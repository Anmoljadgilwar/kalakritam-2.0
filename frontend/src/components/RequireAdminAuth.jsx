import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authApi } from '../lib/adminApi';

const RequireAdminAuth = ({ children }) => {
  const [authState, setAuthState] = useState('loading');
  const location = useLocation();

  useEffect(() => {
    const checkAdminAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setAuthState('unauthenticated');
        return;
      }

      try {
        const result = await authApi.verifyToken();
        if (result.success) {
          setAuthState('authenticated');
        } else {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          setAuthState('unauthenticated');
        }
      } catch {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setAuthState('unauthenticated');
      }
    };

    checkAdminAuth();
  }, []);

  if (authState === 'loading') {
    return (
      <div className="auth-loading-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'rgba(0, 0, 0, 0.95)',
        color: '#c38f21'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(195, 143, 33, 0.3)',
            borderTop: '4px solid #c38f21',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p>Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (authState === 'unauthenticated') {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
};

export default RequireAdminAuth;
