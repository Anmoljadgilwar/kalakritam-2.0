// Universal mobile optimization hook for all pages
import { useState, useEffect } from 'react';
import { 
  getMobileParticleConfig, 
  getMobileBlurConfig,
  shouldOptimizeForMobile,
  getNetworkOptimizations,
  getBatteryOptimizations,
  mobileMemoryOptimization,
  getOptimizedImageUrl
} from '../utils/mobileOptimizations';
import { mobilePerformanceMonitor } from '../utils/mobilePerformanceMonitor';

export const useMobileOptimizations = (pageName = 'page') => {
  const [isMobile, setIsMobile] = useState(shouldOptimizeForMobile());
  const [particleConfig, setParticleConfig] = useState(getMobileParticleConfig());
  const [blurConfig, setBlurConfig] = useState(getMobileBlurConfig());
  const [networkOptimizations, setNetworkOptimizations] = useState({});
  const [batteryOptimizations, setBatteryOptimizations] = useState({});

  useEffect(() => {
    const initializeOptimizations = async () => {
      if (isMobile) {
        mobilePerformanceMonitor.startLoadTime();
        if (mobilePerformanceMonitor.shouldMonitor()) {
          console.log(`🔧 Initializing mobile optimizations for ${pageName}`);
        }
      }
      
      const networkOpts = getNetworkOptimizations();
      const batteryOpts = await getBatteryOptimizations();
      
      setNetworkOptimizations(networkOpts);
      setBatteryOptimizations(batteryOpts);
      
      // Update particle config based on optimizations
      const optimizedParticleConfig = getMobileParticleConfig();
      if (batteryOpts.disableParticles || networkOpts.delayNonCritical || optimizedParticleConfig.disabled) {
        setParticleConfig({ ...optimizedParticleConfig, particleCount: 0, disabled: true });
        if (mobilePerformanceMonitor.shouldMonitor()) {
          console.log(`⚡ Particles disabled for ${pageName} due to battery/network optimization`);
        }
      } else {
        setParticleConfig(optimizedParticleConfig);
      }
      
      if (isMobile) {
        mobilePerformanceMonitor.endLoadTime();
        if (mobilePerformanceMonitor.shouldMonitor()) {
          console.log(`✅ Mobile optimizations loaded for ${pageName}`);
        }
      }
    };
    
    initializeOptimizations();
    
    // Handle window resize for mobile detection
    const handleResize = () => {
      const newIsMobile = shouldOptimizeForMobile();
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
        setParticleConfig(getMobileParticleConfig());
        setBlurConfig(getMobileBlurConfig());
        console.log(`📱 Mobile state changed for ${pageName}: ${newIsMobile}`);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Set up memory cleanup for mobile
    let cleanupInterval;
    if (isMobile) {
      cleanupInterval = setInterval(() => {
        mobileMemoryOptimization.cleanup();
      }, 30000);
    }
    
    return () => {
      if (cleanupInterval) clearInterval(cleanupInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile, pageName]);

  return {
    isMobile,
    particleConfig,
    blurConfig,
    networkOptimizations,
    batteryOptimizations,
    // Helper functions
    getOptimizedImageUrl: (url) => getOptimizedImageUrl(url, isMobile),
    trackImageLoad: () => {
      if (isMobile) {
        mobilePerformanceMonitor.trackImageLoad();
      }
    },
    setTotalImages: (count) => {
      if (isMobile) {
        mobilePerformanceMonitor.setTotalImages(count);
      }
    }
  };
};
