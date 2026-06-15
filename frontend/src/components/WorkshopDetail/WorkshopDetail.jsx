import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useUsernameValidation } from '../ValidateUsername/ValidateUsername';
import Header from '../Header';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import Particles from '../Particles';
import LazyImage from '../LazyImage';
import { config } from '../../config/environment';
import { generateSlug } from '../../utils/seoHelpers';
import { toast } from '../../utils/notifications.js';
import { generateWorkshopSEO } from '../../utils/dynamicSeo';
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
import './WorkshopDetail.css';

/**
 * WorkshopDetail Page
 * Matches Gallery theme exactly with particles, blur overlay, and mobile optimizations.
 * Fetches all workshops then finds matching slug.
 */
const WorkshopDetail = () => {
  const { slug, username } = useParams();
  useUsernameValidation('workshops'); // Validate username in URL (if present)
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [seoMetadata, setSeoMetadata] = useState(null);
  
  // Mobile optimization states (matching Gallery)
  const [isMobile, setIsMobile] = useState(shouldOptimizeForMobile());
  const [particleConfig, setParticleConfig] = useState(getMobileParticleConfig());
  const [blurConfig, setBlurConfig] = useState(getMobileBlurConfig());
  const [networkOptimizations, setNetworkOptimizations] = useState({});
  const [batteryOptimizations, setBatteryOptimizations] = useState({});

  // Helper function to generate workshops URL
  const getWorkshopsPath = () => {
    // If user has username in URL, use personalized path
    if (username) {
      return `/u/${username}/workshops`;
    }
    // Otherwise use regular path
    return `/workshops`;
  };

  // Initialize mobile optimizations (matching Gallery approach)
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
    const initToast = toast.dataLoading('Loading workshop details...');
    
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
    
    const fetchWorkshop = async () => {
      try {
        setLoading(true);
        
        // Start performance monitoring (matching Gallery)
        if (isMobile) {
          mobilePerformanceMonitor.startLoadTime();
        }
        
        const loadingId = toast.dataLoading('Loading workshop...');
        // Fetch all workshops with a high limit to ensure we get the one we're looking for
        const res = await fetch(`${config.apiBaseUrl}/workshops?limit=1000`);
        const data = await res.json();
        toast.dismiss(loadingId);
        
        if (data.success) {
          const transformed = data.data.map(w => ({
            id: w.id,
            title: w.title,
            instructor: w.instructor,
            description: w.description,
            startDate: w.startDate || w.start_date,
            endDate: w.endDate || w.end_date,
            venue: w.venue,
            duration: w.duration,
            price: w.price,
            maxParticipants: w.maxParticipants || w.max_participants,
            currentParticipants: w.currentParticipants || w.current_participants,
            imageUrl: config.transformImageUrl(w.imageUrl || w.image_url),
            active: w.active,
            slug: w.slug,
            _slug: w.slug || generateSlug(w.title)
          }));
          const found = transformed.find(w => w._slug === slug);
          if (found) {
            setWorkshop(found);
            
            // Set up performance monitoring
            if (isMobile) {
              mobilePerformanceMonitor.setTotalImages(1);
              mobilePerformanceMonitor.endLoadTime();
            }
            
            // Generate comprehensive dynamic SEO metadata
            const seo = generateWorkshopSEO(found);
            setSeoMetadata(seo);
            console.log('Generated Workshop SEO metadata:', seo);
            
            toast.dataLoaded('Workshop loaded');
          } else {
            setError('Workshop not found');
            toast.error('Workshop not found');
          }
        } else {
          setError('Failed to load workshop');
          toast.error('Failed to load workshop');
        }
      } catch (e) {
        console.error(e);
        setError('Server error loading workshop');
        toast.serverError('Server error loading workshop');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshop();
  }, [slug, initializing, isMobile]);

  // Show full-screen loading during initialization to prevent flash of scrolled content
  if (initializing || loading) {
    return (
      <div className="workshop-detail-container loading-overlay">
        <div className="workshop-detail-particles-background">
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
        <div className="workshop-detail-content loading-state">
          <div className="loading-message" style={{ textAlign: 'center', padding: '3rem', color: '#c38f21' }}>
            <p style={{ fontSize: '1.2rem' }}>Loading workshop details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !workshop) {
    return (
      <div className="workshop-detail-container">
        {particleConfig.particleCount > 0 && (
          <div className="workshop-detail-particles-background">
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
        <div className="workshop-detail-content error-state">
          <h2>Workshop Not Found</h2>
          <p>{error}</p>
          <Link to={getWorkshopsPath()} className="back-link">Back to Workshops</Link>
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

  const availableSpots = workshop.maxParticipants - workshop.currentParticipants;

  return (
    <div className="workshop-detail-container" data-connection={networkOptimizations.lowerQuality ? 'slow' : 'fast'}>
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
      
      {/* Particles Background - Optimized for mobile (matching Gallery) */}
      {particleConfig.particleCount > 0 && (
        <div className="workshop-detail-particles-background">
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
      
      {/* Blur Overlay Layer - Optimized for mobile (matching Gallery) */}
      <div 
        className="workshop-detail-blur-overlay"
        style={{
          backdropFilter: blurConfig.backdropFilter,
          background: blurConfig.background
        }}
      ></div>
      
      {/* Video Logo */}
      <VideoLogo />
      
      <Header currentPage="workshops" />
      
      <div className="workshop-detail-content">
        <div className="workshop-layout">
          {/* Left Column - Image and What's Included */}
          <div className="workshop-left-column">
            <div className="workshop-image-wrapper">
              <LazyImage
                src={getOptimizedImageUrl(workshop.imageUrl, isMobile)}
                alt={workshop.title}
                className="workshop-detail-image"
                placeholder={
                  <div className="workshop-image-placeholder">
                    <div className="kalakritam-logo-text">Kalakritam</div>
                    <div className="image-not-available">
                      {networkOptimizations.lowerQuality ? 'Loading...' : 'Loading...'}
                    </div>
                  </div>
                }
                onError={() => {
                  console.log(`Failed to load image: ${workshop.imageUrl}`);
                }}
                onLoad={() => {
                  if (isMobile) {
                    mobilePerformanceMonitor.trackImageLoad();
                  }
                }}
              />
              <div className="image-meta-badges">
                {workshop.duration && <span className="badge duration">{workshop.duration}</span>}
                {workshop.active && <span className="badge active">Active</span>}
              </div>
            </div>
            
            {/* Additional Info Cards Below Image */}
            <div className="workshop-additional-info">
              <div className="info-card">
                <h4>What's Included</h4>
                <p>All materials and guidance will be provided during the workshop session.{workshop.instructor && ` Expert instruction from ${workshop.instructor}.`}</p>
              </div>
              
              <div className="info-card">
                <h4>Prerequisites</h4>
                <p>No prior experience required. This workshop is suitable for all skill levels. Bring your creativity and enthusiasm!</p>
              </div>
            </div>
          </div>
          
          {/* Right Column - Workshop Info */}
          <div className="workshop-info-panel">
            <h1 className="workshop-title">{workshop.title}</h1>
            {workshop.instructor && <p className="workshop-instructor">by {workshop.instructor}</p>}
            {workshop.price && <div className="workshop-price">₹{workshop.price}</div>}
            
            {/* About This Workshop Section */}
            {workshop.description && (
              <div className="workshop-about-section">
                <h3>About This Workshop</h3>
                <p className="workshop-description">{workshop.description}</p>
              </div>
            )}
            
            {/* Workshop Details */}
            <div className="workshop-specifications">
              <h3>Workshop Details</h3>
              <div className="workshop-specs">
                {workshop.instructor && (
                  <div className="spec-item">
                    <span className="label">Instructor:</span>
                    <span className="value">{workshop.instructor}</span>
                  </div>
                )}
                {workshop.duration && (
                  <div className="spec-item">
                    <span className="label">Duration:</span>
                    <span className="value">{workshop.duration}</span>
                  </div>
                )}
                {workshop.startDate && (
                  <div className="spec-item">
                    <span className="label">Start Date:</span>
                    <span className="value">{formatDate(workshop.startDate)}</span>
                  </div>
                )}
                {workshop.endDate && (
                  <div className="spec-item">
                    <span className="label">End Date:</span>
                    <span className="value">{formatDate(workshop.endDate)}</span>
                  </div>
                )}
                {workshop.venue && (
                  <div className="spec-item full-width">
                    <span className="label">Venue:</span>
                    <span className="value">{workshop.venue}</span>
                  </div>
                )}
                {workshop.maxParticipants && (
                  <div className="spec-item">
                    <span className="label">Max Participants:</span>
                    <span className="value">{workshop.maxParticipants}</span>
                  </div>
                )}
                {(workshop.currentParticipants !== undefined && workshop.currentParticipants !== null) && (
                  <div className="spec-item">
                    <span className="label">Current Participants:</span>
                    <span className="value">{workshop.currentParticipants}</span>
                  </div>
                )}
                {workshop.maxParticipants && workshop.currentParticipants !== undefined && (
                  <div className="spec-item">
                    <span className="label">Available Spots:</span>
                    <span className="value">{availableSpots > 0 ? availableSpots : 'Fully Booked'}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="workshop-actions">
              {/* Reuse universal card button styling for exact visual parity */}
              <Link to={getWorkshopsPath()} className="universal-card-btn themed-animated-btn back-button">← Back to Workshops</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WorkshopDetail;
