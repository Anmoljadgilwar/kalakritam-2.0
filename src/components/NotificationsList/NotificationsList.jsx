import React, { useState, useEffect } from 'react';
import { config } from '../../config/environment';
import { toast } from '../../utils/notifications';
import './NotificationsList.css';

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('userToken');
      const response = await fetch(`${config.apiBaseUrl}/api/auth/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNotifications(data.data);
          setUnreadCount(data.data.filter(n => !n.is_read).length);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('userToken');
      const response = await fetch(`${config.apiBaseUrl}/api/auth/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
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
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      gallery: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      ),
      workshop: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      ),
      event: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
      blog: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
      announcement: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="notifications-loading">
        <div className="loading-spinner"></div>
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h3>Notifications</h3>
        {unreadCount > 0 && (
          <div className="notifications-actions">
            <span className="unread-badge">{unreadCount} unread</span>
            <button onClick={markAllAsRead} className="mark-all-read-btn">
              Mark all as read
            </button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="no-notifications">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <p>No notifications yet</p>
          <small>You'll be notified when new content is added</small>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
              onClick={() => !notification.is_read && markAsRead(notification.id)}
            >
              <div className={`notification-icon notification-icon-${notification.type}`}>
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-content">
                <div className="notification-header">
                  <h4>{notification.title}</h4>
                  {!notification.is_read && <span className="new-badge">NEW</span>}
                </div>
                <p>{notification.message}</p>
                <div className="notification-footer">
                  <span className="notification-time">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {formatTime(notification.created_at)}
                  </span>
                  {notification.link && (
                    <a href={notification.link} className="view-link" onClick={(e) => e.stopPropagation()}>
                      View Details →
                    </a>
                  )}
                </div>
              </div>
              {!notification.is_read && <div className="unread-indicator"></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsList;
