import React, { useState, useEffect, useRef } from 'react';
import { config } from '../../config/environment';
import './NotificationBell.css';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 2 minutes
    const interval = setInterval(fetchNotifications, 120000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Delete all notifications when closing the dropdown
        if (isOpen && notifications.length > 0) {
          deleteAllNotifications();
        }
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, notifications.length]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch(`${config.apiBaseUrl}/api/auth/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNotifications(data.data.slice(0, 10)); // Show only latest 10
          setUnreadCount(data.data.filter(n => !n.is_read).length);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleBellClick = async () => {
    // If closing the dropdown, delete all notifications
    if (isOpen && notifications.length > 0) {
      await deleteAllNotifications();
    }
    
    setIsOpen(!isOpen);
    
    // Mark all as read when opening (but don't delete yet)
    if (!isOpen && unreadCount > 0) {
      await markAllAsRead();
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('userToken');
      const response = await fetch(`${config.apiBaseUrl}/api/auth/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, is_read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const deleteAllNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('userToken');
      
      const deleteResponse = await fetch(`${config.apiBaseUrl}/api/auth/notifications/delete-all`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (deleteResponse.ok) {
        // Clear notifications from state
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error deleting notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      gallery: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      ),
      workshop: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2196F3" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      ),
      event: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF9800" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
      blog: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9C27B0" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
      announcement: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c38f21" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      )
    };
    return icons[type] || icons.announcement;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button 
        className="notification-bell-btn"
        onClick={handleBellClick}
        aria-label="Notifications"
      >
        <img 
          src="/images/notification.png" 
          alt="Notifications" 
          className="notification-bell-icon"
        />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <h3>Notifications</h3>
            {loading && <span className="loading-indicator">...</span>}
          </div>

          {notifications.length === 0 ? (
            <div className="notification-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(195, 143, 33, 0.3)" strokeWidth="1.5">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <p>No new notifications</p>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map(notification => (
                <a
                  key={notification.id}
                  href={notification.link || '#'}
                  className="notification-item"
                  onClick={() => setIsOpen(false)}
                >
                  <div className={`notification-icon-wrapper notification-icon-${notification.type}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-time">{formatTime(notification.created_at)}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
