import React, { Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LoadingProvider, useLoading } from './contexts/LoadingContext.jsx'
import { NotificationProvider } from './contexts/NotificationContext.jsx'
import Loading from './components/Loading'
import GlobalToastContainer from './components/GlobalToastContainer'
import Particles from './components/Particles'
import { measureLazyLoadTime } from './hooks/usePerformanceTracking'
import { seoManager } from './utils/seoManager.js'
import useServerConnection from './hooks/useServerConnection.js'
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

const AdminEvents = React.lazy(() => {
  const measure = measureLazyLoadTime('AdminEvents');
  return import('./components/AdminEvents').then(module => {
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



// Preload commonly visited components for better UX
const preloadComponent = (componentImport) => {
  const componentImportFunc = componentImport;
  componentImportFunc();
};

// Smart preloading strategy - reduced timeout and selective preloading
setTimeout(() => {
  // Only preload the most commonly visited components
  preloadComponent(() => import('./components/Home'));
  preloadComponent(() => import('./components/Gallery'));
}, 2000); // Reduced from 3000ms

// Optimized preloading on user interaction hints
if (typeof window !== 'undefined') {
  let preloadTimeouts = new Map();
  
  window.addEventListener('mouseover', (e) => {
    // Preload components when user hovers over navigation links
    const target = e.target.closest('a');
    if (target) {
      const href = target.getAttribute('href');
      
      // Clear existing timeout for this href
      if (preloadTimeouts.has(href)) {
        clearTimeout(preloadTimeouts.get(href));
      }
      
      // Set a small delay to avoid preloading on quick mouse movements
      const timeoutId = setTimeout(() => {
        switch (href) {
          case '/workshops':
            preloadComponent(() => import('./components/Workshops'));
            break;
        case '/artists':
          preloadComponent(() => import('./components/Artists'));
          break;
        case '/about':
          preloadComponent(() => import('./components/About'));
          break;
        case '/events':
          preloadComponent(() => import('./components/Events'));
          break;
        case '/artblogs':
          preloadComponent(() => import('./components/ArtBlogs'));
          break;
        case '/artparty':
          preloadComponent(() => import('./components/ArtParty'));
          break;
          case '/contact':
            preloadComponent(() => import('./components/Contact'));
            break;
          case '/admin/artpartyimages':
            preloadComponent(() => import('./components/AdminArtPartyImages'));
            break;
        }
        preloadTimeouts.delete(href);
      }, 300); // 300ms delay
      
      preloadTimeouts.set(href, timeoutId);
    }
  });
}

// Lazy loading fallback component
const LazyLoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#000000',
    color: '#c38f21',
    fontSize: '1.2rem',
    fontFamily: 'Samarkan, serif'
  }}>
    Loading Kalakritam...
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

const AppContent = () => {
  const { isLoading } = useLoading();

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

  return (
    <>
      {isLoading && <Loading />}
      <GlobalToastContainer />
      <Router>
        <div className="app">
          <div className="app-particles-background">
            <Particles
              particleColors={['#c38f21', '#ffffff', '#c38f21']}
              particleCount={1000}
              particleSpread={10}
              speed={0.2}
              particleBaseSize={200}
              moveParticlesOnHover={true}
              particleHoverFactor={2}
              alphaParticles={true}
              disableRotation={false}
            />
          </div>
          <div className="app-content">
            <ScrollToTop behavior="auto" />
            <LazyLoadingErrorBoundary>
              <Suspense fallback={<LazyLoadingFallback />}>
                <Routes>
                  <Route path="/" element={<IntroVideo />} />
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
                  <Route path="/artblogs" element={<ArtBlogs />} />
                  <Route path="/artparty" element={<ArtParty />} />
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
                  <Route path="/admin/artists" element={<AdminArtists />} />
                  <Route path="/admin/blogs" element={<AdminBlogs />} />
                  <Route path="/admin/contact" element={<AdminContact />} />
                  <Route path="/admin/tickets" element={<AdminTickets />} />
                  <Route path="/admin/artpartyimages" element={<AdminArtPartyImages />} />
                  
                  {/* Public Ticket Verification Routes */}
                  <Route path="/verify-ticket/:ticketId" element={<TicketVerification />} />
                  <Route path="/verify/:ticketId" element={<TicketVerification />} />
                  
                  <Route path="*" element={<Navigate to="/" replace />} />
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
    <LoadingProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </LoadingProvider>
  )
}

export default App
