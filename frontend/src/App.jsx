import React, { Suspense, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import RequireAuth from './components/RequireAuth'
import GuestOnly from './components/GuestOnly'
import { LoadingProvider, useLoading } from './contexts/LoadingContext.jsx'
import { UserAuthProvider } from './contexts/UserAuthContext.jsx'
import Loading from './components/Loading'
// Particles removed - pages load their own if needed
import { measureLazyLoadTime } from './hooks/usePerformanceTracking'
import { seoManager } from './utils/seoManager.js'
import useServerConnection from './hooks/useServerConnection.js'
import { updateSpeculationRules } from './utils/pageOptimizationScript.js'
import { isMobile } from './utils/mobileOptimizations.js'
import { preloadRouteChunks } from './utils/chunkPreloader.js'
import './App.css'
import ScrollToTop from './components/ScrollToTop.jsx'

// Lazy load all components for better performance with performance tracking
const IntroVideo = React.lazy(() => {
  const measure = measureLazyLoadTime('IntroVideo');
  return import('./components/IntroVideo').then(module => {
    measure();
    return module;
  });
});

const Home = React.lazy(() => {
  const measure = measureLazyLoadTime('Home');
  return import('./components/Home').then(module => {
    measure();
    return module;
  });
});

const Gallery = React.lazy(() => {
  const measure = measureLazyLoadTime('Gallery');
  return import('./components/Gallery').then(module => {
    measure();
    return module;
  });
});

const Workshops = React.lazy(() => {
  const measure = measureLazyLoadTime('Workshops');
  return import('./components/Workshops').then(module => {
    measure();
    return module;
  });
});

const WorkshopDetail = React.lazy(() => {
  const measure = measureLazyLoadTime('WorkshopDetail');
  return import('./components/WorkshopDetail').then(module => {
    measure();
    return module;
  });
});

const Artists = React.lazy(() => {
  const measure = measureLazyLoadTime('Artists');
  return import('./components/Artists').then(module => {
    measure();
    return module;
  });
});

const Contact = React.lazy(() => {
  const measure = measureLazyLoadTime('Contact');
  return import('./components/Contact').then(module => {
    measure();
    return module;
  });
});

const About = React.lazy(() => {
  const measure = measureLazyLoadTime('About');
  return import('./components/About').then(module => {
    measure();
    return module;
  });
});

const Events = React.lazy(() => {
  const measure = measureLazyLoadTime('Events');
  return import('./components/Events').then(module => {
    measure();
    return module;
  });
});

const EventDetail = React.lazy(() => {
  const measure = measureLazyLoadTime('EventDetail');
  return import('./components/EventDetail').then(module => {
    measure();
    return module;
  });
});

const ArtBlogs = React.lazy(() => {
  const measure = measureLazyLoadTime('ArtBlogs');
  return import('./components/ArtBlogs').then(module => {
    measure();
    return module;
  });
});

const ArtParty = React.lazy(() => {
  const measure = measureLazyLoadTime('ArtParty');
  return import('./components/ArtParty').then(module => {
    measure();
    return module;
  });
});

const PrivacyPolicy = React.lazy(() => {
  const measure = measureLazyLoadTime('PrivacyPolicy');
  return import('./components/PrivacyPolicy').then(module => {
    measure();
    return module;
  });
});

const TermsOfService = React.lazy(() => {
  const measure = measureLazyLoadTime('TermsOfService');
  return import('./components/TermsOfService').then(module => {
    measure();
    return module;
  });
});

const AdminLogin = React.lazy(() => {
  const measure = measureLazyLoadTime('AdminLogin');
  return import('./components/AdminLogin').then(module => {
    measure();
    return module;
  });
});

const AdminPortal = React.lazy(() => {
  const measure = measureLazyLoadTime('AdminPortal');
  return import('./components/AdminPortal').then(module => {
    measure();
    return module;
  });
});

const AdminGallery = React.lazy(() => {
  const measure = measureLazyLoadTime('AdminGallery');
  return import('./components/AdminGallery').then(module => {
    measure();
    return module;
  });
});

const AdminWorkshops = React.lazy(() => {
  const measure = measureLazyLoadTime('AdminWorkshops');
  return import('./components/AdminWorkshops').then(module => {
    measure();
    return module;
  });
});

const AdminHeroBanners = React.lazy(() => {
  const measure = measureLazyLoadTime('AdminHeroBanners');
  return import('./components/AdminHeroBanners').then(module => {
    measure();
    return module;
  });
});

const AdminEvents = React.lazy(() => {
  const measure = measureLazyLoadTime('AdminEvents');
  return import('./components/AdminEvents').then(module => {
    measure();
    return module;
  });
});

const AdminFinancials = React.lazy(() => {
  const measure = measureLazyLoadTime('AdminFinancials');
  return import('./components/AdminFinancials').then(module => {
    measure();
    return module;
  });
});

const AdminArtists = React.lazy(() => {
  const measure = measureLazyLoadTime('AdminArtists');
  return import('./components/AdminArtists').then(module => {
    measure();
    return module;
  });
});

const AdminBlogs = React.lazy(() => {
  const measure = measureLazyLoadTime('AdminBlogs');
  return import('./components/AdminBlogs').then(module => {
    measure();
    return module;
  });
});

const AdminContact = React.lazy(() => {
  const measure = measureLazyLoadTime('AdminContact');
  return import('./components/AdminContact').then(module => {
    measure();
    return module;
  });
});

const AdminTickets = React.lazy(() => {
  const measure = measureLazyLoadTime('AdminTickets');
  return import('./components/AdminTickets').then(module => {
    measure();
    return module;
  });
});

const AdminArtPartyImages = React.lazy(() => {
  const measure = measureLazyLoadTime('AdminArtPartyImages');
  return import('./components/AdminArtPartyImages').then(module => {
    measure();
    return module;
  });
});

const Moments = React.lazy(() => {
  const measure = measureLazyLoadTime('Moments');
  return import('./components/Moments').then(module => {
    measure();
    return module;
  });
});

const AdminMoments = React.lazy(() => {
  const measure = measureLazyLoadTime('AdminMoments');
  return import('./components/AdminMoments').then(module => {
    measure();
    return module;
  });
});

const ToastDemo = React.lazy(() => {
  const measure = measureLazyLoadTime('ToastDemo');
  return import('./components/ToastDemo').then(module => {
    measure();
    return module;
  });
});

// Artwork detail dynamic page
const ArtworkDetail = React.lazy(() => {
  const measure = measureLazyLoadTime('ArtworkDetail');
  return import('./components/ArtworkDetail/ArtworkDetail.jsx').then(module => {
    measure();
    return module;
  });
});

// Preload commonly visited components for better UX

const TicketVerification = React.lazy(() => {
  const measure = measureLazyLoadTime('TicketVerification');
  return import('./components/TicketVerification').then(module => {
    measure();
    return module;
  });
});

// User Authentication Components
const UserLogin = React.lazy(() => {
  const measure = measureLazyLoadTime('UserLogin');
  return import('./components/UserLogin').then(module => {
    measure();
    return module;
  });
});

const UserDashboard = React.lazy(() => {
  const measure = measureLazyLoadTime('UserDashboard');
  return import('./components/UserDashboard').then(module => {
    measure();
    return module;
  });
});

const AdminUsers = React.lazy(() => {
  const measure = measureLazyLoadTime('AdminUsers');
  return import('./components/AdminUsers').then(module => {
    measure();
    return module;
  });
});

const NotFound = React.lazy(() => {
  const measure = measureLazyLoadTime('NotFound');
  return import('./components/NotFound').then(module => {
    measure();
    return module;
  });
});

// Optimized preloading - only preload on hover with debounce
let preloadTimeout = null;
const handleLinkHover = (route) => {
  if (preloadTimeout) {
    clearTimeout(preloadTimeout);
  }
  preloadTimeout = setTimeout(() => {
    preloadRouteChunks(route);
  }, 300); // 300ms debounce
};

// Preloading disabled - pages load only when navigated to
// Hover preloading still available via handleLinkHover function

// Lazy loading fallback component - minimal loader without text
const LazyLoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#002f2f',
    color: '#c38f21'
  }}>
    {/* No loading text - just blank screen matching intro video background */}
  </div>
)

