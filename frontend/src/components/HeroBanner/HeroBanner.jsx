import React, { useState, useEffect } from 'react';
import { heroBannersApi } from '../../lib/adminApi';
import './HeroBanner.css';

const HeroBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = React.useRef(null);
  const fetchCalled = React.useRef(false); // Prevent duplicate API calls

  useEffect(() => {
    // Only fetch once
    if (!fetchCalled.current) {
      fetchActiveBanners();
      fetchCalled.current = true;
    }
  }, []);

  const fetchActiveBanners = async () => {
    try {
      setLoading(true);
      const response = await heroBannersApi.getActive();
      if (response.success && response.data && response.data.length > 0) {
        setBanners(response.data);
        setError(null);
      } else {
        setBanners([]);
      }
    } catch (err) {
      console.error('Error fetching hero banners:', err);
      setError('Failed to load banners');
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-rotate banners every 5 seconds (but pause for videos)
  useEffect(() => {
    if (banners.length <= 1) return;
    if (isVideoPlaying) return; // Don't auto-rotate while video is playing

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length, isVideoPlaying]);

  const handlePrevious = () => {
    // Stop video if playing
    if (videoRef.current && isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    // Stop video if playing
    if (videoRef.current && isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const handleDotClick = (index) => {
    // Stop video if playing
    if (videoRef.current && isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
    setCurrentIndex(index);
  };

  const handleBannerClick = () => {
    const currentBanner = banners[currentIndex];
    if (currentBanner?.link_url) {
      window.location.href = currentBanner.link_url;
    }
  };

  // Don't render if loading, error, or no banners
  if (loading || error || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  // Handle video end - advance to next slide
  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
    if (banners.length > 1) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }
  };

  // Handle video start
  const handleVideoStart = () => {
    setIsVideoPlaying(true);
  };

  return (
    <div className="hero-banner-container">
      <div 
        className={`hero-banner ${currentBanner.link_url ? 'clickable' : ''}`}
        onClick={handleBannerClick}
      >
        {currentBanner.media_type === 'video' ? (
          <video
            ref={videoRef}
            className="hero-banner-media"
            src={currentBanner.media_url}
            autoPlay
            muted
            playsInline
            onPlay={handleVideoStart}
            onEnded={handleVideoEnd}
            onPause={() => setIsVideoPlaying(false)}
          />
        ) : (
          <img
            className="hero-banner-media"
            src={currentBanner.media_url}
            alt={currentBanner.title || 'Hero Banner'}
            loading="eager"
          />
        )}

        {/* Gradient overlay for better text visibility */}
        <div className="hero-banner-overlay"></div>

        {/* Banner title if available */}
        {currentBanner.title && (
          <div className="hero-banner-content">
            <h2 className="hero-banner-title">{currentBanner.title}</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroBanner;
