import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigationWithLoading } from '../../hooks/useNavigationWithLoading';
import { useUsernameValidation } from '../ValidateUsername/ValidateUsername';
import { useUserAuth } from '../../contexts/UserAuthContext';
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
import { config } from '../../config/environment';
import './Workshops.css';
import '../Gallery/Gallery.css';

const Workshops = () => {
  const { navigateWithLoading } = useNavigationWithLoading();
  const { username } = useParams();
  const { user, isAuthenticated } = useUserAuth();
  useUsernameValidation('workshops'); // Validate username in URL
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedView, setSelectedView] = useState('upcoming'); // Add view state
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workshops, setWorkshops] = useState([]);
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

  // Initialize mobile optimizations
  useEffect(() => {
    const initializeOptimizations = async () => {
      const networkOpts = getNetworkOptimizations();
      const batteryOpts = await getBatteryOptimizations();
      
      setNetworkOptimizations(networkOpts);
      setBatteryOptimizations(batteryOpts);
      
      if (batteryOpts.disableParticles || networkOpts.delayNonCritical) {
        setParticleConfig({ ...particleConfig, particleCount: 0 });
      }
    };
    
    initializeOptimizations();
    
    const handleResize = () => {
      const newIsMobile = shouldOptimizeForMobile();
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
        setParticleConfig(getMobileParticleConfig());
        setBlurConfig(getMobileBlurConfig());
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    if (isMobile) {
      const cleanupInterval = setInterval(() => {
        mobileMemoryOptimization.cleanup();
      }, 30000);
      
      return () => {
        clearInterval(cleanupInterval);
        window.removeEventListener('resize', handleResize);
      };
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  useEffect(() => {
    if (!fetchCalled.current) {
      fetchWorkshops();
      fetchCalled.current = true;
    }
  }, []);

  // Auto-switch to past workshops if no upcoming workshops
  useEffect(() => {
    if (!loading && workshops.length > 0 && selectedView === 'upcoming') {
      const now = new Date();
      const upcomingWorkshops = workshops.filter(workshop => {
        const workshopEndDate = workshop.endDate ? new Date(workshop.endDate) : null;
        const isUpcoming = workshopEndDate ? workshopEndDate >= now : true;
        return workshop.active && isUpcoming;
      });
      
      // If no upcoming workshops, switch to past workshops
      if (upcomingWorkshops.length === 0) {
        setSelectedView('past');
        toast.info('No upcoming workshops. Showing past workshops.');
      }
    }
  }, [workshops, loading, selectedView]);

  // Helper to transform workshop data from backend (snake_case to camelCase)
  const transformWorkshop = (workshop) => {
    return {
      id: workshop.id,
      title: workshop.title,
      instructor: workshop.instructor,
      description: workshop.description,
      startDate: workshop.start_date || workshop.startDate,
      endDate: workshop.end_date || workshop.endDate,
      venue: workshop.venue,
      duration: workshop.duration,
      price: workshop.price,
      maxParticipants: workshop.max_participants || workshop.maxParticipants,
      currentParticipants: workshop.current_participants || workshop.currentParticipants,
      imageUrl: workshop.image_url || workshop.imageUrl,
      active: workshop.active,
      slug: workshop.slug,
      createdAt: workshop.created_at || workshop.createdAt,
      updatedAt: workshop.updated_at || workshop.updatedAt
    };
  };

  // Helper function to generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleViewDetails = (workshop) => {
    const slug = workshop.slug || generateSlug(workshop.title);
    
    // If user is authenticated and has username in URL, use personalized path
    let workshopPath;
    if (username && isAuthenticated && user) {
      workshopPath = `/u/${username}/workshops/${slug}`;
    } else {
      workshopPath = `/workshops/${slug}`;
    }
    
    // Navigate to slug-based URL
    navigateWithLoading(workshopPath);
  };

  const fetchWorkshops = async (page = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      const loadingId = toast.dataLoading(append ? 'Loading more workshops...' : 'Loading workshops...');
      
      console.log('Fetching workshops from:', `${config.apiBaseUrl}/workshops?page=${page}&limit=${itemsPerPage}`);
      const response = await fetch(`${config.apiBaseUrl}/workshops?page=${page}&limit=${itemsPerPage}`);
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      toast.dismiss(loadingId);
      
      if (data.success && data.data) {
        // Transform the data from snake_case to camelCase
        const transformedData = data.data.map(transformWorkshop);
        
        if (append) {
          setWorkshops(prev => [...prev, ...transformedData]);
        } else {
          setWorkshops(transformedData);
        }
        
        // Update pagination info
        if (data.pagination) {
          setCurrentPage(data.pagination.page);
          setTotalPages(data.pagination.totalPages);
          setTotalItems(data.pagination.total || 0);
        }
        
        toast.dataLoaded(`Loaded ${transformedData.length} workshops`);
      } else {
        setError('Failed to load workshops');
        toast.error('Failed to load workshops');
      }
    } catch (err) {
      console.error('Error fetching workshops:', err);
      setError('Failed to connect to server');
      toast.serverError('Failed to connect to server');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      fetchWorkshops(currentPage + 1, true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWorkshop(null);
  };

  // Filter workshops based on selected view and date
  const now = new Date();
  const filteredWorkshops = selectedView === 'upcoming'
    ? workshops.filter(workshop => {
        // Check if workshop is active AND the end date hasn't passed
        const workshopEndDate = workshop.endDate ? new Date(workshop.endDate) : null;
        const isUpcoming = workshopEndDate ? workshopEndDate >= now : true;
        return workshop.active && isUpcoming;
      })
    : workshops.filter(workshop => {
        // Show all past workshops (end date has passed)
        const workshopEndDate = workshop.endDate ? new Date(workshop.endDate) : null;
        return workshopEndDate ? workshopEndDate < now : false;
      });

  if (loading) {
    return (
      <div className="workshops-container">
        <VideoLogo />
        <Header currentPage="workshops" />
        <div className="workshops-page-content">
          <header className="workshops-page-header">
            <h1 className="workshops-title">Workshops</h1>
            <p className="workshops-subtitle">Learn from Expert Artists</p>
          </header>
          
          <div className="loading-message" style={{ textAlign: 'center', padding: '3rem', color: '#c38f21' }}>
            <p style={{ fontSize: '1.2rem' }}>Loading workshops...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="workshops-container">
        <VideoLogo />
        <Header currentPage="workshops" />
        <div className="workshops-page-content">
          <div className="error-container">
            <h2>Unable to load workshops</h2>
            <p>{error}</p>
            <button onClick={fetchWorkshops} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="workshops-container" data-connection={networkOptimizations.lowerQuality ? 'slow' : 'fast'}>
      {/* Particles Background - Optimized for mobile */}
      {particleConfig.particleCount > 0 && (
        <div className="workshops-particles-background">
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
        className="workshops-blur-overlay"
        style={{
          backdropFilter: blurConfig.backdropFilter,
          background: blurConfig.background
        }}
      ></div>
      
      {/* Video Logo */}
      <VideoLogo />
      
      <Header currentPage="workshops" />
      
      <div className="workshops-page-content">
        <header className="workshops-page-header">
          <h1 className="workshops-title">Workshops</h1>
          <p className="workshops-subtitle">Learn from Master Artists & Preserve Cultural Heritage</p>
          <div className="workshops-description">
            <p>Join our expert-led workshops and immerse yourself in the world of traditional and contemporary Indian art forms. Learn techniques passed down through generations from master artists and explore modern artistic expressions.</p>
          </div>
          
          {/* View Toggle */}
          <div className="view-toggle">
            <button 
              className={`view-toggle-btn ${selectedView === 'upcoming' ? 'active' : ''}`}
              onClick={() => setSelectedView('upcoming')}
            >
              Upcoming Workshops
            </button>
            <button 
              className={`view-toggle-btn ${selectedView === 'past' ? 'active' : ''}`}
              onClick={() => setSelectedView('past')}
            >
              Past Workshops
            </button>
          </div>
        </header>

        <main className="workshops-content">
          <div className="workshops-count">
            <p>Showing {filteredWorkshops.length} workshop{filteredWorkshops.length !== 1 ? 's' : ''}</p>
          </div>
          
          <div className="workshops-grid">
            {filteredWorkshops.map(workshop => (
              <div key={workshop.id} className="workshop-card universal-card">
                <div className="workshop-image-container universal-card-image-container">
                  <img 
                    src={workshop.imageUrl} 
                    alt={workshop.title}
                    className="workshop-image universal-card-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const placeholder = e.target.parentNode.querySelector('.workshop-image-placeholder');
                      if (placeholder) {
                        placeholder.style.display = 'flex';
                      }
                    }}
                  />
                  <div className="workshop-image-placeholder universal-card-image-placeholder" style={{ display: 'none' }}>
                    <div className="universal-card-logo-text">Kalakritam</div>
                    <div className="universal-card-image-not-available">Image not available</div>
                  </div>
                  <div className="workshop-overlay universal-card-overlay">
                    <div className="workshop-overlay-content universal-card-overlay-content">
                      <h3>{workshop.title}</h3>
                      <p>by {workshop.instructor}</p>
                      <span className="highlight-text">₹{workshop.price}</span>
                    </div>
                  </div>
                </div>
                
                <div className="workshop-info universal-card-content">
                  <h4 className="workshop-title universal-card-title">{workshop.title}</h4>
                  <p className="workshop-instructor universal-card-subtitle">by {workshop.instructor}</p>
                  <p className="workshop-description universal-card-description">{workshop.description}</p>
                  
                  <div className="workshop-details universal-card-details">
                    <div className="detail-row universal-card-detail-row">
                      <span className="detail-label universal-card-detail-label">Duration:</span>
                      <span className="detail-value universal-card-detail-value">{workshop.duration}</span>
                    </div>
                    <div className="detail-row universal-card-detail-row">
                      <span className="detail-label universal-card-detail-label">Start Date:</span>
                      <span className="detail-value universal-card-detail-value">{new Date(workshop.startDate).toLocaleDateString('en-US', { 
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="detail-row universal-card-detail-row">
                      <span className="detail-label universal-card-detail-label">End Date:</span>
                      <span className="detail-value universal-card-detail-value">{new Date(workshop.endDate).toLocaleDateString('en-US', { 
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="detail-row universal-card-detail-row">
                      <span className="detail-label universal-card-detail-label">Max Participants:</span>
                      <span className="detail-value universal-card-detail-value">{workshop.maxParticipants}</span>
                    </div>
                  </div>
                  
                  <div className="workshop-actions universal-card-actions">
                    <button 
                      className="btn-details universal-card-btn"
                      onClick={() => handleViewDetails(workshop)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredWorkshops.length === 0 && (
            <div className="no-results">
              <div className="no-results-content">
                <h3>No workshops found</h3>
                <p>Try selecting a different category to explore more workshops.</p>
                <button 
                  className="reset-filter-btn"
                  onClick={() => setSelectedCategory('all')}
                >
                  Show All Workshops
                </button>
              </div>
            </div>
          )}
          
          {/* Load More Button */}
          {currentPage < totalPages && (
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
                  `Load More Workshops`
                )}
              </button>
              {!loadingMore && (
                <div style={{
                  fontSize: '0.9rem',
                  color: '#d4af85',
                  fontWeight: '500',
                  opacity: 0.8
                }}>
                  Showing {workshops.length} of {totalItems} workshops • Page {currentPage} of {totalPages}
                </div>
              )}
            </div>
          )}
        </main>

        <section className="workshops-info">
          <div className="info-content">
            <h2>Weekend Art Workshops in Hyderabad - Cafes & Restaurants</h2>
            <p>
              Experience unique <strong>art workshops in Hyderabad</strong> at Kalakritam, where creativity meets the cozy ambiance 
              of cafes and restaurants. Our weekend workshops focus on traditional Indian art techniques and contemporary expressions, 
              providing a relaxed and inspiring environment for artistic learning. Join our community of art enthusiasts who gather 
              every weekend to explore creativity, learn new skills, and connect with fellow artists in beautiful, social settings 
              across Hyderabad. Each workshop includes all materials and offers personalized guidance for all skill levels.
            </p>
          </div>
        </section>
      </div>

      {/* Workshop Detail Modal */}
      {isModalOpen && selectedWorkshop && (
        <div className="artwork-modal-overlay" onClick={closeModal}>
          <div className="artwork-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              <div className="close-icon-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </div>
            </button>
            
            <div className="modal-content">
              <div className="modal-image-section">
                <img 
                  src={selectedWorkshop.imageUrl} 
                  alt={selectedWorkshop.title}
                  className="modal-artwork-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="image-placeholder" style={{ display: 'none' }}>
                  <div className="kalakritam-logo-text">Kalakritam</div>
                  <div className="image-not-available">Image not available</div>
                </div>
                <div className="modal-image-info">
                  <div className="image-quality-badge">Workshop</div>
                </div>
              </div>

              <div className="modal-details-section">
                <div className="modal-header">
                  <div className="modal-title-section">
                    <h2 className="modal-title">{selectedWorkshop.title}</h2>
                    <p className="modal-artist">Instructor: {selectedWorkshop.instructor}</p>
                  </div>
                  <div className="modal-price-section">
                    <span className="price-label">Price</span>
                    <div className="modal-price">₹{selectedWorkshop.price}</div>
                  </div>
                </div>

                <div className="modal-description">
                  <h3>About This Workshop</h3>
                  <p>{selectedWorkshop.description}</p>
                </div>

                <div className="modal-specifications">
                  <h3>Workshop Details</h3>
                  <div className="spec-grid">
                    <div className="spec-item">
                      <span className="spec-label">Duration</span>
                      <span className="spec-value">{selectedWorkshop.duration}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Start Date</span>
                      <span className="spec-value">{new Date(selectedWorkshop.startDate).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">End Date</span>
                      <span className="spec-value">{new Date(selectedWorkshop.endDate).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Start Time</span>
                      <span className="spec-value">{new Date(selectedWorkshop.startDate).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit', 
                        hour12: true 
                      })}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Max Participants</span>
                      <span className="spec-value">{selectedWorkshop.maxParticipants}</span>
                    </div>
                  </div>
                </div>

                <div className="modal-additional-info">
                  <div className="artwork-authenticity">
                    <h4>Workshop Information</h4>
                    <p>This workshop provides hands-on learning experience with expert guidance from {selectedWorkshop.instructor}. All necessary materials and guidance will be provided during the session.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Workshops;
