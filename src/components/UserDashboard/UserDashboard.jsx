import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserAuth } from '../../contexts/UserAuthContext';
import { validateUsernameMatch, getUserPath, getNavigationPath } from '../../utils/userHelpers';
import { toast } from '../../utils/notifications';
import Header from '../Header';
import Footer from '../Footer';
import './UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const { user, isAuthenticated, isLoading, logout } = useUserAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: ''
  });

  // Validate username in URL matches logged-in user
  useEffect(() => {
    if (username && user) {
      const isValid = validateUsernameMatch(username, user);
      if (!isValid) {
        toast.error('Invalid user access');
        const correctPath = getUserPath(user, 'dashboard');
        navigate(correctPath, { replace: true });
      }
    } else if (!username && user && isAuthenticated) {
      // If accessing /user/dashboard without username, redirect to personalized URL
      const correctPath = getUserPath(user, 'dashboard');
      navigate(correctPath, { replace: true });
    }
  }, [username, user, isAuthenticated, navigate]);

  useEffect(() => {
    console.log('UserDashboard - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'user:', user);
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
    }
  }, [user, isLoading, isAuthenticated]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/home');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    // This will be implemented when the API is ready
    toast.info('Profile update feature coming soon!');
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="user-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="user-dashboard-container">
      <Header currentPage="user" />

      <div className="user-dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">My Account</h1>
          <p className="dashboard-subtitle">Welcome back, {user.name}!</p>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>

        <div className="dashboard-grid">
          {/* Profile Card */}
          <div className="dashboard-card profile-card">
            <div className="card-header">
              <h2 className="card-title">Profile Information</h2>
              <button 
                className="edit-btn"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Cancel
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit Profile
                  </>
                )}
              </button>
            </div>
            
            <div className="profile-content">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  {user.photoUrl ? (
                    <img src={user.photoUrl} alt={user.name} />
                  ) : (
                    <span className="avatar-initials">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                {user.provider === 'google' && (
                  <div className="google-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google Account
                  </div>
                )}
              </div>

              <div className="profile-fields">
                <div className="field-group">
                  <label>Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="field-input"
                    />
                  ) : (
                    <p className="field-value">{user.name}</p>
                  )}
                </div>

                <div className="field-group">
                  <label>Email Address</label>
                  <p className="field-value">{user.email}</p>
                  <small className="field-note">Email cannot be changed</small>
                </div>

                <div className="field-group">
                  <label>Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="field-input"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="field-value">{user.phone || 'Not provided'}</p>
                  )}
                </div>

                <div className="field-group">
                  <label>Bio</label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      className="field-textarea"
                      placeholder="Tell us about yourself"
                      rows="4"
                    />
                  ) : (
                    <p className="field-value">{user.bio || 'No bio provided'}</p>
                  )}
                </div>

                {isEditing && (
                  <button 
                    className="save-btn"
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="dashboard-card stats-card">
            <h2 className="card-title">Account Statistics</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <div className="stat-info">
                  <p className="stat-label">Member Since</p>
                  <p className="stat-value">
                    {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="stat-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <div className="stat-info">
                  <p className="stat-label">Notifications</p>
                  <p className="stat-value">Coming Soon</p>
                </div>
              </div>

              <div className="stat-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                <div className="stat-info">
                  <p className="stat-label">Activity</p>
                  <p className="stat-value">
                    {user.lastLogin ? 
                      `Last login: ${new Date(user.lastLogin).toLocaleDateString()}` :
                      'Active'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card actions-card">
            <h2 className="card-title">Quick Actions</h2>
            <div className="actions-grid">
              <button 
                className="action-btn"
                onClick={() => navigate(getNavigationPath(user, isAuthenticated, 'gallery'))}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span>Browse Gallery</span>
              </button>

              <button 
                className="action-btn"
                onClick={() => navigate(getNavigationPath(user, isAuthenticated, 'workshops'))}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                <span>View Workshops</span>
              </button>

              <button 
                className="action-btn"
                onClick={() => navigate(getNavigationPath(user, isAuthenticated, 'events'))}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>Upcoming Events</span>
              </button>

              <button 
                className="action-btn"
                onClick={() => navigate(getNavigationPath(user, isAuthenticated, 'contact'))}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>Contact Us</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
