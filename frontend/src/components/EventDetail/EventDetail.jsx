import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useUsernameValidation } from '../ValidateUsername/ValidateUsername';
import { toast } from '../../utils/notifications.js';
import Header from '../Header';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import Particles from '../Particles';
import LazyImage from '../LazyImage';
import { config } from '../../config/environment';
import { generateSlug } from '../../utils/seoHelpers';
import { generateEventSEO } from '../../utils/dynamicSeo';
import { 
  getMobileParticleConfig, 
  getOptimizedImageUrl, 
  getMobileBlurConfig,
  shouldOptimizeForMobile,
  getNetworkOptimizations,
  getBatteryOptimizations,
  mobileMemoryOptimization
} from '../../utils/mobileOptimizations';
import { mobilePerformanceMonitor } from '../../utils/mobilePerformanceMonitor';
import './EventDetail.css';

/**
 * EventDetail Page
 * Matches Workshop/Gallery theme exactly with particles, blur overlay, and mobile optimizations.
 * Fetches all events then finds matching slug.
 */
const EventDetail = () => {
  const { slug, username } = useParams();
  useUsernameValidation('events'); // Validate username in URL (if present)
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [seoMetadata, setSeoMetadata] = useState(null);
  
  // Mobile optimization states (matching Workshop/Gallery)
  const [isMobile, setIsMobile] = useState(shouldOptimizeForMobile());
  const [particleConfig, setParticleConfig] = useState(getMobileParticleConfig());
  const [blurConfig, setBlurConfig] = useState(getMobileBlurConfig());
  const [networkOptimizations, setNetworkOptimizations] = useState({});
  const [batteryOptimizations, setBatteryOptimizations] = useState({});

  // Helper function to generate events URL
  const getEventsPath = () => {
    // If user has username in URL, use personalized path
    if (username) {
      return `/u/${username}/events`;
    }
    // Otherwise use regular path
    return `/events`;
  };

  // Initialize mobile optimizations (matching Workshop/Gallery approach)
  useEffect(() => {
    const initializeOptimizations = async () => {
      const networkOpts = getNetworkOptimizations();
      const batteryOpts = await getBatteryOptimizations();
      
      setNetworkOptimizations(networkOpts);
      setBatteryOptimizations(batteryOpts);
      
      // Update particle config based on optimizations
      if (batteryOpts.disableParticles || networkOpts.delayNonCritical) {
        setParticleConfig({ ...particleConfig, particleCount: 0 });
      }
    };
    
    initializeOptimizations();
    
    // Handle window resize for mobile detection
    const handleResize = () => {
      const newIsMobile = shouldOptimizeForMobile();
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
        setParticleConfig(getMobileParticleConfig());
        setBlurConfig(getMobileBlurConfig());
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Set up memory cleanup for mobile
    if (isMobile) {
      const cleanupInterval = setInterval(() => {
        mobileMemoryOptimization.cleanup();
      }, 30000); // Clean up every 30 seconds
      
      return () => {
        clearInterval(cleanupInterval);
        window.removeEventListener('resize', handleResize);
      };
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // IMMEDIATE scroll reset on mount - runs before any async operations
  useEffect(() => {
    // Show loading toast immediately
    const initToast = toast.dataLoading('Loading event details...');
    
    // Temporarily disable smooth scrolling to force instant reset
    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    const originalHtmlBehavior = htmlEl.style.scrollBehavior;
    const originalBodyBehavior = bodyEl.style.scrollBehavior;
    
    htmlEl.style.scrollBehavior = 'auto';
    bodyEl.style.scrollBehavior = 'auto';
    
    // Force multiple scroll resets
    window.scrollTo(0, 0);
    htmlEl.scrollTop = 0;
    bodyEl.scrollTop = 0;
    
    // Small delay to ensure scroll completes before showing content
    setTimeout(() => {
      htmlEl.style.scrollBehavior = originalHtmlBehavior;
      bodyEl.style.scrollBehavior = originalBodyBehavior;
      setInitializing(false);
      toast.dismiss(initToast);
    }, 150);
  }, [slug]);

  useEffect(() => {
    if (initializing) return; // Wait for initialization to complete
    
    const fetchEvent = async () => {
      try {
        setLoading(true);
        
        // Start performance monitoring (matching Workshop/Gallery)
        if (isMobile) {
          mobilePerformanceMonitor.startLoadTime();
        }
        
        const loadingId = toast.dataLoading('Loading event...');
        // Fetch all events with a high limit to ensure we get the one we're looking for
        const res = await fetch(`${config.apiBaseUrl}/events?limit=1000`);
        const data = await res.json();
        toast.dismiss(loadingId);
        
        if (data.success) {
          const transformed = data.data.map(e => ({
            id: e.id,
            title: e.title,
            description: e.description,
            category: e.category,
            startDate: e.startDate || e.start_date,
            endDate: e.endDate || e.end_date,
            venue: e.venue,
            ticketPrice: e.ticketPrice || e.ticket_price,
            maxAttendees: e.maxAttendees || e.max_attendees,
            imageUrl: config.transformImageUrl(e.image_url || e.imageUrl),
            videoUrl: e.videoUrl || e.video_url,
            districtUrl: e.districtUrl || e.district_url,
            bookMyShowUrl: e.bookMyShowUrl || e.book_my_show_url,
            active: e.active,
            slug: e.slug,
            _slug: e.slug || generateSlug(e.title)
          }));
          const found = transformed.find(e => e._slug === slug);
          if (found) {
            console.log('Event found:', found);
            console.log('District URL:', found.districtUrl);
            console.log('BookMyShow URL:', found.bookMyShowUrl);
            setEvent(found);
            
            // Set up performance monitoring
            if (isMobile) {
              mobilePerformanceMonitor.setTotalImages(1);
              mobilePerformanceMonitor.endLoadTime();
            }
            
            // Generate comprehensive dynamic SEO metadata
            const seo = generateEventSEO(found);
            setSeoMetadata(seo);
            console.log('Generated SEO metadata:', seo);
            
            toast.dataLoaded('Event loaded');
          } else {
            setError('Event not found');
            toast.error('Event not found');
          }
        } else {
          setError('Failed to load event');
          toast.error('Failed to load event');
        }
      } catch (e) {
        console.error(e);
        setError('Server error loading event');
        toast.serverError('Server error loading event');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug, initializing, isMobile]);

  // Show full-screen loading during initialization to prevent flash of scrolled content
  if (initializing || loading) {
    return (
      <div className="event-detail-container loading-overlay">
        <div className="event-detail-particles-background">
          {particleConfig.particleCount > 0 && (
            <Particles
              particleColors={['#c38f21', '#ffffff', '#c38f21']}
              particleCount={particleConfig.particleCount}
              particleSpread={particleConfig.particleSpread}
              speed={particleConfig.speed}
              particleBaseSize={particleConfig.particleBaseSize}
              moveParticlesOnHover={particleConfig.moveParticlesOnHover}
              particleHoverFactor={particleConfig.particleHoverFactor}
              alphaParticles={particleConfig.alphaParticles}
              disableRotation={particleConfig.disableRotation}
            />
          )}
        </div>
        <VideoLogo />
        <Header />
        <div className="event-detail-content loading-state">
          <div className="loading-message" style={{ textAlign: 'center', padding: '3rem', color: '#c38f21' }}>
            <p style={{ fontSize: '1.2rem' }}>Loading event details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-detail-container">
        {particleConfig.particleCount > 0 && (
          <div className="event-detail-particles-background">
            <Particles
              particleColors={['#c38f21', '#ffffff', '#c38f21']}
              particleCount={particleConfig.particleCount}
              particleSpread={particleConfig.particleSpread}
              speed={particleConfig.speed}
              particleBaseSize={particleConfig.particleBaseSize}
              moveParticlesOnHover={particleConfig.moveParticlesOnHover}
              particleHoverFactor={particleConfig.particleHoverFactor}
              alphaParticles={particleConfig.alphaParticles}
              disableRotation={particleConfig.disableRotation}
            />
          </div>
        )}
        <VideoLogo />
        <Header />
        <div className="event-detail-content error-state">
          <h2>Event Not Found</h2>
          <p>{error}</p>
          <Link to={getEventsPath()} className="back-link">Back to Events</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="event-detail-container" data-connection={networkOptimizations.lowerQuality ? 'slow' : 'fast'}>
      {/* Dynamic SEO Meta Tags */}
      {seoMetadata && (
        <Helmet>
          <title>{seoMetadata.title}</title>
          <meta name="description" content={seoMetadata.description} />
          <meta name="keywords" content={seoMetadata.keywords} />
          <link rel="canonical" href={seoMetadata.canonical} />
          
          {/* Open Graph Tags */}
          <meta property="og:title" content={seoMetadata.ogTitle} />
          <meta property="og:description" content={seoMetadata.ogDescription} />
          <meta property="og:image" content={seoMetadata.ogImage} />
          <meta property="og:url" content={seoMetadata.ogUrl} />
          <meta property="og:type" content={seoMetadata.ogType} />
          <meta property="og:site_name" content="Kalakritam" />
          
          {/* Twitter Card Tags */}
          <meta name="twitter:card" content={seoMetadata.twitterCard} />
          <meta name="twitter:title" content={seoMetadata.twitterTitle} />
          <meta name="twitter:description" content={seoMetadata.twitterDescription} />
          <meta name="twitter:image" content={seoMetadata.twitterImage} />
          
          {/* Structured Data */}
          <script type="application/ld+json">
            {JSON.stringify(seoMetadata.structuredData)}
          </script>
        </Helmet>
      )}
      
      {/* Particles Background - Optimized for mobile (matching Workshop/Gallery) */}
      {particleConfig.particleCount > 0 && (
        <div className="event-detail-particles-background">
          <Particles
            particleColors={['#c38f21', '#ffffff', '#c38f21']}
            particleCount={particleConfig.particleCount}
            particleSpread={particleConfig.particleSpread}
            speed={particleConfig.speed}
            particleBaseSize={particleConfig.particleBaseSize}
            moveParticlesOnHover={particleConfig.moveParticlesOnHover}
            particleHoverFactor={particleConfig.particleHoverFactor}
            alphaParticles={particleConfig.alphaParticles}
            disableRotation={particleConfig.disableRotation}
          />
        </div>
      )}
      
      {/* Blur Overlay Layer - Optimized for mobile (matching Workshop/Gallery) */}
      <div 
        className="event-detail-blur-overlay"
        style={{
          backdropFilter: blurConfig.backdropFilter,
          background: blurConfig.background
        }}
      ></div>
      
      {/* Video Logo */}
      <VideoLogo />
      
      <Header currentPage="events" />
      
      <div className="event-detail-content">
        <div className="event-layout">
          {/* Left Column - Image and Additional Info */}
          <div className="event-left-column">
            <div className="event-image-wrapper">
              <LazyImage
                src={getOptimizedImageUrl(event.imageUrl, isMobile)}
                alt={event.title}
                className="event-detail-image"
                placeholder={
                  <div className="event-image-placeholder">
                    <div className="kalakritam-logo-text">Kalakritam</div>
                    <div className="image-not-available">
                      {networkOptimizations.lowerQuality ? 'Loading...' : 'Loading...'}
                    </div>
                  </div>
                }
                onError={() => {
                  console.log(`Failed to load image: ${event.imageUrl}`);
                }}
                onLoad={() => {
                  if (isMobile) {
                    mobilePerformanceMonitor.trackImageLoad();
                  }
                }}
              />
              <div className="image-meta-badges">
                {event.active && <span className="badge active">Active</span>}
              </div>
            </div>
            
            {/* Additional Info Cards Below Image */}
            <div className="event-additional-info">
              <div className="info-card">
                <h4>What's Included</h4>
                <p>Join us for this exciting art event and be part of our creative community. All participants will receive confirmation details via email after registration.</p>
              </div>
              
              <div className="info-card">
                <h4>Event Guidelines</h4>
                <p>Please arrive 15 minutes early for registration. All necessary materials will be provided at the venue. Limited seats available!</p>
              </div>
            </div>
          </div>
          
          {/* Right Column - Event Info */}
          <div className="event-info-panel">
            <div className="event-header-with-booking">
              <h1 className="event-detail-title">{event.title}</h1>
              
              {/* Booking Logo Buttons - Top Right */}
              {(event.districtUrl || event.bookMyShowUrl) && (
                <div className="booking-logo-buttons">
                  {event.districtUrl && (
                    <a 
                      href={event.districtUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="booking-logo-btn district-logo-btn"
                      title="Book on District by Zomato"
                    >
                      <img 
                        src="/images/district-logo.png" 
                        alt="District by Zomato" 
                        className="booking-logo-icon"
                      />
                    </a>
                  )}
                  {event.bookMyShowUrl && (
                    <a 
                      href={event.bookMyShowUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="booking-logo-btn bookmyshow-logo-btn"
                      title="Book on BookMyShow"
                    >
                      <img 
                        src="/images/bookmyshow-logo.png" 
                        alt="BookMyShow" 
                        className="booking-logo-icon"
                      />
                    </a>
                  )}
                </div>
              )}
            </div>
            
            {event.venue && <p className="event-detail-venue">at {event.venue}</p>}
            {event.ticketPrice && <div className="event-detail-price">₹{event.ticketPrice}</div>}
            
            {/* About This Event Section */}
            {event.description && (
              <div className="event-about-section">
                <h3>About This Event</h3>
                <p className="event-detail-description">{event.description}</p>
              </div>
            )}
            
            {/* Event Details */}
            <div className="event-detail-specifications">
              <h3>Event Details</h3>
              <div className="event-specs">
                {event.startDate && (
                  <div className="spec-item">
                    <span className="label">Start Date:</span>
                    <span className="value">{formatDate(event.startDate)}</span>
                  </div>
                )}
                {event.endDate && (
                  <div className="spec-item">
                    <span className="label">End Date:</span>
                    <span className="value">{formatDate(event.endDate)}</span>
                  </div>
                )}
                {event.category && (
                  <div className="spec-item">
                    <span className="label">Category:</span>
                    <span className="value">{event.category}</span>
                  </div>
                )}
                {event.venue && (
                  <div className="spec-item full-width">
                    <span className="label">Venue:</span>
                    <span className="value">{event.venue}</span>
                  </div>
                )}
                {event.maxAttendees && (
                  <div className="spec-item">
                    <span className="label">Max Attendees:</span>
                    <span className="value">{event.maxAttendees}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="event-actions">
              <Link to={getEventsPath()} className="universal-card-btn themed-animated-btn back-button">← Back to Events</Link>
              
              {/* Register Button - Goes to preferred booking platform */}
              {(event.districtUrl || event.bookMyShowUrl) && (
                <a 
                  href={event.districtUrl || event.bookMyShowUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="universal-card-btn themed-animated-btn register-button"
                >
                  Register Now →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetail;
