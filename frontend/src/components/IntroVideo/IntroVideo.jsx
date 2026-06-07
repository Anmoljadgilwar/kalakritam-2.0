import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../utils/notifications.js';
import { performanceMonitor } from '../../utils/performance';
import './IntroVideo.css';

const IntroVideo = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [showFallback, setShowFallback] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const loadingTimeoutRef = useRef(null);

  // Preload Home component
  useEffect(() => {
    // Preload Home component in the background
    import('../Home').catch(error => {
      console.warn('Failed to preload Home component:', error);
    });
  }, []);

  // Memoized navigation function
  const navigateToHome = useCallback(() => {
    try {
      performanceMonitor.mark('intro-video-complete');
      sessionStorage.setItem('videoCompleted', 'true');
      navigate('/home');
    } catch (error) {
      console.warn('Navigation error:', error);
      // Fallback navigation
      window.location.href = '/home';
    }
  }, [navigate]);

  useEffect(() => {
    performanceMonitor.mark('intro-video-start');
    
    const video = videoRef.current;
    
    const handleVideoEnd = () => {
      // Start transition animation
      setIsTransitioning(true);
      sessionStorage.setItem('videoTransitioning', 'true');
      
      // Show welcome toast
      toast.success('Welcome to Kalakritam!', {
        description: 'Discover the art of creation',
        duration: 3000
      });
      
      // Redirect to home page after transition
      setTimeout(navigateToHome, 1500); // Reduced from 2000ms
    };

    const handleTimeUpdate = () => {
      // Start transition at exactly 2 seconds
      if (video.currentTime >= 1.9) { // Start slightly before 2s for smooth transition
        setIsTransitioning(true);
        sessionStorage.setItem('videoTransitioning', 'true');
        setTimeout(navigateToHome, 1500);
      }
    };

    const handleVideoError = (error) => {
      console.warn('Video loading error:', error);
      // Start transition animation even on error
      setIsTransitioning(true);
      sessionStorage.setItem('videoTransitioning', 'true');
      setShowFallback(true);
      // Auto-redirect after showing animation
      setTimeout(navigateToHome, 1500);
    };

    const handleVideoLoad = () => {
      setVideoLoaded(true);
      performanceMonitor.measure('intro-video-load', 'intro-video-start');
      console.log('Video loaded successfully');
    };

    const handleCanPlay = () => {
      console.log('Video can start playing');
      setVideoLoaded(true);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };

    if (video) {
      video.addEventListener('ended', handleVideoEnd);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('error', handleVideoError);
      video.addEventListener('loadeddata', handleVideoLoad);
      video.addEventListener('canplay', handleCanPlay);
      
      // Set a timeout for video loading (reduced from 5s to 3s)
      loadingTimeoutRef.current = setTimeout(() => {
        if (!videoLoaded) {
          console.warn('Video loading timeout - showing fallback with animation');
          setIsTransitioning(true);
          setShowFallback(true);
          setTimeout(navigateToHome, 1500);
        }
      }, 3000);
      
      // Auto-play the video with better error handling
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn('Video autoplay failed:', error);
          setIsTransitioning(true);
          setShowFallback(true);
          setTimeout(navigateToHome, 1500);
        });
      }

      // Cleanup
      return () => {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        if (video) {
          video.removeEventListener('ended', handleVideoEnd);
          video.removeEventListener('timeupdate', handleTimeUpdate);
          video.removeEventListener('error', handleVideoError);
          video.removeEventListener('loadeddata', handleVideoLoad);
          video.removeEventListener('canplay', handleCanPlay);
        }
      };
    } else {
      // If no video element, show fallback with animation and redirect
      setIsTransitioning(true);
      setShowFallback(true);
      setTimeout(navigateToHome, 1500);
    }
  }, [navigateToHome, videoLoaded]);

  const handleSkip = () => {
    navigateToHome();
  };

  return (
    <div className={`intro-video-container ${isTransitioning ? 'transitioning' : ''}`}>
      {!showFallback ? (
        <div className={`video-wrapper ${isTransitioning ? 'transition-to-logo' : ''}`}>
          <video
            ref={videoRef}
            className={`intro-video ${isTransitioning ? 'shrinking' : ''}`}
            muted
            playsInline
            preload="metadata"
            autoPlay={false}
            crossOrigin="anonymous"
          >
            <source src="https://pub-9cdd84716e0341ba9fa9c0b6875b5572.r2.dev/intro-video-compressed.mp4" type="video/mp4" />
            <p>Your browser does not support the video tag.</p>
          </video>
        </div>
      ) : null}
      
      <div className={`video-fallback ${showFallback ? 'show' : ''}`}>
        <div className="logo-animation">
          <h1>Kalakritam</h1>
          <div className="intro-spinner"></div>
        </div>
      </div>
    </div>
  );
};

export default IntroVideo;
