import React, { useEffect, useRef } from 'react';
import { useNavigationWithLoading } from '../../hooks/useNavigationWithLoading';
import { useUsernameValidation } from '../ValidateUsername/ValidateUsername';
import { toast } from '../../utils/notifications.js';
import { useMobileOptimizations } from '../../hooks/useMobileOptimizations';
import Header from '../Header';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import Particles from '../Particles';
import './About.css';

// Background Images Configuration - Add your R2 URLs here
const ABOUT_BACKGROUND_IMAGES = {
  ourStory: 'https://pub-9cdd84716e0341ba9fa9c0b6875b5572.r2.dev/home/about-us-hero-banner.png', // Our Story section background
  ourMission: 'https://pub-9cdd84716e0341ba9fa9c0b6875b5572.r2.dev/home/our-mission.png', // Our Mission section background
  ourVision: 'https://pub-9cdd84716e0341ba9fa9c0b6875b5572.r2.dev/home/our-vision.png', // Our Vision section background
  authenticity: 'https://pub-9cdd84716e0341ba9fa9c0b6875b5572.r2.dev/home/Authenticity%20Card.png', // Authenticity value card
  innovation: 'https://pub-9cdd84716e0341ba9fa9c0b6875b5572.r2.dev/home/Innovation%20Card.png', // Innovation value card
  community: 'https://pub-9cdd84716e0341ba9fa9c0b6875b5572.r2.dev/home/Community%20Card.png', // Community value card
  excellence: 'https://pub-9cdd84716e0341ba9fa9c0b6875b5572.r2.dev/home/Excellence%20Card.png' // Excellence value card
};

