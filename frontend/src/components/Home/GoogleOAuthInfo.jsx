import React from 'react';
import './GoogleOAuthInfo.css';

const GoogleOAuthInfo = () => {
  return (
    <section className="oauth-info-section scroll-animate fade-up">
      <div className="oauth-info-container">
        <h2 className="oauth-title">Sign In with Google</h2>
        <div className="oauth-content">
          <div className="oauth-purpose">
            <h3>Why We Use Google Sign-In</h3>
            <p>
              Kalakritam uses <strong>Google OAuth 2.0</strong> to provide you with a secure, 
              convenient way to access your account without creating another password. 
              This industry-standard authentication method ensures your data remains protected.
            </p>
          </div>

          <div className="oauth-data-usage">
            <h3>What Data We Access</h3>
            <p>When you sign in with Google, we access only the following information:</p>
            <ul className="oauth-data-list">
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span><strong>Email Address:</strong> To identify your account and send booking confirmations</span>
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span><strong>Name:</strong> To personalize your experience and workshop registrations</span>
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span><strong>Profile Picture:</strong> To display your identity within the Kalakritam community</span>
              </li>
            </ul>
          </div>

          <div className="oauth-purpose-usage">
            <h3>How We Use Your Information</h3>
            <div className="purpose-grid">
              <div className="purpose-card">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <h4>Workshop Registration</h4>
                <p>To register you for art workshops and send confirmation emails</p>
              </div>
              <div className="purpose-card">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <h4>Event Notifications</h4>
                <p>To notify you about upcoming events, workshops, and cultural programs</p>
              </div>
              <div className="purpose-card">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
                <h4>Personalized Experience</h4>
                <p>To provide a customized dashboard and track your workshop history</p>
              </div>
              <div className="purpose-card">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                <h4>Account Security</h4>
                <p>To protect your account with Google's robust security infrastructure</p>
              </div>
            </div>
          </div>

          <div className="oauth-security">
            <h3>Your Privacy & Security</h3>
            <div className="security-highlights">
              <div className="security-item">
                <span className="security-icon">🔒</span>
                <p><strong>We never access your Google password</strong></p>
              </div>
              <div className="security-item">
                <span className="security-icon">🚫</span>
                <p><strong>We never share your data with third parties for marketing</strong></p>
              </div>
              <div className="security-item">
                <span className="security-icon">✅</span>
                <p><strong>You can revoke access anytime from your Google Account settings</strong></p>
              </div>
              <div className="security-item">
                <span className="security-icon">📋</span>
                <p><strong>We comply with Google's API Services User Data Policy</strong></p>
              </div>
            </div>
          </div>

          <div className="oauth-links">
            <p>
              Learn more about how we handle your data in our{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
              {' '}and{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>.
            </p>
            <p className="oauth-revoke-info">
              To manage or revoke Kalakritam's access to your Google account, visit:{' '}
              <a 
                href="https://myaccount.google.com/permissions" 
                target="_blank" 
                rel="noopener noreferrer"
                className="google-link"
              >
                Google Account Permissions
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleOAuthInfo;
