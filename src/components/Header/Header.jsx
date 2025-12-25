import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigationWithLoading } from '../../hooks/useNavigationWithLoading';
import { useUserAuth } from '../../contexts/UserAuthContext';
import { getUserPath, getNavigationPath } from '../../utils/userHelpers';
import { gsap } from 'gsap';
import NotificationBell from '../NotificationBell';
import './Header.css';
import Artists from '../Artists';

const Header = ({ currentPage = 'home' }) => {
  const navigate = useNavigate();
  const { navigateWithLoading } = useNavigationWithLoading();
  const { user, isAuthenticated, logout } = useUserAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showExploreMenu, setShowExploreMenu] = useState(false);
  const [showInfoMenu, setShowInfoMenu] = useState(false);
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const exploreMenuRef = useRef(null);
  const infoMenuRef = useRef(null);
  const exploreItemsRef = useRef([]);
  const infoItemsRef = useRef([]);
  const exploreTimelineRef = useRef(null);
  const infoTimelineRef = useRef(null);

  const exploreItems = [
    { path: '/gallery', label: 'Gallery' },
    { path: '/workshops', label: 'Workshops' },
    { path: '/events', label: 'Events' },
    { path: '/artists', label: 'Artists' },
    { path: '/artblogs', label: 'Art Blogs' }
  ];

  const infoItems = [
    { path: '/contact', label: 'Contact' },
    { path: '/about', label: 'About Us' }
  ];

  const navItems = [
    { path: '/home', label: 'Home' },
    { path: '/moments', label: 'Moments' }
  ];

  // Check if device is mobile - more aggressive detection
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const isMobileDevice = width <= 768 || 
                           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
      
      // Force hide desktop navigation on mobile
      if (isMobileDevice) {
        const desktopNav = document.querySelector('.desktop-nav');
        if (desktopNav) {
          desktopNav.style.display = 'none';
          desktopNav.style.visibility = 'hidden';
          desktopNav.style.pointerEvents = 'none';
          desktopNav.style.position = 'absolute';
          desktopNav.style.left = '-9999px';
          desktopNav.style.zIndex = '-1000';
        }
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  // Force remove desktop navigation on mobile - additional safety
  useEffect(() => {
    if (isMobile) {
      const removeDesktopElements = () => {
        // Remove all desktop navigation buttons
        const desktopButtons = document.querySelectorAll('.desktop-nav .nav-link');
        desktopButtons.forEach(button => {
          button.style.display = 'none';
          button.style.pointerEvents = 'none';
          button.style.visibility = 'hidden';
          button.style.position = 'absolute';
          button.style.left = '-9999px';
          button.disabled = true;
        });
        
        // Remove desktop navigation container
        const desktopNav = document.querySelector('.desktop-nav');
        if (desktopNav) {
          desktopNav.style.display = 'none !important';
          desktopNav.style.visibility = 'hidden !important';
          desktopNav.style.pointerEvents = 'none !important';
          desktopNav.style.position = 'absolute !important';
          desktopNav.style.left = '-9999px !important';
          desktopNav.style.zIndex = '-1000 !important';
          desktopNav.style.opacity = '0 !important';
        }
      };
      
      removeDesktopElements();
      // Run again after a short delay to ensure DOM is ready
      setTimeout(removeDesktopElements, 100);
    }
  }, [isMobile]);

  // Initialize GSAP animations for dropdown menus
  useLayoutEffect(() => {
    // Explore menu animation
    if (showExploreMenu) {
      const exploreDropdown = document.querySelector('.explore-menu-dropdown');
      const validItems = exploreItemsRef.current.filter(item => item !== null);
      
      if (exploreDropdown && validItems.length > 0) {
        // Kill any existing timeline
        exploreTimelineRef.current?.kill();

        // Create advanced timeline with custom ease
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        
        // Dropdown container animation with scale and blur
        tl.fromTo(exploreDropdown, 
          { 
            opacity: 0, 
            y: -20, 
            scale: 0.95,
            filter: 'blur(10px)'
          },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.4,
            ease: 'expo.out'
          }
        );
        
        // Items staggered animation with rotation and slide
        tl.fromTo(validItems,
          { 
            opacity: 0, 
            y: 30,
            x: -20,
            rotateX: -15,
            scale: 0.9
          },
          { 
            opacity: 1, 
            y: 0,
            x: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.5,
            stagger: {
              each: 0.06,
              ease: 'power2.out'
            },
            ease: 'back.out(1.2)'
          },
          '-=0.25'
        );

        // Add subtle float animation to bullets
        validItems.forEach((item, index) => {
          const bullet = item.querySelector('.dropdown-item-bullet');
          if (bullet) {
            tl.fromTo(bullet,
              { scale: 0, rotation: -180 },
              { 
                scale: 1, 
                rotation: 0,
                duration: 0.4,
                ease: 'elastic.out(1, 0.5)'
              },
              `-=${0.4 - (index * 0.06)}`
            );
          }
        });
        
        exploreTimelineRef.current = tl;
      }
    }

    // Info menu animation
    if (showInfoMenu) {
      const infoDropdown = document.querySelector('.info-menu-dropdown');
      const validItems = infoItemsRef.current.filter(item => item !== null);
      
      if (infoDropdown && validItems.length > 0) {
        // Kill any existing timeline
        infoTimelineRef.current?.kill();

        // Create advanced timeline with custom ease
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        
        // Dropdown container animation with scale and blur
        tl.fromTo(infoDropdown, 
          { 
            opacity: 0, 
            y: -20, 
            scale: 0.95,
            filter: 'blur(10px)'
          },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.4,
            ease: 'expo.out'
          }
        );
        
        // Items staggered animation with rotation and slide
        tl.fromTo(validItems,
          { 
            opacity: 0, 
            y: 30,
            x: -20,
            rotateX: -15,
            scale: 0.9
          },
          { 
            opacity: 1, 
            y: 0,
            x: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.5,
            stagger: {
              each: 0.06,
              ease: 'power2.out'
            },
            ease: 'back.out(1.2)'
          },
          '-=0.25'
        );

        // Add subtle float animation to bullets
        validItems.forEach((item, index) => {
          const bullet = item.querySelector('.dropdown-item-bullet');
          if (bullet) {
            tl.fromTo(bullet,
              { scale: 0, rotation: -180 },
              { 
                scale: 1, 
                rotation: 0,
                duration: 0.4,
                ease: 'elastic.out(1, 0.5)'
              },
              `-=${0.4 - (index * 0.06)}`
            );
          }
        });
        
        infoTimelineRef.current = tl;
      }
    }

    return () => {
      exploreTimelineRef.current?.kill();
      infoTimelineRef.current?.kill();
    };
  }, [showExploreMenu, showInfoMenu]);

  const handleNavigation = (path) => {
    // For dashboard path that already includes username, use it directly
    if (path.includes('/u/') || path === '/user/login' || path === '/admin/login') {
      navigate(path); // Direct navigation for dashboard
    } else {
      // Use personalized path for logged-in users, regular path for guests
      const navigationPath = getNavigationPath(path, user, isAuthenticated);
      navigateWithLoading(navigationPath);
    }
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const toggleMobileMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both the mobile menu button and the sidebar
      const mobileMenuButton = mobileMenuRef.current;
      const mobileSidebar = document.querySelector('.mobile-sidebar');
      
      if (mobileMenuButton && !mobileMenuButton.contains(event.target) &&
          mobileSidebar && !mobileSidebar.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }

      // Close user menu when clicking outside
      const userMenuButton = userMenuRef.current;
      const userMenuDropdown = document.querySelector('.user-menu-dropdown');
      
      if (userMenuButton && !userMenuButton.contains(event.target) &&
          userMenuDropdown && !userMenuDropdown.contains(event.target)) {
        setShowUserMenu(false);
      }

      // Close explore menu when clicking outside
      const exploreMenuButton = exploreMenuRef.current;
      const exploreMenuDropdown = document.querySelector('.explore-menu-dropdown');
      
      if (exploreMenuButton && !exploreMenuButton.contains(event.target) &&
          exploreMenuDropdown && !exploreMenuDropdown.contains(event.target)) {
        setShowExploreMenu(false);
      }

      // Close info menu when clicking outside
      const infoMenuButton = infoMenuRef.current;
      const infoMenuDropdown = document.querySelector('.info-menu-dropdown');
      
      if (infoMenuButton && !infoMenuButton.contains(event.target) &&
          infoMenuDropdown && !infoMenuDropdown.contains(event.target)) {
        setShowInfoMenu(false);
      }
    };

    // Always attach listener
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Empty dependency array - always active

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigateWithLoading('/home');
  };

  return (
    <header className="shared-header">
      <div className="header-content">
        <div className="header-brand" onClick={() => handleNavigation('/home')}>
          <h1 className="kalakritam-title">Kalakritam</h1>
          <div className="header-subtitle">Manifesting Through Arts</div>
        </div>
        
        {/* Desktop Navigation - Only render on desktop - NEVER on mobile */}
        {!isMobile && window.innerWidth > 768 && (
          <nav className="header-navigation desktop-nav" style={{ display: isMobile ? 'none' : 'flex' }}>
            <div className="nav-links">
              {navItems.map(item => (
                <button 
                  key={item.path}
                  onClick={() => handleNavigation(item.path)} 
                  className={`nav-link ${currentPage === item.path.slice(1) ? 'active' : ''}`}
                  disabled={isMobile}
                  style={{ 
                    display: isMobile ? 'none' : 'flex',
                    pointerEvents: isMobile ? 'none' : 'auto'
                  }}
                >
                  {item.label}
                </button>
              ))}

              {/* Explore Dropdown Menu */}
              <div className="header-dropdown-section" ref={exploreMenuRef}>
                <button 
                  className="nav-link dropdown-trigger"
                  onClick={() => {
                    setShowExploreMenu(!showExploreMenu);
                    setShowInfoMenu(false);
                    setShowUserMenu(false);
                  }}
                >
                  Explore
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {showExploreMenu && (
                  <div className="dropdown-menu explore-menu-dropdown">
                    {exploreItems.map((item, index) => (
                      <button 
                        key={item.path}
                        ref={el => exploreItemsRef.current[index] = el}
                        className="dropdown-menu-item"
                        onClick={() => {
                          setShowExploreMenu(false);
                          handleNavigation(item.path);
                        }}
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

              {/* Info Dropdown Menu */}
              <div className="header-dropdown-section" ref={infoMenuRef}>
                <button 
                  className="nav-link dropdown-trigger"
                  onClick={() => {
                    setShowInfoMenu(!showInfoMenu);
                    setShowExploreMenu(false);
                    setShowUserMenu(false);
                  }}
                >
                  Info
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {showInfoMenu && (
                  <div className="dropdown-menu info-menu-dropdown">
                    {infoItems.map((item, index) => (
                      <button 
                        key={item.path}
                        ref={el => infoItemsRef.current[index] = el}
                        className="dropdown-menu-item"
                        onClick={() => {
                          setShowInfoMenu(false);
                          handleNavigation(item.path);
                        }}
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
              
              {/* User Login/Profile Button */}
              <div className="header-user-section" ref={userMenuRef}>
                {isAuthenticated && user && (
                  <NotificationBell />
                )}
                
                {isAuthenticated && user ? (
                  <button 
                    className="user-profile-btn"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="user-avatar">
                      {(user.profileImageUrl || user.photoUrl) ? (
                        <img src={user.profileImageUrl || user.photoUrl} alt={user.name} />
                      ) : (
                        <span className="user-initials">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="user-name-display">{user.name?.split(' ')[0]}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                ) : (
                  <button 
                    className="nav-link login-btn"
                    onClick={() => handleNavigation('/user/login')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                      <polyline points="10 17 15 12 10 7"></polyline>
                      <line x1="15" y1="12" x2="3" y2="12"></line>
                    </svg>
                    Login
                  </button>
                )}

                {/* User Dropdown Menu */}
                {showUserMenu && isAuthenticated && (
                  <div className="user-menu-dropdown">
                    <button 
                      className="user-menu-item"
                      onClick={() => {
                        setShowUserMenu(false);
                        const dashboardPath = getUserPath(user, 'dashboard');
                        handleNavigation(dashboardPath);
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      My Dashboard
                    </button>
                    <button 
                      className="user-menu-item logout"
                      onClick={handleLogout}
                    >
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
            </div>
          </nav>
        )}
      </div>

      {/* Mobile Menu Button - 3 Dots - Only render on mobile */}
      {isMobile && (
        <div className="mobile-menu-container" ref={mobileMenuRef}>
          <button 
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            aria-label="Toggle mobile menu"
          >
            <div className={`three-dots ${isMobileMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      )}

      {/* Mobile Sidebar - Only render on mobile */}
      {isMobile && (
        <>
          {/* Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="mobile-sidebar-overlay"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
          )}
          
          {/* Sidebar */}
          <nav className={`mobile-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <h3>Navigation</h3>
              <button 
                className="close-sidebar-btn"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close sidebar"
              >
                ×
              </button>
            </div>
            <div className="sidebar-nav-links">
              {navItems.map((item) => (
                <button 
                  key={item.path}
                  onClick={() => handleNavigation(item.path)} 
                  className={`sidebar-nav-link ${currentPage === item.path.slice(1) ? 'active' : ''}`}
                >
                  <span className="nav-icon">•</span>
                  {item.label}
                </button>
              ))}

              {/* Explore Section */}
              <div className="sidebar-section-title">Explore</div>
              {exploreItems.map((item) => (
                <button 
                  key={item.path}
                  onClick={() => handleNavigation(item.path)} 
                  className={`sidebar-nav-link ${currentPage === item.path.slice(1) ? 'active' : ''}`}
                >
                  <span className="nav-icon">→</span>
                  {item.label}
                </button>
              ))}

              {/* Info Section */}
              <div className="sidebar-section-title">Info</div>
              {infoItems.map((item) => (
                <button 
                  key={item.path}
                  onClick={() => handleNavigation(item.path)} 
                  className={`sidebar-nav-link ${currentPage === item.path.slice(1) ? 'active' : ''}`}
                >
                  <span className="nav-icon">→</span>
                  {item.label}
                </button>
              ))}
              
              {/* Mobile User Section */}
              <div className="mobile-user-section">
                {isAuthenticated && user ? (
                  <>
                    <button 
                      className="sidebar-nav-link"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        const dashboardPath = getUserPath(user, 'dashboard');
                        handleNavigation(dashboardPath);
                      }}
                    >
                      <span className="nav-icon">👤</span>
                      My Dashboard
                    </button>
                    <button 
                      className="sidebar-nav-link logout-mobile"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <span className="nav-icon">🚪</span>
                      Logout
                    </button>
                  </>
                ) : (
                  <button 
                    className="sidebar-nav-link login-mobile"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleNavigation('/user/login');
                    }}
                  >
                    <span className="nav-icon">🔐</span>
                    Login
                  </button>
                )}
              </div>
            </div>
            <div className="sidebar-footer">
              {isAuthenticated && user && (
                <div className="sidebar-user-info">
                  <div className="sidebar-user-avatar">
                    {(user.profileImageUrl || user.photoUrl) ? (
                      <img src={user.profileImageUrl || user.photoUrl} alt={user.name} />
                    ) : (
                      <span>{user.name?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <p className="sidebar-user-name">{user.name}</p>
                </div>
              )}
              <p>Kalakritam</p>
              <small>Art Gallery & Cultural Hub</small>
            </div>
          </nav>
        </>
      )}
    </header>
  );
};

export default Header;
