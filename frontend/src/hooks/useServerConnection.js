import { useEffect, useRef, useState } from 'react';
import { toast } from '../utils/notifications.js';

const useServerConnection = (config = {}) => {
  const {
    checkInterval = 30000, // 30 seconds
    timeout = 10000, // 10 seconds
    retryAttempts = 3,
    retryDelay = 2000, // 2 seconds
    endpoints = ['/api/health', '/api/status'], // Health check endpoints
    onConnect = null,
    onDisconnect = null,
    onError = null
  } = config;

  const [isConnected, setIsConnected] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const connectingNotificationId = useRef(null);
  const disconnectedNotificationId = useRef(null);

  const checkConnection = async () => {
    if (isChecking) return;
    
    setIsChecking(true);
    setLastChecked(Date.now());

    try {
      // Show connecting notification if we're retrying or this is the first check
      if (retryCount > 0 || !isConnected) {
        connectingNotificationId.current = toast.serverConnecting(
          retryCount > 0 
            ? `Reconnecting to server... (Attempt ${retryCount + 1}/${retryAttempts})`
            : 'Checking server connection...'
        );
      }

      // Try multiple endpoints
      const promises = endpoints.map(endpoint => 
        fetch(endpoint, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          signal: AbortSignal.timeout(timeout)
        })
      );

      const results = await Promise.allSettled(promises);
      const hasSuccessfulConnection = results.some(result => 
        result.status === 'fulfilled' && result.value.ok
      );

      if (hasSuccessfulConnection) {
        // Connection successful
        if (!isConnected) {
          setIsConnected(true);
          setRetryCount(0);
          
          // Remove connecting notification and show success
          if (connectingNotificationId.current) {
            toast.dismiss(connectingNotificationId.current);
            connectingNotificationId.current = null;
          }
          
          // Remove disconnected notification
          if (disconnectedNotificationId.current) {
            toast.dismiss(disconnectedNotificationId.current);
            disconnectedNotificationId.current = null;
          }
          
          toast.serverConnected('Server connection restored!');
          onConnect?.();
        } else if (connectingNotificationId.current) {
          // Just checking - dismiss connecting notification
          toast.dismiss(connectingNotificationId.current);
          connectingNotificationId.current = null;
        }
        
        setRetryCount(0);
      } else {
        throw new Error('All health check endpoints failed');
      }
    } catch (error) {
      console.warn('Server connection check failed:', error);
      
      // Remove connecting notification
      if (connectingNotificationId.current) {
        toast.dismiss(connectingNotificationId.current);
        connectingNotificationId.current = null;
      }

      if (retryCount < retryAttempts - 1) {
        // Retry after delay
        setRetryCount(prev => prev + 1);
        timeoutRef.current = setTimeout(() => {
          checkConnection();
        }, retryDelay);
      } else {
        // Max retries reached - show disconnected
        if (isConnected) {
          setIsConnected(false);
          disconnectedNotificationId.current = toast.serverDisconnected(
            'Unable to connect to server. Please check your internet connection.'
          );
          onDisconnect?.(error);
        }
        setRetryCount(0);
      }
      
      onError?.(error);
    } finally {
      setIsChecking(false);
    }
  };

  const forceCheck = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    checkConnection();
  };

  const startMonitoring = () => {
    if (intervalRef.current) return;
    
    // Initial check
    checkConnection();
    
    // Set up periodic checks
    intervalRef.current = setInterval(checkConnection, checkInterval);
  };

  const stopMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Clean up notifications
    if (connectingNotificationId.current) {
      toast.dismiss(connectingNotificationId.current);
      connectingNotificationId.current = null;
    }
    
    if (disconnectedNotificationId.current) {
      toast.dismiss(disconnectedNotificationId.current);
      disconnectedNotificationId.current = null;
    }
  };

  useEffect(() => {
    startMonitoring();
    
    // Handle visibility change to check connection when tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden && isConnected) {
        forceCheck();
      }
    };

    // Handle online/offline events
    const handleOnline = () => {
      if (!isConnected) {
        forceCheck();
      }
    };

    const handleOffline = () => {
      setIsConnected(false);
      if (disconnectedNotificationId.current) {
        toast.dismiss(disconnectedNotificationId.current);
      }
      disconnectedNotificationId.current = toast.serverDisconnected(
        'No internet connection detected'
      );
      onDisconnect?.(new Error('Network offline'));
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      stopMonitoring();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkInterval, retryAttempts, retryDelay, isConnected]);

  return {
    isConnected,
    isChecking,
    lastChecked,
    retryCount,
    forceCheck,
    startMonitoring,
    stopMonitoring
  };
};

export default useServerConnection;
