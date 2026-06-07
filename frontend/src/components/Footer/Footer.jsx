import React from 'react';
import { useNavigationWithLoading } from '../../hooks/useNavigationWithLoading';
import { useUserAuth } from '../../contexts/UserAuthContext';
import { getNavigationPath } from '../../utils/userHelpers';
import './Footer.css';

const Footer = () => {
  const { navigateWithLoading } = useNavigationWithLoading();
  const { user, isAuthenticated } = useUserAuth();

  const scrollToTop = () => {
    // Scroll all possible containers to top
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Also scroll any app containers
    const appContent = document.querySelector('.app-content');
    if (appContent) appContent.scrollTop = 0;
    
    const app = document.querySelector('.app');
    if (app) app.scrollTop = 0;
  };

  const handleNavigation = (path) => {
    // Scroll to top immediately before navigation
    scrollToTop();
    
    // Use personalized path for logged-in users, regular path for guests
    const navigationPath = getNavigationPath(path, user, isAuthenticated);
    navigateWithLoading(navigationPath);
  };

  const handleAdminLogin = () => {
    // Scroll to top immediately before navigation
    scrollToTop();
    
    // Navigate to admin login page (always uses regular path)
    navigateWithLoading('/admin/login');
  };

  return (
    <footer className="shared-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title" onClick={() => handleNavigation('/home')} style={{ cursor: 'pointer' }}>Kalakritam</h3>
          <p className="footer-description">Manifesting Through Arts</p>
          <div className="social-links">
            <div className="social-item">
              <a href="https://instagram.com/kalakritam.in" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="social-text">kalakritam.in</span>
              </a>
            </div>
            <div className="social-item">
              <a href="https://www.linkedin.com/in/kalakritam/" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span className="social-text">Kalakritam</span>
              </a>
            </div>
            <div className="social-item">
              <a href="mailto:contact@kalakritam.in" className="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span className="social-text">contact@kalakritam.in</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-subtitle">Quick Links</h4>
          <ul className="footer-links">
            <li><button onClick={() => handleNavigation('/home')} className="footer-nav-btn">Home</button></li>
            <li><button onClick={() => handleNavigation('/gallery')} className="footer-nav-btn">Gallery</button></li>
            <li><button onClick={() => handleNavigation('/workshops')} className="footer-nav-btn">Workshops</button></li>
            <li><button onClick={() => handleNavigation('/contact')} className="footer-nav-btn">Contact</button></li>
            <li><button onClick={() => handleNavigation('/about')} className="footer-nav-btn">About Us</button></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-subtitle">Explore</h4>
          <ul className="footer-links">
            <li><button onClick={() => handleNavigation('/artists')} className="footer-nav-btn">Artists</button></li>
            <li><button onClick={() => handleNavigation('/events')} className="footer-nav-btn">Events</button></li>
            <li><button onClick={() => handleNavigation('/artblogs')} className="footer-nav-btn">Art Blogs</button></li>
            <li><button onClick={() => handleNavigation('/artparty')} className="footer-nav-btn">Art at your party</button></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-subtitle">Visit Us</h4>
          <p className="footer-text">Experience Indian art heritage</p>
          <p className="footer-text">Traditional & Contemporary</p>
          <button onClick={handleAdminLogin} className="admin-login-btn">Admin Login</button>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">© 2025 Kalakritam. All rights reserved.</p>
          <div className="footer-legal">
            <button className="footer-nav-btn" onClick={() => handleNavigation('/privacy')}>Privacy Policy</button>
            <span className="separator">|</span>
            <button className="footer-nav-btn" onClick={() => handleNavigation('/terms')}>Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
