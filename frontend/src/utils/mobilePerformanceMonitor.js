// Mobile performance monitoring for the gallery
const isClient = typeof window !== 'undefined';
const isDevMode = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

const shouldMonitorPerf = () => {
  if (!isClient) return false;
  const userEnabled = localStorage.getItem('enableMobilePerfMonitor') === '1';
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return window.innerWidth <= 768 && !prefersReducedMotion && (isDevMode || userEnabled);
};

export const mobilePerformanceMonitor = {
  metrics: {
    loadTime: 0,
    imagesLoaded: 0,
    totalImages: 0,
    memoryUsage: 0,
    fps: 0
  },

  monitoringHandles: {
    memoryInterval: null,
    fpsHandle: null
  },

  shouldMonitor: shouldMonitorPerf,

  startLoadTime: () => {
    if (!shouldMonitorPerf()) return;
    mobilePerformanceMonitor.metrics.loadTime = performance.now();
  },

  endLoadTime: () => {
    if (!shouldMonitorPerf()) return 0;
    const endTime = performance.now();
    const loadTime = endTime - mobilePerformanceMonitor.metrics.loadTime;
    console.log(`Gallery load time: ${loadTime.toFixed(2)}ms`);
    return loadTime;
  },

  trackImageLoad: () => {
    if (!shouldMonitorPerf()) return;
    mobilePerformanceMonitor.metrics.imagesLoaded++;
    const progress = (mobilePerformanceMonitor.metrics.imagesLoaded / mobilePerformanceMonitor.metrics.totalImages) * 100;
    console.log(`Images loaded: ${mobilePerformanceMonitor.metrics.imagesLoaded}/${mobilePerformanceMonitor.metrics.totalImages} (${progress.toFixed(1)}%)`);
  },

  setTotalImages: (count) => {
    if (!shouldMonitorPerf()) return;
    mobilePerformanceMonitor.metrics.totalImages = count;
  },

  measureMemoryUsage: () => {
    if (!shouldMonitorPerf()) return;
    if ('memory' in performance) {
      const memory = performance.memory;
      mobilePerformanceMonitor.metrics.memoryUsage = memory.usedJSHeapSize / 1048576; // Convert to MB
      console.log(`Memory usage: ${mobilePerformanceMonitor.metrics.memoryUsage.toFixed(2)} MB`);
      
      // Warn if memory usage is high (>50MB on mobile)
      if (mobilePerformanceMonitor.metrics.memoryUsage > 50) {
        console.warn('High memory usage detected on mobile device');
      }
    }
  },

  measureFPS: () => {
    if (!shouldMonitorPerf()) return;
    let lastTime = performance.now();
    let frameCount = 0;

    const measureFrame = () => {
      if (!shouldMonitorPerf()) return;
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        mobilePerformanceMonitor.metrics.fps = frameCount;
        console.log(`FPS: ${mobilePerformanceMonitor.metrics.fps}`);
        
        // Warn if FPS is low on mobile
        if (mobilePerformanceMonitor.metrics.fps < 30) {
          console.warn('Low FPS detected on mobile device');
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      mobilePerformanceMonitor.monitoringHandles.fpsHandle = requestAnimationFrame(measureFrame);
    };

    mobilePerformanceMonitor.monitoringHandles.fpsHandle = requestAnimationFrame(measureFrame);
  },

  stopMonitoring: () => {
    if (mobilePerformanceMonitor.monitoringHandles.fpsHandle) {
      cancelAnimationFrame(mobilePerformanceMonitor.monitoringHandles.fpsHandle);
      mobilePerformanceMonitor.monitoringHandles.fpsHandle = null;
    }
    if (mobilePerformanceMonitor.monitoringHandles.memoryInterval) {
      clearInterval(mobilePerformanceMonitor.monitoringHandles.memoryInterval);
      mobilePerformanceMonitor.monitoringHandles.memoryInterval = null;
    }
  },

  logMetrics: () => {
    if (!shouldMonitorPerf()) return;
    console.group('Mobile Performance Metrics');
    console.log('Load Time:', `${mobilePerformanceMonitor.metrics.loadTime.toFixed(2)}ms`);
    console.log('Images Loaded:', `${mobilePerformanceMonitor.metrics.imagesLoaded}/${mobilePerformanceMonitor.metrics.totalImages}`);
    console.log('Memory Usage:', `${mobilePerformanceMonitor.metrics.memoryUsage.toFixed(2)} MB`);
    console.log('FPS:', mobilePerformanceMonitor.metrics.fps);
    console.groupEnd();
  },

  // Performance recommendations based on metrics
  getRecommendations: () => {
    if (!shouldMonitorPerf()) return [];
    const recommendations = [];
    
    if (mobilePerformanceMonitor.metrics.loadTime > 3000) {
      recommendations.push('Consider reducing image sizes or enabling more aggressive caching');
    }
    
    if (mobilePerformanceMonitor.metrics.memoryUsage > 50) {
      recommendations.push('High memory usage detected - consider implementing image recycling');
    }
    
    if (mobilePerformanceMonitor.metrics.fps < 30) {
      recommendations.push('Low FPS detected - consider reducing particle count or disabling animations');
    }
    
    return recommendations;
  }
};

// Auto-start monitoring only when explicitly enabled (dev or flag) to avoid production lag
const bootPerfMonitoring = () => {
  if (!shouldMonitorPerf()) return;
  if (mobilePerformanceMonitor.monitoringHandles.memoryInterval || mobilePerformanceMonitor.monitoringHandles.fpsHandle) return;

  const startMonitoring = () => {
    mobilePerformanceMonitor.measureFPS();
    mobilePerformanceMonitor.monitoringHandles.memoryInterval = setInterval(() => {
      mobilePerformanceMonitor.measureMemoryUsage();
    }, 30000);
  };

  if (isClient && 'requestIdleCallback' in window) {
    window.requestIdleCallback(startMonitoring);
  } else {
    setTimeout(startMonitoring, 0);
  }
};

bootPerfMonitoring();
