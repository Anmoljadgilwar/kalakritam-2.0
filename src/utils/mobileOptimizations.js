// Mobile optimization utilities

// Device detection
export const isMobile = () => {
  return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isTouchDevice = () => {
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
  const slowConnection = isSlowConnection();
  
  // Disable particles completely on slow connections
  if (slowConnection) {
    return {
      particleCount: 0, // Disabled on slow connections
      particleSpread: 0,
      speed: 0,
      particleBaseSize: 0,
      moveParticlesOnHover: false,
      particleHoverFactor: 1,
      alphaParticles: false,
      disableRotation: true,
      disabled: true
    };
  }
  
  if (isMobile()) {
    return {
      particleCount: 100, // Reduced further from 300
      particleSpread: 6,  // Reduced from 8
      speed: 0.1,         // Reduced from 0.15
      particleBaseSize: 100, // Reduced from 150
      moveParticlesOnHover: false, // Disabled on mobile
      particleHoverFactor: 1, // Reduced from 2
      alphaParticles: false, // Disable alpha for better performance
      disableRotation: true, // Disable rotation on mobile for better performance
      disabled: false
    };
  }
  return {
    particleCount: 1000,
    particleSpread: 10,
    speed: 0.2,
    particleBaseSize: 200,
    moveParticlesOnHover: true,
    particleHoverFactor: 2,
    alphaParticles: true,
    disableRotation: false,
    disabled: false
  };
};

// Image optimization for mobile
export const getOptimizedImageUrl = (url, isMobile = false) => {
  if (!url) return '';
  
  // For mobile devices, request smaller images
  const width = isMobile ? 400 : 800;
  const quality = isMobile ? 70 : 80;
  
  // If it's already a data URL or blob, return as is
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  // Check if browser supports WebP
  const supportsWebP = (() => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } catch (e) {
      return false;
    }
  })();
  
  // Add optimization parameters if the URL supports them
  const separator = url.includes('?') ? '&' : '?';
  const format = supportsWebP ? 'webp' : 'jpeg';
  
  return `${url}${separator}w=${width}&q=${quality}&f=${format}`;
};

// Reduce CSS effects on mobile for better performance
export const getMobileBlurConfig = () => {
  if (isMobile()) {
    return {
      backdropFilter: 'blur(4px)', // Reduced from 8px
      background: 'rgba(0, 0, 0, 0.3)' // Slightly more opaque to compensate for less blur
    };
  }
  return {
    backdropFilter: 'blur(8px)',
    background: 'rgba(0, 0, 0, 0.2)'
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
    if (isMobile()) {
      // Force garbage collection if available
      if (window.gc) {
        window.gc();
      }
      
      // Clear any cached images that are not visible
      const images = document.querySelectorAll('img[data-cached="true"]');
      images.forEach(img => {
        if (!img.getBoundingClientRect().top < window.innerHeight + 200) {
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
          lowerQuality: true,
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
          lowerQuality: true,
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
