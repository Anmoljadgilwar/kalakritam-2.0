import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VideoLogo.css';

const VideoLogo = () => {
  const [showVideoLogo, setShowVideoLogo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if video was completed or if we're coming from intro
    const videoCompleted = sessionStorage.getItem('videoCompleted');
    const fromIntro = sessionStorage.getItem('fromIntro');
    const logoShown = sessionStorage.getItem('logoShown');
    
    if (videoCompleted || fromIntro || logoShown) {
      setShowVideoLogo(true);
      // Set a flag that we've shown the logo
      sessionStorage.setItem('logoShown', 'true');
      // Clear the temporary flags
      sessionStorage.removeItem('videoCompleted');
      sessionStorage.removeItem('fromIntro');
    }
  }, []);

  const handleLogoClick = () => {
    navigate('/');
  };

  if (!showVideoLogo) return null;

  return (
    <div className="video-logo-container" onClick={handleLogoClick}>
      <video
        className="video-logo"
        muted
        loop
        autoPlay
        playsInline
      >
        <source src="/intro-video.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoLogo;
