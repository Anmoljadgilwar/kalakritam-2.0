import React, { useState, useEffect, useRef } from 'react';
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
  const { login, signup, googleLogin, isAuthenticated, isLoading: authLoading, user, checkAuth } = useUserAuth();
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
  
  // OTP and Forgot Password States
  const [authMode, setAuthMode] = useState('password'); // 'password' | 'otp' | 'forgot-password' | 'reset-password'
  const [otpStep, setOtpStep] = useState('email'); // 'email' | 'verify'
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpPurpose, setOtpPurpose] = useState('login'); // 'login' | 'signup' | 'password-reset'
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pendingSignupData, setPendingSignupData] = useState(null); // Store signup data for after OTP verification
  const otpInputRefs = useRef([]);

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
            
            // Render the button with website theme
            window.google.accounts.id.renderButton(
              buttonContainer,
              {
                theme: 'outline',
                size: 'large',
                text: isSignUp ? 'signup_with' : 'signin_with',
                width: '380',
                logo_alignment: 'left',
                shape: 'rectangular',
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

    if (isSignUp) {
      // For signup: First send OTP, then create account after verification
      const loadingId = toast.authLoading('Sending verification OTP...');
      
      try {
        // Store signup data for later (after OTP verification)
        setPendingSignupData({
          email: formData.email,
          password: formData.password,
          name: formData.name.trim(),
          phone: formData.phone.trim() || undefined
        });
        setOtpPurpose('signup');
        
        // Request OTP for signup verification
        const otpResult = await userAuthApi.requestOTP(formData.email, 'signup');
        toast.dismiss(loadingId);
        
        if (otpResult.success) {
          toast.success('Verification OTP sent to your email!');
          setAuthMode('otp');
          setOtpStep('verify');
          setOtpTimer(120);
          setOtp(['', '', '', '', '', '']);
        } else {
          const errorMessage = otpResult.error || 'Failed to send OTP';
          toast.authError(errorMessage);
          setError(errorMessage);
        }
      } catch (error) {
        toast.dismiss(loadingId);
        const errorMessage = error.message || 'Failed to send OTP';
        toast.authError(errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // For login: Use normal flow
    const loadingId = toast.authLoading('Signing in...');

    try {
      const result = await login({
        email: formData.email,
        password: formData.password
      });

      toast.dismiss(loadingId);

      if (result.success && result.user) {
        toast.authSuccess('Welcome back!');
        
        // Navigate to user's personalized home page after a short delay
        const userPath = getUserPath(result.user, 'home');
        setTimeout(() => {
          navigate(userPath);
        }, 1000);
      } else {
        const errorMessage = result.error || 'Login failed';
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

  // OTP Timer Effect
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Handle OTP Input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pastedValue = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedValue.forEach((char, i) => {
        if (index + i < 6 && /^\d$/.test(char)) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + pastedValue.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Request OTP
  const handleRequestOTP = async () => {
    if (!formData.email) {
      toast.validationError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');
    const loadingId = toast.authLoading('Sending OTP...');

    try {
      const result = await userAuthApi.requestOTP(formData.email, 'login');
      toast.dismiss(loadingId);

      if (result.success) {
        toast.success('OTP sent to your email!');
        setOtpStep('verify');
        setOtpTimer(300); // 5 minutes
        setOtp(['', '', '', '', '', '']);
      }
    } catch (error) {
      toast.dismiss(loadingId);
      const errorMessage = error.message || 'Failed to send OTP';
      toast.authError(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.validationError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');
    const loadingId = toast.authLoading('Verifying OTP...');

    try {
      // Determine purpose based on current flow
      const purpose = otpPurpose || 'login';
      const result = await userAuthApi.verifyOTP(formData.email, otpCode, purpose);
      toast.dismiss(loadingId);

      if (purpose === 'signup') {
        // Signup verification - NOW create the account after OTP is verified
        if (result.success) {
          toast.success('Email verified! Creating your account...');
          
          const createLoadingId = toast.authLoading('Creating your account...');
          
          try {
            // Now create the account using stored signup data
            const signupResult = await signup(pendingSignupData);
            toast.dismiss(createLoadingId);
            
            if (signupResult.success && signupResult.user) {
              toast.authSuccess('Account created successfully!');
              const userPath = getUserPath(signupResult.user, 'home');
              setTimeout(() => navigate(userPath), 800);
            } else {
              const errorMessage = signupResult.error || 'Failed to create account';
              toast.authError(errorMessage);
              setError(errorMessage);
            }
          } catch (signupError) {
            toast.dismiss(createLoadingId);
            const errorMessage = signupError.message || 'Failed to create account';
            toast.authError(errorMessage);
            setError(errorMessage);
          }
        }
      } else if (purpose === 'password-reset') {
        // Password reset verification - show password reset form
        if (result.success) {
          toast.success('OTP verified! Enter your new password.');
          setResetToken(result.resetToken || otpCode); // Use OTP as token for password reset
          setAuthMode('reset-password');
        }
      } else if (result.success && result.token) {
        // Login verification
        // Store login time for skipping token verification
        localStorage.setItem('loginTime', Date.now().toString());
        
        // Trigger auth context to re-check and update state
        await checkAuth();
        
        toast.authSuccess('Login successful!');
        const userPath = getUserPath(result.data, 'home');
        
        // Navigate without reload - the context will pick up from localStorage
        setTimeout(() => {
          navigate(userPath);
        }, 800);
      } else if (result.success && result.verified) {
        toast.success('OTP verified successfully!');
      }
    } catch (error) {
      toast.dismiss(loadingId);
      const errorMessage = error.message || 'Invalid OTP';
      toast.authError(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (otpTimer > 0) return;
    
    setIsLoading(true);
    setError('');
    const loadingId = toast.authLoading('Resending OTP...');
    
    try {
      const purpose = otpPurpose || 'login';
      const result = await userAuthApi.requestOTP(formData.email, purpose);
      toast.dismiss(loadingId);
      
      if (result.success) {
        toast.success('OTP resent to your email!');
        setOtpTimer(120);
        setOtp(['', '', '', '', '', '']);
      }
    } catch (error) {
      toast.dismiss(loadingId);
      const errorMessage = error.message || 'Failed to resend OTP';
      toast.authError(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password - Now uses OTP
  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast.validationError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');
    const loadingId = toast.authLoading('Sending verification OTP...');

    try {
      const result = await userAuthApi.requestOTP(formData.email, 'password-reset');
      toast.dismiss(loadingId);

      if (result.success) {
        toast.success('OTP sent to your email! Verify to reset password.');
        setOtpPurpose('password-reset');
        setAuthMode('otp');
        setOtpStep('verify');
        setOtpTimer(120);
        setOtp(['', '', '', '', '', '']);
      }
    } catch (error) {
      toast.dismiss(loadingId);
      const errorMessage = error.message || 'Failed to send OTP';
      toast.authError(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Reset Password (after OTP verification)
  const handleResetPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      toast.validationError('Please enter and confirm your new password');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.validationError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.validationError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    setError('');
    const loadingId = toast.authLoading('Resetting password...');

    try {
      // Use email and OTP-based reset
      const result = await userAuthApi.resetPasswordWithOTP(formData.email, resetToken, newPassword);
      toast.dismiss(loadingId);

      if (result.success) {
        toast.authSuccess('Password reset successful! Please login with your new password.');
        setAuthMode('password');
        setOtpPurpose('login');
        setResetToken('');
        setNewPassword('');
        setConfirmNewPassword('');
        setIsSignUp(false);
      }
    } catch (error) {
      toast.dismiss(loadingId);
      const errorMessage = error.message || 'Failed to reset password';
      toast.authError(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for reset token in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setResetToken(token);
      setAuthMode('reset-password');
    }
  }, []);

  // Switch auth mode
  const switchToOTP = () => {
    setAuthMode('otp');
    setOtpStep('email');
    setOtp(['', '', '', '', '', '']);
    setError('');
  };

  const switchToPassword = () => {
    setAuthMode('password');
    setError('');
  };

  const switchToForgotPassword = () => {
    setAuthMode('forgot-password');
    setError('');
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
            <h2 className="user-subtitle">
              {authMode === 'forgot-password' ? 'Reset Password' :
               authMode === 'reset-password' ? 'Create New Password' :
               authMode === 'otp' ? 'OTP Login' :
               isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="user-description">
              {authMode === 'forgot-password' ? 'Enter your email to receive a reset link' :
               authMode === 'reset-password' ? 'Enter your new password below' :
               authMode === 'otp' ? (otpStep === 'email' ? 'Enter your email to receive OTP' : 'Enter the 6-digit code sent to your email') :
               isSignUp ? 'Join our community of art enthusiasts' : 'Sign in to access your account'}
            </p>
          </div>

          {/* Forgot Password Form */}
          {authMode === 'forgot-password' && (
            <div className="user-login-form">
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

              <div className="form-group">
                <label htmlFor="forgot-email" className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <input
                    type="email"
                    id="forgot-email"
                    name="email"
                    value={formData.email}
                    onChange={handleEmailInput}
                    placeholder="Enter your email"
                    className="form-input"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleForgotPassword}
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
                    Sending...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Send Reset Link
                  </>
                )}
              </button>

              <div className="form-footer">
                <p className="toggle-mode">
                  Remember your password?{' '}
                  <button type="button" onClick={switchToPassword} className="toggle-mode-btn" disabled={isLoading}>
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Reset Password Form */}
          {authMode === 'reset-password' && (
            <div className="user-login-form">
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

              <div className="form-group">
                <label htmlFor="new-password" className="form-label">New Password</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="form-input"
                    disabled={isLoading}
                  />
                  <button type="button" className="password-toggle" onClick={togglePasswordVisibility}>
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>
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

              <div className="form-group">
                <label htmlFor="confirm-new-password" className="form-label">Confirm New Password</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-new-password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="form-input"
                    disabled={isLoading}
                  />
                  <button type="button" className="password-toggle" onClick={toggleConfirmPasswordVisibility}>
                    {showConfirmPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>
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

              <button
                type="button"
                onClick={handleResetPassword}
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
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
          )}

          {/* OTP Login Form */}
          {authMode === 'otp' && (
            <div className="user-login-form">
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

              {otpStep === 'email' ? (
                <>
                  <div className="form-group">
                    <label htmlFor="otp-email" className="form-label">Email Address</label>
                    <div className="input-wrapper">
                      <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      <input
                        type="email"
                        id="otp-email"
                        name="email"
                        value={formData.email}
                        onChange={handleEmailInput}
                        placeholder="Enter your email"
                        className="form-input"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRequestOTP}
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
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 2L11 13"></path>
                          <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                        </svg>
                        Send OTP
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className="otp-sent-info">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>OTP sent to <strong>{formData.email}</strong></span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Enter OTP</label>
                    <div className="otp-inputs">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpInputRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="otp-input"
                          disabled={isLoading}
                          autoFocus={index === 0}
                        />
                      ))}
                    </div>
                    <div className="otp-timer">
                      {otpTimer > 0 ? (
                        <span>Resend OTP in {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}</span>
                      ) : (
                        <button type="button" onClick={handleResendOTP} className="resend-otp-btn" disabled={isLoading}>
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    className={`login-submit-btn ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading || otp.join('').length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <svg className="loading-spinner" width="20" height="20" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                            <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                            <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                          </circle>
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Verify & Login
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpStep('email')}
                    className="change-email-btn"
                    disabled={isLoading}
                  >
                    ← Change Email
                  </button>
                </>
              )}

              <div className="divider">
                <span>OR</span>
              </div>

              <button type="button" onClick={switchToPassword} className="alt-login-btn" disabled={isLoading}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Login with Password
              </button>

              <div className="form-footer">
                <p className="toggle-mode">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => { setIsSignUp(true); switchToPassword(); }} className="toggle-mode-btn" disabled={isLoading}>
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Password Login / Signup Form */}
          {authMode === 'password' && (
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

            {!isSignUp && (
              <>
                <button type="button" onClick={switchToOTP} className="alt-login-btn" disabled={isLoading}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <circle cx="12" cy="16" r="1"></circle>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Login with OTP
                </button>

                <button type="button" onClick={switchToForgotPassword} className="forgot-password-btn" disabled={isLoading}>
                  Forgot Password?
                </button>
              </>
            )}

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
          )}

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
