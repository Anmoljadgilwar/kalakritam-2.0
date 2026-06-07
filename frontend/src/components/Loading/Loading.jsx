import React from 'react';
import './Loading.css';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <div className="simple-spinner"></div>
        <p className="loading-text">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
