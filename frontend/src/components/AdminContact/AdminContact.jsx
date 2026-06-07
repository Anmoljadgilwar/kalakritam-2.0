import React, { useState, useEffect } from 'react';
import { toast } from '../../utils/notifications.js';
import AdminHeader from '../AdminHeader';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import AdminLoading from '../AdminLoading';
import { contactsApi } from '../../lib/adminApi';
import { config } from '../../config/environment';
import '../AdminGallery/AdminGallery.css';
import './AdminContact.css';

const AdminContact = () => {
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
  };

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await contactsApi.getAll();
      
      if (response.success) {
        setInquiries(response.data || []);
      } else {
        // Handle API response that might not have success field
        const data = response.data || response || [];
        setInquiries(Array.isArray(data) ? data : []);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching inquiries:', err);
      setError('Failed to load inquiries');
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (inquiry) => {
    setSelectedInquiry(inquiry);
    setModalMode('view');
    setIsModalOpen(true);
    
    // Mark as read if unread
    if (inquiry.status === 'unread') {
      updateInquiryStatus(inquiry.id, 'read');
    }
  };

  const handleReply = (inquiry) => {
    setSelectedInquiry(inquiry);
    setModalMode('reply');
    setIsModalOpen(true);
  };

  const updateInquiryStatus = async (inquiryId, status) => {
    try {
      await contactsApi.update(inquiryId, { status, is_read: status === 'read' });
      setInquiries(inquiries.map(inquiry => 
        inquiry.id === inquiryId ? { ...inquiry, status, is_read: status === 'read' } : inquiry
      ));
    } catch (err) {
      console.error('Error updating inquiry status:', err);
    }
  };

  const handleDelete = async (inquiryId) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    
    try {
      await contactsApi.delete(inquiryId);
      setInquiries(inquiries.filter(inquiry => inquiry.id !== inquiryId));
      toast.success('Inquiry deleted successfully');
    } catch (err) {
      console.error('Error deleting inquiry:', err);
      toast.error('Failed to delete inquiry');
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const replyData = {
      to: selectedInquiry.email,
      subject: formData.get('subject'),
      message: formData.get('message')
    };
    
    try {
      const result = await contactsApi.reply(replyData);
      
      if (result.success) {
        toast.success('Reply sent successfully');
        updateInquiryStatus(selectedInquiry.id, 'replied');
        setIsModalOpen(false);
      } else {
        toast.error('Failed to send reply');
      }
    } catch (err) {
      console.error('Error sending reply:', err);
      toast.error('Failed to send reply');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInquiry(null);
    setModalMode('view');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread': return '#f59e0b';
      case 'read': return '#3b82f6';
      case 'replied': return '#10b981';
      case 'archived': return '#6b7280';
      default: return '#9ca3af';
    }
  };

  const filteredInquiries = filterStatus === 'all' 
    ? inquiries 
    : inquiries.filter(inquiry => inquiry.status === filterStatus);

  const stats = {
    total: inquiries.length,
    unread: inquiries.filter(i => i.status === 'unread').length,
    read: inquiries.filter(i => i.status === 'read').length,
    replied: inquiries.filter(i => i.status === 'replied').length
  };

  if (loading) {
    return <AdminLoading message="Loading inquiries..." />;
  }

  if (error) {
    return (
      <div className="admin-gallery-container">
        <VideoLogo />
        <AdminHeader currentPage="contact" />
        <div className="admin-gallery-content">
          <div className="error-container">
            <h2>Unable to load inquiries</h2>
            <p>{error}</p>
            <button onClick={fetchInquiries} className="retry-btn">
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
      <AdminHeader currentPage="contact" />
      
      <main className="admin-gallery-content">
        <section className="admin-gallery-header">
          <div className="header-content">
            <h1 className="admin-gallery-title">Contact Management</h1>
            <p className="admin-gallery-subtitle">Manage Customer Inquiries & Messages</p>
          </div>
          <div className="header-actions">
            <div className="contact-stats">
              <span className="stat">Total: {stats.total}</span>
              <span className="stat unread">Unread: {stats.unread}</span>
              <span className="stat">Replied: {stats.replied}</span>
            </div>
          </div>
        </section>

        <section className="contact-filters-section">
          <div className="filter-controls">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Inquiries</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </section>

        <section className="artworks-table-section">
          <div className="table-container">
            <table className="artworks-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map(inquiry => (
                  <tr key={inquiry.id} className={inquiry.status === 'unread' ? 'unread-row' : ''}>
                    <td className="date-cell">{formatDate(inquiry.createdAt)}</td>
                    <td className="name-cell">{inquiry.name}</td>
                    <td className="email-cell">{inquiry.email}</td>
                    <td className="subject-cell">
                      <div className="subject-text">{inquiry.subject}</div>
                      <div className="message-preview">{inquiry.message.substring(0, 60)}...</div>
                    </td>
                    <td>
                      <span className="inquiry-type-badge">{inquiry.inquiryType || 'General'}</span>
                    </td>
                    <td>
                      <span 
                        className="status-badge inquiry-status"
                        style={{ backgroundColor: `${getStatusColor(inquiry.status)}20`, color: getStatusColor(inquiry.status) }}
                      >
                        {inquiry.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleView(inquiry)}
                          className="action-btn view-btn"
                          title="View Inquiry"
                        >
                          👁️
                        </button>
                        <button 
                          onClick={() => handleReply(inquiry)}
                          className="action-btn reply-btn"
                          title="Reply"
                        >
                          ↩️
                        </button>
                        <select 
                          value={inquiry.status}
                          onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                          className="status-select"
                          title="Update Status"
                        >
                          <option value="unread">Unread</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                          <option value="archived">Archived</option>
                        </select>
                        <button 
                          onClick={() => handleDelete(inquiry.id)}
                          className="action-btn delete-btn"
                          title="Delete Inquiry"
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

      {/* Modal for View/Reply */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal contact-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === 'view' && 'Inquiry Details'}
                {modalMode === 'reply' && 'Reply to Inquiry'}
              </h2>
              <button onClick={closeModal} className="modal-close-btn">×</button>
            </div>
            
            <div className="modal-content">
              {modalMode === 'view' ? (
                <div className="inquiry-details-view">
                  <div className="inquiry-header">
                    <div className="inquiry-meta">
                      <h3>{selectedInquiry?.subject}</h3>
                      <div className="meta-info">
                        <span>From: {selectedInquiry?.name} ({selectedInquiry?.email})</span>
                        <span>Received: {formatDate(selectedInquiry?.createdAt)}</span>
                        <span>Type: {selectedInquiry?.inquiryType || 'General'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="inquiry-content">
                    <h4>Message:</h4>
                    <div className="message-content">
                      {selectedInquiry?.message}
                    </div>
                  </div>

                  {selectedInquiry?.phone && (
                    <div className="additional-info">
                      <h4>Contact Information:</h4>
                      <p><strong>Phone:</strong> {selectedInquiry.phone}</p>
                    </div>
                  )}

                  <div className="inquiry-actions">
                    <button 
                      onClick={() => setModalMode('reply')}
                      className="reply-button"
                    >
                      Reply to this Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendReply} className="reply-form">
                  <div className="reply-to-info">
                    <p><strong>Replying to:</strong> {selectedInquiry?.name} ({selectedInquiry?.email})</p>
                    <p><strong>Original Subject:</strong> {selectedInquiry?.subject}</p>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      defaultValue={`Re: ${selectedInquiry?.subject}`}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="8"
                      placeholder="Type your reply here..."
                      required
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button type="button" onClick={closeModal} className="cancel-btn">
                      Cancel
                    </button>
                    <button type="submit" className="send-btn">
                      Send Reply
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

export default AdminContact;

