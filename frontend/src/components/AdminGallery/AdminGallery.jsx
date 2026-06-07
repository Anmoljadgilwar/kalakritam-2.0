import React, { useState, useEffect } from 'react';
import { toast } from '../../utils/notifications.js';
import AdminHeader from '../AdminHeader';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import SEOFieldsComponent from '../SEOFieldsComponent';
import FileUpload from '../FileUpload';
import AdminLoading from '../AdminLoading';
import { galleryApi, uploadApi } from '../../lib/adminApi';
import { config } from '../../config/environment';
import './AdminGallery.css';

const AdminGallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'create', 'edit'
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const itemsPerPage = 6;
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    description: '',
    medium: '',
    dimensions: '',
    year: '',
    price: '',
    category: '',
    imageUrl: '',
    available: true,
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
    fetchArtworks();
  }, []);

  const fetchArtworks = async (page = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      const response = await galleryApi.getArtworks({ page, limit: itemsPerPage });
      
      if (response.success) {
        // Transform image URLs to handle localhost URLs
        const transformedData = response.data.map(artwork => ({
          ...artwork,
          imageUrl: config.transformImageUrl(artwork.image_url || artwork.imageUrl)
        }));
        
        if (append) {
          setArtworks(prev => [...prev, ...transformedData]);
        } else {
          setArtworks(transformedData);
        }
        
        // Update pagination info
        if (response.pagination) {
          setCurrentPage(response.pagination.page);
          setTotalPages(response.pagination.totalPages);
        }
      } else {
        setError('Failed to load artworks');
      }
    } catch (err) {
      console.error('Error fetching artworks:', err);
      setError('Failed to connect to server');
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

  const handleCreate = () => {
    setFormData({
      title: '',
      artist: '',
      description: '',
      medium: '',
      dimensions: '',
      year: '',
      price: '',
      category: '',
      imageUrl: '',
      available: true,
    });
    setImageFile(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (artwork) => {
    setFormData({
      title: artwork.title || '',
      artist: artwork.artist || '',
      description: artwork.description || '',
      medium: artwork.medium || '',
      dimensions: artwork.dimensions || '',
      year: artwork.year || '',
      price: artwork.price || '',
      category: artwork.category || '',
      imageUrl: artwork.imageUrl || '',
      available: artwork.available !== false,
      // SEO fields
      metaTitle: artwork.metaTitle || '',
      metaDescription: artwork.metaDescription || '',
      metaKeywords: artwork.metaKeywords || '',
      slug: artwork.slug || '',
      ogTitle: artwork.ogTitle || '',
      ogDescription: artwork.ogDescription || '',
      ogImage: artwork.ogImage || ''
    });
    setImageFile(null);
    setSelectedArtwork(artwork);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (artwork) => {
    setSelectedArtwork(artwork);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDelete = async (artworkId) => {
    if (!confirm('Are you sure you want to delete this artwork?')) return;
    
    try {
      const response = await galleryApi.deleteArtwork(artworkId);
      
      if (response.success) {
        setArtworks(artworks.filter(artwork => artwork.id !== artworkId));
        toast.success('Artwork deleted successfully');
      } else {
        toast.error('Failed to delete artwork: ' + (response.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error deleting artwork:', err);
      toast.error('Failed to delete artwork: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Capture form values immediately from the form element to avoid React state race conditions
    const form = e.target;
    
    // Get raw year value and log it for debugging
    const rawYearValue = form.year.value;
    console.log('🔍 Raw year input value:', {
      rawValue: rawYearValue,
      rawType: typeof rawYearValue,
      rawIsEmpty: rawYearValue === '',
      formDataYear: formData.year
    });
    
    const formValues = {
      title: form.title.value,
      artist: form.artist.value,
      description: form.description.value,
      medium: form.medium.value,
      dimensions: form.dimensions.value,
      year: rawYearValue,  // Keep as string, will parse later
      price: form.price.value,
      category: form.category.value,
      available: form.available.checked,
      metaTitle: formData.metaTitle,
      metaDescription: formData.metaDescription,
      metaKeywords: formData.metaKeywords,
      slug: formData.slug,
      ogTitle: formData.ogTitle,
      ogDescription: formData.ogDescription,
      ogImage: formData.ogImage
    };
    
    try {
      const loadingId = toast.dataSaving(`${modalMode === 'create' ? 'Creating' : 'Updating'} artwork...`);
      
      let imageUrl = formData.imageUrl; // Use existing image URL if no new file
      
      // If there's a new image file to upload
      if (imageFile) {
        try {
          toast.info('Uploading image to R2 storage...');
          const uploadResult = await uploadApi.uploadImage(imageFile, 'artworks');
          
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
      
      // Match the exact database schema from Neon
      const artworkData = {
        // Required/basic fields
        title: formValues.title || "Untitled Artwork",
        description: formValues.description || null,
        
        // Artist fields (database has both artist_id and artist)
        artist_id: null, // We don't have artist management yet, so null
        artist: formValues.artist || null, // This will be the artist name as text
        
        // Artwork details
        category: formValues.category || null,
        medium: formValues.medium || null,
        dimensions: formValues.dimensions || null,
        year: formValues.year && formValues.year !== '' ? parseInt(formValues.year, 10) : null,
        price: formValues.price && formValues.price !== '' ? parseFloat(formValues.price) : null,
        
        // Image fields (now with actual R2 URL)
        image_url: imageUrl || null,
        imageUrl: imageUrl || null,
        thumbnail_url: null, // We don't handle thumbnails yet
        
        // Status fields
        available: formValues.available !== false,
        
        // SEO/Meta fields
        meta_title: formValues.metaTitle || (formValues.title ? `${formValues.title} - Original Artwork | Kalakritam` : null),
        meta_description: formValues.metaDescription || (formValues.title && formValues.description ? 
          `Discover "${formValues.title}" - ${formValues.description}. Explore unique artworks and cultural heritage at Kalakritam's online gallery.` : null),
        meta_keywords: formValues.metaKeywords || "kalakritam, art, culture, traditional art, contemporary art, artwork, painting, sculpture, gallery, art collection",
        slug: formValues.slug || (formValues.title ? formValues.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : null),
        og_title: formValues.ogTitle || (formValues.title ? `${formValues.title} - Discover Original Artwork` : null),
        og_description: formValues.ogDescription || (formValues.title && formValues.description ? 
          `Experience "${formValues.title}" and explore the rich world of art and culture at Kalakritam. ${formValues.description}` : null),
        og_image: formValues.ogImage || imageUrl || null
        
        // Note: id, created_at, updated_at are auto-generated by the database
      };
      
      console.log('📤 Submitting artwork data:', {
        year: artworkData.year,
        yearType: typeof artworkData.year,
        yearIsNull: artworkData.year === null,
        formValuesYear: formValues.year,
        formValuesYearType: typeof formValues.year,
        allData: artworkData
      });
      
      let response;
      if (modalMode === 'create') {
        response = await galleryApi.addArtwork(artworkData);
      } else {
        // Include old image URL for deletion if a new image was uploaded
        const updateData = {
          ...artworkData,
          oldImageUrl: (imageFile && selectedArtwork?.image_url) ? selectedArtwork.image_url : undefined
        };
        response = await galleryApi.updateArtwork(selectedArtwork.id, updateData);
      }
      
      toast.dismiss(loadingId);
      if (response.success) {
        toast.success(`Artwork ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
        setIsModalOpen(false);
        setImageFile(null); // Clear the selected file
        fetchArtworks(); // Refresh the list
      } else {
        toast.error(`Failed to ${modalMode} artwork: ${response.message || 'Unknown error'}`);
      }
    } catch (err) {
      if (typeof loadingId !== 'undefined') toast.dismiss(loadingId);
      console.error('Error saving artwork:', err);
      toast.error(`Failed to ${modalMode} artwork: ${err.message}`);
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
    // If we're editing an existing artwork, we might want to keep track of the original URL
    // but for now, this will clear it completely
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
    setSelectedArtwork(null);
    setModalMode('view');
  };

  if (loading) {
    return <AdminLoading message="Loading artworks..." />;
  }

  if (error) {
    return (
      <div className="admin-gallery-container">
        <VideoLogo />
        <AdminHeader currentPage="gallery" />
        <div className="admin-gallery-content">
          <div className="error-container">
            <h2>Unable to load artworks</h2>
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
    <div className="admin-gallery-container">
      <VideoLogo />
      <AdminHeader currentPage="gallery" />
      
      <main className="admin-gallery-content">
        <section className="admin-gallery-header">
          <div className="header-content">
            <h1 className="admin-gallery-title">Gallery Management</h1>
            <p className="admin-gallery-subtitle">Manage Artworks & Gallery Content</p>
          </div>
          <div className="header-actions">
            <button onClick={handleCreate} className="create-btn">
              + Add New Artwork
            </button>
            <div className="gallery-stats">
              <span className="stat">Total: {artworks.length}</span>
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
                  <th>Artist</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {artworks.map(artwork => (
                  <tr key={artwork.id}>
                    <td>
                      <div className="artwork-image-cell">
                        <img 
                          src={artwork.imageUrl} 
                          alt={artwork.title}
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
                    <td className="artwork-title-cell">{artwork.title}</td>
                    <td>{artwork.artist}</td>
                    <td>
                      <span className="category-badge">{artwork.category}</span>
                    </td>
                    <td className="price-cell">{artwork.price}</td>
                    <td>{artwork.year}</td>
                    <td>
                      <div className="status-badges">
                        {artwork.available ? (
                          <span className="status-badge available">Available</span>
                        ) : (
                          <span className="status-badge unavailable">Unavailable</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleView(artwork)}
                          className="action-btn view-btn"
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button 
                          onClick={() => handleEdit(artwork)}
                          className="action-btn edit-btn"
                          title="Edit Artwork"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(artwork.id)}
                          className="action-btn delete-btn"
                          title="Delete Artwork"
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
                {modalMode === 'create' && 'Add New Artwork'}
                {modalMode === 'edit' && 'Edit Artwork'}
                {modalMode === 'view' && 'Artwork Details'}
              </h2>
              <button onClick={closeModal} className="modal-close-btn">×</button>
            </div>
            
            <div className="modal-content">
              {modalMode === 'view' ? (
                <div className="artwork-details-view">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Title:</label>
                      <span>{selectedArtwork?.title}</span>
                    </div>
                    <div className="detail-item">
                      <label>Artist:</label>
                      <span>{selectedArtwork?.artist}</span>
                    </div>
                    <div className="detail-item">
                      <label>Category:</label>
                      <span>{selectedArtwork?.category}</span>
                    </div>
                    <div className="detail-item">
                      <label>Medium:</label>
                      <span>{selectedArtwork?.medium}</span>
                    </div>
                    <div className="detail-item">
                      <label>Dimensions:</label>
                      <span>{selectedArtwork?.dimensions}</span>
                    </div>
                    <div className="detail-item">
                      <label>Year:</label>
                      <span>{selectedArtwork?.year}</span>
                    </div>
                    <div className="detail-item">
                      <label>Price:</label>
                      <span>{selectedArtwork?.price}</span>
                    </div>
                    <div className="detail-item">
                      <label>Description:</label>
                      <span>{selectedArtwork?.description}</span>
                    </div>
                    
                    {/* SEO Information in View Mode */}
                    {(selectedArtwork?.metaTitle || selectedArtwork?.metaDescription || selectedArtwork?.slug) && (
                      <div className="seo-section">
                        <h4 className="seo-section-title">SEO Information</h4>
                        {selectedArtwork?.metaTitle && (
                          <div className="detail-item">
                            <label>Meta Title:</label>
                            <span>{selectedArtwork.metaTitle}</span>
                          </div>
                        )}
                        {selectedArtwork?.metaDescription && (
                          <div className="detail-item">
                            <label>Meta Description:</label>
                            <span>{selectedArtwork.metaDescription}</span>
                          </div>
                        )}
                        {selectedArtwork?.slug && (
                          <div className="detail-item">
                            <label>URL Slug:</label>
                            <span>{selectedArtwork.slug}</span>
                          </div>
                        )}
                        {selectedArtwork?.metaKeywords && (
                          <div className="detail-item">
                            <label>Keywords:</label>
                            <span>{selectedArtwork.metaKeywords}</span>
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
                      <label htmlFor="artist">Artist *</label>
                      <input
                        type="text"
                        id="artist"
                        name="artist"
                        value={formData.artist}
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
                        <option value="painting">Painting</option>
                        <option value="sculpture">Sculpture</option>
                        <option value="traditional">Traditional</option>
                        <option value="contemporary">Contemporary</option>
                        <option value="abstract">Abstract</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="medium">Medium</label>
                      <input
                        type="text"
                        id="medium"
                        name="medium"
                        value={formData.medium}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="dimensions">Dimensions</label>
                      <input
                        type="text"
                        id="dimensions"
                        name="dimensions"
                        value={formData.dimensions}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="year">Year</label>
                      <input
                        type="text"
                        id="year"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        placeholder="e.g., 2000"
                        pattern="[0-9]*"
                        inputMode="numeric"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="price">Price</label>
                      <input
                        type="text"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <FileUpload
                        label="Artwork Image"
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
                          name="available"
                          checked={formData.available}
                          onChange={handleInputChange}
                        />
                        Available for Purchase
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
                    type="artwork"
                    autoGenerate={true}
                  />
                  
                  <div className="form-actions">
                    <button type="button" onClick={closeModal} className="cancel-btn">
                      Cancel
                    </button>
                    <button type="submit" className="submit-btn">
                      {modalMode === 'create' ? 'Create Artwork' : 'Update Artwork'}
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

export default AdminGallery;
