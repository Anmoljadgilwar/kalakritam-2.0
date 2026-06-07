import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigationWithLoading } from '../../hooks/useNavigationWithLoading';
import { useUsernameValidation } from '../ValidateUsername/ValidateUsername';
import { useUserAuth } from '../../contexts/UserAuthContext';
import { toast } from '../../utils/notifications.js';
import { useMobileOptimizations } from '../../hooks/useMobileOptimizations';
import { getMobileBlurConfig } from '../../utils/mobileOptimizations';
import Header from '../Header';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import OptimizedParticles from '../OptimizedParticles';
import { config } from '../../config/environment';
import './Events.css';

const Events = () => {
  const { navigateWithLoading } = useNavigationWithLoading();
  const { username } = useParams();
  const { user, isAuthenticated } = useUserAuth();
  useUsernameValidation('events'); // Validate username in URL
  const [selectedView, setSelectedView] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEventId, setExpandedEventId] = useState(null); // Track which event is expanded
  const fetchCalled = useRef(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const itemsPerPage = 6;
  
  // Mobile optimizations
  const { particleConfig, networkOptimizations } = useMobileOptimizations('events');
  const [blurConfig, setBlurConfig] = useState(getMobileBlurConfig());

  useEffect(() => {
    if (!fetchCalled.current) {
      fetchEvents();
      fetchCalled.current = true;
    }
  }, []);

  // Auto-switch to past events if no upcoming events
  useEffect(() => {
    if (!loading && events.length > 0 && selectedView === 'upcoming') {
      const now = new Date();
      const upcomingEvents = events.filter(event => {
        const eventEndDate = event.endDate ? new Date(event.endDate) : null;
        const isUpcoming = eventEndDate ? eventEndDate >= now : true;
        return event.active && isUpcoming;
      });
      
      // If no upcoming events, switch to past events
      if (upcomingEvents.length === 0) {
        setSelectedView('past');
        toast.info('No upcoming events. Showing past events.');
      }
    }
  }, [events, loading, selectedView]);

  // Helper function to generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleViewDetails = (event) => {
    const slug = event.slug || generateSlug(event.title);
    
    // If user is authenticated and has username in URL, use personalized path
    let eventPath;
    if (username && isAuthenticated && user) {
      eventPath = `/u/${username}/events/${slug}`;
    } else {
      eventPath = `/events/${slug}`;
    }
    
    // Navigate to slug-based URL
    navigateWithLoading(eventPath);
  };

  const toggleEventDetails = (eventId, e) => {
    e.stopPropagation();
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  const handleCardClick = (event, e) => {
    // Navigate to detail page when clicking poster
    handleViewDetails(event);
  };

  const fetchEvents = async (page = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      const loadingId = toast.dataLoading(append ? 'Loading more events...' : 'Loading events...');
      
      const response = await fetch(`${config.apiBaseUrl}/events?page=${page}&limit=${itemsPerPage}`);
      const data = await response.json();
      
      toast.dismiss(loadingId);
      
      if (data.success) {
        // Transform database fields to camelCase and handle URLs
        const transformedData = data.data.map(event => ({
          id: event.id,
          title: event.title,
          slug: event.slug,
          description: event.description,
          category: event.category,
          venue: event.venue,
          startDate: event.start_date,
          endDate: event.end_date,
          ticketPrice: event.ticket_price,
          maxAttendees: event.max_attendees,
          imageUrl: config.transformImageUrl(event.image_url || event.imageUrl),
          videoUrl: event.video_url || event.videoUrl,
          districtUrl: event.district_url || event.districtUrl,
          bookMyShowUrl: event.book_my_show_url || event.bookMyShowUrl,
          active: event.active,
          createdAt: event.created_at,
          updatedAt: event.updated_at
        }));
        
        if (append) {
          setEvents(prev => [...prev, ...transformedData]);
        } else {
          setEvents(transformedData);
        }
        
        // Update pagination info
        if (data.pagination) {
          setCurrentPage(data.pagination.page);
          setTotalPages(data.pagination.totalPages);
          setTotalItems(data.pagination.total || 0);
        }
        
        toast.dataLoaded(`Loaded ${transformedData.length} events`);
      } else {
        setError('Failed to load events');
        toast.error('Failed to load events');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to connect to server');
      toast.serverError('Failed to connect to server');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      fetchEvents(currentPage + 1, true);
    }
  };

  if (loading) {
    return (
      <div className="events-container">
        <VideoLogo />
        <Header currentPage="events" />
        <div className="events-page-content">
          <header className="events-page-header">
            <h1 className="events-title">Events</h1>
            <p className="events-subtitle">Discover Art Experiences</p>
          </header>
          
          <div className="loading-message" style={{ textAlign: 'center', padding: '3rem', color: '#c38f21' }}>
            <p style={{ fontSize: '1.2rem' }}>Loading events...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-container">
        <VideoLogo />
        <Header currentPage="events" />
        <div className="events-page-content">
          <div className="error-container">
            <h2>Unable to load events</h2>
            <p>{error}</p>
            <button onClick={fetchEvents} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter events based on selected view and date
  const now = new Date();
  const filteredEvents = selectedView === 'upcoming' 
    ? events.filter(event => {
        // Check if event is active AND the end date hasn't passed
        const eventEndDate = event.endDate ? new Date(event.endDate) : null;
        const isUpcoming = eventEndDate ? eventEndDate >= now : true;
        return event.active && isUpcoming;
      })
    : events.filter(event => {
        // Show all past events (end date has passed)
        const eventEndDate = event.endDate ? new Date(event.endDate) : null;
        return eventEndDate ? eventEndDate < now : false;
      });

  return (
    <div className="events-container">
      {/* Particles Background - Optimized for mobile */}
      <OptimizedParticles 
        particleConfig={particleConfig}
        networkOptimizations={networkOptimizations}
        className="events-particles-background"
      />
      
      {/* Blur Overlay Layer - Optimized for mobile */}
      <div 
        className="events-blur-overlay"
        style={{
          backdropFilter: blurConfig.backdropFilter,
          background: blurConfig.background
        }}
      ></div>
      
      {/* Video Logo */}
      <VideoLogo />
      
      <Header currentPage="events" />
      
      <div className="events-page-content">
        <header className="events-page-header">
          <h1 className="events-title">Events</h1>
          <p className="events-subtitle">Discover Art Through Experiences</p>
          <div className="events-description">
            <p>Immerse yourself in our vibrant art events and cultural experiences. Connect with artists, explore creative workshops, and be part of the thriving art community at Kalakritam.</p>
          </div>
          
          {/* View Toggle */}
          <div className="view-toggle">
            <button 
              className={`view-toggle-btn ${selectedView === 'upcoming' ? 'active' : ''}`}
              onClick={() => setSelectedView('upcoming')}
            >
              Upcoming Events
            </button>
            <button 
              className={`view-toggle-btn ${selectedView === 'past' ? 'active' : ''}`}
              onClick={() => setSelectedView('past')}
            >
              Past Events
            </button>
          </div>
        </header>

        <main className="events-content">
          <div className="events-count">
            <p>Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}</p>
          </div>
          
          <div className="events-grid">
            {filteredEvents.map(event => (
              <div 
                key={event.id} 
                className={`event-card-poster flip-card ${expandedEventId === event.id ? 'expanded' : ''} ${event.videoUrl ? 'has-video' : ''}`}
              >
                <div className="flip-card-inner">
                  {/* Front Side - Poster Image */}
                  <div className="flip-card-front">
                    <div className="event-poster-image">
                      <img 
                        src={event.imageUrl || '/events/art poster.png'} 
                        alt={event.title}
                        className="poster-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const placeholder = e.target.parentNode.querySelector('.poster-placeholder');
                          if (placeholder) {
                            placeholder.style.display = 'flex';
                          }
                        }}
                      />
                      <div className="poster-placeholder" style={{ display: 'none' }}>
                        <div className="kalakritam-logo-text">Kalakritam</div>
                        <div className="image-not-available">Image not available</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Back Side - Video with Details */}
                  {event.videoUrl ? (
                    <div className="flip-card-back" onClick={(e) => handleCardClick(event, e)}>
                      <div className="event-video-container">
                        <video 
                          className="event-video"
                          src={event.videoUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          onError={(e) => {
                            console.error('Video failed to load:', event.videoUrl);
                            e.target.style.display = 'none';
                            const fallback = e.target.parentNode.querySelector('.video-fallback');
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className="video-fallback" style={{ display: 'none' }}>
                          <div className="kalakritam-logo-text">Kalakritam</div>
                          <div className="image-not-available">Video unavailable</div>
                        </div>
                      </div>
                      
                      {/* Tap indicator on video */}
                      <div className="tap-indicator">
                        <span>Click to see the complete information</span>
                      </div>
                      
                      {/* Details Panel - Shows on click */}
                      {expandedEventId === event.id && (
                        <div className="event-details-panel" onClick={(e) => e.stopPropagation()}>
                          <button 
                            className="close-details-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedEventId(null);
                            }}
                          >
                            ×
                          </button>
                          
                          <h3 className="event-detail-title">{event.title}</h3>
                          <p className="event-detail-venue">{event.venue}</p>
                          <p className="event-detail-description">{event.description}</p>
                          
                          <div className="event-detail-specs">
                            <div className="spec-row">
                              <span className="spec-label">DATE:</span>
                              <span className="spec-value">
                                {event.startDate ? new Date(event.startDate).toLocaleDateString('en-US', { 
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                }) : 'TBA'}
                              </span>
                            </div>
                            <div className="spec-row">
                              <span className="spec-label">TIME:</span>
                              <span className="spec-value">
                                {event.startDate ? new Date(event.startDate).toLocaleTimeString('en-US', { 
                                  hour: 'numeric', 
                                  minute: '2-digit', 
                                  hour12: true 
                                }) : 'TBA'}
                              </span>
                            </div>
                            <div className="spec-row">
                              <span className="spec-label">LOCATION:</span>
                              <span className="spec-value">{event.venue || 'TBA'}</span>
                            </div>
                            <div className="spec-row">
                              <span className="spec-label">MAX ATTENDEES:</span>
                              <span className="spec-value">{event.maxAttendees || 'No limit'}</span>
                            </div>
                            <div className="spec-row price-row">
                              <span className="spec-label">PRICE:</span>
                              <span className="spec-value price">₹{event.ticketPrice || '0'}</span>
                            </div>
                          </div>
                          
                          <button 
                            className="view-full-details-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(event);
                            }}
                          >
                            View Full Details →
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flip-card-back" onClick={(e) => handleCardClick(event, e)}>
                      <div className="event-poster-image">
                        <div className="poster-placeholder" style={{ display: 'flex' }}>
                          <div className="kalakritam-logo-text">Kalakritam</div>
                          <div className="image-not-available">No video available</div>
                        </div>
                      </div>
                      
                      {/* Tap indicator */}
                      <div className="tap-indicator">
                        <span>Click to see the complete information</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="no-results">
              <div className="no-results-content">
                <h3>No events found</h3>
                <p>Check back soon for upcoming art events and cultural experiences.</p>
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
                    `Load More Events`
                  )}
                </button>
                {!loadingMore && (
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#d4af85',
                    fontWeight: '500',
                    opacity: 0.8
                  }}>
                  Showing {events.length} of {totalItems} events • Page {currentPage} of {totalPages}
                </div>
              )}
            </div>
          )}
        </main>

        <section className="events-info">
          <div className="info-content">
            <h2>Art Events & Cultural Experiences in Hyderabad</h2>
            <p>
              Join <strong>Kalakritam's vibrant art events in Hyderabad</strong> where creativity meets community. 
              Our events showcase traditional Indian art forms, contemporary expressions, and provide opportunities 
              to connect with artists and art enthusiasts. Experience art workshops, exhibitions, cultural gatherings, 
              and creative sessions in inspiring venues across Hyderabad. Each event is designed to foster artistic 
              growth, cultural appreciation, and community building through the power of art.
            </p>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Events;