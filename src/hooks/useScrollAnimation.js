import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-triggered animations
 * @param {Object} options - Animation options
 * @returns {Object} - Reference and animation state
 */
export const useScrollAnimation = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    animationClass = 'animate-in'
  } = options;

  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Split the animationClass string and add each class separately
          const classes = animationClass.split(' ');
          classes.forEach(cls => {
            if (cls) element.classList.add(cls);
          });
          
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
          const classes = animationClass.split(' ');
          classes.forEach(cls => {
            if (cls) element.classList.remove(cls);
          });
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce, animationClass]);

  return { ref, isVisible };
};

/**
 * Hook for parallax scroll effect
 */
export const useParallax = (speed = 0.5) => {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const element = ref.current;
      const rect = element.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const elementTop = rect.top + scrolled;
      const windowHeight = window.innerHeight;
      
      // Calculate parallax offset
      if (rect.top < windowHeight && rect.bottom > 0) {
        const yPos = -(scrolled - elementTop) * speed;
        setOffset(yPos);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { ref, offset };
};

/**
 * Hook for counting animation
 */
export const useCountAnimation = (end, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);

  const startCounting = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const startTime = Date.now();
    const range = end - start;

    const timer = setInterval(() => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(start + range * easeProgress);
      
      setCount(currentCount);

      if (progress === 1) {
        clearInterval(timer);
        setIsAnimating(false);
        setCount(end);
      }
    }, 16); // ~60fps

    return () => clearInterval(timer);
  };

  return { count, startCounting, isAnimating };
};

/**
 * Hook for scroll progress indicator
 */
export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const totalHeight = documentHeight - windowHeight;
      const scrollProgress = (scrollTop / totalHeight) * 100;
      
      setProgress(Math.min(scrollProgress, 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
};
