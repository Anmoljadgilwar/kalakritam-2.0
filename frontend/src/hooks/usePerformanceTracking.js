import { useEffect } from 'react';
import { performanceMonitor } from '../utils/performance';

export const usePerformanceTracking = (componentName) => {
  useEffect(() => {
    // Track component mount time for performance monitoring
    const markName = `${componentName}-mount-start`;
    performanceMonitor.mark(markName);
    
    return () => {
      const measureName = `${componentName}-mount-duration`;
      const duration = performanceMonitor.measure(measureName, markName);
      
      // Log performance metrics only in development
      if (process.env.NODE_ENV === 'development' && duration !== null) {
        console.log(`${componentName} mounted in ${duration.toFixed(2)}ms`);
      }
      
      // You can also track to analytics services here
      // analytics.track('component_mount_time', {
      //   component: componentName,
      //   duration: duration
      // });
    };
  }, [componentName]);
};

export const measureLazyLoadTime = (componentName) => {
  const markName = `${componentName}-lazy-start`;
  performanceMonitor.mark(markName);
  
  return () => {
    const measureName = `${componentName}-lazy-duration`;
    const duration = performanceMonitor.measure(measureName, markName);
    
    if (process.env.NODE_ENV === 'development' && duration !== null) {
      console.log(`${componentName} lazy loaded in ${duration.toFixed(2)}ms`);
    }
  };
};
