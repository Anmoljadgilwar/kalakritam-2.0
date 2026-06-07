import React, { useState, useEffect } from 'react';
import { toast } from '../../utils/notifications.js';
import AdminHeader from '../AdminHeader';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import SEOFieldsComponent from '../SEOFieldsComponent';
import FileUpload from '../FileUpload';
import AdminLoading from '../AdminLoading';
import { workshopsApi, uploadApi } from '../../lib/adminApi';
import { config } from '../../config/environment';
import '../AdminGallery/AdminGallery.css';
import './AdminWorkshops.css';

const AdminWorkshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'create', 'edit'
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const itemsPerPage = 6;
  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    description: '',
    startDate: '',
    endDate: '',
    venue: '',
    duration: '',
    price: '',
    maxParticipants: '',
    currentParticipants: 0,
    imageUrl: '',
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
    // Check if user is authenticated before fetching data
    const token = localStorage.getItem('adminToken');
    if (!token) {
      // No token, redirect to login
      window.location.href = '/admin/login';
      return;
    }
    
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async (page = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      const response = await workshopsApi.getAll({ page, limit: itemsPerPage });
      console.log('📋 Fetched workshops:', {
        success: response.success,
        count: response.data?.length,
        firstWorkshop: response.data?.[0],
        firstWorkshopDates: {
          startDate: response.data?.[0]?.startDate,
          endDate: response.data?.[0]?.endDate,
          startDateType: typeof response.data?.[0]?.startDate,
          endDateType: typeof response.data?.[0]?.endDate
        }
      });
      
      // Handle API response structure
      const data = response.data || response || [];
      
      if (append) {
        setWorkshops(prev => [...prev, ...(Array.isArray(data) ? data : [])]);
      } else {
        setWorkshops(Array.isArray(data) ? data : []);
      }
      
      // Update pagination info
      if (response.pagination) {
        setCurrentPage(response.pagination.page);
        setTotalPages(response.pagination.totalPages);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching workshops:', err);
      setError('Failed to load workshops');
      if (!append) {
        setWorkshops([]); // Ensure workshops is always an array
      }
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

  const handleCreate = () => {
    setFormData({
      title: '',
      instructor: '',
      description: '',
      startDate: '',
      endDate: '',
      venue: '',
      duration: '',
      price: '',
      maxParticipants: '',
      currentParticipants: 0,
      imageUrl: '',
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
    setImageFile(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (workshop) => {
    // Format date for datetime-local input field  
    const formatDateTimeLocal = (dateString) => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        // Check if date is valid
        if (isNaN(date.getTime())) return '';
        
        console.log('🔄 Converting date for input:', {
          input: dateString,
          parsedDate: date.toString(),
          localDate: date.toLocaleString()
        });
        
        // Format as YYYY-MM-DDTHH:mm for datetime-local input
        // Use local timezone
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const formatted = `${year}-${month}-${day}T${hours}:${minutes}`;
        
        console.log('🔄 Formatted for input:', formatted);
        return formatted;
      } catch (error) {
        console.error('Error formatting date:', error);
        return '';
      }
    };

    console.log('✏️ Editing workshop:', {
      id: workshop.id,
      title: workshop.title,
      startDate: workshop.startDate,
      endDate: workshop.endDate
    });

    setFormData({
      title: workshop.title || '',
      instructor: workshop.instructor || '',
      description: workshop.description || '',
      startDate: formatDateTimeLocal(workshop.startDate) || '',
      endDate: formatDateTimeLocal(workshop.endDate) || '',
      venue: workshop.venue || '',
      duration: workshop.duration || '',
      price: workshop.price || '',
      maxParticipants: workshop.maxParticipants || '',
      currentParticipants: workshop.currentParticipants || 0,
      imageUrl: workshop.imageUrl || '',
      active: workshop.active !== false,
      // SEO fields
      metaTitle: workshop.metaTitle || '',
      metaDescription: workshop.metaDescription || '',
      metaKeywords: workshop.metaKeywords || '',
      slug: workshop.slug || '',
      ogTitle: workshop.ogTitle || '',
      ogDescription: workshop.ogDescription || '',
      ogImage: workshop.ogImage || ''
    });
    setImageFile(null);
    setSelectedWorkshop(workshop);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (workshop) => {
    setSelectedWorkshop(workshop);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDelete = async (workshopId) => {
    if (!confirm('Are you sure you want to delete this workshop?')) return;
    
    try {
      await workshopsApi.delete(workshopId);
      setWorkshops(workshops.filter(workshop => workshop.id !== workshopId));
      toast.success('Workshop deleted successfully');
    } catch (err) {
      console.error('Error deleting workshop:', err);
      toast.error('Failed to delete workshop');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const loadingId = toast.dataSaving(`${modalMode === 'create' ? 'Creating' : 'Updating'} workshop...`);
      
      let imageUrl = formData.imageUrl; // Use existing image URL if no new file
      
      // If there's a new image file to upload
      if (imageFile) {
        try {
          toast.info('Uploading image to R2 storage...');
          const uploadResult = await uploadApi.uploadImage(imageFile, 'workshops');
          
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
      
      // Convert datetime-local format to ISO 8601 with timezone
      const formatDateForDB = (dateTimeLocalString) => {
        if (!dateTimeLocalString) return null;
        try {
          // datetime-local gives us "YYYY-MM-DDTHH:mm" in local timezone
          // Convert to ISO 8601 format with timezone
          const date = new Date(dateTimeLocalString);
          if (isNaN(date.getTime())) return null;
          const isoString = date.toISOString(); // Returns "YYYY-MM-DDTHH:mm:ss.sssZ"
          console.log('📅 Date conversion:', { input: dateTimeLocalString, output: isoString });
          return isoString;
        } catch (error) {
          console.error('Error formatting date for database:', error);
          return null;
        }
      };
      
      console.log('📝 Form data before conversion:', {
        startDate: formData.startDate,
        endDate: formData.endDate,
        maxParticipants: formData.maxParticipants,
        maxParticipantsType: typeof formData.maxParticipants,
        price: formData.price,
        priceType: typeof formData.price
      });
      
      // Parse numeric values properly
      const parseIntSafely = (value) => {
        if (value === '' || value === null || value === undefined) return 0;
        const parsed = parseInt(String(value).trim(), 10);
        console.log('🔢 Parsing integer:', { input: value, parsed, isNaN: isNaN(parsed) });
        return isNaN(parsed) ? 0 : parsed;
      };
      
      const parseFloatSafely = (value) => {
        if (value === '' || value === null || value === undefined) return 0;
        const parsed = parseFloat(String(value).trim());
        console.log('💰 Parsing float:', { input: value, parsed, isNaN: isNaN(parsed) });
        return isNaN(parsed) ? 0 : parsed;
      };
      
      // Prepare data with correct field mapping for database
      const workshopData = {
        title: formData.title,
        instructor: formData.instructor,
        description: formData.description,
        start_date: formatDateForDB(formData.startDate),
        end_date: formatDateForDB(formData.endDate),
        venue: formData.venue,
        duration: formData.duration,
        price: parseFloatSafely(formData.price),
        max_participants: parseIntSafely(formData.maxParticipants),
        current_participants: parseIntSafely(formData.currentParticipants),
        image_url: imageUrl || '',
        featured: formData.featured,
        active: formData.active,
        // SEO fields
        meta_title: formData.metaTitle,
        meta_description: formData.metaDescription,
        meta_keywords: formData.metaKeywords,
        slug: formData.slug,
        og_title: formData.ogTitle,
        og_description: formData.ogDescription,
        og_image: formData.ogImage
      };

      console.log('📤 Sending workshop data to API:', workshopData);

      let result;
      if (modalMode === 'create') {
        result = await workshopsApi.create(workshopData);
      } else {
        // Include old image URL for deletion if a new image was uploaded
        const updateData = {
          ...workshopData,
          oldImageUrl: (imageFile && selectedWorkshop?.imageUrl) ? selectedWorkshop.imageUrl : undefined
        };
        result = await workshopsApi.update(selectedWorkshop.id, updateData);
      }

      console.log('📥 Received response from API:', result);

      toast.dismiss(loadingId);
      toast.success(`Workshop ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
      setIsModalOpen(false);
      fetchWorkshops(); // Refresh the list
    } catch (err) {
      if (typeof loadingId !== 'undefined') toast.dismiss(loadingId);
      console.error('Error saving workshop:', err);
      toast.error(`Failed to ${modalMode} workshop: ${err.message}`);
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
    setSelectedWorkshop(null);
    setModalMode('view');
  };

  if (loading) {
    return <AdminLoading message="Loading workshops..." />;
  }

  if (error) {
    return (
      <div className="admin-gallery-container">
        <VideoLogo />
        <AdminHeader currentPage="workshops" />
        <div className="admin-gallery-content">
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
    <div className="admin-gallery-container">
      <VideoLogo />
      <AdminHeader currentPage="workshops" />
      
      <main className="admin-gallery-content">
        <section className="admin-gallery-header">
          <div className="header-content">
            <h1 className="admin-gallery-title">Workshop Management</h1>
            <p className="admin-gallery-subtitle">Manage Workshops & Learning Programs</p>
          </div>
          <div className="header-actions">
            <button onClick={handleCreate} className="create-btn">
              + Add New Workshop
            </button>
            <div className="gallery-stats">
              <span className="stat">Total: {workshops.length}</span>
              <span className="stat">Active: {workshops.filter(w => w.active).length}</span>
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
                  <th>Instructor</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Level</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {workshops.map(workshop => (
                  <tr key={workshop.id}>
                    <td>
                      <div className="artwork-image-cell">
                        <img 
                          src={workshop.imageUrl} 
                          alt={workshop.title}
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
                    <td className="artwork-title-cell">{workshop.title}</td>
                    <td>{workshop.instructor}</td>
                    <td>{workshop.duration}</td>
                    <td className="price-cell">₹{workshop.price}</td>
                    <td>
                      <span className="category-badge">{workshop.level || 'All Levels'}</span>
                    </td>
                    <td>
                      <div className="status-badges">
                        {workshop.active && <span className="status-badge available">Active</span>}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleView(workshop)}
                          className="action-btn view-btn"
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button 
                          onClick={() => handleEdit(workshop)}
                          className="action-btn edit-btn"
                          title="Edit Workshop"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(workshop.id)}
                          className="action-btn delete-btn"
                          title="Delete Workshop"
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
                {modalMode === 'create' && 'Add New Workshop'}
                {modalMode === 'edit' && 'Edit Workshop'}
                {modalMode === 'view' && 'Workshop Details'}
              </h2>
              <button onClick={closeModal} className="modal-close-btn">×</button>
            </div>
            
            <div className="modal-content">
              {modalMode === 'view' ? (
                <div className="artwork-details-view">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Title:</label>
                      <span>{selectedWorkshop?.title}</span>
                    </div>
                    <div className="detail-item">
                      <label>Instructor:</label>
                      <span>{selectedWorkshop?.instructor}</span>
                    </div>
                    <div className="detail-item">
                      <label>Duration:</label>
                      <span>{selectedWorkshop?.duration}</span>
                    </div>
                    <div className="detail-item">
                      <label>Price:</label>
                      <span>₹{selectedWorkshop?.price}</span>
                    </div>
                    <div className="detail-item">
                      <label>Start Date:</label>
                      <span>{selectedWorkshop?.startDate ? new Date(selectedWorkshop.startDate).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      }) : 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>End Date:</label>
                      <span>{selectedWorkshop?.endDate ? new Date(selectedWorkshop.endDate).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      }) : 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Max Participants:</label>
                      <span>{selectedWorkshop?.maxParticipants}</span>
                    </div>
                    <div className="detail-item">
                      <label>Current Participants:</label>
                      <span>{selectedWorkshop?.currentParticipants}</span>
                    </div>
                    <div className="detail-item">
                      <label>Venue:</label>
                      <span>{selectedWorkshop?.venue || 'N/A'}</span>
                    </div>
                    <div className="detail-item full-width">
                      <label>Image:</label>
                      {selectedWorkshop?.imageUrl && (
                        <img 
                          src={selectedWorkshop.imageUrl} 
                          alt={selectedWorkshop.title}
                          style={{ maxWidth: '300px', marginTop: '0.5rem', borderRadius: '8px' }}
                        />
                      )}
                    </div>
                    <div className="detail-item full-width">
                      <label>Description:</label>
                      <span>{selectedWorkshop?.description}</span>
                    </div>
                    
                    {/* SEO Information in View Mode */}
                    {(selectedWorkshop?.metaTitle || selectedWorkshop?.metaDescription || selectedWorkshop?.slug) && (
                      <div className="seo-section">
                        <h4 className="seo-section-title">SEO Information</h4>
                        {selectedWorkshop?.metaTitle && (
                          <div className="detail-item">
                            <label>Meta Title:</label>
                            <span>{selectedWorkshop.metaTitle}</span>
                          </div>
                        )}
                        {selectedWorkshop?.metaDescription && (
                          <div className="detail-item">
                            <label>Meta Description:</label>
                            <span>{selectedWorkshop.metaDescription}</span>
                          </div>
                        )}
                        {selectedWorkshop?.slug && (
                          <div className="detail-item">
                            <label>URL Slug:</label>
                            <span>{selectedWorkshop.slug}</span>
                          </div>
                        )}
                        {selectedWorkshop?.metaKeywords && (
                          <div className="detail-item">
                            <label>Keywords:</label>
                            <span>{selectedWorkshop.metaKeywords}</span>
                          </div>
                        )}
                      </div>
                    )}
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
                      <label htmlFor="instructor">Instructor *</label>
                      <input
                        type="text"
                        id="instructor"
                        name="instructor"
                        value={formData.instructor}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="duration">Duration *</label>
                      <input
                        type="text"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        placeholder="e.g., 2 hours, 3 days"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="price">Price (₹) *</label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="maxParticipants">Max Participants</label>
                      <input
                        type="number"
                        id="maxParticipants"
                        name="maxParticipants"
                        value={formData.maxParticipants}
                        onChange={handleInputChange}
                        min="0"
                        step="1"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="currentParticipants">Current Participants</label>
                      <input
                        type="number"
                        id="currentParticipants"
                        name="currentParticipants"
                        value={formData.currentParticipants}
                        onChange={handleInputChange}
                        min="0"
                        step="1"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="startDate">Start Date</label>
                      <input
                        type="datetime-local"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
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
                    
                    <div className="form-group full-width">
                      <label htmlFor="venue">Venue</label>
                      <input
                        type="text"
                        id="venue"
                        name="venue"
                        value={formData.venue}
                        onChange={handleInputChange}
                        placeholder="e.g., Art Studio, Cafe Name"
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <FileUpload
                        label="Workshop Image"
                        onFileSelect={handleFileSelect}
                        onFileRemove={handleFileRemove}
                        currentImageUrl={formData.imageUrl}
                      />
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
                        Active
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
                    type="workshop"
                    autoGenerate={true}
                  />
                  
                  <div className="form-actions">
                    <button type="button" onClick={closeModal} className="cancel-btn">
                      Cancel
                    </button>
                    <button type="submit" className="submit-btn">
                      {modalMode === 'create' ? 'Create Workshop' : 'Update Workshop'}
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

export default AdminWorkshops;

