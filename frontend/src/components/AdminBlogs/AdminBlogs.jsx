import React, { useState, useEffect } from 'react';
import { toast } from '../../utils/notifications.js';
import AdminHeader from '../AdminHeader';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import SEOFieldsComponent from '../SEOFieldsComponent';
import FileUpload from '../FileUpload';
import AdminLoading from '../AdminLoading';
import { blogsApi, uploadApi } from '../../lib/adminApi';
import { config } from '../../config/environment';
import '../AdminGallery/AdminGallery.css';
import './AdminBlogs.css';

const AdminBlogs = () => {
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
  };

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    category: '',
    tags: '',
    imageUrl: '',
    published: false,
    featured: false,
    readTime: '',
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
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogsApi.getAll();
      
      if (response.success) {
        setBlogs(response.data || []);
      } else {
        setError('Failed to load blogs');
        setBlogs([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      author: '',
      category: '',
      tags: '',
      imageUrl: '',
      published: false,
      featured: false,
      readTime: '',
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

  const handleEdit = (blog) => {
    // Format date for input field
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    setFormData({
      title: blog.title || '',
      content: blog.content || '',
      excerpt: blog.excerpt || '',
      author: blog.author || '',
      category: blog.category || '',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''),
      imageUrl: blog.image_url || '',
      published: blog.published !== false,
      featured: blog.featured || false,
      readTime: blog.read_time || '',
      // SEO fields
      metaTitle: blog.meta_title || '',
      metaDescription: blog.meta_description || '',
      metaKeywords: blog.meta_keywords || '',
      slug: blog.slug || '',
      ogTitle: blog.og_title || '',
      ogDescription: blog.og_description || '',
      ogImage: blog.og_image || ''
    });
    setImageFile(null);
    setSelectedBlog(blog);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (blog) => {
    setSelectedBlog(blog);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDelete = async (blogId) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      await blogsApi.delete(blogId);
      setBlogs(blogs.filter(blog => blog.id !== blogId));
      toast.success('Blog deleted successfully');
    } catch (err) {
      console.error('Error deleting blog:', err);
      toast.error('Failed to delete blog');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const loadingId = toast.dataSaving(`${modalMode === 'create' ? 'Creating' : 'Updating'} blog...`);
      
      let imageUrl = formData.imageUrl; // Use existing image URL if no new file
      
      // If there's a new image file to upload
      if (imageFile) {
        try {
          toast.info('Uploading image to R2 storage...');
          const uploadResult = await uploadApi.uploadImage(imageFile, 'blogs');
          
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
      const tagsArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
      
      const blogData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        author: formData.author,
        category: formData.category,
        tags: tagsArray,
        image_url: imageUrl || '',
        published: formData.published,
        featured: formData.featured,
        read_time: formData.readTime,
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
        result = await blogsApi.create(blogData);
      } else {
        // Include old image URL for deletion if a new image was uploaded
        const updateData = {
          ...blogData,
          oldImageUrl: (imageFile && selectedBlog?.imageUrl) ? selectedBlog.imageUrl : undefined
        };
        result = await blogsApi.update(selectedBlog.id, updateData);
      }

      toast.dismiss(loadingId);
      toast.success(`Blog ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
      setIsModalOpen(false);
      fetchBlogs(); // Refresh the list
    } catch (err) {
      if (typeof loadingId !== 'undefined') toast.dismiss(loadingId);
      console.error('Error saving blog:', err);
      toast.error(`Failed to ${modalMode} blog: ${err.message}`);
    }
  };

  // File handling functions
  const handleFileSelect = (file) => {
    setImageFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target.result;
      setFormData(prev => ({
        ...prev,
        imageUrl: previewUrl
      }));
    };
    reader.readAsDataURL(file);
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
    setSelectedBlog(null);
    setModalMode('view');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return <AdminLoading message="Loading blogs..." />;
  }

  if (error) {
    return (
      <div className="admin-gallery-container">
        <VideoLogo />
        <AdminHeader currentPage="blogs" />
        <div className="admin-gallery-content">
          <div className="error-container">
            <h2>Unable to load blogs</h2>
            <p>{error}</p>
            <button onClick={fetchBlogs} className="retry-btn">
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
      <AdminHeader currentPage="blogs" />
      
      <main className="admin-gallery-content">
        <section className="admin-gallery-header">
          <div className="header-content">
            <h1 className="admin-gallery-title">Blog Management</h1>
            <p className="admin-gallery-subtitle">Manage Art Blog Posts & Articles</p>
          </div>
          <div className="header-actions">
            <button onClick={handleCreate} className="create-btn">
              + Add New Blog Post
            </button>
            <div className="gallery-stats">
              <span className="stat">Total: {blogs.length}</span>
              <span className="stat">Published: {blogs.filter(b => b.isPublished).length}</span>
            </div>
          </div>
        </section>

        <section className="artworks-table-section">
          <div className="table-container">
            <table className="artworks-table">
              <thead>
                <tr>
                  <th>Featured Image</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Published</th>
                  <th>Read Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map(blog => (
                  <tr key={blog.id}>
                    <td>
                      <div className="artwork-image-cell">
                        <img 
                          src={blog.image_url} 
                          alt={blog.title}
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
                    <td className="blog-title-cell">
                      <div className="blog-title">{blog.title}</div>
                      <div className="blog-excerpt">{truncateText(blog.excerpt, 60)}</div>
                    </td>
                    <td>{blog.author}</td>
                    <td>
                      <span className="category-badge">{blog.category}</span>
                    </td>
                    <td>{formatDate(blog.createdAt)}</td>
                    <td className="read-time-cell">{blog.read_time || 'N/A'}</td>
                    <td>
                      <div className="status-badges">
                        {blog.isPublished && <span className="status-badge available">Published</span>}
                        {!blog.isPublished && <span className="status-badge draft">Draft</span>}
                        {blog.isFeatured && <span className="status-badge featured">Featured</span>}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleView(blog)}
                          className="action-btn view-btn"
                          title="View Blog"
                        >
                          👁️
                        </button>
                        <button 
                          onClick={() => handleEdit(blog)}
                          className="action-btn edit-btn"
                          title="Edit Blog"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(blog.id)}
                          className="action-btn delete-btn"
                          title="Delete Blog"
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
        </section>
      </main>

      {/* Modal for Create/Edit/View */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal blog-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === 'create' && 'Add New Blog Post'}
                {modalMode === 'edit' && 'Edit Blog Post'}
                {modalMode === 'view' && 'Blog Post Details'}
              </h2>
              <button onClick={closeModal} className="modal-close-btn">×</button>
            </div>
            
            <div className="modal-content">
              {modalMode === 'view' ? (
                <div className="blog-details-view">
                  <div className="blog-header-info">
                    <h3>{selectedBlog?.title}</h3>
                    <div className="blog-meta">
                      <span>By {selectedBlog?.author}</span>
                      <span>•</span>
                      <span>{formatDate(selectedBlog?.createdAt)}</span>
                      <span>•</span>
                      <span>{selectedBlog?.readTime || 'Unknown'} read</span>
                    </div>
                  </div>
                  
                  {selectedBlog?.imageUrl && (
                    <div className="blog-featured-image">
                      <img src={selectedBlog.image_url} alt={selectedBlog.title} />
                    </div>
                  )}
                  
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Category:</label>
                      <span>{selectedBlog?.category}</span>
                    </div>
                    <div className="detail-item">
                      <label>Tags:</label>
                      <span>{selectedBlog?.tags || 'None'}</span>
                    </div>
                    <div className="detail-item full-width">
                      <label>Excerpt:</label>
                      <span>{selectedBlog?.excerpt}</span>
                    </div>
                    <div className="detail-item full-width">
                      <label>Content:</label>
                      <div className="blog-content-preview">
                        {selectedBlog?.content}
                      </div>
                    </div>

                    {/* SEO Information */}
                    {(selectedBlog?.seoTitle || selectedBlog?.seoDescription) && (
                      <>
                        <div className="detail-section-title">SEO Information</div>
                        {selectedBlog?.seoTitle && (
                          <div className="detail-item full-width">
                            <label>SEO Title:</label>
                            <span>{selectedBlog.seoTitle}</span>
                          </div>
                        )}
                        {selectedBlog?.seoDescription && (
                          <div className="detail-item full-width">
                            <label>SEO Description:</label>
                            <span>{selectedBlog.seoDescription}</span>
                          </div>
                        )}
                        {selectedBlog?.seoKeywords && (
                          <div className="detail-item full-width">
                            <label>SEO Keywords:</label>
                            <span>{selectedBlog.seoKeywords}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="blog-form">
                  <div className="form-grid">
                    <div className="form-group full-width">
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
                      <label htmlFor="author">Author *</label>
                      <input
                        type="text"
                        id="author"
                        name="author"
                        value={formData.author}
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
                        <option value="art-techniques">Art Techniques</option>
                        <option value="artist-spotlight">Artist Spotlight</option>
                        <option value="art-history">Art History</option>
                        <option value="tutorials">Tutorials</option>
                        <option value="exhibition-reviews">Exhibition Reviews</option>
                        <option value="art-news">Art News</option>
                        <option value="inspiration">Inspiration</option>
                        <option value="art-business">Art Business</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="readTime">Read Time</label>
                      <input
                        type="text"
                        id="readTime"
                        name="readTime"
                        value={formData.readTime}
                        onChange={handleInputChange}
                        placeholder="e.g., 5 min read"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="tags">Tags</label>
                      <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="painting, tutorial, beginner (comma separated)"
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <label>Featured Image</label>
                      <FileUpload
                        currentImageUrl={formData.imageUrl}
                        onFileSelect={handleFileSelect}
                        onFileRemove={handleFileRemove}
                        acceptedTypes="image/*"
                        maxSize={5}
                        label="Upload Featured Image"
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <label htmlFor="excerpt">Excerpt *</label>
                      <textarea
                        id="excerpt"
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Brief description that appears in blog listings..."
                        required
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <label htmlFor="content">Content *</label>
                      <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        rows="12"
                        placeholder="Write your blog post content here..."
                        required
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <label htmlFor="seoTitle">SEO Title</label>
                      <input
                        type="text"
                        id="seoTitle"
                        name="seoTitle"
                        value={formData.seoTitle}
                        onChange={handleInputChange}
                        placeholder="SEO optimized title for search engines"
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <label htmlFor="seoDescription">SEO Description</label>
                      <textarea
                        id="seoDescription"
                        name="seoDescription"
                        value={formData.seoDescription}
                        onChange={handleInputChange}
                        rows="2"
                        placeholder="Meta description for search engines (150-160 characters)"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="published"
                          checked={formData.published}
                          onChange={handleInputChange}
                        />
                        Published
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
                        Featured Post
                      </label>
                    </div>
                  </div>

                  <SEOFieldsComponent
                    data={formData}
                    onChange={handleSeoChange}
                    type="blog"
                  />
                  
                  <div className="form-actions">
                    <button type="button" onClick={closeModal} className="cancel-btn">
                      Cancel
                    </button>
                    <button type="submit" className="submit-btn">
                      {modalMode === 'create' ? 'Create Blog Post' : 'Update Blog Post'}
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

export default AdminBlogs;

