import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext.jsx';
import NotificationMessage from '../NotificationMessage';

const GlobalToastContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <NotificationMessage
      notifications={notifications}
      onRemove={removeNotification}
    />
  );
};

export default GlobalToastContainer;
