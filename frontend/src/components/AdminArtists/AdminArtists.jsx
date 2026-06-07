import React, { useState, useEffect } from 'react';
import { toast } from '../../utils/notifications.js';
import AdminHeader from '../AdminHeader';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import SEOFieldsComponent from '../SEOFieldsComponent';
import FileUpload from '../FileUpload';
import AdminLoading from '../AdminLoading';
import { artistsApi, uploadApi } from '../../lib/adminApi';
import { config } from '../../config/environment';
import '../AdminGallery/AdminGallery.css';
import './AdminArtists.css';

const AdminArtists = () => {
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
  };

  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const itemsPerPage = 6;
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    specialization: '',
    email: '',
    phone: '',
    website: '',
    imageUrl: '',
    socialLinks: '',
    featured: false,
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
    fetchArtists();
  }, []);

  const fetchArtists = async (page = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      const response = await artistsApi.getAll({ page, limit: itemsPerPage });
      // Handle API response structure
      const data = response.data || response || [];
      
      if (append) {
        setArtists(prev => [...prev, ...(Array.isArray(data) ? data : [])]);
      } else {
        setArtists(Array.isArray(data) ? data : []);
      }
      
      // Update pagination info
      if (response.pagination) {
        setCurrentPage(response.pagination.page);
        setTotalPages(response.pagination.totalPages);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching artists:', err);
      setError('Failed to load artists');
      if (!append) {
        setArtists([]); // Ensure artists is always an array
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      fetchArtists(currentPage + 1, true);
    }
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      bio: '',
      specialization: '',
      email: '',
      phone: '',
      website: '',
      imageUrl: '',
      socialLinks: '',
      featured: false,
      active: true
    });
    setImageFile(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (artist) => {
    setFormData({
      name: artist.name || '',
      bio: artist.bio || '',
      specialization: artist.specialization || '',
      email: artist.email || '',
      phone: artist.phone || '',
      website: artist.website || '',
      imageUrl: artist.image_url || '',
      socialLinks: typeof artist.social_links === 'object' ? JSON.stringify(artist.social_links) : (artist.social_links || ''),
      featured: artist.featured || false,
      active: artist.active !== false,
      // SEO fields
      metaTitle: artist.meta_title || '',
      metaDescription: artist.meta_description || '',
      metaKeywords: artist.meta_keywords || '',
      slug: artist.slug || '',
      ogTitle: artist.og_title || '',
      ogDescription: artist.og_description || '',
      ogImage: artist.og_image || ''
    });
    setImageFile(null);
    setSelectedArtist(artist);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (artist) => {
    setSelectedArtist(artist);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDelete = async (artistId) => {
    if (!confirm('Are you sure you want to delete this artist profile?')) return;
    
    try {
      // Find the artist to get the image URL before deleting
      const artistToDelete = artists.find(artist => artist.id === artistId);
      
      await artistsApi.delete(artistId);
      
      // If the artist had an image, try to delete it from R2
      if (artistToDelete && artistToDelete.imageUrl) {
        try {
          const imageKey = uploadApi.extractImageKey(artistToDelete.imageUrl);
          if (imageKey) {
            console.log('🗑️ Deleting R2 image:', imageKey);
            await uploadApi.deleteImage(imageKey);
            console.log('✅ R2 image deleted successfully');
          }
        } catch (imageDeleteError) {
          console.warn('⚠️ Failed to delete R2 image:', imageDeleteError);
          // Don't fail the whole operation if image deletion fails
        }
      }
      
      setArtists(artists.filter(artist => artist.id !== artistId));
      toast.success('Artist deleted successfully');
    } catch (err) {
      console.error('Error deleting artist:', err);
      toast.error('Failed to delete artist');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const loadingId = toast.dataSaving(`${modalMode === 'create' ? 'Creating' : 'Updating'} artist...`);
      
      let imageUrl = formData.imageUrl; // Use existing image URL if no new file
      let oldImageToDelete = null;
      
      // If there's a new image file to upload
      if (imageFile) {
        try {
          // If we're updating and there's an existing image, mark it for deletion
          if (modalMode === 'edit' && selectedArtist && selectedArtist.imageUrl && 
              selectedArtist.imageUrl !== formData.imageUrl) {
            oldImageToDelete = selectedArtist.imageUrl;
          }
          
          toast.info('Uploading image to R2 storage...');
          const uploadResult = await uploadApi.uploadImage(imageFile, 'artists');
          
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
      
      // Prepare data with correct field mapping for database
      let socialLinksData = '';
      try {
        if (formData.socialLinks && formData.socialLinks.trim()) {
          // Try to parse as JSON, if it fails, keep as string
          socialLinksData = JSON.parse(formData.socialLinks);
        }
      } catch {
        socialLinksData = formData.socialLinks;
      }

      const artistData = {
        name: formData.name,
        bio: formData.bio,
        specialization: formData.specialization,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        image_url: imageUrl || '',
        social_links: socialLinksData,
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
      
      let result;
      if (modalMode === 'create') {
        result = await artistsApi.create(artistData);
      } else {
        // Include old image URL for deletion if a new image was uploaded
        const updateData = {
          ...artistData,
          oldImageUrl: (imageFile && selectedArtist?.imageUrl) ? selectedArtist.imageUrl : undefined
        };
        result = await artistsApi.update(selectedArtist.id, updateData);
      }

      toast.dismiss(loadingId);
      toast.success(`Artist ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
      setIsModalOpen(false);
      fetchArtists(); // Refresh the list
    } catch (err) {
      if (typeof loadingId !== 'undefined') toast.dismiss(loadingId);
      console.error('Error saving artist:', err);
      toast.error(`Failed to ${modalMode} artist: ${err.message}`);
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
    setSelectedArtist(null);
    setModalMode('view');
  };

  if (loading) {
    return <AdminLoading message="Loading artists..." />;
  }

  if (error) {
    return (
      <div className="admin-gallery-container">
        <VideoLogo />
        <AdminHeader currentPage="artists" />
        <div className="admin-gallery-content">
          <div className="error-container">
            <h2>Unable to load artists</h2>
            <p>{error}</p>
            <button onClick={fetchArtists} className="retry-btn">
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
      <AdminHeader currentPage="artists" />
      
      <main className="admin-gallery-content">
        <section className="admin-gallery-header">
          <div className="header-content">
            <h1 className="admin-gallery-title">Artist Management</h1>
            <p className="admin-gallery-subtitle">Manage Artist Profiles & Portfolios</p>
          </div>
          <div className="header-actions">
            <button onClick={handleCreate} className="create-btn">
              + Add New Artist
            </button>
            <div className="gallery-stats">
              <span className="stat">Total: {artists.length}</span>
              <span className="stat">Active: {artists.filter(a => a.isActive).length}</span>
            </div>
          </div>
        </section>

        <section className="artworks-table-section">
          <div className="table-container">
            <table className="artworks-table">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Location</th>
                  <th>Experience</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {artists.map(artist => (
                  <tr key={artist.id}>
                    <td>
                      <div className="artwork-image-cell">
                        <img 
                          src={artist.image_url} 
                          alt={artist.name}
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
                    <td className="artwork-title-cell">{artist.name}</td>
                    <td>
                      <span className="category-badge">{artist.specialization}</span>
                    </td>
                    <td>{artist.location}</td>
                    <td>{artist.experience}</td>
                    <td className="contact-cell">
                      <div>{artist.email}</div>
                      <div className="phone-text">{artist.phone}</div>
                    </td>
                    <td>
                      <div className="status-badges">
                        {artist.isActive && <span className="status-badge available">Active</span>}
                        {artist.featured && <span className="status-badge featured">Featured</span>}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleView(artist)}
                          className="action-btn view-btn"
                          title="View Profile"
                        >
                          👁️
                        </button>
                        <button 
                          onClick={() => handleEdit(artist)}
                          className="action-btn edit-btn"
                          title="Edit Artist"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(artist.id)}
                          className="action-btn delete-btn"
                          title="Delete Artist"
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
                {modalMode === 'create' && 'Add New Artist'}
                {modalMode === 'edit' && 'Edit Artist'}
                {modalMode === 'view' && 'Artist Profile'}
              </h2>
              <button onClick={closeModal} className="modal-close-btn">×</button>
            </div>
            
            <div className="modal-content">
              {modalMode === 'view' ? (
                <div className="artwork-details-view">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Name:</label>
                      <span>{selectedArtist?.name}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{selectedArtist?.email}</span>
                    </div>
                    <div className="detail-item">
                      <label>Phone:</label>
                      <span>{selectedArtist?.phone}</span>
                    </div>
                    <div className="detail-item">
                      <label>Specialization:</label>
                      <span>{selectedArtist?.specialization}</span>
                    </div>
                    <div className="detail-item">
                      <label>Website:</label>
                      <span>{selectedArtist?.website || 'Not provided'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Social Links:</label>
                      <span>{selectedArtist?.social_links ? JSON.stringify(selectedArtist.social_links) : 'Not provided'}</span>
                    </div>
                    <div className="detail-item full-width">
                      <label>Bio:</label>
                      <span>{selectedArtist?.bio}</span>
                    </div>

                    {/* SEO Information */}
                    {(selectedArtist?.seoTitle || selectedArtist?.seoDescription) && (
                      <>
                        <div className="detail-section-title">SEO Information</div>
                        {selectedArtist?.seoTitle && (
                          <div className="detail-item full-width">
                            <label>SEO Title:</label>
                            <span>{selectedArtist.seoTitle}</span>
                          </div>
                        )}
                        {selectedArtist?.seoDescription && (
                          <div className="detail-item full-width">
                            <label>SEO Description:</label>
                            <span>{selectedArtist.seoDescription}</span>
                          </div>
                        )}
                        {selectedArtist?.seoKeywords && (
                          <div className="detail-item full-width">
                            <label>SEO Keywords:</label>
                            <span>{selectedArtist.seoKeywords}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="artwork-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="specialization">Specialization *</label>
                      <select
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Specialization</option>
                        <option value="painter">Painter</option>
                        <option value="sculptor">Sculptor</option>
                        <option value="photographer">Photographer</option>
                        <option value="calligrapher">Calligrapher</option>
                        <option value="illustrator">Illustrator</option>
                        <option value="digital-artist">Digital Artist</option>
                        <option value="mixed-media">Mixed Media</option>
                        <option value="traditional-artist">Traditional Artist</option>
                        <option value="contemporary-artist">Contemporary Artist</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="website">Website URL</label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://artist-website.com"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="socialLinks">Social Links (JSON)</label>
                      <textarea
                        id="socialLinks"
                        name="socialLinks"
                        value={formData.socialLinks}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder='{"instagram": "https://instagram.com/artist", "facebook": "https://facebook.com/artist"}'
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <label>Profile Image</label>
                      <FileUpload
                        currentImageUrl={formData.imageUrl}
                        onFileSelect={handleFileSelect}
                        onFileRemove={handleFileRemove}
                        acceptedTypes="image/*"
                        maxSize={5}
                        label="Upload Profile Image"
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <label htmlFor="portfolioImages">Portfolio Images (URLs)</label>
                      <textarea
                        id="portfolioImages"
                        name="portfolioImages"
                        value={formData.portfolioImages}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Enter multiple image URLs separated by commas"
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <label htmlFor="bio">Artist Bio</label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Tell us about the artist's background, style, and artistic journey..."
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                        />
                        Active Artist
                      </label>
                    </div>
                    
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                        />
                        Featured Artist
                      </label>
                    </div>
                  </div>

                  <SEOFieldsComponent
                    data={formData}
                    onChange={handleSeoChange}
                    type="artist"
                  />
                  
                  <div className="form-actions">
                    <button type="button" onClick={closeModal} className="cancel-btn">
                      Cancel
                    </button>
                    <button type="submit" className="submit-btn">
                      {modalMode === 'create' ? 'Create Artist' : 'Update Artist'}
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

export default AdminArtists;

