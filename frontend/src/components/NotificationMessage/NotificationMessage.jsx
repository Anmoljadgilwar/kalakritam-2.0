import React, { useState, useEffect } from 'react';
import { NOTIFICATION_TYPES, NOTIFICATION_POSITIONS } from '../../utils/notifications.js';
import ToastIcon from '../ToastIcon';
import './NotificationMessage.css';

const NotificationItem = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Show animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    if (!notification.dismissible) return;
    
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300);
  };

  const handleClick = () => {
    if (notification.clickable && notification.onClick) {
      notification.onClick();
      // Optionally remove the notification after clicking
      if (notification.dismissOnClick !== false) {
        handleRemove();
      }
    }
  };

  const getIcon = () => {
    // If custom icon is provided, use it
    if (notification.icon) {
      return <ToastIcon customIcon={notification.icon} />;
    }
    
    // Use professional SVG icons based on type
    return <ToastIcon type={notification.type} />;
  };

  const shouldShowProgress = notification.duration > 0 && !isRemoving;

  return (
    <div
      className={`notification ${notification.type} ${
        isVisible && !isRemoving ? 'show' : 'hide'
      } ${notification.clickable ? 'clickable' : ''}`}
      role="alert"
      aria-live="polite"
      onClick={handleClick}
      style={{ cursor: notification.clickable ? 'pointer' : 'default' }}
    >
      <div className="notification-icon">
        {getIcon()}
      </div>
      
      <div className="notification-content">
        <p className="notification-message">
          {notification.message}
        </p>
        {notification.description && (
          <p className="notification-description">
            {notification.description}
          </p>
        )}
      </div>

      {notification.dismissible && (
        <button
          className="notification-close"
          onClick={handleRemove}
          aria-label="Close notification"
        >
          <ToastIcon type="close" />
        </button>
      )}

      {shouldShowProgress && (
        <div
          className="notification-progress"
          style={{
            animationDuration: `${notification.duration}ms`
          }}
        />
      )}
    </div>
  );
};

const NotificationContainer = ({ notifications, position, onRemove }) => {
  if (notifications.length === 0) return null;

  return (
    <div className={`notification-container ${position}`}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

const NotificationMessage = ({ notifications = [], onRemove }) => {
  // Group notifications by position
  const notificationsByPosition = notifications.reduce((acc, notification) => {
    const position = notification.position || NOTIFICATION_POSITIONS.TOP_RIGHT;
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(notification);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(notificationsByPosition).map(([position, positionNotifications]) => (
        <NotificationContainer
          key={position}
          notifications={positionNotifications}
          position={position}
          onRemove={onRemove}
        />
      ))}
    </>
  );
};

export default NotificationMessage;
