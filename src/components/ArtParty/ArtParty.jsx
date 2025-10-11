import React, { useEffect, useState } from 'react';
import { useNavigationWithLoading } from '../../hooks/useNavigationWithLoading';
import Header from '../Header';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import Particles from '../Particles';
import { getMobileBlurConfig, shouldOptimizeForMobile } from '../../utils/mobileOptimizations';
import './ArtParty.css';
import ArtPartyBanner from './ArtPartyBanner';
import ApiClient from '../../utils/apiClient';
import { config } from '../../config/environment';

const ArtParty = () => {
  const { navigateWithLoading } = useNavigationWithLoading();
  const [blurConfig, setBlurConfig] = useState(getMobileBlurConfig());
  const [bannerImages, setBannerImages] = useState([]);

  useEffect(() => {
    document.title = 'Art at your party | Kalakritam';
    const metaDescription = document.querySelector('meta[name="description"]');
    const content = 'Bring Kalakritam to your celebration! Host immersive art experiences at your party, cafe, office, or community event.';
    if (metaDescription) {
      metaDescription.setAttribute('content', content);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = content;
      document.head.appendChild(meta);
    }
  }, []);

  // Fetch public ArtParty images for the banner
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const publicApi = new ApiClient(config.apiBaseUrl);
        const res = await publicApi.get('/artparty/images?featured=true');
        if (!cancelled && res?.data?.success) {
          let urls = (res.data.data || [])
            .map((item) => item.image_url)
            .filter(Boolean);
          // If no featured images, fallback to all artparty images
          if (urls.length === 0) {
            const resAll = await publicApi.get('/artparty/images');
            if (resAll?.data?.success) {
              urls = (resAll.data.data || [])
                .map((item) => item.image_url)
                .filter(Boolean);
            }
          }
          setBannerImages(urls);
        }
      } catch (e) {
        // silent fallback to placeholders
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="artparty-container">
      <div className="artparty-particles-background">
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

      <div 
        className="artparty-blur-overlay"
        style={{ backdropFilter: blurConfig.backdropFilter, background: blurConfig.background }}
      />

      <VideoLogo />
      <Header currentPage="artparty" />

      <main className="artparty-content">
        <section className="artparty-hero">
          <h1 className="artparty-title">Art at your party</h1>
          <p className="artparty-subtitle">Turn your celebration into a creative experience with Kalakritam-led art sessions.</p>
        </section>
        <div style={{ marginTop: '1rem' }}>
          <ArtPartyBanner 
            images={bannerImages.length ? bannerImages : [
              '/images/og-image.jpg',
              '/images/twitter-card.jpg'
            ]}
            height="300px"
            speedSec={15}
            gap="1px"
          />
        </div>

        {/* Details and offerings below the banner */}
        <section className="artparty-details">
          <div className="artparty-card">
            <h3>Private Events & Parties</h3>
            <p>Bring the magic of art to your celebrations — perfect for birthdays, get-togethers, corporate events, and more!</p>
            <ul>
              <li>Birthdays and house parties</li>
              <li>Friends and family get-togethers</li>
              <li>Corporate events, team outings, offsites</li>
              <li>Community gatherings, pop-ups, cafés</li>
              <li>School and college fests, clubs</li>
            </ul>
          </div>

          <div className="artparty-card">
            <h3>Activities we offer</h3>
            <ul>
              <li>Pot / Diya Painting</li>
              <li>Canvas Painting</li>
              <li>Tote Bag Painting</li>
              <li>T-shirt Painting</li>
              <li>Coaster Painting</li>
              <li>Diamond Painting</li>
              <li>Bead Bracelet Making</li>
              <li>Mouldit Charm Making</li>
              <li>Mandala Painting</li>
              <li>Block Printing on Fabric</li>
              <li>Bookmark Painting</li>
              <li>Pouch Painting</li>
              <li>Watercolor Postcards</li>
            </ul>
          </div>

          

          <div className="artparty-card">
            <h3>How booking works</h3>
            <ul>
              <li>Share your date, location, audience, and expected headcount</li>
              <li>Pick an activity (or theme) — we can help you choose</li>
              <li>We confirm the plan and bring everything needed on the day</li>
              <li>Custom branding and themes available on request</li>
              <li>Pricing depends on activity, group size, and location — get a quick quote</li>
            </ul>
            <div style={{ marginTop: '0.75rem' }}>
              <button className="artparty-btn" onClick={() => navigateWithLoading('/contact')}>
                Get a quote
              </button>
            </div>
          </div>
        </section>

        <section className="artparty-cta">
          <button className="artparty-btn" onClick={() => navigateWithLoading('/contact')}>
            Plan your art party
          </button>
          <button className="artparty-secondary-btn" onClick={() => navigateWithLoading('/workshops')}>
            Explore workshops
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ArtParty;
