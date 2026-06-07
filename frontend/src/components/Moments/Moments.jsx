import React, { useState, useEffect, useRef } from 'react';
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
import './Moments.css';

const Moments = () => {
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchCalled = useRef(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Track window width
  const animationRef = useRef(null);
  const columnsRef = useRef({}); // Changed to object to store columns by eventId-colIndex
  
  // Mobile optimization states
  const [isMobile, setIsMobile] = useState(shouldOptimizeForMobile());
  const [particleConfig, setParticleConfig] = useState(getMobileParticleConfig());
  const [blurConfig, setBlurConfig] = useState(getMobileBlurConfig());
  const [networkOptimizations, setNetworkOptimizations] = useState({});
  const [batteryOptimizations, setBatteryOptimizations] = useState({});

  // JavaScript-based animation for mobile (fallback when CSS animations don't work)
  useEffect(() => {
    if (!isMobile || loading || moments.length === 0) return;
    
    // Wait for DOM to be fully rendered with all columns
    const timeoutId = setTimeout(() => {
      let startTime = null;
      const duration = 25000; // 25 seconds for one cycle
      
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = (elapsed % duration) / duration;
        
        // Query all masonry grids and animate each grid's columns
        const allGrids = document.querySelectorAll('.masonry-grid');
        
        allGrids.forEach((grid) => {
          const columns = grid.querySelectorAll('.masonry-column.mobile-animated');
          columns.forEach((column, colIndex) => {
            // Alternate direction based on column index within each grid
            const direction = colIndex % 2 === 0 ? -1 : 1; // Even columns go up, odd go down
            const translateY = direction === -1 
              ? -33.333 * progress 
              : -33.333 + (33.333 * progress);
            
            column.style.transform = `translateY(${translateY}%) translateZ(0)`;
          });
        });
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }, 500); // Wait for images to start loading
    
    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMobile, loading, moments]);

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
      setWindowWidth(window.innerWidth); // Update window width for column redistribution
      
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
      fetchMoments();
      fetchCalled.current = true;
    }

    // SEO meta tags for Kalakritam Moments
    document.title = 'Moments - Kalakritam | Art Workshop Highlights & Memories in Hyderabad';

    const metaDescription = document.querySelector('meta[name="description"]');
    const descriptionContent = 'Relive the best moments from Kalakritam art workshops in Hyderabad. Browse photos and highlights from our traditional & contemporary art sessions, events, and community gatherings.';
    if (metaDescription) {
      metaDescription.setAttribute('content', descriptionContent);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = descriptionContent;
      document.head.appendChild(meta);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const keywordsContent = 'Kalakritam moments, art workshop photos Hyderabad, art class highlights, workshop memories, Kalakritam gallery, art event photos, Hyderabad art community, creative moments, kala kritam';
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywordsContent);
    } else {
      const keywords = document.createElement('meta');
      keywords.name = 'keywords';
      keywords.content = keywordsContent;
      document.head.appendChild(keywords);
    }

    // Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      const meta = document.createElement('meta');
      meta.property = 'og:title';
      meta.content = 'Moments - Kalakritam | Art Workshop Highlights in Hyderabad';
      document.head.appendChild(meta);
    } else {
      ogTitle.setAttribute('content', 'Moments - Kalakritam | Art Workshop Highlights in Hyderabad');
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      const meta = document.createElement('meta');
      meta.property = 'og:description';
      meta.content = 'Browse highlights and memories from Kalakritam art workshops in Hyderabad.';
      document.head.appendChild(meta);
    } else {
      ogDescription.setAttribute('content', 'Browse highlights and memories from Kalakritam art workshops in Hyderabad.');
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://kalakritam.in/moments';
  }, []);

  const fetchMoments = async () => {
    try {
      setLoading(true);
      
      if (isMobile) {
        mobilePerformanceMonitor.startLoadTime();
      }
      
      const loadingId = toast.dataLoading('Loading moments...');
      
      const response = await fetch(`${config.apiBaseUrl}/moments`);
      const data = await response.json();
      
      toast.dismiss(loadingId);
      
      if (data.success) {
        // Parse photos JSON if it's a string
        const transformedData = data.data.map(moment => ({
          ...moment,
          photos: typeof moment.photos === 'string' ? JSON.parse(moment.photos) : moment.photos
        }));
        
        setMoments(transformedData);
        
        if (isMobile) {
          const totalImages = transformedData.reduce((sum, m) => sum + (m.photos?.length || 0), 0);
          mobilePerformanceMonitor.setTotalImages(totalImages);
          mobilePerformanceMonitor.endLoadTime();
        }
        
        toast.dataLoaded(`Loaded ${transformedData.length} moments`);
      } else {
        setError('Failed to load moments');
        toast.error('Failed to load moments');
      }
    } catch (err) {
      console.error('Error fetching moments:', err);
      const errorMessage = 'Failed to connect to server';
      setError(errorMessage);
      toast.serverError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Distribute photos of each event into columns based on screen size
  const distributeEventPhotosToColumns = (photos, eventName) => {
    // Determine number of columns based on screen width (matching CSS breakpoints)
    let numColumns = 4; // Desktop default (>1200px)
    const screenWidth = window.innerWidth;
    
    if (screenWidth <= 768) {
      numColumns = 2; // Mobile and small tablets
    } else if (screenWidth <= 1200) {
      numColumns = 3; // Tablet
    }
    
    // Create the appropriate number of columns
    const columns = Array.from({ length: numColumns }, () => []);
    
    // Distribute photos across columns
    photos.forEach((photoUrl, index) => {
      columns[index % numColumns].push({
        url: photoUrl,
        eventName: eventName
      });
    });

    // Triple images in each column for seamless infinite loop
    // This ensures continuous flow as images scroll through
    return columns.map(column => [...column, ...column, ...column]);
  };

  if (loading) {
    return (
      <div className="moments-container">
        <VideoLogo />
        <Header currentPage="moments" />
        <div className="moments-page-content">
          <header className="moments-header">
            <h1 className="moments-title">Moments</h1>
            <p className="moments-subtitle">Captured Memories from Our Events</p>
          </header>
          
          <div className="loading-message" style={{ textAlign: 'center', padding: '3rem', color: '#c38f21' }}>
            <p style={{ fontSize: '1.2rem' }}>Loading moments...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="moments-container">
        <VideoLogo />
        <Header currentPage="moments" />
        <div className="moments-page-content">
          <div className="error-container">
            <h2>Unable to load moments</h2>
            <p>{error}</p>
            <button onClick={fetchMoments} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="moments-container" data-connection={networkOptimizations.lowerQuality ? 'slow' : 'fast'}>
      {/* Particles Background */}
      {particleConfig.particleCount > 0 && (
        <div className="moments-particles-background">
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
      
      {/* Blur Overlay Layer */}
      <div 
        className="moments-blur-overlay"
        style={{
          backdropFilter: blurConfig.backdropFilter,
          background: blurConfig.background
        }}
      ></div>
      
      <VideoLogo />
      <Header currentPage="moments" />
      
      <div className="moments-page-content">
        <header className="moments-page-header">
          <h1 className="moments-title">Moments</h1>
          <p className="moments-subtitle">Captured Memories from Our Events</p>
          <div className="moments-description">
            <p>Explore the beautiful moments captured during our various art events, workshops, and cultural celebrations. Each photo tells a story of creativity, connection, and celebration.</p>
          </div>
        </header>

        <main className="moments-content">
          {moments.length === 0 ? (
            <div className="no-moments">
              <div className="no-moments-content">
                <h3>No moments yet</h3>
                <p>Check back soon for photos from our upcoming events!</p>
              </div>
            </div>
          ) : (
            <div className="moments-events-list">
              {moments.map((moment) => (
                <div key={moment.id} className="event-moment-section">
                  {/* Event Name Header */}
                  <h2 className="event-moment-title">{moment.event_name}</h2>
                  
                  {/* Masonry Grid for this event's photos */}
                  {moment.photos && moment.photos.length > 0 ? (
                    <div className="masonry-grid">
                      {distributeEventPhotosToColumns(moment.photos, moment.event_name).map((column, colIndex) => (
                        <div 
                          key={colIndex} 
                          className={`masonry-column ${isMobile ? 'mobile-animated' : ''}`}
                          ref={el => {
                            if (isMobile && el) {
                              // Use unique key: eventId-colIndex to store all columns
                              columnsRef.current[`${moment.id}-${colIndex}`] = el;
                            }
                          }}
                        >
                          {column.map((photo, photoIndex) => (
                            <div 
                              key={`${moment.id}-${colIndex}-${photoIndex}`} 
                              className="masonry-item"
                            >
                              <LazyImage
                                src={getOptimizedImageUrl(photo.url, isMobile)} 
                                alt={photo.eventName}
                                className="masonry-image"
                                placeholder={
                                  <div className="masonry-image-placeholder">
                                    <div className="placeholder-logo">Kalakritam</div>
                                    <div className="placeholder-text">
                                      {networkOptimizations.lowerQuality ? 'Loading...' : 'Loading...'}
                                    </div>
                                  </div>
                                }
                                onError={() => {
                                  console.log(`Failed to load image: ${photo.url}`);
                                }}
                                onLoad={() => {
                                  if (isMobile) {
                                    mobilePerformanceMonitor.trackImageLoad();
                                  }
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-photos-message">No photos available for this event</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>

        <section className="moments-info">
          <div className="info-content">
            <h2>Event Moments - Kalakritam's Art & Cultural Celebrations</h2>
            <p>
              Discover the vibrant moments from Kalakritam's art events and workshops in Hyderabad. 
              Our gallery showcases the joy, creativity, and cultural connections made during our 
              weekend workshops, art parties, and special celebrations. Each photo captures the essence 
              of artistic expression and community engagement that defines the Kalakritam experience.
            </p>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Moments;