const About = () => {
  const { navigateWithLoading } = useNavigationWithLoading();
  useUsernameValidation('about'); // Validate username in URL
  const toastShown = useRef(false);
  
  // Mobile optimization configurations
  const { particleConfig, blurConfig } = useMobileOptimizations('about');

  useEffect(() => {
    // SEO meta tags for About page
    document.title = 'About Kalakritam - Art Workshops Hyderabad | Manifesting Through Art | Traditional & Contemporary Art Classes';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about Kalakritam, Hyderabad\'s premier art workshop center. Manifesting through art with expert-led traditional and contemporary Indian art classes. Discover our mission, vision, and artistic journey.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Learn about Kalakritam, Hyderabad\'s premier art workshop center. Manifesting through art with expert-led traditional and contemporary Indian art classes. Discover our mission, vision, and artistic journey.';
      document.head.appendChild(meta);
    }

    // Keywords for About page
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'about Kalakritam, art workshops Hyderabad, art gallery history, manifesting through art, traditional art classes, contemporary art training, Indian art education, cultural heritage, art community Hyderabad, kala kritam meaning');
    } else {
      const keywords = document.createElement('meta');
      keywords.name = 'keywords';
      keywords.content = 'about Kalakritam, art workshops Hyderabad, art gallery history, manifesting through art, traditional art classes, contemporary art training, Indian art education, cultural heritage, art community Hyderabad, kala kritam meaning';
      document.head.appendChild(keywords);
    }
    
    // Welcome toast - prevent duplicates
    if (!toastShown.current) {
      toast.info('Learn about our journey', {
        description: 'Discover the story behind Kalakritam',
        duration: 3000
      });
      toastShown.current = true;
    }
  }, []);

  return (
    <div className="about-container">
      {/* Particles Background */}
      <div className="about-particles-background">
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
      
      {/* Blur Overlay Layer - Optimized for mobile */}
      <div 
        className="about-blur-overlay"
        style={{
          backdropFilter: blurConfig.backdropFilter,
          background: blurConfig.background
        }}
      ></div>
      
      {/* Video Logo */}
      <VideoLogo />
      
      <Header currentPage="about" />
      
      <main className="about-content">
        <section className="about-hero">
          <h1 className="about-title">About Kalakritam</h1>
          <p className="about-subtitle">Hyderabad's Premier Art Workshop Center & Cultural Heritage Hub</p>
        </section>

        <section className="about-story">
          <div className="story-background-image" style={{ backgroundImage: ABOUT_BACKGROUND_IMAGES.ourStory ? `url(${ABOUT_BACKGROUND_IMAGES.ourStory})` : 'none' }}></div>
          <div className="story-content">
            <h2>Our Story - Manifesting Creativity Through Art Workshops in Hyderabad</h2>
            <p>
              <strong>Kalakritam</strong>, derived from the Sanskrit words <em>kala</em> (art/skill) and <em>kritam</em> (creation/work), 
              embodies our philosophy of <strong>manifesting through art</strong>. Established as Hyderabad's premier destination 
              for <strong>art workshops</strong> and cultural learning, we bridge traditional Indian artistry with contemporary 
              expressions, serving as a vibrant cultural hub for art lovers, collectors, and creators across Telangana and beyond.
            </p>
            <p>
              Our unique <strong>art workshops in Hyderabad</strong> mainly happen on weekends in cozy cafes and restaurants, 
              creating an inspiring atmosphere for creativity. We feature expert instructors and comprehensive workshop experiences 
              spanning various Indian art forms, regional styles, and contemporary techniques. From ancient temple art methods to 
              modern creative workshops, Kalakritam offers an immersive weekend experience in India's artistic journey through 
              hands-on learning, cultural appreciation, and creative expression. We believe in <strong>manifesting through art </strong> 
              as a pathway to personal growth and cultural understanding.
            </p>
          </div>
        </section>

        <section className="mission-vision">
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-background-image" style={{ backgroundImage: ABOUT_BACKGROUND_IMAGES.ourMission ? `url(${ABOUT_BACKGROUND_IMAGES.ourMission})` : 'none' }}></div>
              <div className="mission-content-wrapper">
                <h3>Our Mission</h3>
              <p>To provide world-class <strong>art workshops in Hyderabad</strong> that preserve, promote, and celebrate Indian art forms 
              while fostering a vibrant community of artists, students, and art enthusiasts. Our weekend workshops in cafes and restaurants 
              create unique spaces for <strong>manifesting through art</strong> by offering comprehensive workshop experiences, cultural heritage 
              appreciation, and creative expression opportunities for learners of all ages and skill levels.</p>
              </div>
            </div>
            <div className="mission-card">
              <div className="mission-background-image" style={{ backgroundImage: ABOUT_BACKGROUND_IMAGES.ourVision ? `url(${ABOUT_BACKGROUND_IMAGES.ourVision})` : 'none' }}></div>
              <div className="mission-content-wrapper">
                <h3>Our Vision - Leading Art Education in Hyderabad</h3>
              <p>To be Hyderabad's premier destination for weekend art workshops, cultural exchange, and creative learning, 
              bridging traditional artistry with contemporary expression for future generations. We envision a thriving 
              artistic community where students, artists, and cultural enthusiasts unite in <strong>manifesting through art </strong> 
              through our unique cafe and restaurant workshop experiences, celebrating India's rich cultural heritage.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-background-image" style={{ backgroundImage: ABOUT_BACKGROUND_IMAGES.authenticity ? `url(${ABOUT_BACKGROUND_IMAGES.authenticity})` : 'none' }}></div>
              <div className="value-content-wrapper">
                <h4>Authenticity</h4>
              <p>We honor the authentic traditions and techniques passed down through generations of master artists.</p>
              </div>
            </div>
            <div className="value-item">
              <div className="value-background-image" style={{ backgroundImage: ABOUT_BACKGROUND_IMAGES.innovation ? `url(${ABOUT_BACKGROUND_IMAGES.innovation})` : 'none' }}></div>
              <div className="value-content-wrapper">
                <h4>Innovation</h4>
              <p>We embrace contemporary interpretations and new artistic expressions while respecting traditional roots.</p>
              </div>
            </div>
            <div className="value-item">
              <div className="value-background-image" style={{ backgroundImage: ABOUT_BACKGROUND_IMAGES.community ? `url(${ABOUT_BACKGROUND_IMAGES.community})` : 'none' }}></div>
              <div className="value-content-wrapper">
                <h4>Community</h4>
              <p>We foster a inclusive community where artists and art lovers can connect, learn, and grow together.</p>
              </div>
            </div>
            <div className="value-item">
              <div className="value-background-image" style={{ backgroundImage: ABOUT_BACKGROUND_IMAGES.excellence ? `url(${ABOUT_BACKGROUND_IMAGES.excellence})` : 'none' }}></div>
              <div className="value-content-wrapper">
                <h4>Excellence</h4>
              <p>We maintain the highest standards in curating, preserving, and presenting artworks to the public.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="team-section">
          <h2>Our Team</h2>
          <p className="team-intro">
            Our dedicated team of curators, art historians, and cultural experts work tirelessly to bring you the finest 
            in Indian art and cultural heritage. Together, we are committed to making art accessible and meaningful 
            for everyone who walks through our doors.
          </p>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
