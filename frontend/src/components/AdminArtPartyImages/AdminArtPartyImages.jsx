import React, { useEffect, useState } from 'react';
import AdminHeader from '../AdminHeader';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import AdminLoading from '../AdminLoading';
import FileUpload from '../FileUpload';
import { toast } from '../../utils/notifications.js';
import { imagesApi, uploadApi } from '../../lib/adminApi';
import { config } from '../../config/environment';
import './AdminArtPartyImages.css';

const AdminArtPartyImages = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState('view');
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await imagesApi.getAll();
      if (res.success) {
        const list = (res.data || []).map(i => ({
          ...i,
          imageUrl: config.transformImageUrl(i.image_url || i.imageUrl)
        })).filter(i => (i.category || '').toLowerCase() === 'artparty');
        setItems(list);
      } else {
        setError(res.message || 'Failed to load images');
      }
    } catch (e) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setMode('create');
    setSelected(null);
    setName('');
    setImageUrl('');
    setFile(null);
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setMode('edit');
    setSelected(item);
    setName(item.title || item.altText || '');
    setImageUrl(item.imageUrl || '');
    setFile(null);
    setIsModalOpen(true);
  };

  const handleFileSelect = (f) => {
    setFile(f);
    if (f) setImageUrl(URL.createObjectURL(f));
  };

  const handleFileRemove = () => {
    setFile(null);
    setImageUrl('');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this image?')) return;
    const res = await imagesApi.delete(id);
    if (res.success) { toast.success('Deleted'); fetchItems(); } else { toast.error(res.message || 'Failed'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Please enter a Name');
    if (mode === 'create' && !file) return toast.error('Please select an Image');

    const savingId = toast.dataSaving(`${mode === 'create' ? 'Creating' : 'Updating'} image...`);
    try {
      let finalUrl = imageUrl;
      if (file) {
        const up = await uploadApi.uploadImage(file, 'artpartyimages', name);
        if (!up.success) throw new Error(up.message || 'Upload failed');
        finalUrl = up.data.url;
      }
      const payload = {
        title: name,
        altText: name,
        category: 'artparty',
        image_url: finalUrl,
        imageUrl: finalUrl,
        ...(mode === 'edit' && file && selected?.image_url ? { oldImageUrl: selected.image_url } : {})
      };
      const res = mode === 'create' ? await imagesApi.create(payload) : await imagesApi.update(selected.id, payload);
      toast.dismiss(savingId);
      if (res.success) { toast.success(`Image ${mode === 'create' ? 'created' : 'updated'}`); setIsModalOpen(false); fetchItems(); }
      else { toast.error(res.message || 'Failed to save'); }
    } catch (err) {
      toast.dismiss(savingId);
      toast.error(err.message);
    }
  };

  if (loading) return <AdminLoading message="Loading images..." />;
  if (error) return (
    <div className="admin-gallery-container">
      <VideoLogo />
      <AdminHeader currentPage="/admin/artpartyimages" />
      <main className="admin-gallery-content">
        <div className="error-container">
          <h2>Unable to load images</h2>
          <p>{error}</p>
          <button onClick={fetchItems} className="retry-btn">Try Again</button>
        </div>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="admin-gallery-container">
      <VideoLogo />
      <AdminHeader currentPage="/admin/artpartyimages" />
      <main className="admin-gallery-content">
        <section className="admin-gallery-header">
          <div className="header-content">
            <h1 className="admin-gallery-title">ArtParty Images</h1>
            <p className="admin-gallery-subtitle">Manage banner images shown on the ArtParty page</p>
          </div>
          <div className="header-actions">
            <button onClick={openCreate} className="create-btn">+ Add Image</button>
            <div className="gallery-stats"><span className="stat">Total: {items.length}</span></div>
          </div>
        </section>

        <section className="artworks-table-section">
          <div className="table-container">
            <table className="artworks-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="artwork-image-cell">
                        <img src={item.imageUrl} alt={item.title || 'image'} className="table-artwork-image" onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextSibling.style.display='flex'; }} />
                        <div className="image-placeholder" style={{ display: 'none' }}><span>No Image</span></div>
                      </div>
                    </td>
                    <td className="artwork-title-cell">{item.title || 'Untitled'}</td>
                    <td><span className="category-badge">{item.category || 'artparty'}</span></td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn edit-btn" onClick={() => openEdit(item)} title="Edit">✏️</button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(item.id)} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{mode === 'create' ? 'Add ArtParty Image' : 'Edit ArtParty Image'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">×</button>
            </div>
            <div className="modal-content">
              <form onSubmit={handleSubmit} className="artwork-form">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <FileUpload label="Upload Image" onFileSelect={handleFileSelect} onFileRemove={handleFileRemove} currentImageUrl={imageUrl} />
                  </div>
                  <div className="form-group">
                    <label>Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., pastel-bouquet" />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-btn">Cancel</button>
                  <button type="submit" className="submit-btn">{mode === 'create' ? 'Create Image' : 'Update Image'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminArtPartyImages;
