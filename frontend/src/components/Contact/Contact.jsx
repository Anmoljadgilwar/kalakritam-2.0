import React, { useState } from 'react';
import { useNavigationWithLoading } from '../../hooks/useNavigationWithLoading';
import { useUsernameValidation } from '../ValidateUsername/ValidateUsername';
import { toast } from '../../utils/notifications.js';
import { useMobileOptimizations } from '../../hooks/useMobileOptimizations';
import Header from '../Header';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import OptimizedParticles from '../OptimizedParticles';
import { config } from '../../config/environment';
import './Contact.css';

const Contact = () => {
  const { navigateWithLoading } = useNavigationWithLoading();
  useUsernameValidation('contact'); // Validate username in URL
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mobile optimizations
  const { particleConfig, blurConfig, networkOptimizations } = useMobileOptimizations('contact');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      toast.validationError('Please enter your name');
      return;
    }
    
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.validationError('Please enter a valid email address');
      return;
    }
    
    if (!formData.subject.trim()) {
      toast.validationError('Please enter a subject');
      return;
    }
    
    if (!formData.message.trim()) {
      toast.validationError('Please enter your message');
      return;
    }
    
    setIsSubmitting(true);
    
    // Show loading notification
    const loadingId = toast.formSubmitting('Sending your message...');
    
    try {
      const response = await fetch(`${config.apiBaseUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      toast.dismiss(loadingId);

      if (data.success) {
        toast.formSubmitted('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.formError('Failed to send your message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.dismiss(loadingId);
      
      if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
        toast.serverError('Unable to connect to server. Please check your internet connection.');
      } else {
        toast.formError('Failed to send your message. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container" data-connection={networkOptimizations.lowerQuality ? 'slow' : 'fast'}>
      {/* Particles Background - Optimized for mobile */}
      <OptimizedParticles 
        particleConfig={particleConfig}
        networkOptimizations={networkOptimizations}
        className="contact-particles-background"
      />
      
      {/* Blur Overlay Layer - Optimized for mobile */}
      <div 
        className="contact-blur-overlay"
        style={{
          backdropFilter: blurConfig.backdropFilter,
          background: blurConfig.background
        }}
      ></div>
      
      {/* Video Logo */}
      <VideoLogo />
      
      <Header currentPage="contact" />
      
      <main className="contact-content">
        <section className="contact-hero">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-subtitle">Get in Touch with Kalakritam</p>
        </section>
        <div className="contact-grid">
          <section className="contact-form-section">
            <h2>Send us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email address"
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="workshop-inquiry">Workshop Inquiry</option>
                  <option value="weekend-workshops">Weekend Workshop Schedule</option>
                  <option value="group-booking">Group Booking</option>
                  <option value="instructor-collaboration">Instructor Collaboration</option>
                  <option value="cafe-partnership">Cafe/Restaurant Partnership</option>
                  <option value="private-session">Private Workshop Session</option>
                  <option value="general">General Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  placeholder="Write your message here..."
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="submit-btn" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </section>

          <section className="contact-info-section">
            <h2>Get In Touch</h2>
            <div className="contact-info">
              <div className="info-item">
                <h3>Phone</h3>
                <p>+91 7032201999</p>
              </div>
              <div className="info-item">
                <h3>Email</h3>
                <p>contact@kalakritam.in</p>
              </div>
            </div>

            <div className="social-section">
              <h3>Follow Us</h3>
              <div className="social-links">
                <a href="https://instagram.com/kalakritam.in" target="_blank" rel="noopener noreferrer" className="social-link">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  @kalakritam.in
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