// Error boundary for lazy loading errors
class LazyLoadingErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: '#000000',
          color: '#c38f21',
          textAlign: 'center',
          fontFamily: 'Samarkan, serif'
        }}>
          <h2>Something went wrong loading this page</h2>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              background: '#c38f21',
              color: '#000000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Component to handle page optimizations like speculation rules
const PageOptimizer = () => {
  const location = useLocation();

  useEffect(() => {
    updateSpeculationRules();
  }, [location.pathname]);

  return null;
};

const AppContent = () => {
  const { isLoading, loadingMessage } = useLoading();
  const [showParticles, setShowParticles] = useState(false);
  const [homeBlurred, setHomeBlurred] = useState(true);
  const [showHome, setShowHome] = useState(false);

  // Initialize server connection monitoring
  const serverConnection = useServerConnection({
    checkInterval: 30000, // Check every 30 seconds
    timeout: 8000, // 8 second timeout
    retryAttempts: 3,
    retryDelay: 2000,
    endpoints: ['/api/health', '/api/status', '/'], // Health check endpoints
    onConnect: () => {
      console.log('Server connection established');
    },
    onDisconnect: (error) => {
      console.warn('Server connection lost:', error);
    },
    onError: (error) => {
      console.error('Server connection error:', error);
    }
  });

  // Hover preloading DISABLED - pages load ONLY when clicked
  // This ensures minimal initial load

  // Check if video has been completed
  useEffect(() => {
    const videoCompleted = sessionStorage.getItem('videoCompleted');
    const isTransitioning = sessionStorage.getItem('videoTransitioning');
    
    if (videoCompleted === 'true') {
      setShowParticles(true);
      setHomeBlurred(false);
      setShowHome(true);
    } else if (isTransitioning === 'true') {
      // During transition, show home but keep it blurred
      setShowHome(true);
      setHomeBlurred(true);
    }

    // Listen for storage changes (when video completes)
    const handleStorageChange = () => {
      const videoCompleted = sessionStorage.getItem('videoCompleted');
      const isTransitioning = sessionStorage.getItem('videoTransitioning');
      
      if (videoCompleted === 'true') {
        setShowParticles(true);
        setHomeBlurred(false);
        setShowHome(true);
      } else if (isTransitioning === 'true') {
        setShowHome(true);
        setHomeBlurred(true);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check on route changes
    const checkInterval = setInterval(() => {
      const videoCompleted = sessionStorage.getItem('videoCompleted');
      const isTransitioning = sessionStorage.getItem('videoTransitioning');
      
      if (videoCompleted === 'true' && !showParticles) {
        setShowParticles(true);
        setHomeBlurred(false);
        setShowHome(true);
      } else if (isTransitioning === 'true' && !showHome) {
        setShowHome(true);
        setHomeBlurred(true);
      }
    }, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(checkInterval);
    };
  }, [showParticles, showHome]);

  // Check if on mobile device - don't render particles on mobile for performance
  const isOnMobile = isMobile();

  return (
    <>
      {isLoading && <Loading message={loadingMessage} />}
      <Router>
        <PageOptimizer />
        <div className="app">
          {/* Global Particles DISABLED - Each page loads its own if needed */}
          {/* This prevents loading Particles component on every page */}
          
          {/* Background Home DISABLED - was causing 300+ requests on initial load */}
          
          <div className="app-content">
            <ScrollToTop behavior="auto" />
            <LazyLoadingErrorBoundary>
              <Suspense fallback={<LazyLoadingFallback />}>
                <Routes>
                  <Route path="/" element={<IntroVideo />} />
                  <Route path="/intro" element={<IntroVideo />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/gallery/:slug" element={<ArtworkDetail />} />
                  <Route path="/workshops" element={<Workshops />} />
                  <Route path="/workshops/:slug" element={<WorkshopDetail />} />
                  <Route path="/artists" element={<Artists />} />
                  <Route path="/arts" element={<Navigate to="/artists" replace />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:slug" element={<EventDetail />} />
                  <Route path="/artblogs" element={<ArtBlogs />} />
                  <Route path="/artparty" element={<ArtParty />} />
                  <Route path="/moments" element={<Moments />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  
                  {/* Demo Routes (for development/testing) */}
                  <Route path="/toast-demo" element={<ToastDemo />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/portal" element={<AdminPortal />} />
                  <Route path="/admin/gallery" element={<AdminGallery />} />
                  <Route path="/admin/workshops" element={<AdminWorkshops />} />
                  <Route path="/admin/events" element={<AdminEvents />} />
                  <Route path="/admin/financials" element={<AdminFinancials />} />
                  <Route path="/admin/artists" element={<AdminArtists />} />
                  <Route path="/admin/blogs" element={<AdminBlogs />} />
                  <Route path="/admin/contact" element={<AdminContact />} />
                  <Route path="/admin/tickets" element={<AdminTickets />} />
                  <Route path="/admin/artpartyimages" element={<AdminArtPartyImages />} />
                  <Route path="/admin/moments" element={<AdminMoments />} />
                  <Route path="/admin/hero-banners" element={<AdminHeroBanners />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  
                  {/* Public Ticket Verification Routes */}
                  <Route path="/verify-ticket/:ticketId" element={<TicketVerification />} />
                  <Route path="/verify/:ticketId" element={<TicketVerification />} />
                  
                  {/* User Authentication Routes with guards */}
                  <Route path="/user/login" element={<GuestOnly><UserLogin /></GuestOnly>} />
                  <Route path="/user/signup" element={<GuestOnly><UserLogin /></GuestOnly>} />
                  <Route path="/user/dashboard" element={<RequireAuth><UserDashboard /></RequireAuth>} />
                  
                  {/* Username-based routes for logged-in users - MUST be at the end to avoid conflicts */}
                  <Route path="/u/:username/home" element={<RequireAuth><Home /></RequireAuth>} />
                  <Route path="/u/:username/dashboard" element={<RequireAuth><UserDashboard /></RequireAuth>} />
                  <Route path="/u/:username/gallery" element={<RequireAuth><Gallery /></RequireAuth>} />
                  <Route path="/u/:username/gallery/:slug" element={<RequireAuth><ArtworkDetail /></RequireAuth>} />
                  <Route path="/u/:username/workshops" element={<RequireAuth><Workshops /></RequireAuth>} />
                  <Route path="/u/:username/workshops/:slug" element={<RequireAuth><WorkshopDetail /></RequireAuth>} />
                  <Route path="/u/:username/contact" element={<RequireAuth><Contact /></RequireAuth>} />
                  <Route path="/u/:username/about" element={<RequireAuth><About /></RequireAuth>} />
                  <Route path="/u/:username/events" element={<RequireAuth><Events /></RequireAuth>} />
                  <Route path="/u/:username/events/:slug" element={<RequireAuth><EventDetail /></RequireAuth>} />
                  <Route path="/u/:username/artblogs" element={<RequireAuth><ArtBlogs /></RequireAuth>} />
                  <Route path="/u/:username/artists" element={<RequireAuth><Artists /></RequireAuth>} />
                  <Route path="/u/:username/artparty" element={<RequireAuth><ArtParty /></RequireAuth>} />
                  <Route path="/u/:username/moments" element={<RequireAuth><Moments /></RequireAuth>} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </LazyLoadingErrorBoundary>
          </div>
        </div>
      </Router>
    </>
  );
};

function App() {
  // Initialize SEO manager on app load
  useEffect(() => {
    seoManager.init();
  }, []);

  return (
    <HelmetProvider>
      <LoadingProvider>
        <UserAuthProvider>
          <AppContent />
        </UserAuthProvider>
      </LoadingProvider>
    </HelmetProvider>
  )
}

export default App
