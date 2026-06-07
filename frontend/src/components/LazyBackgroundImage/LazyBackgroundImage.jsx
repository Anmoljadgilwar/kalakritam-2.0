import React, { useEffect, useRef, useState } from 'react';

/**
 * Lazy loading background image component
 * Only loads the background image when element is in viewport
 */
const LazyBackgroundImage = ({ 
  imageUrl, 
  className = '', 
  children, 
  threshold = 0.1,
  placeholder = 'none',
  style = {}
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !imageUrl) return;

    // Create Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isInView) {
            setIsInView(true);
            observer.unobserve(element); // Stop observing once loaded
          }
        });
      },
      {
        threshold,
        rootMargin: '50px', // Start loading 50px before element is visible
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [imageUrl, threshold, isInView]);

  // Preload image when in view
  useEffect(() => {
    if (isInView && imageUrl && !isLoaded) {
      const img = new Image();
      img.onload = () => {
        setIsLoaded(true);
      };
      img.onerror = () => {
        console.error(`Failed to load background image: ${imageUrl}`);
        setIsLoaded(false);
      };
      img.src = imageUrl;
    }
  }, [isInView, imageUrl, isLoaded]);

  const backgroundStyle = {
    ...style,
    backgroundImage: isLoaded ? `url(${imageUrl})` : placeholder,
    transition: 'background-image 0.3s ease-in-out',
  };

  return (
    <div 
      ref={elementRef} 
      className={className} 
      style={backgroundStyle}
    >
      {children}
    </div>
  );
};

export default LazyBackgroundImage;
