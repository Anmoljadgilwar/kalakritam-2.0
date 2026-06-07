import React, { useState, useEffect } from 'react';
import { toast } from '../../utils/notifications.js';
import AdminHeader from '../AdminHeader';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import FileUpload from '../FileUpload';
import AdminLoading from '../AdminLoading';
import { momentsApi, uploadApi } from '../../lib/adminApi';
import { config } from '../../config/environment';
import './AdminMoments.css';

const AdminMoments = () => {
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'create', 'edit'
  const [selectedMoment, setSelectedMoment] = useState(null);
  const [imageFiles, setImageFiles] = useState([]); // Array of files
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    event_name: '',
    photos: [] // Array of image URLs
  });

  useEffect(() => {
    fetchMoments();
  }, []);

  const fetchMoments = async (page = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await momentsApi.getAll({ page, limit: itemsPerPage });

      if (response.success) {
        // Parse photos JSON if it's a string
        const transformedData = response.data.map(moment => ({
          ...moment,
          photos: typeof moment.photos === 'string' ? JSON.parse(moment.photos) : moment.photos
        }));

        if (append) {
          setMoments(prev => [...prev, ...transformedData]);
        } else {
          setMoments(transformedData);
        }

        if (response.pagination) {
          setCurrentPage(response.pagination.page);
          setTotalPages(response.pagination.totalPages);
        }
      } else {
        setError('Failed to load moments');
      }
    } catch (err) {
      console.error('Error fetching moments:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      fetchMoments(currentPage + 1, true);
    }
  };

  const handleCreate = () => {
    setFormData({
      event_name: '',
      photos: []
    });
    setImageFiles([]);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (moment) => {
    setFormData({
      event_name: moment.event_name || '',
      photos: moment.photos || []
    });
    setImageFiles([]);
    setSelectedMoment(moment);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (moment) => {
    setSelectedMoment(moment);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDelete = async (momentId) => {
    if (!confirm('Are you sure you want to delete this moment? All photos will be deleted.')) return;

    try {
      const response = await momentsApi.delete(momentId);

      if (response.success) {
        setMoments(moments.filter(moment => moment.id !== momentId));
        toast.success('Moment deleted successfully');
      } else {
        toast.error('Failed to delete moment: ' + (response.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error deleting moment:', err);
      toast.error('Failed to delete moment: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.event_name.trim()) {
      toast.error('Please enter an event name');
      return;
    }

    if (modalMode === 'create' && imageFiles.length === 0) {
      toast.error('Please add at least one photo');
      return;
    }

    try {
      const loadingId = toast.dataSaving(`${modalMode === 'create' ? 'Creating' : 'Updating'} moment...`);

      let photoUrls = [...formData.photos]; // Keep existing photos

      // Upload new images if any
      if (imageFiles.length > 0) {
        toast.info(`Uploading ${imageFiles.length} images to R2 storage...`);

        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          try {
            const uploadResult = await uploadApi.uploadImage(file, 'moments');

            if (uploadResult.success) {
              photoUrls.push(uploadResult.data.url);
              toast.success(`Image ${i + 1}/${imageFiles.length} uploaded`);
            } else {
              throw new Error(uploadResult.message || 'Image upload failed');
            }
          } catch (uploadError) {
            toast.dismiss(loadingId);
            toast.error(`Image ${i + 1} upload failed: ${uploadError.message}`);
            return;
          }
        }
      }

      const momentData = {
        event_name: formData.event_name,
        photos: photoUrls
      };

      let response;
      if (modalMode === 'create') {
        response = await momentsApi.create(momentData);
      } else {
        // Include old photos for deletion tracking
        const updateData = {
          ...momentData,
          oldPhotos: selectedMoment?.photos || []
        };
        response = await momentsApi.update(selectedMoment.id, updateData);
      }

      toast.dismiss(loadingId);
      if (response.success) {
        toast.success(`Moment ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
        setIsModalOpen(false);
        setImageFiles([]);
        fetchMoments();
      } else {
        toast.error(`Failed to ${modalMode} moment: ${response.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error saving moment:', err);
      toast.error(`Failed to ${modalMode} moment: ${err.message}`);
    }
  };

  const handleMultipleFileSelect = (files) => {
    setImageFiles(prev => [...prev, ...files]);
  };

  const handleRemoveNewFile = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingPhoto = (photoUrl) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(url => url !== photoUrl)
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMoment(null);
    setModalMode('view');
    setImageFiles([]);
  };

  if (loading) {
    return <AdminLoading message="Loading moments..." />;
  }

  if (error) {
    return (
      <div className="admin-moments-container">
        <VideoLogo />
        <AdminHeader currentPage="moments" />
        <div className="admin-moments-content">
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
    <div className="admin-moments-container">
      <VideoLogo />
      <AdminHeader currentPage="moments" />

      <main className="admin-moments-content">
        <section className="admin-moments-header">
          <div className="header-content">
            <h1 className="admin-moments-title">Moments Management</h1>
            <p className="admin-moments-subtitle">Manage Event Moments & Photos</p>
          </div>
          <div className="header-actions">
            <button onClick={handleCreate} className="create-btn">
              + Add New Moment
            </button>
            <div className="moments-stats">
              <span className="stat">Total: {moments.length}</span>
            </div>
          </div>
        </section>

        <section className="moments-table-section">
          <div className="table-container">
            <table className="moments-table">
              <thead>
                <tr>
                  <th>Event Details</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {moments.map(moment => (
                  <tr key={moment.id}>
                    <td>
                      <div className="moment-details-cell">
                        <div className="event-name-header">{moment.event_name}</div>
                        <div className="photos-preview-grid">
                          {moment.photos && moment.photos.length > 0 ? (
                            moment.photos.slice(0, 4).map((photo, index) => (
                              <img
                                key={index}
                                src={photo}
                                alt={`${moment.event_name} - Photo ${index + 1}`}
                                className="preview-image"
                              />
                            ))
                          ) : (
                            <span className="no-photos-text">No photos</span>
                          )}
                        </div>
                        {moment.photos && moment.photos.length > 4 && (
                          <span className="photo-count-badge">
                            +{moment.photos.length - 4} more photos
                          </span>
                        )}
                        {moment.photos && moment.photos.length > 0 && (
                          <span className="total-count-badge">
                            Total: {moment.photos.length} photo{moment.photos.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{new Date(moment.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleView(moment)}
                          className="action-btn view-btn"
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleEdit(moment)}
                          className="action-btn edit-btn"
                          title="Edit Moment"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(moment.id)}
                          className="action-btn delete-btn"
                          title="Delete Moment"
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

          {currentPage < totalPages && (
            <div className="load-more-container">
              <button
                className="load-more-btn"
                onClick={loadMore}
                disabled={loadingMore}
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
          <div className="admin-modal moments-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === 'create' && 'Add New Moment'}
                {modalMode === 'edit' && 'Edit Moment'}
                {modalMode === 'view' && 'Moment Details'}
              </h2>
              <button onClick={closeModal} className="modal-close-btn">×</button>
            </div>

            <div className="modal-content">
              {modalMode === 'view' ? (
                <div className="moment-details-view">
                  <div className="detail-item">
                    <label>Event Name:</label>
                    <span>{selectedMoment?.event_name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Photos ({selectedMoment?.photos?.length || 0}):</label>
                    <div className="photos-grid">
                      {selectedMoment?.photos?.map((photoUrl, index) => (
                        <img
                          key={index}
                          src={photoUrl}
                          alt={`${selectedMoment.event_name} - Photo ${index + 1}`}
                          className="photo-preview"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="moment-form">
                  <div className="form-group">
                    <label htmlFor="event_name">Event Name *</label>
                    <input
                      type="text"
                      id="event_name"
                      name="event_name"
                      value={formData.event_name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Summer Art Festival 2024"
                    />
                  </div>

                  {/* Existing Photos (for edit mode) */}
                  {modalMode === 'edit' && formData.photos.length > 0 && (
                    <div className="form-group">
                      <label>Existing Photos</label>
                      <div className="existing-photos-grid">
                        {formData.photos.map((photoUrl, index) => (
                          <div key={index} className="existing-photo-item">
                            <img src={photoUrl} alt={`Photo ${index + 1}`} />
                            <button
                              type="button"
                              className="remove-photo-btn"
                              onClick={() => handleRemoveExistingPhoto(photoUrl)}
                              title="Remove photo"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Photos Upload */}
                  <div className="form-group">
                    <label>
                      {modalMode === 'edit' ? 'Add More Photos' : 'Upload Photos *'}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleMultipleFileSelect(Array.from(e.target.files))}
                      className="file-input"
                    />
                    <p className="help-text">You can select multiple images at once</p>
                  </div>

                  {/* Preview new files */}
                  {imageFiles.length > 0 && (
                    <div className="form-group">
                      <label>New Photos to Upload ({imageFiles.length})</label>
                      <div className="new-photos-grid">
                        {imageFiles.map((file, index) => (
                          <div key={index} className="new-photo-item">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`New photo ${index + 1}`}
                            />
                            <button
                              type="button"
                              className="remove-photo-btn"
                              onClick={() => handleRemoveNewFile(index)}
                              title="Remove photo"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="form-actions">
                    <button type="button" onClick={closeModal} className="cancel-btn">
                      Cancel
                    </button>
                    <button type="submit" className="submit-btn">
                      {modalMode === 'create' ? 'Create Moment' : 'Update Moment'}
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

export default AdminMoments;
