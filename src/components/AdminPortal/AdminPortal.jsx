import React, { useState, useEffect } from 'react';
import AdminHeader from '../AdminHeader';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import AdminLoading from '../AdminLoading';
import { galleryApi, workshopsApi, eventsApi, artistsApi, heroBannersApi, momentsApi } from '../../lib/adminApi';
import './AdminPortal.css';

const AdminPortal = () => {
  const [stats, setStats] = useState({
    artworks: 0,
    workshops: 0,
    events: 0,
    artists: 0,
    heroBanners: 0,
    moments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [artworksRes, workshopsRes, eventsRes, artistsRes, heroBannersRes, momentsRes] = await Promise.allSettled([
        galleryApi.getArtworks(),
        workshopsApi.getAll(),
        eventsApi.getAll(),
        artistsApi.getAll(),
        heroBannersApi.getAll(),
        momentsApi.getAll()
      ]);

      // Extract counts from successful responses
      const newStats = {
        artworks: artworksRes.status === 'fulfilled' ? (artworksRes.value?.data?.length || 0) : 0,
        workshops: workshopsRes.status === 'fulfilled' ? (workshopsRes.value?.data?.length || 0) : 0,
        events: eventsRes.status === 'fulfilled' ? (eventsRes.value?.data?.length || 0) : 0,
        artists: artistsRes.status === 'fulfilled' ? (artistsRes.value?.data?.length || 0) : 0,
        heroBanners: heroBannersRes.status === 'fulfilled' ? (heroBannersRes.value?.data?.length || 0) : 0,
        moments: momentsRes.status === 'fulfilled' ? (momentsRes.value?.data?.length || 0) : 0
      };
      path: '/admin/artpartyimages',
      setStats(newStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  const adminModules = [
    {
      title: 'Financial Analytics',
      description: 'Track event profits, budgets, and ticket sales with interactive charts',
      path: '/admin/financials',
      icon: '📊',
      color: '#c38f21'
    },
    {
      title: 'Hero Banners',
      description: 'Manage home page hero banners with images or videos (16:9 ratio)',
      path: '/admin/hero-banners',
      icon: '🎬',
      color: '#c38f21'
    },
    {
      title: 'Gallery Management',
      description: 'Manage artworks, categories, and gallery content',
      path: '/admin/gallery',
      icon: '🖼️',
      color: '#d4af85'
    },
    {
      title: 'Workshop Management',
      description: 'Create and manage workshops, instructors, and enrollment',
      path: '/admin/workshops',
      icon: '🎨',
      color: '#c38f21'
    },
    {
      title: 'Event Management',
      description: 'Organize events, manage schedules and registrations',
      path: '/admin/events',
      icon: '📅',
      color: '#c38f21'
    },
    {
      title: 'Artist Management',
      description: 'Manage artist profiles, portfolios, and information',
      path: '/admin/artists',
      icon: '👨‍🎨',
      color: '#d4af85'
    },
    {
      title: 'Blog Management',
      description: 'Create and publish art blogs, manage content',
      path: '/admin/blogs',
      icon: '📝',
      color: '#c38f21'
    },
    {
      title: 'Contact Management',
      description: 'Manage contact inquiries and communication',
      path: '/admin/contact',
      icon: '📞',
      color: '#d4af85'
    },
    {
      title: 'Ticket Management',
      description: 'Generate tickets and verify ticket authenticity',
      path: '/admin/tickets',
      icon: '🎫',
      color: '#c38f21'
    }
    ,
    {
      title: 'ArtParty Images',
      description: 'Upload and manage banners for the ArtParty page',
      path: '/admin/artpartyimages',
      icon: '🖼️',
      color: '#d4af85'
    },
    {
      title: 'Moments Management',
      description: 'Upload and manage event moments photos in masonry grid',
      path: '/admin/moments',
      icon: '📸',
      color: '#c38f21'
    },
    {
      title: 'User Management',
      description: 'View and manage registered users, track activity and statistics',
      path: '/admin/users',
      icon: '👥',
      color: '#d4af85'
    }
  ];

  if (loading) {
    return <AdminLoading message="Loading admin dashboard..." />;
  }

  return (
    <div className="admin-portal-container">
      <VideoLogo />
      <AdminHeader currentPage="portal" />
      
      <main className="admin-portal-content">
        <section className="admin-portal-hero">
          <div className="admin-portal-badge">Admin Portal</div>
          <h1 className="admin-portal-title">Kalakritam Content Management</h1>
          <p className="admin-portal-subtitle">Comprehensive Administration Dashboard</p>
          <div className="admin-portal-description">
            <p>Manage all aspects of the Kalakritam website from this central dashboard. Access full CRUD operations for all content areas while maintaining the same beautiful design as the main website.</p>
          </div>
        </section>

        <section className="admin-modules-section">
          <h2>Administration Modules</h2>
          <div className="admin-modules-grid">
            {adminModules.map((module, index) => (
              <div 
                key={index}
                className="admin-module-card"
                onClick={() => window.location.href = module.path}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.location.href = module.path;
                  }
                }}
              >
                <div className="module-icon" style={{ color: module.color }}>
                  {module.icon}
                </div>
                <h3 className="module-title">{module.title}</h3>
                <p className="module-description">{module.description}</p>
                <div className="module-arrow" style={{ color: module.color }}>→</div>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-quick-stats">
          <h2>Quick Overview</h2>
          <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🎬</div>
                <div className="stat-info">
                  <span className="stat-number">{stats.heroBanners}</span>
                  <span className="stat-label">Hero Banners</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🖼️</div>
                <div className="stat-info">
                  <span className="stat-number">{stats.artworks}</span>
                  <span className="stat-label">Artworks</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎨</div>
                <div className="stat-info">
                  <span className="stat-number">{stats.workshops}</span>
                  <span className="stat-label">Workshops</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <span className="stat-number">{stats.events}</span>
                  <span className="stat-label">Events</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👨‍🎨</div>
                <div className="stat-info">
                  <span className="stat-number">{stats.artists}</span>
                  <span className="stat-label">Artists</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📸</div>
                <div className="stat-info">
                  <span className="stat-number">{stats.moments}</span>
                  <span className="stat-label">Moments</span>
                </div>
              </div>
            </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPortal;
