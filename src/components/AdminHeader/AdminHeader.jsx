import React, { useState, useRef, useEffect } from 'react';
import './AdminHeader.css';

const AdminHeader = ({ currentPage = 'portal' }) => {
  const [showContentMenu, setShowContentMenu] = useState(false);
  const [showManageMenu, setShowManageMenu] = useState(false);
  const contentMenuRef = useRef(null);
  const manageMenuRef = useRef(null);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
  };

  const handleNavigation = (path) => {
    setShowContentMenu(false);
    setShowManageMenu(false);
    window.location.href = path;
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
          
          <div className="admin-header-actions">
            <button onClick={handleLogout} className="admin-logout-btn">
              <span className="logout-text">Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;
