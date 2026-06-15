// Mobile optimization utilities
const isClient = typeof window !== 'undefined';

let memoizedWebPSupport = null;

// Device detection
export const isMobile = () => {
  if (!isClient) return false;
  return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isTouchDevice = () => {
  if (!isClient) return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Check if user is on slow connection
export const isSlowConnection = () => {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const connection = navigator.connection;
    if (connection) {
      // Check for slow connection types
      if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
        return true;
      }
      // Check for save-data mode
      if (connection.saveData) {
        return true;
      }
      // Check if downlink is less than 1.5 Mbps
      if (connection.downlink && connection.downlink < 1.5) {
        return true;
      }
    }
  }
  return false;
};

// Check if we should optimize for mobile performance
export const shouldOptimizeForMobile = () => {
  return isMobile() || isSlowConnection();
};

// Performance optimization for mobile
export const getMobileParticleConfig = () => {
  // Return a single, unified, constant configuration across all pages, devices, and network states
  // to prevent automatic increasing/decreasing of particle counts and sizes.
  return {
    particleCount: 800,
    particleSpread: 11,
    speed: 0.12,
    particleBaseSize: 220,     // ← Beautiful, clearly visible fireflies/starfield
    moveParticlesOnHover: true,
    particleHoverFactor: 1.5,
    alphaParticles: true,
    disableRotation: false,
    disabled: false
  };
};

// Image optimization for mobile - disabled, return images as-is
export const getOptimizedImageUrl = (url, isMobile = false) => {
  if (!url) return '';
  // Return the original URL without any modifications
  return url;
};

// Reduce CSS effects on mobile for better performance
export const getMobileBlurConfig = () => {
  if (isMobile()) {
    return {
      backdropFilter: 'none', // No blur — keeps particles crisp
      background: 'rgba(0, 0, 0, 0.08)'
    };
  }
  return {
    backdropFilter: 'none', // No blur — keeps particles fully visible
    background: 'rgba(0, 0, 0, 0.05)'
  };
};

// Lazy loading optimization for mobile
export const getMobileLazyConfig = () => {
  if (isMobile()) {
    return {
      threshold: 0.05, // Load earlier on mobile
      rootMargin: '100px' // Larger margin for mobile
    };
  }
  return {
    threshold: 0.1,
    rootMargin: '50px'
  };
};

// Grid optimization for mobile
export const getMobileGridConfig = () => {
  if (isMobile()) {
    return {
      gridTemplateColumns: '1fr', // Single column on mobile
      gap: '1rem', // Smaller gap
      minWidth: '280px' // Smaller minimum width
    };
  }
  return {
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '30px',
    minWidth: '350px'
  };
};

// Animation optimization for mobile
export const getMobileAnimationConfig = () => {
  if (isMobile()) {
    return {
      reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      disableHoverEffects: true,
      simplifyTransitions: true
    };
  }
  return {
    reduceMotion: false,
    disableHoverEffects: false,
    simplifyTransitions: false
  };
};

// Memory management for mobile
export const mobileMemoryOptimization = {
  // Clean up unused resources
  cleanup: () => {
    if (!isClient || document.visibilityState === 'hidden') return;
    if (isMobile()) {
      // Force garbage collection if available
      if (window.gc) {
        window.gc();
      }
      
      // Clear any cached images that are not visible
      const images = document.querySelectorAll('img[data-cached="true"]');
      images.forEach(img => {
        const rectTop = img.getBoundingClientRect().top;
        if (rectTop > window.innerHeight + 200) {
          img.removeAttribute('data-cached');
        }
      });
    }
  },
  
  // Optimize scroll performance
  throttleScroll: (callback, limit = 16) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        callback.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Battery optimization
export const getBatteryOptimizations = async () => {
  try {
    if ('getBattery' in navigator) {
      const battery = await navigator.getBattery();
      const isLowBattery = battery.level < 0.2;
      const isCharging = battery.charging;
      
      if (isLowBattery && !isCharging) {
        return {
          reduceAnimations: true,
          lowerQuality: false, // Disabled - keep original image quality for reliable loading
          disableParticles: true,
          simplifyEffects: true
        };
      }
    }
  } catch (e) {
    // Battery API not supported
  }
  
  return {
    reduceAnimations: false,
    lowerQuality: false,
    disableParticles: false,
    simplifyEffects: false
  };
};

// Network optimization
export const getNetworkOptimizations = () => {
  try {
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const slowConnection = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
      const saveData = connection.saveData;
      
      if (slowConnection || saveData) {
        return {
          preloadImages: false,
          lowerQuality: false, // Disabled - keep original image quality for reliable loading
          delayNonCritical: true,
          disableAutoplay: true
        };
      }
    }
  } catch (e) {
    // Network API not supported
  }
  
  return {
    preloadImages: true,
    lowerQuality: false,
    delayNonCritical: false,
    disableAutoplay: false
  };
};
