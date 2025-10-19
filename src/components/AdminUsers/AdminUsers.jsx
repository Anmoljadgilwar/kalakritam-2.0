import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAuthApi } from '../../lib/adminApi';
import { toast } from '../../utils/notifications';
import AdminHeader from '../AdminHeader';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import AdminLoading from '../AdminLoading';
import './AdminUsers.css';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    googleUsers: 0,
    emailUsers: 0
  });
  const [filter, setFilter] = useState('all'); // all, active, google, email

  useEffect(() => {
    // Check if user is authenticated (can be either admin or user token)
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('userToken');
    
    console.log('AdminUsers - Mount check:', { hasAdminToken: !!adminToken, hasUserToken: !!userToken });
    
    if (!adminToken && !userToken) {
      // Not logged in at all - redirect to admin login (since this is admin feature)
      console.log('AdminUsers - No tokens found, redirecting to admin login');
      toast.error('Please log in as admin to access User Management');
      navigate('/admin/login');
      return;
    }
    
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    setIsLoading(true);
    
    // Debug: Check what tokens we have
    const userToken = localStorage.getItem('userToken');
    const adminToken = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('userData');
    
    console.log('AdminUsers - Checking tokens:', {
      hasUserToken: !!userToken,
      hasAdminToken: !!adminToken,
      userData: userData ? JSON.parse(userData) : null
    });
    
    try {
      console.log('AdminUsers - Calling getAllUsers API...');
      const result = await userAuthApi.getAllUsers();
      console.log('AdminUsers - API result:', result);
      
      if (result.success) {
        console.log('AdminUsers - Got users:', result.data?.length || 0);
        setUsers(result.data || []);
        calculateStats(result.data || []);
        
        if (!result.data || result.data.length === 0) {
          toast.info('No users registered yet. Users will appear here once they sign up.');
        }
      } else {
        console.error('AdminUsers - API returned error:', result.error);
        if (result.error?.includes('Unauthorized') || result.error?.includes('Admin access required')) {
          toast.error('Access denied: Admin privileges required. Please contact admin@kalakritam.in');
          setTimeout(() => navigate('/home'), 2000);
        } else {
          toast.error(result.error || 'Failed to fetch users');
        }
      }
    } catch (error) {
      console.error('AdminUsers - Fetch error:', error);
      const errorMsg = error.message || 'Error loading users data';
      
      if (errorMsg.includes('Not authenticated') || errorMsg.includes('Please log in')) {
        toast.error('Authentication required. Please log in as admin.');
        setTimeout(() => navigate('/admin/login'), 1500);
      } else if (errorMsg.includes('Unauthorized') || errorMsg.includes('403')) {
        toast.error('Access denied: Admin privileges required. Please contact admin@kalakritam.in');
        setTimeout(() => navigate('/admin/portal'), 2000);
      } else if (errorMsg.includes('401')) {
        toast.error('Authentication expired. Please log in again.');
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (usersData) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    
    const stats = {
      totalUsers: usersData.length,
      activeUsers: usersData.filter(user => 
        new Date(user.lastLogin || user.createdAt) > thirtyDaysAgo
      ).length,
      googleUsers: usersData.filter(user => user.provider === 'google').length,
      emailUsers: usersData.filter(user => user.provider === 'email').length
    };
    
    setStats(stats);
  };

  const getFilteredUsers = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    
    switch (filter) {
      case 'active':
        return users.filter(user => 
          new Date(user.lastLogin || user.createdAt) > thirtyDaysAgo
        );
      case 'google':
        return users.filter(user => user.provider === 'google');
      case 'email':
        return users.filter(user => user.provider === 'email');
      default:
        return users;
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await userAuthApi.deleteUser(userId);
      if (result.success) {
        toast.success('User deleted successfully');
        fetchUsers();
      } else {
        toast.error(result.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
    }
  };

  const handleLogout = () => {
    // Clear both admin and user tokens
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('loginTime');
    toast.success('Logged out successfully');
    navigate('/home');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUserActive = (user) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    return new Date(user.lastLogin || user.createdAt) > thirtyDaysAgo;
  };

  if (isLoading) {
    return <AdminLoading message="Loading user data..." />;
  }

  const filteredUsers = getFilteredUsers();

  return (
    <div className="admin-users-container">
      <VideoLogo />
      <AdminHeader currentPage="users" />
      
      <div className="admin-users-content">
        <div className="admin-users-header">
          <div className="header-content">
            <h1>User Management</h1>
            <p>Monitor and manage all registered users</p>
            <div className="header-nav-buttons">
              <button 
                className="back-btn"
                onClick={() => navigate('/admin/portal')}
              >
                ← Back to Portal
              </button>
            </div>
          </div>
          <div className="header-actions">
            <div className="users-stats-summary">
              <div className="stat">
                <span className="stat-label">Total:</span>
                <span className="stat-value">{stats.totalUsers}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Active:</span>
                <span className="stat-value">{stats.activeUsers}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="admin-notice">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Admin access only. Contact admin@kalakritam.in for permissions.
        </p>

        {/* Stats Grid */}
        <div className="users-stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-value">{stats.totalUsers}</p>
              <p className="stat-label">Total Users</p>
            </div>
          </div>

          <div className="stat-card active">
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-value">{stats.activeUsers}</p>
              <p className="stat-label">Active Users (30 days)</p>
            </div>
          </div>

          <div className="stat-card google">
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-value">{stats.googleUsers}</p>
              <p className="stat-label">Google Sign-In</p>
            </div>
          </div>

          <div className="stat-card email">
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-value">{stats.emailUsers}</p>
              <p className="stat-label">Email Sign-Up</p>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Users ({users.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active ({stats.activeUsers})
          </button>
          <button 
            className={`filter-btn ${filter === 'google' ? 'active' : ''}`}
            onClick={() => setFilter('google')}
          >
            Google ({stats.googleUsers})
          </button>
          <button 
            className={`filter-btn ${filter === 'email' ? 'active' : ''}`}
            onClick={() => setFilter('email')}
          >
            Email ({stats.emailUsers})
          </button>
        </div>

        {/* Users Table */}
        <div className="users-table-container">
          {filteredUsers.length === 0 ? (
            <div className="no-users">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <p>No users found</p>
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Sign-Up Method</th>
                  <th>Joined Date</th>
                  <th>Last Login</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.photoUrl ? (
                            <img src={user.photoUrl} alt={user.name} />
                          ) : (
                            <span className="user-initials">
                              {user.name?.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span className="user-name">{user.name}</span>
                      </div>
                    </td>
                    <td className="user-email">{user.email}</td>
                    <td>
                      {user.provider === 'google' ? (
                        <span className="provider-badge google">
                          <svg width="16" height="16" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          </svg>
                          Google
                        </span>
                      ) : (
                        <span className="provider-badge email">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          </svg>
                          Email
                        </span>
                      )}
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>{formatDate(user.lastLogin)}</td>
                    <td>
                      {isUserActive(user) ? (
                        <span className="status-badge active">Active</span>
                      ) : (
                        <span className="status-badge inactive">Inactive</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete user"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminUsers;
