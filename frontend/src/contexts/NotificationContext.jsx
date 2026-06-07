import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationManager } from '../utils/notifications.js';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = notificationManager.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  const addNotification = (notification) => {
    return notificationManager.add(notification);
  };

  const removeNotification = (id) => {
    notificationManager.remove(id);
  };

  const clearNotifications = () => {
    notificationManager.clear();
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
