import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import { config } from '../../config/environment';
import './TicketVerification.css';

const TicketVerification = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ticketId) {
      fetchTicket(ticketId);
    }
  }, [ticketId]);

  const fetchTicket = async (id) => {
    try {
      setLoading(true);
      setError('');
      console.log('🎫 Verifying ticket:', id);
      
      const response = await fetch(`${config.apiBaseUrl}/tickets/verify/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('🎫 Verification response status:', response.status);
      const data = await response.json();
      console.log('🎫 Verification response data:', data);
      
      if (response.ok && data.success) {
        // Normalize data structure to handle different API response formats
        const ticketData = data.data || data;
        const normalizedTicket = {
          // Core identifiers
          id: ticketData.id,
          ticketNumber: ticketData.ticket_number || ticketData.ticketNumber,
          
          // Customer info
          customerName: ticketData.customer_name || ticketData.customerName || 'Guest',
          customerEmail: ticketData.customer_email || ticketData.customerEmail,
          customerPhone: ticketData.customer_phone || ticketData.customerPhone,
          
          // Event info
          eventName: ticketData.event_name || ticketData.eventName || 'Kalakritam Workshop',
          venue: ticketData.venue || 'Kalakritam Art Gallery, Main Hall',
          eventTimings: ticketData.event_timings || ticketData.eventTimings || 'To be announced',
          
          // Ticket details
          numberOfTickets: ticketData.number_of_tickets || ticketData.numberOfTickets || 1,
          amountPaid: ticketData.amount_paid || ticketData.amountPaid || '500',
          status: ticketData.status || 'valid',
          
          // Timestamps
          createdAt: ticketData.created_at || ticketData.createdAt || new Date().toISOString(),
          verifiedAt: ticketData.verified_at || ticketData.verifiedAt,
          isVerified: ticketData.is_verified || ticketData.isVerified || false,
        };
        
        setTicket(normalizedTicket);
        setError('');
      } else {
        setError(data.message || 'Ticket not found or invalid');
        setTicket(null);
      }
    } catch (error) {
      console.error('❌ Error verifying ticket:', error);
      setError('Unable to verify ticket. Please check your connection and try again.');
      setTicket(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'valid':
        return '#28a745';
      case 'used':
        return '#ffc107';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'valid':
        return '✓';
      case 'used':
        return '✓';
      case 'cancelled':
        return '×';
      default:
        return '?';
    }
  };

  if (loading) {
    return (
      <div className="ticket-verification-container">
        <VideoLogo />
        <Header />
        <main className="ticket-verification-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Verifying ticket...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="ticket-verification-container">
      <VideoLogo />
      <Header />
      
      <main className="ticket-verification-content">
        <div className="verification-header">
          <h1>Ticket Verification</h1>
        </div>

        {error ? (
          <div className="verification-error">
            <div className="error-icon">⚠</div>
            <h2>Ticket Not Found</h2>
            <p>{error}</p>
            <div className="error-details">
              <p>This ticket may have been:</p>
              <ul>
                <li>Already used or verified</li>
                <li>Cancelled or invalid</li>
                <li>Entered incorrectly</li>
              </ul>
              <p>Please contact the event organizers if you believe this is an error.</p>
            </div>
          </div>
        ) : ticket ? (
          <div className="ticket-verification-success">
            <div className="ticket-status-header">
              <div className="status-icon-wrapper" style={{ background: `linear-gradient(135deg, ${getStatusColor(ticket.status)}20, ${getStatusColor(ticket.status)}40)` }}>
                <div className="status-icon-large" style={{ color: getStatusColor(ticket.status) }}>
                  {getStatusIcon(ticket.status)}
                </div>
              </div>
              <h2 className="status-title" style={{ color: getStatusColor(ticket.status) }}>
                Ticket {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
              </h2>
              <p className="status-subtitle">
                {ticket.status === 'valid' && 'Ready for entry'}
                {ticket.status === 'used' && 'Successfully verified'}
                {ticket.status === 'cancelled' && 'No longer valid'}
              </p>
            </div>

            <div className="premium-ticket-card">
                <div className="ticket-card-header">
                  <div className="ticket-card-bg"></div>
                  <div className="ticket-header-content">
                    <div className="kalakritam-brand">
                      <h3>KALAKRITAM</h3>
                      <p>Art Gallery & Cultural Center</p>
                    </div>
                    <div className="ticket-number-badge">#{ticket.ticketNumber || ticket.ticket_number}</div>
                  </div>
                </div>              <div className="ticket-card-body">
                <div className="event-info-section">
                  <h4 className="section-title">Event Information</h4>
                  <div className="event-details">
                    <div className="event-name">{ticket.eventName || ticket.event_name}</div>
                    <div className="event-meta">
                      <div className="meta-item">
                        <span className="meta-icon">●</span>
                        <span className="meta-text">{ticket.venue}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">●</span>
                        <span className="meta-text">{ticket.eventTimings || ticket.event_timings}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="customer-info-section">
                  <h4 className="section-title">Guest Information</h4>
                  <div className="info-grid-premium">
                    <div className="info-item-premium">
                      <div className="info-label-premium">Guest Name</div>
                      <div className="info-value-premium">{ticket.customerName || ticket.customer_name}</div>
                    </div>
                    <div className="info-item-premium">
                      <div className="info-label-premium">Number of Guests</div>
                      <div className="info-value-premium">{ticket.numberOfTickets || ticket.number_of_tickets} {(ticket.numberOfTickets || ticket.number_of_tickets) === 1 ? 'Person' : 'People'}</div>
                    </div>
                    <div className="info-item-premium">
                      <div className="info-label-premium">Amount Paid</div>
                      <div className="info-value-premium">₹{ticket.amountPaid || ticket.amount_paid}</div>
                    </div>
                  </div>
                </div>

                <div className="ticket-timeline-section">
                  <h4 className="section-title">Ticket Timeline</h4>
                  <div className="timeline">
                    <div className="timeline-item completed">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-title">Ticket Issued</div>
                        <div className="timeline-date">
                          {new Date(ticket.createdAt || ticket.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {ticket.isVerified && ticket.verifiedAt && (
                      <div className="timeline-item completed">
                        <div className="timeline-dot verified"></div>
                        <div className="timeline-content">
                          <div className="timeline-title">Ticket Verified</div>
                          <div className="timeline-date">
                            {new Date(ticket.verifiedAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="status-badge-section">
                  {ticket.status === 'valid' && (
                    <div className="status-badge valid">
                      <span className="badge-icon">✓</span>
                      <span className="badge-text">Valid for Entry</span>
                    </div>
                  )}
                  {ticket.status === 'used' && (
                    <div className="status-badge used">
                      <span className="badge-icon">✓</span>
                      <span className="badge-text">Entry Completed</span>
                    </div>
                  )}
                  {ticket.status === 'cancelled' && (
                    <div className="status-badge cancelled">
                      <span className="badge-icon">×</span>
                      <span className="badge-text">Ticket Cancelled</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="ticket-card-footer">
                <div className="verification-qr">
                  <div className="qr-placeholder">
                    <span>QR</span>
                  </div>
                  <p>Scan at venue</p>
                </div>
                <div className="support-info">
                  <p><strong>Need Help?</strong></p>
                  <p>info@kalakritam.com</p>
                  <p>+91-7032201999</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
      
      <Footer />
    </div>
  );
};

export default TicketVerification;
