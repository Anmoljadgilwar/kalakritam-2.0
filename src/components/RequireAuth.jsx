import React, { useEffect } from 'react';
import { Navigate, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../contexts/UserAuthContext';
import { validateUsernameMatch, getUserPath } from '../utils/userHelpers';
import { toast } from '../utils/notifications';

/**
 * RequireAuth Component
 * 
 * Purpose:
 * - Ensures user is authenticated before accessing protected routes
 * - Validates that the username in the URL matches the logged-in user
 * - Prevents users from accessing other users' personalized pages
 * - Automatically redirects to correct personalized URL if username mismatch
 * 
 * Security Features:
 * 1. Authentication Check: Redirects to login if not authenticated
 * 2. Username Validation: Ensures URL username matches logged-in user
 * 3. Automatic Correction: Redirects to correct personalized URL on mismatch
 * 4. Toast Notifications: Alerts users of access violations
 * 
 * Usage:
 * Wrap any route that requires authentication and username validation
 * 
 * Example:
 * <Route path="/u/:username/dashboard" element={
 *   <RequireAuth>
 *     <UserDashboard />
 *   </RequireAuth>
 * } />
 */
const RequireAuth = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useUserAuth();
  const location = useLocation();
  const { username } = useParams();
  const navigate = useNavigate();

  // Extract page name from current path
  const getPageNameFromPath = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    // For paths like /u/username/page, return 'page'
    // For paths like /user/dashboard, return 'dashboard'
    if (pathParts[0] === 'u' && pathParts.length >= 3) {
      return pathParts[2]; // Returns 'dashboard', 'home', 'gallery', etc.
    }
    if (pathParts[0] === 'user') {
      return pathParts[1]; // Returns 'dashboard'
    }
    return 'home'; // Default fallback
  };

  // Validate username matches logged-in user
  useEffect(() => {
    if (!isLoading && isAuthenticated && user && username) {
      const isValid = validateUsernameMatch(username, user);
      
      if (!isValid) {
        // Username mismatch - user trying to access another user's page
        const pageName = getPageNameFromPath();
        const correctPath = getUserPath(user, pageName);
        
        console.warn(`Username validation failed: URL username "${username}" doesn't match user. Redirecting to ${correctPath}`);
        toast.error('Access denied. You can only access your own pages.');
        
        // Redirect to their correct personalized URL
        navigate(correctPath, { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, user, username, navigate, location.pathname]);

  // While checking authentication, show loading state
  if (isLoading) {
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
          <p>Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    console.log('RequireAuth: User not authenticated, redirecting to login');
    return <Navigate to="/user/login" replace state={{ from: location }} />;
  }

  // Authenticated and username is valid (or no username in URL) - render children
  return children;
};

export default RequireAuth;
