import React from 'react';
import './AdminLoading.css';

const AdminLoading = ({ message = 'Loading...' }) => {
  return (
    <div className="admin-loading-overlay">
      <div className="admin-loading-content">
        <div className="admin-loading-spinner"></div>
        <div className="admin-loading-text">{message}</div>
      </div>
    </div>
  );
};

export default AdminLoading;
