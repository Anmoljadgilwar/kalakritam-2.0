import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigationWithLoading } from '../../hooks/useNavigationWithLoading';
import { useUsernameValidation } from '../ValidateUsername/ValidateUsername';
import { useUserAuth } from '../../contexts/UserAuthContext';
import { config } from '../../config/environment';
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
import Header from '../Header';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import Particles from '../Particles';
import LazyImage from '../LazyImage';
import './Gallery.css';

const Gallery = () => {
  const { navigateWithLoading } = useNavigationWithLoading();
  const { username } = useParams();
  const { user, isAuthenticated } = useUserAuth();
  useUsernameValidation('gallery'); // Validate username in URL
  const [selectedCategory, setSelectedCategory] = useState('all');
  // Removed inline modal detail view in favor of dedicated route /gallery/:slug
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchCalled = useRef(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const itemsPerPage = 6;
  
  // Mobile optimization states
  const [isMobile, setIsMobile] = useState(shouldOptimizeForMobile());
  const [particleConfig, setParticleConfig] = useState(getMobileParticleConfig());
  const [blurConfig, setBlurConfig] = useState(getMobileBlurConfig());
  const [networkOptimizations, setNetworkOptimizations] = useState({});
  const [batteryOptimizations, setBatteryOptimizations] = useState({});

  // Helper function to generate artwork detail URL
  const getArtworkDetailPath = (artwork) => {
    const slug = artwork.slug || (artwork.title ? artwork.title.toLowerCase().trim().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'') : artwork.id);
    
    // If user is authenticated and has username in URL, use personalized path
    if (username && isAuthenticated && user) {
      return `/u/${username}/gallery/${slug}`;
    }
    // Otherwise use regular path
    return `/gallery/${slug}`;
  };

  // Initialize mobile optimizations
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

  useEffect(() => {
    if (!fetchCalled.current) {
      fetchArtworks();
      fetchCalled.current = true;
    }
  }, []);

  const fetchArtworks = async (page = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      // Start performance monitoring
      if (isMobile && !append) {
        mobilePerformanceMonitor.startLoadTime();
      }
      
      // Show loading notification
      const loadingId = toast.dataLoading(append ? 'Loading more artworks...' : 'Loading gallery...');
      
      console.log('Fetching artworks from:', `${config.apiBaseUrl}/gallery?page=${page}&limit=${itemsPerPage}`);
      const response = await fetch(`${config.apiBaseUrl}/gallery?page=${page}&limit=${itemsPerPage}`);
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      toast.dismiss(loadingId);
      
      if (data.success) {
        // Transform image URLs to handle localhost URLs
        const transformedData = data.data.map(artwork => ({
          ...artwork,
          imageUrl: config.transformImageUrl(artwork.image_url || artwork.imageUrl)
        }));
        
        if (append) {
          setArtworks(prev => [...prev, ...transformedData]);
        } else {
          setArtworks(transformedData);
        }
        
        // Update pagination info
        if (data.pagination) {
          setCurrentPage(data.pagination.page);
          setTotalPages(data.pagination.totalPages);
          setTotalItems(data.pagination.total || 0);
        }
        
        // Set up performance monitoring
        if (isMobile && !append) {
          mobilePerformanceMonitor.setTotalImages(transformedData.length);
          mobilePerformanceMonitor.endLoadTime();
        }
        
        toast.dataLoaded(`Loaded ${transformedData.length} artworks`);
      } else {
        setError('Failed to load artworks');
        toast.error('Failed to load artworks');
      }
    } catch (err) {
      console.error('Error fetching artworks:', err);
      const errorMessage = 'Failed to connect to server';
      setError(errorMessage);
      toast.serverError(errorMessage);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      fetchArtworks(currentPage + 1, true);
    }
  };

  const handleViewDetails = (artwork) => {
    // Kept for potential analytics; navigation handled via Link element
  };

  // Extract unique categories from artworks, filtering out null/undefined values
  const categories = ['all', ...new Set(
    artworks
      .map(artwork => artwork.category)
      .filter(category => category != null && category !== '')
  )];

  const filteredArtworks = selectedCategory === 'all' 
    ? artworks 
    : artworks.filter(artwork => artwork.category === selectedCategory);

  if (loading) {
    return (
      <div className="gallery-container gallery-loading">
        <VideoLogo />
        <Header currentPage="gallery" />
        <div className="gallery-page-content">
          <header className="gallery-page-header">
            <h1 className="gallery-title">Art Gallery</h1>
            <p className="gallery-subtitle">Discover India's Artistic Heritage</p>
          </header>
          
          {/* Simple loading message */}
          <div className="loading-state-container">
            <div className="loading-message" style={{ textAlign: 'center', padding: '3rem', color: '#c38f21' }}>
              <p style={{ fontSize: '1.2rem' }}>Loading Gallery...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery-container">
        <VideoLogo />
        <Header currentPage="gallery" />
        <div className="gallery-page-content">
          <div className="error-container">
            <h2>Unable to load gallery</h2>
            <p>{error}</p>
            <button onClick={fetchArtworks} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="gallery-container" data-connection={networkOptimizations.lowerQuality ? 'slow' : 'fast'}>
      {/* Particles Background - Optimized for mobile */}
      {particleConfig.particleCount > 0 && (
        <div className="gallery-particles-background">
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
      
      {/* Blur Overlay Layer - Optimized for mobile */}
      <div 
        className="gallery-blur-overlay"
        style={{
          backdropFilter: blurConfig.backdropFilter,
          background: blurConfig.background
        }}
      ></div>
      
      {/* Video Logo */}
      <VideoLogo />
      
      <Header currentPage="gallery" />
      
      <div className="gallery-page-content">
        <header className="gallery-page-header">
          <h1 className="gallery-title">Art Gallery</h1>
          <p className="gallery-subtitle">Discover India's Artistic Heritage</p>
          <div className="gallery-description">
            <p>Explore our curated collection of traditional and contemporary Indian art. From ancient temple murals to modern interpretations, each piece tells a story of India's rich cultural heritage.</p>
          </div>
        </header>

        <section className="gallery-filters">
          <h3>Filter by Category</h3>
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category && typeof category === 'string' 
                  ? category.charAt(0).toUpperCase() + category.slice(1)
                  : 'Unknown'
                }
              </button>
            ))}
          </div>
        </section>

        <main className="gallery-content">
          <div className="artworks-count">
            <p>Showing {filteredArtworks.length} artwork{filteredArtworks.length !== 1 ? 's' : ''}</p>
          </div>
          
          <div className="gallery-grid">
            {filteredArtworks.map(artwork => (
              <div key={artwork.id} className="artwork-card universal-card">
                <div className="artwork-image-container universal-card-image-container">
                  <LazyImage
                    src={getOptimizedImageUrl(artwork.imageUrl, isMobile)} 
                    alt={artwork.title}
                    className="artwork-image universal-card-image"
                    placeholder={
                      <div className="artwork-image-placeholder universal-card-image-placeholder">
                        <div className="universal-card-logo-text">Kalakritam</div>
                        <div className="universal-card-image-not-available">
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
                  <div className="artwork-overlay universal-card-overlay">
                    <div className="artwork-overlay-content universal-card-overlay-content">
                      <h3>{artwork.title}</h3>
                      <p>by {artwork.artist}</p>
                      {artwork.price && <span className="highlight-text">{artwork.price}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="artwork-info universal-card-content">
                  <h4 className="artwork-title universal-card-title">{artwork.title}</h4>
                  <p className="artwork-artist universal-card-subtitle">by {artwork.artist}</p>
                  
                  <div className="artwork-details universal-card-details">
                    {artwork.medium && (
                      <div className="detail-row universal-card-detail-row">
                        <span className="detail-label universal-card-detail-label">Medium:</span>
                        <span className="detail-value universal-card-detail-value">{artwork.medium}</span>
                      </div>
                    )}
                    {artwork.year && (
                      <div className="detail-row universal-card-detail-row">
                        <span className="detail-label universal-card-detail-label">Year:</span>
                        <span className="detail-value universal-card-detail-value">{artwork.year}</span>
                      </div>
                    )}
                    {artwork.category && (
                      <div className="detail-row universal-card-detail-row">
                        <span className="detail-label universal-card-detail-label">Category:</span>
                        <span className="detail-value universal-card-detail-value">{artwork.category}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="artwork-actions universal-card-actions">
                    <Link 
                      className="btn-view universal-card-btn"
                      to={getArtworkDetailPath(artwork)}
                      onClick={() => {
                        // Force instant scroll (no smooth) for quicker perceived navigation
                        try { sessionStorage.setItem('__forceInstantScroll', '1'); } catch {}
                        handleViewDetails(artwork);
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredArtworks.length === 0 && (
            <div className="no-results">
              <div className="no-results-content">
                <h3>No artworks found</h3>
                <p>Try selecting a different category to explore more artworks.</p>
                <button 
                  className="reset-filter-btn"
                  onClick={() => setSelectedCategory('all')}
                >
                  Show All Artworks
                </button>
              </div>
            </div>
          )}
          
          {/* Load More Button */}
          {selectedCategory === 'all' && currentPage < totalPages && (
            <div className="load-more-container" style={{ 
              textAlign: 'center', 
              margin: '4rem 0 3rem 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <button 
                className="load-more-btn"
                onClick={loadMore}
                disabled={loadingMore}
                style={{
                  position: 'relative',
                  padding: '1rem 2.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  background: loadingMore 
                    ? 'linear-gradient(135deg, #8a6a15 0%, #b89560 100%)'
                    : 'linear-gradient(135deg, #c38f21 0%, #d4af85 100%)',
                  border: '2px solid rgba(195, 143, 33, 0.3)',
                  borderRadius: '50px',
                  cursor: loadingMore ? 'not-allowed' : 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: loadingMore 
                    ? '0 4px 15px rgba(195, 143, 33, 0.2)'
                    : '0 6px 25px rgba(195, 143, 33, 0.4)',
                  transform: loadingMore ? 'scale(0.98)' : 'scale(1)',
                  overflow: 'hidden',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}
                onMouseEnter={(e) => !loadingMore && (e.target.style.transform = 'scale(1.05)', e.target.style.boxShadow = '0 8px 30px rgba(195, 143, 33, 0.5)')}
                onMouseLeave={(e) => !loadingMore && (e.target.style.transform = 'scale(1)', e.target.style.boxShadow = '0 6px 25px rgba(195, 143, 33, 0.4)')}
              >
                {loadingMore ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      border: '3px solid #1a1a1a',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }}></span>
                    Loading...
                  </span>
                ) : (
                  `Load More Artworks`
                )}
              </button>
              {!loadingMore && (
                <div style={{
                  fontSize: '0.9rem',
                  color: '#d4af85',
                  fontWeight: '500',
                  opacity: 0.8
                }}>
                  Showing {artworks.length} of {totalItems} artworks • Page {currentPage} of {totalPages}
                </div>
              )}
            </div>
          )}
        </main>

        <section className="gallery-info">
          <div className="info-content">
            <h2>Art Gallery Hyderabad - Kalakritam's Workshop Creations</h2>
            <p>
              Discover the inspiring creations from our <strong>art workshops in Hyderabad</strong> at Kalakritam's gallery. 
              Our collection showcases artwork created during our weekend workshops held in cafes and restaurants across the city. 
              Each piece represents the creative journey of our workshop participants, featuring traditional Indian art techniques 
              and contemporary expressions learned through our hands-on workshop experiences. Explore the artistic growth and 
              cultural heritage celebrated in every workshop creation.
            </p>
          </div>
        </section>
      </div>

      {/* Modal removed; details now shown on dedicated route */}
      
      <Footer />
    </div>
  );
};

export default Gallery;
