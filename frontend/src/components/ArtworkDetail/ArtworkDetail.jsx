import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUsernameValidation } from '../ValidateUsername/ValidateUsername';
import Header from '../Header';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import Particles from '../Particles';
import LazyImage from '../LazyImage';
import { config } from '../../config/environment';
import { generateSlug } from '../../utils/seoHelpers';
import { toast } from '../../utils/notifications.js';
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
import './ArtworkDetail.css';

/**
 * ArtworkDetail Page
 * Matches Gallery theme exactly with particles, blur overlay, and mobile optimizations.
 * Fetches all artworks (simple approach) then finds matching slug.
 */
const ArtworkDetail = () => {
  const { slug, username } = useParams();
  useUsernameValidation('gallery'); // Validate username in URL (if present)
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initializing, setInitializing] = useState(true);
  
  // Mobile optimization states (matching Gallery)
  const [isMobile, setIsMobile] = useState(shouldOptimizeForMobile());
  const [particleConfig, setParticleConfig] = useState(getMobileParticleConfig());
  const [blurConfig, setBlurConfig] = useState(getMobileBlurConfig());
  const [networkOptimizations, setNetworkOptimizations] = useState({});
  const [batteryOptimizations, setBatteryOptimizations] = useState({});

  // Helper function to generate gallery URL
  const getGalleryPath = () => {
    // If user has username in URL, use personalized path
    if (username) {
      return `/u/${username}/gallery`;
    }
    // Otherwise use regular path
    return `/gallery`;
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
    const initToast = toast.dataLoading('Loading artwork details...');
    
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
    
    const fetchArtwork = async () => {
      try {
        setLoading(true);
        
        // Start performance monitoring (matching Gallery)
        if (isMobile) {
          mobilePerformanceMonitor.startLoadTime();
        }
        
        const loadingId = toast.dataLoading('Loading artwork...');
        // Fetch all artworks with a high limit to ensure we get the one we're looking for
        const res = await fetch(`${config.apiBaseUrl}/gallery?limit=1000`);
        const data = await res.json();
        toast.dismiss(loadingId);
        
        if (data.success) {
          const transformed = data.data.map(a => ({
            ...a,
            imageUrl: config.transformImageUrl(a.image_url || a.imageUrl),
            _slug: a.slug || generateSlug(a.title)
          }));
          const found = transformed.find(a => a._slug === slug);
          if (found) {
            setArtwork(found);
            
            // Set up performance monitoring
            if (isMobile) {
              mobilePerformanceMonitor.setTotalImages(1);
              mobilePerformanceMonitor.endLoadTime();
            }
            
            // Basic SEO tag updates (client side)
            document.title = `${found.title} - Kalakritam Gallery`;
            const desc = found.description || `${found.title} by ${found.artist}`;
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
              metaDesc = document.createElement('meta');
              metaDesc.name = 'description';
              document.head.appendChild(metaDesc);
            }
            metaDesc.content = desc;
            
            // Set canonical URL to non-user-specific path for SEO
            const canonicalSlug = found.slug || slug;
            const canonicalUrl = `https://kalakritam.in/gallery/${canonicalSlug}`;
            let canonical = document.querySelector('link[rel="canonical"]');
            if (!canonical) {
              canonical = document.createElement('link');
              canonical.rel = 'canonical';
              document.head.appendChild(canonical);
            }
            canonical.href = canonicalUrl;
            toast.dataLoaded('Artwork loaded');
          } else {
            setError('Artwork not found');
            toast.error('Artwork not found');
          }
        } else {
          setError('Failed to load artwork');
          toast.error('Failed to load artwork');
        }
      } catch (e) {
        console.error(e);
        setError('Server error loading artwork');
        toast.serverError('Server error loading artwork');
      } finally {
        setLoading(false);
      }
    };
    fetchArtwork();
  }, [slug, initializing, isMobile]);

  // Show full-screen loading during initialization to prevent flash of scrolled content
  if (initializing || loading) {
    return (
      <div className="artwork-detail-container loading-overlay">
        <div className="artwork-detail-particles-background">
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
        <div className="artwork-detail-content loading-state">
          <div className="loading-message" style={{ textAlign: 'center', padding: '3rem', color: '#c38f21' }}>
            <p style={{ fontSize: '1.2rem' }}>Loading artwork details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="artwork-detail-container">
        {particleConfig.particleCount > 0 && (
          <div className="artwork-detail-particles-background">
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
        <div className="artwork-detail-content error-state">
          <h2>Artwork Not Found</h2>
            <p>{error}</p>
            <Link to={getGalleryPath()} className="back-link">Back to Gallery</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="artwork-detail-container" data-connection={networkOptimizations.lowerQuality ? 'slow' : 'fast'}>
      {/* Particles Background - Optimized for mobile (matching Gallery) */}
      {particleConfig.particleCount > 0 && (
        <div className="artwork-detail-particles-background">
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
        className="artwork-detail-blur-overlay"
        style={{
          backdropFilter: blurConfig.backdropFilter,
          background: blurConfig.background
        }}
      ></div>
      
      {/* Video Logo */}
      <VideoLogo />
      
      <Header currentPage="gallery" />
      
      <div className="artwork-detail-content">
        <div className="artwork-layout">
          <div className="artwork-image-wrapper">
            <LazyImage
              src={getOptimizedImageUrl(artwork.imageUrl, isMobile)}
              alt={artwork.title}
              className="artwork-detail-image"
              placeholder={
                <div className="artwork-image-placeholder">
                  <div className="kalakritam-logo-text">Kalakritam</div>
                  <div className="image-not-available">
                    {networkOptimizations.lowerQuality ? 'Loading...' : 'Loading...'}
                  </div>
                </div>
              }
              onError={() => {
                console.log(`Failed to load image: ${artwork.imageUrl}`);
              }}
              onLoad={() => {
                if (isMobile) {
                  mobilePerformanceMonitor.trackImageLoad();
                }
              }}
            />
            {(artwork.category || artwork.year) && (
              <div className="image-meta-badges">
                {artwork.category && <span className="badge category">{artwork.category}</span>}
                {artwork.year && <span className="badge year">{artwork.year}</span>}
              </div>
            )}
          </div>
          
          <div className="artwork-info-panel">
            <h1 className="artwork-title">{artwork.title}</h1>
            <p className="artwork-artist">by {artwork.artist}</p>
            {artwork.price && <div className="artwork-price">{artwork.price}</div>}
            
            {/* About This Artwork Section */}
            {artwork.description && (
              <div className="artwork-about-section">
                <h3>About This Artwork</h3>
                <p className="artwork-description">{artwork.description}</p>
              </div>
            )}
            
            {/* Specifications */}
            {(artwork.medium || artwork.year || artwork.category || artwork.artist) && (
              <div className="artwork-specifications">
                <h3>Specifications</h3>
                <div className="artwork-specs">
                  {artwork.medium && (
                    <div className="spec-item">
                      <span className="label">Medium:</span>
                      <span className="value">{artwork.medium}</span>
                    </div>
                  )}
                  {artwork.year && (
                    <div className="spec-item">
                      <span className="label">Year:</span>
                      <span className="value">{artwork.year}</span>
                    </div>
                  )}
                  {artwork.category && (
                    <div className="spec-item">
                      <span className="label">Category:</span>
                      <span className="value">{artwork.category}</span>
                    </div>
                  )}
                  {artwork.artist && (
                    <div className="spec-item">
                      <span className="label">Artist:</span>
                      <span className="value">{artwork.artist}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Additional Info */}
            <div className="artwork-additional-info">
              <div className="info-card">
                <h4>Authenticity Guaranteed</h4>
                <p>This artwork comes with a certificate of authenticity from Kalakritam Gallery.</p>
              </div>
              
              <div className="info-card">
                <h4>Care Instructions</h4>
                <p>Keep away from direct sunlight. Clean gently with a soft, dry cloth. Frame with UV-protective glass for long-term preservation.</p>
              </div>
            </div>
            
            <div className="artwork-actions">
              {/* Reuse universal card button styling for exact visual parity */}
              <Link to={getGalleryPath()} className="universal-card-btn themed-animated-btn back-button">← Back to Gallery</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ArtworkDetail;
