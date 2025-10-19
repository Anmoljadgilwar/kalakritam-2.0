import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAuthApi } from '../lib/adminApi';

const UserAuthContext = createContext();

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [skipTokenVerification, setSkipTokenVerification] = useState(false);

  // Create a unique ID for this provider instance
  const providerId = React.useRef(`provider-${Math.random().toString(36).substr(2, 9)}`);
  
  console.log(`UserAuthProvider [${providerId.current}] - Initialized`);

  // Log state changes for debugging
  useEffect(() => {
    console.log(`UserAuthContext [${providerId.current}] - State changed:`, {
      isAuthenticated,
      hasUser: !!user,
      isLoading,
      hasToken: !!token
    });
  }, [isAuthenticated, user, isLoading, token]);

  // Check authentication status on mount
  useEffect(() => {
    console.log(`UserAuthContext [${providerId.current}] - Mount - calling checkAuth`);
    checkAuth();
  }, []);

  const checkAuth = async () => {
    console.log('UserAuthContext - checkAuth started');
    try {
      const storedToken = localStorage.getItem('userToken');
      const storedUser = localStorage.getItem('userData');
      
      console.log('UserAuthContext - storedToken:', storedToken ? 'exists' : 'missing');
      console.log('UserAuthContext - storedUser:', storedUser ? 'exists' : 'missing');

      if (storedToken && storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        setToken(storedToken);
        
        try {
          const parsedUser = JSON.parse(storedUser);
          if (!parsedUser || typeof parsedUser !== 'object') {
            throw new Error('Invalid user data');
          }
          setUser(parsedUser);
          setIsAuthenticated(true);
          setIsLoading(false);
          
          console.log('UserAuthContext - User authenticated from localStorage:', parsedUser);

          // Skip token verification if we just logged in (within last 5 seconds)
          const loginTime = localStorage.getItem('loginTime');
          const now = Date.now();
          if (loginTime && (now - parseInt(loginTime)) < 5000) {
            console.log('Skipping token verification - just logged in');
            return;
          }

          // Verify token is still valid (but don't logout immediately on failure)
          console.log('UserAuthContext - Verifying token...');
          try {
            const result = await userAuthApi.verifyToken();
            if (!result.success) {
              console.warn('Token verification returned unsuccessful:', result);
              // Don't logout immediately - user might have just logged in
              // The token might be valid but the API might have issues
            } else {
              console.log('UserAuthContext - Token verified successfully');
              // Update user data if API returns it
              if (result.data) {
                setUser(result.data);
                localStorage.setItem('userData', JSON.stringify(result.data));
              }
            }
          } catch (error) {
            console.error('Token verification failed:', error);
            // Only logout if it's a 401 (unauthorized), not 403 or 500
            if (error.message && error.message.includes('401')) {
              console.log('UserAuthContext - Logging out due to 401');
              logout();
            } else {
              console.warn('Token verification error - keeping user logged in for now');
            }
          }
        } catch (parseError) {
          console.error('Failed to parse stored user data:', parseError);
          // Clear invalid data
          localStorage.removeItem('userData');
          localStorage.removeItem('userToken');
          localStorage.removeItem('loginTime');
          setIsLoading(false);
        }
      } else {
        console.log('UserAuthContext - No stored credentials found or invalid data');
        // Clean up any invalid data
        if (storedUser === 'undefined' || storedUser === 'null') {
          localStorage.removeItem('userData');
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // Don't logout on general errors
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    console.log('UserAuthContext - login() called with:', credentials.email);
    try {
      const result = await userAuthApi.login(credentials);
      console.log('UserAuthContext - API login result:', result);
      
      if (result.success) {
        console.log('UserAuthContext - Setting authenticated state');
        const userData = result.data || result.user; // API returns data, not user
        setToken(result.token);
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('userToken', result.token);
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('loginTime', Date.now().toString());
        console.log('UserAuthContext - State updated, user:', userData);
        return { success: true, user: userData }; // Return user data
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    console.log('UserAuthContext - signup() called with:', userData.email);
    try {
      const result = await userAuthApi.signup(userData);
      console.log('UserAuthContext - API signup result:', result);
      
      if (result.success) {
        console.log('UserAuthContext - Setting authenticated state');
        const userDataResult = result.data || result.user; // API returns data, not user
        setToken(result.token);
        setUser(userDataResult);
        setIsAuthenticated(true);
        localStorage.setItem('userToken', result.token);
        localStorage.setItem('userData', JSON.stringify(userDataResult));
        localStorage.setItem('loginTime', Date.now().toString());
        console.log('UserAuthContext - State updated, user:', userDataResult);
        return { success: true, user: userDataResult }; // Return user data
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const googleLogin = async (credential) => {
    console.log('UserAuthContext - googleLogin() called');
    try {
      const result = await userAuthApi.googleAuth(credential);
      console.log('UserAuthContext - API googleAuth result:', result);
      if (result.success) {
        const userData = result.data || result.user;
        setToken(result.token);
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('userToken', result.token);
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('loginTime', Date.now().toString());
        return { success: true, user: userData }; // Return user data
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('loginTime');
  };

  const updateUserProfile = async (updates) => {
    try {
      const result = await userAuthApi.updateProfile(updates);
      if (result.success) {
        const userData = result.data || result.user; // API returns data, not user
        setUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
        return { success: true, user: userData }; // Return user data
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    token,
    login,
    signup,
    googleLogin,
    logout,
    updateUserProfile,
    checkAuth,
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
};

export default UserAuthContext;
