// Performance optimization utilities

// Debounce function for performance-sensitive operations
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle function for scroll and resize events
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Optimized image loading - disabled, return images as-is
export const getOptimizedImageUrl = (url, width = 400, quality = 80) => {
  if (!url) return '';
  // Return the original URL without any modifications
  return url;
};

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload critical fonts
  const criticalFonts = [
    '/src/assets/fonts/Samarkan.woff2',
    '/src/assets/fonts/Samarkan.woff'
  ];
  
  criticalFonts.forEach(fontUrl => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = fontUrl;
    link.as = 'font';
    link.type = fontUrl.endsWith('.woff2') ? 'font/woff2' : 'font/woff';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Optimize bundle loading
export const loadScriptAsync = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Memory cleanup utility
export const cleanup = {
  timeouts: new Set(),
  intervals: new Set(),
  
  setTimeout(callback, delay) {
    const id = setTimeout(() => {
      callback();
      this.timeouts.delete(id);
    }, delay);
    this.timeouts.add(id);
    return id;
  },
  
  setInterval(callback, delay) {
    const id = setInterval(callback, delay);
    this.intervals.add(id);
    return id;
  },
  
  clearTimeout(id) {
    clearTimeout(id);
    this.timeouts.delete(id);
  },
  
  clearInterval(id) {
    clearInterval(id);
    this.intervals.delete(id);
  },
  
  clearAll() {
    this.timeouts.forEach(id => clearTimeout(id));
    this.intervals.forEach(id => clearInterval(id));
    this.timeouts.clear();
    this.intervals.clear();
  }
};

// Performance monitoring
export const performanceMonitor = {
  marks: new Map(),
  
  mark(name) {
    const timestamp = performance.now();
    this.marks.set(name, timestamp);
    if (typeof performance.mark === 'function') {
      performance.mark(name);
    }
    return timestamp;
  },
  
  measure(name, startMark, endMark) {
    const startTime = this.marks.get(startMark);
    const endTime = endMark ? this.marks.get(endMark) : performance.now();
    
    if (startTime && endTime) {
      const duration = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
      }
      
      if (typeof performance.measure === 'function') {
        performance.measure(name, startMark, endMark);
      }
      
      return duration;
    }
    
    return null;
  },
  
  clear() {
    this.marks.clear();
    if (typeof performance.clearMarks === 'function') {
      performance.clearMarks();
    }
    if (typeof performance.clearMeasures === 'function') {
      performance.clearMeasures();
    }
  }
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '50px'
  };
  
  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

// Resource hints
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const externalDomains = [];
  
  externalDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
  
  // Preconnect to critical origins
  const criticalOrigins = [];
  
  criticalOrigins.forEach(origin => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    document.head.appendChild(link);
  });
};
