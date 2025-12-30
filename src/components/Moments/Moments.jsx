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
          
          <div className="moments-skeleton-grid">
            {[1, 2, 3, 4].map((col) => (
              <div key={col} className="moments-skeleton-column">
                {[1, 2, 3].map((item) => (
                  <div 
                    key={item} 
                    className="loading-skeleton moments-skeleton-item"
                    style={{ width: '100%', height: '200px', borderRadius: '12px' }}
                  />
                ))}
              </div>
            ))}
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
                        <div key={colIndex} className="masonry-column">
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
