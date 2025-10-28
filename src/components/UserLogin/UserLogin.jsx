import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../contexts/UserAuthContext';
import { userAuthApi } from '../../lib/adminApi';
import { getUserPath } from '../../utils/userHelpers';
import { toast } from '../../utils/notifications.js';
import VideoLogo from '../VideoLogo';
import Orb from '../Orb';
import './UserLogin.css';

const UserLogin = () => {
  const navigate = useNavigate();
  const { login, signup, googleLogin, isAuthenticated, isLoading: authLoading, user } = useUserAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Check if already logged in
  useEffect(() => {
    if (isAuthenticated && !authLoading && user) {
      // User is already logged in, redirect to their personalized home page
      const userPath = getUserPath(user, 'home');
      navigate(userPath);
    }
  }, [isAuthenticated, authLoading, user, navigate]);

  // Check if already logged in (fallback check using localStorage)
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('userToken');
      if (token && !isVerifying && !isAuthenticated) {
        setIsVerifying(true);
        // Verify token validity
        await verifyToken(token);
        setIsVerifying(false);
      }
    };
    
    checkAuth();
    
    // Clear any browser stored form data
    setFormData({
      email: '',
      password: '',
      name: '',
      phone: '',
      confirmPassword: ''
    });
  }, []);

  // Initialize Google Sign-In
  useEffect(() => {
    // Skip Google Sign-In if no client ID or in development without proper setup
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn('Google Client ID not configured');
      return;
    }

    // Check if script already exists
    let script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    
    if (!script) {
      // Load Google Sign-In script
      script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    const initializeGoogleButton = () => {
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleSignIn,
            auto_select: false,
          });

          const buttonContainer = document.getElementById('google-signin-button');
          if (buttonContainer) {
            // Clear previous button
            buttonContainer.innerHTML = '';
            
            // Render the button with fixed width
            window.google.accounts.id.renderButton(
              buttonContainer,
              {
                theme: 'filled_black',
                size: 'large',
                text: isSignUp ? 'signup_with' : 'signin_with',
                width: '400',
                logo_alignment: 'left',
              }
            );
          }
        } catch (error) {
          console.error('Google Sign-In initialization error:', error);
          // Hide the button container if initialization fails
          const buttonContainer = document.getElementById('google-signin-button');
          if (buttonContainer) {
            buttonContainer.style.display = 'none';
          }
        }
      }
    };

    if (window.google) {
      initializeGoogleButton();
    } else {
      script.onload = initializeGoogleButton;
      script.onerror = () => {
        console.error('Failed to load Google Sign-In script');
        const buttonContainer = document.getElementById('google-signin-button');
        if (buttonContainer) {
          buttonContainer.style.display = 'none';
        }
      };
    }

    // Don't remove script on cleanup as it might be used by other components
  }, [isSignUp]);

  const verifyToken = async (token) => {
    try {
      const result = await userAuthApi.verifyToken();
      if (result.success) {
        // Token is valid, get user data and redirect to their personalized home
        const userData = localStorage.getItem('userData');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          const userPath = getUserPath(parsedUser, 'home');
          navigate(userPath);
        } else {
          navigate('/user/dashboard');
        }
      } else {
        // Token verification failed, remove it
        console.log('Token verification failed:', result);
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
      }
    } catch (error) {
      // Token is invalid, remove it
      console.log('Token verification error:', error);
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
    }
  };

  const handleGoogleSignIn = async (response) => {
    setIsLoading(true);
    const loadingId = toast.authLoading(isSignUp ? 'Creating account...' : 'Signing in...');

    try {
      const result = await googleLogin(response.credential);
      toast.dismiss(loadingId);

      if (result.success && result.user) {
        toast.authSuccess(isSignUp ? 'Account created successfully!' : 'Welcome back!');
        const userPath = getUserPath(result.user, 'home');
        setTimeout(() => {
          navigate(userPath);
        }, 800);
      } else {
        toast.authError(result.error || 'Google authentication failed');
        setError(result.error || 'Google authentication failed');
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      toast.dismiss(loadingId);
      toast.authError('Google authentication failed. Please try again.');
      setError('Google authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === 'email' ? value.toLowerCase() : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    if (error) setError('');
  };

  const handleEmailInput = (e) => {
    e.target.value = e.target.value.toLowerCase();
    handleInputChange(e);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp) {
      if (!formData.name || formData.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters';
      }
      
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      toast.validationError(Object.values(validationErrors)[0]);
      setError(Object.values(validationErrors)[0]);
      return;
    }

    setIsLoading(true);
    setError('');

    const loadingId = toast.authLoading(isSignUp ? 'Creating your account...' : 'Signing in...');

    try {
      let result;
      
      if (isSignUp) {
        // Use context's signup method
        result = await signup({
          email: formData.email,
          password: formData.password,
          name: formData.name.trim(),
          phone: formData.phone.trim() || undefined
        });
      } else {
        // Use context's login method
        result = await login({
          email: formData.email,
          password: formData.password
        });
      }

      toast.dismiss(loadingId);

      if (result.success && result.user) {
        toast.authSuccess(isSignUp ? 'Account created successfully!' : 'Welcome back!');
        
        // Navigate to user's personalized home page after a short delay
        const userPath = getUserPath(result.user, 'home');
        setTimeout(() => {
          navigate(userPath);
        }, 1000);
      } else {
        const errorMessage = result.error || (isSignUp ? 'Sign up failed' : 'Login failed');
        toast.authError(errorMessage);
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.dismiss(loadingId);
      
      let errorMessage;
      if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        toast.serverError(errorMessage);
      } else if (error.message.includes('401')) {
        errorMessage = 'Invalid email or password. Please try again.';
        toast.authError(errorMessage);
      } else if (error.message.includes('409')) {
        errorMessage = 'An account with this email already exists.';
        toast.authError(errorMessage);
      } else {
        errorMessage = 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setFormData({
      email: '',
      password: '',
      name: '',
      phone: '',
      confirmPassword: ''
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="user-login-container">
      {/* Orb Background */}
      <Orb 
        hue={45} 
        hoverIntensity={0.2} 
        rotateOnHover={true} 
        forceHoverState={false} 
      />
      
      {/* Video Logo */}
      <VideoLogo />
      
      <div className="user-login-content">
        <div className="user-login-card">
          <div className="user-login-header">
            <h1 className="user-title">Kalakritam</h1>
            <h2 className="user-subtitle">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="user-description">
              {isSignUp 
                ? 'Join our community of art enthusiasts' 
                : 'Sign in to access your account'}
            </p>
          </div>

          <form className="user-login-form" onSubmit={handleSubmit} autoComplete="off">
            {error && (
              <div className="error-message">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                {error}
              </div>
            )}

            {isSignUp && (
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={isSignUp}
                    placeholder="Enter your full name"
                    className="form-input"
                    disabled={isLoading}
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            {isSignUp && (
              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number <span className="optional-label">(Optional)</span></label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="form-input"
                    disabled={isLoading}
                    autoComplete="tel"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleEmailInput}
                  onInput={handleEmailInput}
                  required
                  placeholder="Enter your email"
                  className="form-input"
                  disabled={isLoading}
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  style={{ textTransform: 'none' }}
                  inputMode="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <circle cx="12" cy="16" r="1"></circle>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder={isSignUp ? "Create a password" : "Enter your password"}
                  className="form-input"
                  disabled={isLoading}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  style={{ textTransform: 'none' }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <circle cx="12" cy="16" r="1"></circle>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required={isSignUp}
                    placeholder="Confirm your password"
                    className="form-input"
                    disabled={isLoading}
                    autoComplete="new-password"
                    style={{ textTransform: 'none' }}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={toggleConfirmPasswordVisibility}
                    disabled={isLoading}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`login-submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="loading-spinner" width="20" height="20" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                      <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                      <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

            <div id="google-signin-button" className="google-signin-wrapper"></div>

            <div className="form-footer">
              <p className="toggle-mode">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                {' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="toggle-mode-btn"
                  disabled={isLoading}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </form>

          <div className="user-login-footer">
            <button 
              onClick={() => navigate('/home')} 
              className="back-to-home-btn"
              disabled={isLoading}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5"></path>
                <polyline points="12,19 5,12 12,5"></polyline>
              </svg>
              Back to Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
