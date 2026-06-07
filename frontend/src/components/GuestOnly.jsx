import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '../contexts/UserAuthContext';

const GuestOnly = ({ children }) => {
  const { isAuthenticated, isLoading } = useUserAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (isAuthenticated) {
    // If already logged in, go to dashboard (or intended page)
    const redirectTo = location.state?.from?.pathname || '/user/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default GuestOnly;
