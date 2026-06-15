import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ count = 6, layout = 'grid' }) => {
  const skeletons = Array.from({ length: count });

  return (
    <div className={`skeletons-container ${layout}-layout`}>
      {skeletons.map((_, index) => (
        <div key={index} className="skeleton-card universal-card">
          <div className="skeleton-image-container universal-card-image-container">
            <div className="skeleton-shimmer" />
          </div>
          <div className="skeleton-content universal-card-content">
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-subtitle" />
            <div className="skeleton-details">
              <div className="skeleton-line skeleton-detail-row" />
              <div className="skeleton-line skeleton-detail-row" />
            </div>
            <div className="skeleton-actions">
              <div className="skeleton-btn" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
