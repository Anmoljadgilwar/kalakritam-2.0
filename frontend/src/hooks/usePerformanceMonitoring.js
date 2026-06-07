import { useEffect, useRef } from 'react';
import { performanceMonitor, cleanup } from '../utils/performance';

export const usePerformanceMonitoring = (componentName) => {
  const mountTime = useRef(null);
  const renderCount = useRef(0);

  useEffect(() => {
    // Track component mount
    mountTime.current = performanceMonitor.mark(`${componentName}-mount`);
    renderCount.current++;

    // Monitor memory usage (if available)
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      const memoryInfo = performance.memory;
      console.log(`${componentName} Memory:`, {
        used: Math.round(memoryInfo.usedJSHeapSize / 1048576) + 'MB',
        total: Math.round(memoryInfo.totalJSHeapSize / 1048576) + 'MB',
        limit: Math.round(memoryInfo.jsHeapSizeLimit / 1048576) + 'MB'
      });
    }

    return () => {
      // Measure component lifetime
      if (mountTime.current) {
        const lifetime = performanceMonitor.measure(
          `${componentName}-lifetime`,
          `${componentName}-mount`
        );
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`${componentName} lifetime: ${lifetime?.toFixed(2)}ms, renders: ${renderCount.current}`);
        }
      }
    };
  }, [componentName]);

  // Track re-renders
  useEffect(() => {
    renderCount.current++;
  });

  return {
    getRenderCount: () => renderCount.current,
    getMountTime: () => mountTime.current
  };
};

export const useScrollPerformance = (threshold = 100) => {
  const lastScrollTime = useRef(0);
  const scrollTimeouts = useRef(new Set());

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const now = performance.now();
      const timeSinceLastScroll = now - lastScrollTime.current;

      if (timeSinceLastScroll > threshold && !ticking) {
        requestAnimationFrame(() => {
          // Scroll performance tracking
          if (process.env.NODE_ENV === 'development') {
            console.log(`Scroll performance: ${timeSinceLastScroll.toFixed(2)}ms since last scroll`);
          }
          ticking = false;
        });
        ticking = true;
      }

      lastScrollTime.current = now;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Clear any pending timeouts
      scrollTimeouts.current.forEach(timeout => clearTimeout(timeout));
      scrollTimeouts.current.clear();
    };
  }, [threshold]);
};

export const useNetworkPerformance = () => {
  const networkInfo = useRef(null);

  useEffect(() => {
    // Get network information if available
    if ('connection' in navigator) {
      networkInfo.current = navigator.connection;
      
      const logNetworkInfo = () => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Network Info:', {
            effectiveType: networkInfo.current.effectiveType,
            downlink: networkInfo.current.downlink,
            rtt: networkInfo.current.rtt,
            saveData: networkInfo.current.saveData
          });
        }
      };

      logNetworkInfo();
      networkInfo.current.addEventListener('change', logNetworkInfo);

      return () => {
        if (networkInfo.current) {
          networkInfo.current.removeEventListener('change', logNetworkInfo);
        }
      };
    }
  }, []);

  return networkInfo.current;
};

export const useMemoryCleanup = () => {
  useEffect(() => {
    return () => {
      // Clean up timeouts and intervals
      cleanup.clearAll();
      
      // Force garbage collection if available (dev only)
      if (process.env.NODE_ENV === 'development' && window.gc) {
        window.gc();
      }
    };
  }, []);
};

export const useImagePerformance = () => {
  const imageLoadTimes = useRef(new Map());

  const trackImageLoad = (src, startTime) => {
    const loadTime = performance.now() - startTime;
    imageLoadTimes.current.set(src, loadTime);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Image loaded: ${src} in ${loadTime.toFixed(2)}ms`);
    }
  };

  const getImageStats = () => {
    const times = Array.from(imageLoadTimes.current.values());
    if (times.length === 0) return null;

    return {
      count: times.length,
      average: times.reduce((a, b) => a + b, 0) / times.length,
      min: Math.min(...times),
      max: Math.max(...times)
    };
  };

  return { trackImageLoad, getImageStats };
};
