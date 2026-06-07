import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { getMobileLazyConfig, shouldOptimizeForMobile, getNetworkOptimizations } from '../../utils/mobileOptimizations';
import './LazyImage.css';

// Check mobile once at module level to avoid repeated checks
const IS_MOBILE = typeof window !== 'undefined' && (
  window.innerWidth <= 768 || 
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
);

// Mobile image component with immediate loading
const MobileImage = ({ src, alt, className = '', aspectRatio, priority = false, onLoad, onError, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const style = aspectRatio ? { aspectRatio } : {};
  
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad && onLoad();
  };
  
  const handleError = () => {
    setHasError(true);
    onError && onError();
  };
  
  return (
    <div 
      className={`lazy-image-container mobile-image-container ${className} ${isLoaded ? 'is-loaded' : ''}`} 
      style={style} 
      {...props}
    >
      {!hasError ? (
        <img
          src={src || ''}
          alt={alt}
          className={`lazy-image mobile-lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchpriority={priority ? "high" : "auto"}
        />
      ) : (
        <div className="lazy-image-error mobile-image-error">
          <span>Image unavailable</span>
        </div>
      )}
    </div>
  );
};

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = null,
  onLoad = () => {},
  onError = () => {},
  priority = false,
  aspectRatio,
  blurPreview = false,
  showLoadingProgress = false,
  retryOnError = true,
  maxRetries = 2,
  ...props 
}) => {
  // For mobile - use viewport-based lazy loading
  if (IS_MOBILE) {
    return <MobileImage src={src} alt={alt} className={className} aspectRatio={aspectRatio} priority={priority} onLoad={onLoad} onError={onError} {...props} />;
  }
  
  // Desktop version with immediate loading
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const imgRef = useRef();
  const containerRef = useRef();

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad && onLoad();
  }, [onLoad]);

  const handleError = useCallback(() => {
    if (retryOnError && retryCount < maxRetries) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setHasError(false);
      }, Math.pow(2, retryCount) * 500); // Faster retry: 500ms, 1s, 2s
    } else {
      setHasError(true);
      onError && onError();
    }
  }, [retryOnError, retryCount, maxRetries, onError]);

  const optimizedSrc = useMemo(() => {
    if (!src) return '';
    return src;
  }, [src, retryCount]);

  const containerStyle = useMemo(() => {
    const styles = {};
    if (aspectRatio) {
      styles.aspectRatio = aspectRatio;
    }
    return styles;
  }, [aspectRatio]);

  return (
    <div 
      ref={containerRef} 
      className={`lazy-image-container ${className} ${isLoaded ? 'is-loaded' : ''}`}
      style={containerStyle}
      {...props}
    >
      {!hasError && (
        <img
          ref={imgRef}
          src={optimizedSrc}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
          onLoad={handleLoad}
          onError={handleError}
          loading="eager"
          decoding="async"
          fetchpriority="high"
        />
      )}
      
      {hasError && (
        <div className="lazy-image-error">
          <div className="lazy-image-error-content">
            <div className="lazy-image-error-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="lazy-image-error-text">Image unavailable</span>
            {retryOnError && retryCount < maxRetries && (
              <button 
                className="lazy-image-retry-btn"
                onClick={() => {
                  setRetryCount(prev => prev + 1);
                  setHasError(false);
                }}
              >
                Retry
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
