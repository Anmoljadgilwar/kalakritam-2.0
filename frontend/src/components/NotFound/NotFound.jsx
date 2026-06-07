import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FuzzyText from './FuzzyText';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();
  const [hoverIntensity] = useState(0.5);
  const [enableHover] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const creativeMessages = [
    "Oops! This canvas is blank...",
    "Lost in the art gallery?",
    "This masterpiece doesn't exist yet...",
    "Searching for something that's not there...",
    "This page wandered off the exhibit..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % creativeMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="not-found-container">
      {/* Animated background orbs */}
      <div className="not-found-orb orb-1"></div>
      <div className="not-found-orb orb-2"></div>
      <div className="not-found-orb orb-3"></div>
      
      <div className="not-found-content">
        <div className="not-found-fuzzy-wrapper">
          <FuzzyText 
            baseIntensity={0.2} 
            hoverIntensity={hoverIntensity} 
            enableHover={enableHover}
            fontSize="clamp(4rem, 20vw, 12rem)"
            fontWeight={900}
            color="#c38f21"
          >
            404
          </FuzzyText>
        </div>
        
        <div className="not-found-text">
          <h2 className="not-found-title">Page Not Found</h2>
          <div className="not-found-message-container">
            {creativeMessages.map((message, index) => (
              <p 
                key={index}
                className={`not-found-message ${index === currentMessageIndex ? 'active' : ''}`}
              >
                {message}
              </p>
            ))}
          </div>
        </div>

        <div className="not-found-actions">
          <button 
            onClick={() => navigate('/')}
            className="not-found-btn btn-home"
          >
            Return Home
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="not-found-btn btn-back"
          >
            Go Back
          </button>
          <button 
            onClick={() => navigate('/gallery')}
            className="not-found-btn btn-gallery"
          >
            Browse Gallery
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
