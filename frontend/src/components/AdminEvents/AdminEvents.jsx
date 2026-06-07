import React, { useState, useEffect } from 'react';
import { toast } from '../../utils/notifications.js';
import AdminHeader from '../AdminHeader';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import SEOFieldsComponent from '../SEOFieldsComponent';
import FileUpload from '../FileUpload';
import VideoUpload from '../VideoUpload';
import AdminLoading from '../AdminLoading';
import { eventsApi, uploadApi } from '../../lib/adminApi';
import { config } from '../../config/environment';
import '../AdminGallery/AdminGallery.css';
import './AdminEvents.css';

const AdminEvents = () => {
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
  };

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const itemsPerPage = 6;
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    startDate: '',
    endDate: '',
    venue: '',
    ticketPrice: '',
    maxAttendees: '',
    imageUrl: '',
    videoUrl: '',
    districtUrl: '',
    bookMyShowUrl: '',
    active: true,
    // SEO fields
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    slug: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (page = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const response = await eventsApi.getAll({ page, limit: itemsPerPage });
      
      console.log('📋 Fetched events response:', {
        success: response.success,
        dataLength: response.data?.length,
        firstEventRaw: response.data?.[0],
        firstEventKeys: response.data?.[0] ? Object.keys(response.data[0]) : [],
        sampleVideoUrl: response.data?.[0]?.video_url || response.data?.[0]?.videoUrl,
        sampleCategory: response.data?.[0]?.category,
        sampleDistrictUrl: response.data?.[0]?.district_url || response.data?.[0]?.districtUrl,
        sampleBookMyShowUrl: response.data?.[0]?.book_my_show_url || response.data?.[0]?.bookMyShowUrl
      });
      
      if (response.success) {
        // Transform image URLs for display and preserve all event data
        const data = response.data || [];
        const transformedData = Array.isArray(data) ? data.map(event => ({
          ...event,
          imageUrl: config.transformImageUrl(event.image_url || event.imageUrl),
          videoUrl: event.video_url || event.videoUrl,
          districtUrl: event.district_url || event.districtUrl,
          bookMyShowUrl: event.book_my_show_url || event.bookMyShowUrl,
          category: event.category
        })) : [];
        
        if (append) {
          setEvents(prev => [...prev, ...transformedData]);
        } else {
          setEvents(transformedData);
        }
        
        // Update pagination info
        if (response.pagination) {
          setCurrentPage(response.pagination.page);
          setTotalPages(response.pagination.totalPages);
        }
      } else {
        // Handle API response that might not have success field
        const data = response.data || response || [];
        const transformedData = Array.isArray(data) ? data.map(event => ({
          ...event,
          imageUrl: config.transformImageUrl(event.image_url || event.imageUrl),
          videoUrl: event.video_url || event.videoUrl,
          districtUrl: event.district_url || event.districtUrl,
          bookMyShowUrl: event.book_my_show_url || event.bookMyShowUrl,
          category: event.category
        })) : [];
        
        if (append) {
          setEvents(prev => [...prev, ...transformedData]);
        } else {
          setEvents(transformedData);
        }
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to connect to server');
      if (!append) {
        setEvents([]); // Ensure events is always an array
      }
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

  const handleCreate = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      startDate: '',
      endDate: '',
      venue: '',
      ticketPrice: '',
      maxAttendees: '',
      imageUrl: '',
      videoUrl: '',
      districtUrl: '',
      bookMyShowUrl: '',
      active: true
    });
    setImageFile(null);
    setVideoFile(null);  // Reset video file
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (event) => {
    // Format datetime for input field (ISO 8601 format for datetime-local)
    const formatDateTimeLocal = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      // Format as YYYY-MM-DDTHH:MM for datetime-local input
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    console.log('🔧 Editing event:', {
      id: event.id,
      title: event.title,
      category: event.category,
      videoUrl: event.video_url || event.videoUrl,
      districtUrl: event.district_url || event.districtUrl,
      bookMyShowUrl: event.book_my_show_url || event.bookMyShowUrl
    });

    // Use the already transformed event data (districtUrl and bookMyShowUrl are already camelCase)
    setFormData({
      title: event.title || '',
      description: event.description || '',
      category: event.category || '',
      startDate: formatDateTimeLocal(event.start_date || event.startDate) || '',
      endDate: formatDateTimeLocal(event.end_date || event.endDate) || '',
      venue: event.venue || '',
      ticketPrice: event.ticket_price || event.ticketPrice || '',
      maxAttendees: event.max_attendees || event.maxAttendees || '',
      imageUrl: config.transformImageUrl(event.image_url || event.imageUrl) || '',
      videoUrl: event.videoUrl || event.video_url || '',
      districtUrl: event.districtUrl || event.district_url || '',
      bookMyShowUrl: event.bookMyShowUrl || event.book_my_show_url || '',
      active: event.active !== false,
      metaTitle: event.meta_title || event.metaTitle || '',
      metaDescription: event.meta_description || event.metaDescription || '',
      metaKeywords: event.meta_keywords || event.metaKeywords || '',
      slug: event.slug || '',
      ogTitle: event.og_title || event.ogTitle || '',
      ogDescription: event.og_description || event.ogDescription || '',
      ogImage: event.og_image || event.ogImage || ''
    });
    
    console.log('📝 Form data being set:', {
      districtUrl: event.districtUrl || event.district_url || '',
      bookMyShowUrl: event.bookMyShowUrl || event.book_my_show_url || '',
      videoUrl: event.videoUrl || event.video_url || '',
      hasDistrictInEvent: 'district_url' in event || 'districtUrl' in event,
      hasBookMyShowInEvent: 'book_my_show_url' in event || 'bookMyShowUrl' in event,
      hasVideoUrl: 'video_url' in event || 'videoUrl' in event,
      eventKeys: Object.keys(event)
    });
    
    setImageFile(null);
    setVideoFile(null);  // Reset video file
    setSelectedEvent(event);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (event) => {
    setSelectedEvent(event);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const response = await eventsApi.deleteEvent(eventId);
      
      if (response.success) {
        setEvents(events.filter(event => event.id !== eventId));
        toast.success('Event deleted successfully');
      } else {
        toast.error('Failed to delete event: ' + (response.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      toast.error('Failed to delete event: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const loadingId = toast.dataSaving(`${modalMode === 'create' ? 'Creating' : 'Updating'} event...`);
      
      let imageUrl = formData.imageUrl; // Use existing image URL if no new file
      let videoUrl = formData.videoUrl; // Use existing video URL if no new file
      
      // If there's a new image file to upload
      if (imageFile) {
        try {
          toast.info('Uploading image to R2 storage...');
          const uploadResult = await uploadApi.uploadImage(imageFile, 'events');
          
          if (uploadResult.success) {
            imageUrl = uploadResult.data.url; // Use the R2 URL from data object
            toast.success('Image uploaded successfully');
            console.log('R2 Image URL:', imageUrl);
          } else {
            throw new Error(uploadResult.message || 'Image upload failed');
          }
        } catch (uploadError) {
          toast.dismiss(loadingId);
          console.error('Image upload error:', uploadError);
          toast.error(`Image upload failed: ${uploadError.message}`);
          return; // Don't continue if image upload fails
        }
      }
      
      // If there's a new video file to upload
      if (videoFile) {
        try {
          toast.info('Uploading video to R2 storage...');
          const uploadResult = await uploadApi.uploadVideo(videoFile, 'events');
          
          if (uploadResult.success) {
            videoUrl = uploadResult.data.url; // Use the R2 URL from data object
            toast.success('Video uploaded successfully');
            console.log('R2 Video URL:', videoUrl);
          } else {
            throw new Error(uploadResult.message || 'Video upload failed');
          }
        } catch (uploadError) {
          toast.dismiss(loadingId);
          console.error('Video upload error:', uploadError);
          toast.error(`Video upload failed: ${uploadError.message}`);
          return; // Don't continue if video upload fails
        }
      }
      
      // Match the exact database schema from Neon
      const eventData = {
        // Required/basic fields
        title: formData.title || "Untitled Event",
        description: formData.description || null,
        category: formData.category || null,
        
        // Date fields - convert to ISO timestamps (already in correct format from datetime-local)
        start_date: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        end_date: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        
        // Event details
        venue: formData.venue || null,
        ticket_price: formData.ticketPrice ? parseFloat(formData.ticketPrice) : null,
        max_attendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
        
        // Media fields
        image_url: imageUrl || null,
        video_url: videoUrl || null,  // Use the videoUrl variable that has the R2 URL
        
        // Booking URLs
        district_url: formData.districtUrl || null,
        book_my_show_url: formData.bookMyShowUrl || null,
        
        // Status fields
        active: formData.active !== false,
        
        // SEO/Meta fields
        meta_title: formData.metaTitle || (formData.title ? `${formData.title} - Cultural Event | Kalakritam` : null),
        meta_description: formData.metaDescription || (formData.title && formData.description ? 
          `Join "${formData.title}" - ${formData.description}. Discover cultural events and heritage experiences at Kalakritam.` : null),
        meta_keywords: formData.metaKeywords || "kalakritam, cultural events, art events, traditional culture, workshops, exhibitions",
        slug: formData.slug || (formData.title ? formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : null),
        og_title: formData.ogTitle || (formData.title ? `${formData.title} - Cultural Event` : null),
        og_description: formData.ogDescription || (formData.title && formData.description ? 
          `Experience "${formData.title}" and explore the rich world of culture and heritage at Kalakritam. ${formData.description}` : null),
        og_image: formData.ogImage || imageUrl || null
        
        // Note: id, created_at, updated_at are auto-generated by the database
      };
      
      console.log('📦 Submitting event data:', {
        title: eventData.title,
        category: eventData.category,
        image_url: eventData.image_url,
        video_url: eventData.video_url,
        hasImageFile: !!imageFile,
        hasVideoFile: !!videoFile
      });
      
      let response;
      if (modalMode === 'create') {
        response = await eventsApi.addEvent(eventData);
      } else {
        // Include old image URL for deletion if a new image was uploaded
        const updateData = {
          ...eventData,
          oldImageUrl: (imageFile && selectedEvent?.imageUrl) ? selectedEvent.imageUrl : undefined
        };
        response = await eventsApi.updateEvent(selectedEvent.id, updateData);
      }
      
      toast.dismiss(loadingId);
      
      console.log('📥 API Response:', response);
      
      if (response.success) {
        toast.success(`Event ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
        setIsModalOpen(false);
        fetchEvents();
        setFormData({
          title: '',
          description: '',
          startDate: '',
          endDate: '',
          venue: '',
          ticketPrice: '',
          maxAttendees: '',
          imageUrl: '',
          videoUrl: '',
          active: true,
          metaTitle: '',
          metaDescription: '',
          metaKeywords: '',
          slug: '',
          ogTitle: '',
          ogDescription: '',
          ogImage: ''
        });
      } else {
        toast.error(`Failed to ${modalMode} event: ${response.message || 'Unknown error'}`);
      }
    } catch (err) {
      if (typeof loadingId !== 'undefined') toast.dismiss(loadingId);
      console.error('Error saving event:', err);
      toast.error(`Failed to ${modalMode} event: ${err.message}`);
    }
  };

  const handleFileSelect = (file) => {
    setImageFile(file);
    // Create a preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        imageUrl: previewUrl
      }));
    }
  };

  const handleFileRemove = () => {
    setImageFile(null);
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }));
  };

  const handleVideoSelect = (file) => {
    setVideoFile(file);
    // Don't set formData.videoUrl here - it will be set after upload to R2
    // The VideoUpload component handles its own preview
  };

  const handleVideoRemove = () => {
    setVideoFile(null);
    setFormData(prev => ({
      ...prev,
      videoUrl: ''
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSeoChange = (seoData) => {
    setFormData(prev => ({
      ...prev,
      ...seoData
    }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setModalMode('view');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Not set';
      return date.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Not set';
    }
  };

  if (loading) {
    return <AdminLoading message="Loading events..." />;
  }

  if (error) {
    return (
      <div className="admin-gallery-container">
        <VideoLogo />
        <AdminHeader currentPage="events" />
        <div className="admin-gallery-content">
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

  return (
    <div className="admin-gallery-container">
      <VideoLogo />
      <AdminHeader currentPage="events" />
      
      <main className="admin-gallery-content">
        <section className="admin-gallery-header">
          <div className="header-content">
            <h1 className="admin-gallery-title">Event Management</h1>
            <p className="admin-gallery-subtitle">Manage Events & Cultural Programs</p>
          </div>
          <div className="header-actions">
            <button onClick={handleCreate} className="create-btn">
              + Add New Event
            </button>
            <div className="gallery-stats">
              <span className="stat">Total: {events.length}</span>
              <span className="stat">Upcoming: {events.filter(e => new Date(e.start_date || e.startDate) > new Date()).length}</span>
            </div>
          </div>
        </section>

        <section className="artworks-table-section">
          <div className="table-container">
            <table className="artworks-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.id}>
                    <td>
                      <div className="artwork-image-cell">
                        <img 
                          src={event.imageUrl} 
                          alt={event.title}
                          className="table-artwork-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="image-placeholder" style={{ display: 'none' }}>
                          <span>No Image</span>
                        </div>
                      </div>
                    </td>
                    <td className="artwork-title-cell">{event.title}</td>
                    <td>{formatDate(event.start_date || event.startDate)}</td>
                    <td>{event.venue}</td>
                    <td>
                      <span className="category-badge">{event.category}</span>
                    </td>
                    <td className="price-cell">{(event.ticket_price || event.ticketPrice) ? `₹${event.ticket_price || event.ticketPrice}` : 'Free'}</td>
                    <td>
                      <div className="status-badges">
                        {event.active && <span className="status-badge available">Active</span>}
                        {new Date(event.start_date || event.startDate) > new Date() && <span className="status-badge upcoming">Upcoming</span>}
                        {new Date(event.start_date || event.startDate) <= new Date() && <span className="status-badge past">Past</span>}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleView(event)}
                          className="action-btn view-btn"
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button 
                          onClick={() => handleEdit(event)}
                          className="action-btn edit-btn"
                          title="Edit Event"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(event.id)}
                          className="action-btn delete-btn"
                          title="Delete Event"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Load More Button */}
          {currentPage < totalPages && (
            <div className="load-more-container" style={{ textAlign: 'center', margin: '2rem 0' }}>
              <button 
                className="load-more-btn"
                onClick={loadMore}
                disabled={loadingMore}
                style={{
                  padding: '0.8rem 2.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  background: 'linear-gradient(135deg, #c38f21 0%, #d4af85 100%)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loadingMore ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: loadingMore ? 0.6 : 1
                }}
              >
                {loadingMore ? 'Loading...' : `Load More (${currentPage} / ${totalPages})`}
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Modal for Create/Edit/View */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === 'create' && 'Add New Event'}
                {modalMode === 'edit' && 'Edit Event'}
                {modalMode === 'view' && 'Event Details'}
              </h2>
              <button onClick={closeModal} className="modal-close-btn">×</button>
            </div>
            
            <div className="modal-content">
              {modalMode === 'view' ? (
                <div className="artwork-details-view">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Title:</label>
                      <span>{selectedEvent?.title}</span>
                    </div>
                    <div className="detail-item">
                      <label>Start Date:</label>
                      <span>{formatDate(selectedEvent?.start_date || selectedEvent?.startDate)}</span>
                    </div>
                    <div className="detail-item">
                      <label>End Date:</label>
                      <span>{formatDate(selectedEvent?.end_date || selectedEvent?.endDate)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Venue:</label>
                      <span>{selectedEvent?.venue}</span>
                    </div>
                    <div className="detail-item">
                      <label>Category:</label>
                      <span>{selectedEvent?.category}</span>
                    </div>
                    <div className="detail-item">
                      <label>Organizer:</label>
                      <span>{selectedEvent?.organizer}</span>
                    </div>
                    <div className="detail-item">
                      <label>Price:</label>
                      <span>{(selectedEvent?.ticket_price || selectedEvent?.ticketPrice) ? `₹${selectedEvent.ticket_price || selectedEvent.ticketPrice}` : 'Free'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Max Attendees:</label>
                      <span>{(selectedEvent?.max_attendees || selectedEvent?.maxAttendees) || 'No limit'}</span>
                    </div>
                    <div className="detail-item full-width">
                      <label>Description:</label>
                      <span>{selectedEvent?.description}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="artwork-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="title">Title *</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="category">Category *</label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="exhibition">Exhibition</option>
                        <option value="workshop">Workshop</option>
                        <option value="seminar">Seminar</option>
                        <option value="cultural">Cultural Event</option>
                        <option value="performance">Performance</option>
                        <option value="festival">Festival</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="startDate">Start Date *</label>
                      <input
                        type="datetime-local"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="endDate">End Date</label>
                      <input
                        type="datetime-local"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="venue">Venue *</label>
                      <input
                        type="text"
                        id="venue"
                        name="venue"
                        value={formData.venue}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="ticketPrice">Ticket Price (₹)</label>
                      <input
                        type="number"
                        id="ticketPrice"
                        name="ticketPrice"
                        value={formData.ticketPrice}
                        onChange={handleInputChange}
                        placeholder="Leave empty for free events"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="maxAttendees">Max Attendees</label>
                      <input
                        type="number"
                        id="maxAttendees"
                        name="maxAttendees"
                        value={formData.maxAttendees}
                        onChange={handleInputChange}
                        placeholder="Leave empty for no limit"
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <FileUpload
                        label="Event Image"
                        onFileSelect={handleFileSelect}
                        onFileRemove={handleFileRemove}
                        currentImageUrl={formData.imageUrl}
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <VideoUpload
                        label="Event Video"
                        onFileSelect={handleVideoSelect}
                        onFileRemove={handleVideoRemove}
                        currentVideoUrl={formData.videoUrl}
                      />
                      <small style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem', display: 'block' }}>
                        Video will play on hover over the event card (MP4, WebM, OGG, MOV - Max 50MB)
                      </small>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="districtUrl">District Booking URL</label>
                      <input
                        type="url"
                        id="districtUrl"
                        name="districtUrl"
                        value={formData.districtUrl}
                        onChange={handleInputChange}
                        placeholder="https://district.app/event/..."
                      />
                      <small style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                        District app booking link for this event
                      </small>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="bookMyShowUrl">BookMyShow URL</label>
                      <input
                        type="url"
                        id="bookMyShowUrl"
                        name="bookMyShowUrl"
                        value={formData.bookMyShowUrl}
                        onChange={handleInputChange}
                        placeholder="https://in.bookmyshow.com/..."
                      />
                      <small style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                        BookMyShow booking link for this event
                      </small>
                    </div>
                    
                    <div className="form-group full-width">
                      <label htmlFor="description">Description</label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="active"
                          checked={formData.active}
                          onChange={handleInputChange}
                        />
                        Show this event to all
                      </label>
                    </div>
                  </div>
                  
                  {/* SEO Fields Component */}
                  <SEOFieldsComponent
                    seoData={{
                      metaTitle: formData.metaTitle,
                      metaDescription: formData.metaDescription,
                      metaKeywords: formData.metaKeywords,
                      slug: formData.slug,
                      ogTitle: formData.ogTitle,
                      ogDescription: formData.ogDescription,
                      ogImage: formData.ogImage
                    }}
                    onSeoChange={handleSeoChange}
                    mainTitle={formData.title}
                    mainDescription={formData.description}
                    mainCategory={formData.category}
                    type="event"
                    autoGenerate={true}
                  />
                  
                  <div className="form-actions">
                    <button type="button" onClick={closeModal} className="cancel-btn">
                      Cancel
                    </button>
                    <button type="submit" className="submit-btn">
                      {modalMode === 'create' ? 'Create Event' : 'Update Event'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default AdminEvents;

