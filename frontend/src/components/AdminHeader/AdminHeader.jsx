import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../../config/environment';
import './AdminHeader.css';

const AdminHeader = ({ currentPage = 'portal' }) => {
  const navigate = useNavigate();
  const [showContentMenu, setShowContentMenu] = useState(false);
  const [showManageMenu, setShowManageMenu] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const contentMenuRef = useRef(null);
  const manageMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const response = await fetch(`${config.apiBaseUrl}/api/admin/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAdminUser(data.user);
        }
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate('/admin/login', { replace: true });
    }
  };

  const handleNavigation = (path) => {
    setShowContentMenu(false);
    setShowManageMenu(false);
    navigate(path);
  };

  // Content Management items
  const contentItems = [
    { path: '/admin/hero-banners', label: 'Hero Banners' },
    { path: '/admin/gallery', label: 'Gallery' },
    { path: '/admin/artpartyimages', label: 'ArtParty Images' },
    { path: '/admin/moments', label: 'Moments' },
    { path: '/admin/blogs', label: 'Blogs' }
  ];

  // Management items
  const manageItems = [
    { path: '/admin/workshops', label: 'Workshops' },
    { path: '/admin/events', label: 'Events' },
    { path: '/admin/artists', label: 'Artists' },
    { path: '/admin/contact', label: 'Contact' },
    { path: '/admin/tickets', label: 'Tickets' },
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/financials', label: 'Financials' }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentMenuRef.current && !contentMenuRef.current.contains(event.target)) {
        setShowContentMenu(false);
      }
      if (manageMenuRef.current && !manageMenuRef.current.contains(event.target)) {
        setShowManageMenu(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="admin-header">
      <div className="admin-header-content">
        <div className="admin-header-brand" onClick={() => handleNavigation('/admin/portal')}>
          <div className="admin-brand-badge">ADMIN</div>
          <div className="admin-brand-info">
            <h1 className="admin-title">Kalakritam</h1>
            <div className="admin-subtitle">Content Management System</div>
          </div>
        </div>
        
        <nav className="admin-navigation">
          <div className="admin-header-actions">
            <div className="admin-nav-links">
              <button 
                onClick={() => handleNavigation('/admin/portal')} 
                className={`admin-nav-link ${currentPage === '/admin/portal' ? 'active' : ''}`}
              >
                Dashboard
              </button>

              {/* Content Dropdown Menu */}
              <div className="admin-dropdown-section" ref={contentMenuRef}>
                <button 
                  className={`admin-nav-link dropdown-trigger ${showContentMenu ? 'active' : ''}`}
                  onClick={() => {
                    setShowContentMenu(!showContentMenu);
                    setShowManageMenu(false);
                  }}
                >
                  Content
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {showContentMenu && (
                  <div className="admin-dropdown-menu">
                    {contentItems.map((item) => (
                      <button 
                        key={item.path}
                        className="admin-dropdown-item"
                        onClick={() => handleNavigation(item.path)}
                      >
                        <span className="dropdown-item-bullet"></span>
                        {item.label}
                        <svg className="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Management Dropdown Menu */}
              <div className="admin-dropdown-section" ref={manageMenuRef}>
                <button 
                  className={`admin-nav-link dropdown-trigger ${showManageMenu ? 'active' : ''}`}
                  onClick={() => {
                    setShowManageMenu(!showManageMenu);
                    setShowContentMenu(false);
                  }}
                >
                  Manage
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {showManageMenu && (
                  <div className="admin-dropdown-menu">
                    {manageItems.map((item) => (
                      <button 
                        key={item.path}
                        className="admin-dropdown-item"
                        onClick={() => handleNavigation(item.path)}
                      >
                        <span className="dropdown-item-bullet"></span>
                        {item.label}
                        <svg className="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Admin Profile Section */}
            {adminUser && (
              <div className="admin-profile-section" ref={profileMenuRef}>
                <button 
                  className="admin-profile-btn"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div className="admin-profile-avatar">
                    {adminUser.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="admin-profile-info">
                    <span className="admin-profile-name">{adminUser.name}</span>
                    <span className="admin-profile-role">{adminUser.role}</span>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {showProfileMenu && (
                  <div className="admin-profile-dropdown">
                    <div className="admin-profile-details">
                      <div className="profile-detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>{adminUser.name}</span>
                      </div>
                      <div className="profile-detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        <span>{adminUser.email}</span>
                      </div>
                      <div className="profile-detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                          <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                        <span className="profile-role-badge">{adminUser.role}</span>
                      </div>
                    </div>
                    <div className="profile-dropdown-divider"></div>
                    <button className="profile-dropdown-logout" onClick={handleLogout}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {!adminUser && (
              <button onClick={handleLogout} className="admin-logout-btn">
                <span className="logout-text">Logout</span>
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;
