import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAuthApi } from '../lib/adminApi';

const UserAuthContext = createContext(undefined);

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    // During HMR or when context is not yet ready, return a safe default
    console.warn('useUserAuth: Context not available, returning default state');
    return {
      user: null,
      isAuthenticated: false,
      isLoading: true,
      token: null,
      login: async () => ({ success: false, error: 'Context not ready' }),
      signup: async () => ({ success: false, error: 'Context not ready' }),
      googleLogin: async () => ({ success: false, error: 'Context not ready' }),
      logout: () => {},
      checkAuth: async () => {},
      updateUser: () => {},
      resetInactivityTimer: () => {},
    };
  }
  return context;
};

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [skipTokenVerification, setSkipTokenVerification] = useState(false);

  // Create a unique ID for this provider instance
  const providerId = React.useRef(`provider-${Math.random().toString(36).substr(2, 9)}`);
  
  // Auto-logout timer references
  const inactivityTimerRef = React.useRef(null);
  const lastActivityRef = React.useRef(Date.now());
  
  // 10 hours in milliseconds
  const INACTIVITY_TIMEOUT = 10 * 60 * 60 * 1000; // 10 hours
  
  console.log(`UserAuthProvider [${providerId.current}] - Initialized`);

  // State change logging DISABLED to prevent excessive re-renders
  // useEffect(() => {
  //   console.log(`UserAuthContext [${providerId.current}] - State changed:`, {
  //     isAuthenticated,
  //     hasUser: !!user,
  //     isLoading,
  //     hasToken: !!token
  //   });
  // }, [isAuthenticated, user, isLoading, token]);

  // Check authentication status on mount
  useEffect(() => {
    console.log(`UserAuthContext [${providerId.current}] - Mount - calling checkAuth`);
    checkAuth();
  }, []);

  const checkAuth = async () => {
    console.log('UserAuthContext - checkAuth started');
    try {
      const storedToken = localStorage.getItem('userToken');
      const storedUser = localStorage.getItem('userData');
      
      console.log('UserAuthContext - storedToken:', storedToken ? 'exists' : 'missing');
      console.log('UserAuthContext - storedUser:', storedUser ? 'exists' : 'missing');

      if (storedToken && storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        setToken(storedToken);
        
        try {
          const parsedUser = JSON.parse(storedUser);
          if (!parsedUser || typeof parsedUser !== 'object') {
            throw new Error('Invalid user data');
          }
          setUser(parsedUser);
          setIsAuthenticated(true);
          setIsLoading(false);
          
          console.log('UserAuthContext - User authenticated from localStorage:', parsedUser);

          // Skip token verification if we just logged in (within last 30 seconds)
          const loginTime = localStorage.getItem('loginTime');
          const now = Date.now();
          if (loginTime && (now - parseInt(loginTime)) < 30000) {
            console.log('Skipping token verification - just logged in');
            return;
          }

          // Verify token is still valid (with delay to prevent race conditions)
          console.log('UserAuthContext - Verifying token...');
          
          // Add a small delay before verification to ensure localStorage is synced
          await new Promise(resolve => setTimeout(resolve, 100));
          
          try {
            const result = await userAuthApi.verifyToken();
            console.log('UserAuthContext - Token verification result:', result);
            
            if (!result.success) {
              console.warn('Token verification returned unsuccessful:', result);
              // If user was deleted or token is invalid, clear everything
              console.log('UserAuthContext - Logging out due to invalid token');
              logout();
            } else {
              console.log('UserAuthContext - Token verified successfully');
              // Update user data if API returns it
              if (result.data) {
                setUser(result.data);
                localStorage.setItem('userData', JSON.stringify(result.data));
              }
            }
          } catch (error) {
            console.error('Token verification failed:', error);
            
            // Check if it's a network error vs auth error
            if (error.message?.includes('fetch') || error.message?.includes('network') || error.name === 'TypeError') {
              console.log('UserAuthContext - Network error, keeping user logged in');
              // Don't logout on network errors - user might be offline
            } else if (error.message?.includes('No token found')) {
              console.log('UserAuthContext - No token found, logging out');
              logout();
            } else {
              // For other auth errors (401, 403), logout
              console.log('UserAuthContext - Auth error, logging out');
              logout();
            }
          }
        } catch (parseError) {
          console.error('Failed to parse stored user data:', parseError);
          // Clear invalid data
          localStorage.removeItem('userData');
          localStorage.removeItem('userToken');
          localStorage.removeItem('loginTime');
          localStorage.removeItem('lastActivity');
          setIsLoading(false);
        }
      } else {
        console.log('UserAuthContext - No stored credentials found or invalid data');
        // Clean up any invalid data
        if (storedUser === 'undefined' || storedUser === 'null') {
          localStorage.removeItem('userData');
        }
        if (storedToken) {
          localStorage.removeItem('userToken');
        }
        localStorage.removeItem('loginTime');
        localStorage.removeItem('lastActivity');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // Clear everything on error
      localStorage.removeItem('userData');
      localStorage.removeItem('userToken');
      localStorage.removeItem('loginTime');
      localStorage.removeItem('lastActivity');
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    console.log('UserAuthContext - login() called with:', credentials.email);
    try {
      const result = await userAuthApi.login(credentials);
      console.log('UserAuthContext - API login result:', result);
      
      if (result.success) {
        console.log('UserAuthContext - Setting authenticated state');
        const userData = result.data || result.user; // API returns data, not user
        setToken(result.token);
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('userToken', result.token);
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('loginTime', Date.now().toString());
        console.log('UserAuthContext - State updated, user:', userData);
        return { success: true, user: userData }; // Return user data
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    console.log('UserAuthContext - signup() called with:', userData.email);
    try {
      const result = await userAuthApi.signup(userData);
      console.log('UserAuthContext - API signup result:', result);
      
      if (result.success) {
        console.log('UserAuthContext - Setting authenticated state');
        const userDataResult = result.data || result.user; // API returns data, not user
        setToken(result.token);
        setUser(userDataResult);
        setIsAuthenticated(true);
        localStorage.setItem('userToken', result.token);
        localStorage.setItem('userData', JSON.stringify(userDataResult));
        localStorage.setItem('loginTime', Date.now().toString());
        console.log('UserAuthContext - State updated, user:', userDataResult);
        return { success: true, user: userDataResult }; // Return user data
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const googleLogin = async (credential) => {
    console.log('UserAuthContext - googleLogin() called');
    try {
      const result = await userAuthApi.googleAuth(credential);
      console.log('UserAuthContext - API googleAuth result:', result);
      if (result.success) {
        const userData = result.data || result.user;
        setToken(result.token);
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('userToken', result.token);
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('loginTime', Date.now().toString());
        return { success: true, user: userData }; // Return user data
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('lastActivity');
    
    // Clear inactivity timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  };

  // Reset inactivity timer
  const resetInactivityTimer = React.useCallback(() => {
    if (!isAuthenticated) return;
    
    const now = Date.now();
    lastActivityRef.current = now;
    localStorage.setItem('lastActivity', now.toString());
    
    // Clear existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    // Set new timer
    inactivityTimerRef.current = setTimeout(() => {
      console.log('UserAuthContext - Auto-logout: 10 hours of inactivity');
      logout();
      
      // Show notification to user
      if (window.showNotification) {
        window.showNotification('Session expired due to inactivity', 'info');
      }
    }, INACTIVITY_TIMEOUT);
    
    console.log('UserAuthContext - Inactivity timer reset');
  }, [isAuthenticated]);

  // Track user activity
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Activity events to track
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];
    
    // Throttle activity tracking to once per minute
    let lastActivityUpdate = 0;
    const ACTIVITY_THROTTLE = 60 * 1000; // 1 minute
    
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastActivityUpdate > ACTIVITY_THROTTLE) {
        lastActivityUpdate = now;
        resetInactivityTimer();
      }
    };
    
    // Add event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });
    
    // Initial timer setup
    resetInactivityTimer();
    
    // Check for inactivity on mount (in case user had tab open for long time)
    const lastActivity = localStorage.getItem('lastActivity');
    if (lastActivity) {
      const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
      if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
        console.log('UserAuthContext - Auto-logout: Session expired while tab was inactive');
        logout();
        if (window.showNotification) {
          window.showNotification('Session expired due to inactivity', 'info');
        }
      }
    }
    
    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [isAuthenticated, resetInactivityTimer]);

  const updateUserProfile = async (updates) => {
    try {
      const result = await userAuthApi.updateProfile(updates);
      if (result.success) {
        const userData = result.data || result.user; // API returns data, not user
        setUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
        return { success: true, user: userData }; // Return user data
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    token,
    login,
    signup,
    googleLogin,
    logout,
    updateUserProfile,
    checkAuth,
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
};

export default UserAuthContext;
