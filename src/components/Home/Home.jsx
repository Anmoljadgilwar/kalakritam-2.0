import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useNavigationWithLoading } from '../../hooks/useNavigationWithLoading';
import { useUserAuth } from '../../contexts/UserAuthContext';
import { validateUsernameMatch, getUserPath } from '../../utils/userHelpers';
import { toast } from '../../utils/notifications.js';
import { 
  getMobileParticleConfig, 
  getMobileBlurConfig,
  shouldOptimizeForMobile,
  getNetworkOptimizations,
  getBatteryOptimizations,
  mobileMemoryOptimization
} from '../../utils/mobileOptimizations';
import { mobilePerformanceMonitor } from '../../utils/mobilePerformanceMonitor';
import Header from '../Header';
import Footer from '../Footer';
import Particles from '../Particles';
import HeroBanner from '../HeroBanner';
import TextType from './TextType';
import './Home.css';
import '../../assets/fonts/fonts.css';

const Home = () => {
  const [showVideoLogo, setShowVideoLogo] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = useParams();
  const { navigateWithLoading } = useNavigationWithLoading();
  const { isAuthenticated, user } = useUserAuth();
  const toastShown = useRef(false);
  
  // Validate username in URL matches logged-in user
  useEffect(() => {
    if (username && user) {
      const isValid = validateUsernameMatch(username, user);
      if (!isValid) {
        toast.error('Access denied. Redirecting to your home page...');
        const correctPath = getUserPath(user, 'home');
        navigate(correctPath, { replace: true });
      }
    } else if (!username && user && isAuthenticated && location.pathname === '/home') {
      // If accessing /home while logged in, redirect to personalized home
      const correctPath = getUserPath(user, 'home');
      navigate(correctPath, { replace: true });
    }
  }, [username, user, isAuthenticated, location.pathname, navigate]);
  
  // Mobile optimization states
  const [isMobile, setIsMobile] = useState(shouldOptimizeForMobile());
  const [particleConfig, setParticleConfig] = useState(getMobileParticleConfig());
  const [blurConfig, setBlurConfig] = useState(getMobileBlurConfig());
  const [networkOptimizations, setNetworkOptimizations] = useState({});
  const [batteryOptimizations, setBatteryOptimizations] = useState({});

  // Initialize mobile optimizations
  useEffect(() => {
    const initializeOptimizations = async () => {
      if (isMobile) {
        mobilePerformanceMonitor.startLoadTime();
      }
      
      const networkOpts = getNetworkOptimizations();
      const batteryOpts = await getBatteryOptimizations();
      
      setNetworkOptimizations(networkOpts);
      setBatteryOptimizations(batteryOpts);
      
      // Update particle config based on optimizations
      if (batteryOpts.disableParticles || networkOpts.delayNonCritical) {
        setParticleConfig({ ...particleConfig, particleCount: 0 });
      }
      
      if (isMobile) {
        mobilePerformanceMonitor.endLoadTime();
      }
    };
    
    initializeOptimizations();
    
    // Handle window resize for mobile detection
    const handleResize = () => {
      const newIsMobile = shouldOptimizeForMobile();
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
        setParticleConfig(getMobileParticleConfig());
        setBlurConfig(getMobileBlurConfig());
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Set up memory cleanup for mobile
    if (isMobile) {
      const cleanupInterval = setInterval(() => {
        mobileMemoryOptimization.cleanup();
      }, 30000);
      
      return () => {
        clearInterval(cleanupInterval);
        window.removeEventListener('resize', handleResize);
      };
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // Navigation handler with toast feedback
  const handleNavigation = (path, sectionName) => {
    toast.info(`Exploring ${sectionName}...`);
    navigateWithLoading(path);
  };

  useEffect(() => {
    // Welcome toast when component mounts - prevent duplicates
    if (!toastShown.current) {
      toast.success('Welcome to Kalakritam!', {
        description: 'Discover art workshops and creative experiences',
        duration: 4000
      });
      toastShown.current = true;
    }
  }, []);

  useEffect(() => {
    // Check if video was completed or if we're coming from intro
    const videoCompleted = sessionStorage.getItem('videoCompleted');
    const fromIntro = sessionStorage.getItem('fromIntro');
    
    if (videoCompleted || fromIntro) {
      setShowVideoLogo(true);
      // Set a flag that we've shown the logo
      sessionStorage.setItem('logoShown', 'true');
      // Clear the temporary flags
      sessionStorage.removeItem('videoCompleted');
      sessionStorage.removeItem('fromIntro');
    } else {
      // Check if logo was already shown in this session
      const logoShown = sessionStorage.getItem('logoShown');
      if (logoShown) {
        setShowVideoLogo(true);
      }
    }

    // SEO meta tags for art workshops in Hyderabad and Kalakritam
    document.title = 'Kalakritam - Art Workshops in Hyderabad | Traditional & Contemporary Indian Art Classes | Manifesting Through Art';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Join Kalakritam art workshops in Hyderabad. Learn traditional Indian art, contemporary painting, sculpture & crafts. Expert-led classes for all levels. Manifesting creativity through art in Hyderabad\'s premier art gallery.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Join Kalakritam art workshops in Hyderabad. Learn traditional Indian art, contemporary painting, sculpture & crafts. Expert-led classes for all levels. Manifesting creativity through art in Hyderabad\'s premier art gallery.';
      document.head.appendChild(meta);
    }

    // Keywords meta tag optimized for Hyderabad art workshops
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'Kalakritam, art workshops Hyderabad, painting classes Hyderabad, traditional art workshops, contemporary art classes, Indian art gallery Hyderabad, art training center, creative workshops, artistic learning, manifesting through art, kala kritam, art classes near me, Hyderabad art community, cultural workshops');
    } else {
      const keywords = document.createElement('meta');
      keywords.name = 'keywords';
      keywords.content = 'Kalakritam, art workshops Hyderabad, painting classes Hyderabad, traditional art workshops, contemporary art classes, Indian art gallery Hyderabad, art training center, creative workshops, artistic learning, manifesting through art, kala kritam, art classes near me, Hyderabad art community, cultural workshops';
      document.head.appendChild(keywords);
    }

    // Add Open Graph meta tags for social sharing
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      const meta = document.createElement('meta');
      meta.property = 'og:title';
      meta.content = 'Kalakritam - Art Workshops in Hyderabad | Manifesting Through Art';
      document.head.appendChild(meta);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      const meta = document.createElement('meta');
      meta.property = 'og:description';
      meta.content = 'Join Kalakritam art workshops in Hyderabad. Expert-led traditional & contemporary art classes for all levels.';
      document.head.appendChild(meta);
    }

    // Add structured data for local business
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ArtGallery",
      "name": "Kalakritam Art Gallery",
      "description": "Premier art gallery and workshop center in Hyderabad offering traditional and contemporary Indian art classes",
      "url": "https://kalakritam.in",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Hyderabad",
        "addressRegion": "Telangana",
        "addressCountry": "IN"
      },
      "offers": {
        "@type": "Service",
        "name": "Art Workshops",
        "description": "Traditional and contemporary art workshops in Hyderabad"
      },
      "slogan": "Manifesting Through Art"
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    if (!document.head.querySelector('script[type="application/ld+json"]')) {
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="home-container" data-connection={networkOptimizations.lowerQuality ? 'slow' : 'fast'}>
      {/* Particles Background - Optimized for mobile */}
      {particleConfig.particleCount > 0 && (
        <div className="home-particles-background">
          <Particles
            particleColors={['#c38f21', '#ffffff', '#c38f21']}
            particleCount={particleConfig.particleCount}
            particleSpread={particleConfig.particleSpread}
            speed={particleConfig.speed}
            particleBaseSize={particleConfig.particleBaseSize}
            moveParticlesOnHover={particleConfig.moveParticlesOnHover}
            particleHoverFactor={particleConfig.particleHoverFactor}
            alphaParticles={particleConfig.alphaParticles}
            disableRotation={particleConfig.disableRotation}
          />
        </div>
      )}
      
      {/* Blur Overlay Layer - Optimized for mobile */}
      <div 
        className="home-blur-overlay"
        style={{
          backdropFilter: blurConfig.backdropFilter,
          background: blurConfig.background
        }}
      ></div>
      
      {/* Video Logo in top-left corner */}
      {showVideoLogo && (
        <div className="video-logo-container">
          <video
            className="video-logo"
            muted
            loop
            autoPlay
            playsInline
          >
            <source src="/intro-video.mp4" type="video/mp4" />
          </video>
        </div>
      )}
      
      <Header currentPage="home" />
      
      {/* Promotional Banner with Typing Effect - Only show on home page for non-authenticated users */}
      {!isAuthenticated && !username && (location.pathname === '/home' || location.pathname === '/') ? (
        <div className="promo-banner">
          <div className="promo-banner__text">
            <TextType 
              text={[
                "Want to get free Pass worth ₹1199/- of below event?",
                "Do sign up for more details!",
                "Limited time offer - Register now!"
              ]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
              className="promo-banner__highlight"
            />
          </div>
        </div>
      ) : null}
      
      {/* Hero Banner - 16:9 ratio image/video carousel */}
      <HeroBanner />
      
      <main className="home-content">
        <section className="hero-section">
          <div className="hero-text">
            <h1 className="main-title">Kalakritam</h1>
            <h2 className="sub-title">Premier Art Workshops in Hyderabad</h2>
            <p>
              Experience the finest <strong>art workshops in Hyderabad</strong> at Kalakritam, where weekend creativity 
              meets the cozy ambiance of cafes and restaurants. Our distinguished workshop experiences blend traditional 
              <strong>kala</strong> (art) and contemporary <strong>kritam</strong> (creation) through expertly-curated, 
              instructor-led sessions held in inspiring venues across the city. Join Hyderabad's most unique art community 
              and explore your creative potential through our weekend workshop programs, cultural experiences, and artistic 
              learning sessions that bring art to life in relaxed, social settings.
            </p>
            <button 
              className="cta-button" 
              aria-label="Explore Kalakritam art workshops in Hyderabad"
              onClick={() => handleNavigation('/workshops', 'Art Workshops')}
            >
              Join Art Workshops
            </button>
          </div>
        </section>
        
        <section className="features-section">
          <h2 className="section-title">Experience Indian Art at Kalakritam - Hyderabad's Premier Art Destination</h2>
          <div className="features-grid">
            <article className="feature-card" onClick={() => handleNavigation('/gallery', 'Art Gallery')}>
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3>Traditional Kala Gallery</h3>
              <p>Explore our curated collection of traditional Indian art forms including Madhubani, Warli, 
              Tanjore paintings, and classical sculptures. Each piece represents centuries of artistic heritage 
              and cultural significance in Indian art history.</p>
              <button className="card-cta">Explore Gallery</button>
            </article>

            <article className="feature-card" onClick={() => navigateWithLoading('/workshops')}>
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3>Art Workshops Hyderabad</h3>
              <p>Join our unique weekend <strong>art workshops in Hyderabad</strong> featuring traditional Indian techniques, 
              contemporary painting, and creative expressions. Our workshops mainly happen on weekends in cozy cafes and 
              restaurants, perfect for beginners and advanced artists seeking to explore creativity while manifesting through art.</p>
              <button className="card-cta">Join Workshops</button>
            </article>

            <article className="feature-card" onClick={() => navigateWithLoading('/events')}>
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
              </div>
              <h3>Cultural Events & Exhibitions</h3>
              <p>Attend exclusive art exhibitions, cultural festivals, and artist meetups in Hyderabad. 
              Experience live demonstrations, art competitions, and networking events that celebrate 
              Indian artistic traditions and contemporary innovations.</p>
              <button className="card-cta">View Events</button>
            </article>

            <article className="feature-card" onClick={() => navigateWithLoading('/artists')}>
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <h3>Featured Artists Community</h3>
              <p>Discover talented artists from Hyderabad and across India. Meet master craftsmen, 
              contemporary creators, and emerging talents who are manifesting their vision through art. 
              Connect with Kalakritam's vibrant artistic community.</p>
              <button className="card-cta">Meet Artists</button>
            </article>

            <article className="feature-card" onClick={() => navigateWithLoading('/artblogs')}>
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
              </div>
              <h3>Art Blogs & Learning Resources</h3>
              <p>Read insightful articles about Indian art techniques, workshop tutorials, artist interviews, 
              and cultural heritage stories. Enhance your artistic knowledge with our comprehensive blog 
              covering traditional and contemporary art forms.</p>
              <button className="card-cta">Read Blogs</button>
            </article>

            <article className="feature-card" onClick={() => navigateWithLoading('/contact')}>
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 00 18.54 8H16.8l-.86-2.58A1.5 1.5 0 00 14.52 4h-5.04c-.66 0-1.26.42-1.42 1.42L7.2 8H5.46c-.66 0-1.26.42-1.42 1.37L1.5 16H4v6h16z"/>
                </svg>
              </div>
              <h3>Join Kalakritam Community</h3>
              <p>Connect with Hyderabad's most vibrant art community. Share your passion for Indian art, 
              participate in collaborative projects, and discover opportunities for artistic growth 
              in our supportive creative environment.</p>
              <button className="card-cta">Get Connected</button>
            </article>
          </div>
        </section>

        <section className="about-section">
          <h2>About Kalakritam - Hyderabad's Premier Art Workshop Center | Manifesting Through Art</h2>
          <p>
            <strong>Kalakritam</strong>, derived from the Sanskrit words <em>kala</em> (art/skill) and <em>kritam</em> (creation/work), 
            represents our commitment to <strong>manifesting through art</strong> in Hyderabad's vibrant cultural landscape. 
            Founded with the vision of bridging traditional Indian artistry with contemporary expressions, Kalakritam serves 
            as a distinguished cultural hub for art enthusiasts, collectors, and creators across Telangana and beyond.
          </p>
          <p>
            Kalakritam stands as a beacon of artistic excellence, where traditional techniques meet innovative methodologies. 
            Our philosophy centers on the belief that art is not merely a skill but a transformative journey of self-discovery 
            and cultural appreciation. Through our carefully structured programs, we nurture artistic talent while preserving 
            the rich heritage of Indian art forms, ensuring that each student experiences the profound joy of 
            <strong>manifesting through art</strong> in its purest form.
          </p>
          <div className="cta-section">
            <button 
              className="secondary-cta" 
              onClick={() => navigateWithLoading('/about')}
              aria-label="Learn more about Kalakritam art workshops"
            >
              Learn More About Us
            </button>
            <button 
              className="primary-cta" 
              onClick={() => navigateWithLoading('/contact')}
              aria-label="Contact Kalakritam for art workshop enrollment"
            >
              Enroll in Workshops
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
