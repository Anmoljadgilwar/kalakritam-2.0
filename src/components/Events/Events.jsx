import React, { useState, useEffect, useRef } from 'react';
import { useNavigationWithLoading } from '../../hooks/useNavigationWithLoading';
import { useUsernameValidation } from '../ValidateUsername/ValidateUsername';
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
  useUsernameValidation('events'); // Validate username in URL
  const [selectedView, setSelectedView] = useState('upcoming');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        // Transform image URLs to handle localhost URLs like gallery
        const transformedData = data.data.map(event => ({
          ...event,
          imageUrl: config.transformImageUrl(event.image_url || event.imageUrl)
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
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading events...</p>
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

  // Filter events based on selected view
  const filteredEvents = selectedView === 'upcoming' 
    ? events.filter(event => event.active) 
    : events;

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

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
      
      <main className="events-content">
        <section className="events-hero">
          <h1 className="events-title">Events</h1>
          <p className="events-subtitle">Discover Art Through Experiences</p>
        </section>

        <section className="events-filter">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${selectedView === 'upcoming' ? 'active' : ''}`}
              onClick={() => setSelectedView('upcoming')}
            >
              Upcoming Events
            </button>
          </div>
        </section>

        {selectedView === 'upcoming' && (
          <section className="upcoming-events">
            <div className="events-grid">
              {filteredEvents.map(event => (
                <div key={event.id} className="event-card" onClick={() => handleEventClick(event)}>
                  <div className="event-poster">
                    <img 
                      src={event.imageUrl || '/events/art poster.png'} 
                      alt={event.title}
                      className="poster-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="poster-placeholder" style={{ display: 'none' }}>
                      <div className="kalakritam-logo-text">Kalakritam</div>
                      <div className="event-type">Event Poster</div>
                    </div>
                    <div className="event-date-badge">
                      {new Date(event.startDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                  <div className="event-content">
                    <h3 className="event-title">{event.title}</h3>
                    <div className="event-quick-details">
                      <div className="event-time">
                        <strong>Time:</strong> {new Date(event.startDate).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit', 
                          hour12: true 
                        })}
                      </div>
                      <div className="event-location">
                        <strong>Location:</strong> {event.venue}
                      </div>
                      <div className="event-price">
                        <strong>Price:</strong> ₹{event.ticketPrice}
                      </div>
                    </div>
                    <p className="event-description">{event.description}</p>
                    <div className="event-actions">
                      <button className="view-details-btn">View Details</button>
                      <button className="register-btn">Register Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
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
          </section>
        )}

        {/* Event Detail Modal */}
        {isModalOpen && selectedEvent && (
          <div className="event-modal-overlay" onClick={closeModal}>
            <div className="event-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={closeModal}>
                <div className="close-icon-circle">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </div>
              </button>
              
              <div className="modal-content">
                <div className="modal-poster-section">
                  <img 
                    src={selectedEvent.imageUrl} 
                    alt={selectedEvent.title}
                    className="modal-poster-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="poster-placeholder" style={{ display: 'none' }}>
                    <div className="kalakritam-logo-text">Kalakritam</div>
                    <div className="event-type">Event Poster</div>
                  </div>
                </div>

                <div className="modal-details-section">
                  <div className="modal-header">
                    <h2 className="modal-title">{selectedEvent.title}</h2>
                    <div className="modal-price-section">
                      <span className="price-label">Price</span>
                      <div className="modal-price">₹{selectedEvent.ticketPrice}</div>
                    </div>
                  </div>

                  <div className="modal-description">
                    <h3>About This Event</h3>
                    <p>{selectedEvent.description}</p>
                  </div>

                  <div className="modal-specifications">
                    <h3>Event Details</h3>
                    <div className="spec-grid">
                      <div className="spec-item">
                        <span className="spec-label">Date</span>
                        <span className="spec-value">{new Date(selectedEvent.startDate).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Start Time</span>
                        <span className="spec-value">{new Date(selectedEvent.startDate).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit', 
                          hour12: true 
                        })}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">End Time</span>
                        <span className="spec-value">{new Date(selectedEvent.endDate).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit', 
                          hour12: true 
                        })}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Location</span>
                        <span className="spec-value">{selectedEvent.venue}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Max Attendees</span>
                        <span className="spec-value">{selectedEvent.maxAttendees}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Current Attendees</span>
                        <span className="spec-value">{selectedEvent.currentAttendees}</span>
                      </div>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button className="register-modal-btn">Register Now</button>
                    <button className="share-btn">Share Event</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Events;
