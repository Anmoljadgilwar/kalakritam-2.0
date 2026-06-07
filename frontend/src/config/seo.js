// SEO and Performance Configuration for Kalakritam

// Meta tags configuration for SEO
export const seoMetaTags = {
  title: 'Kalakritam',
  description: 'Join Kalakritam weekend art workshops in Hyderabad. Learn traditional Indian art, contemporary painting in cozy cafes and restaurants. Expert-led classes for all levels.',
  keywords: 'Kalakritam, art workshops Hyderabad, painting classes Hyderabad, weekend art workshops, traditional art classes, contemporary art training, Indian art education, art workshops in cafes, manifesting through art, kala kritam',
  author: 'Kalakritam',
  robots: 'index, follow',
  language: 'en',
  viewport: 'width=device-width, initial-scale=1.0',
  
  // Open Graph Tags
  ogTitle: 'Kalakritam',
  ogDescription: 'Join weekend art workshops in Hyderabad cafes and restaurants. Expert-led traditional & contemporary art classes for all levels.',
  ogImage: 'https://kalakritam.in/images/og-image.jpg',
  ogUrl: 'https://kalakritam.in',
  ogType: 'website',
  ogSiteName: 'Kalakritam',
  
  // Twitter Card Tags
  twitterCard: 'summary_large_image',
  twitterTitle: 'Kalakritam',
  twitterDescription: 'Weekend art workshops in cafes and restaurants across Hyderabad. Traditional & contemporary art classes.',
  twitterImage: 'https://kalakritam.in/images/twitter-card.jpg',
  
  // Additional Meta Tags
  canonical: 'https://kalakritam.in',
  alternate: {
    'en': 'https://kalakritam.in',
    'hi': 'https://kalakritam.in/hi',
    'te': 'https://kalakritam.in/te'
  }
};

// Structured Data Schema for Local Business
export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://kalakritam.in/#organization",
      "name": "Kalakritam",
      "url": "https://kalakritam.in",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kalakritam.in/images/logo.png"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-7032201999",
        "contactType": "customer service",
        "email": "contact@kalakritam.in"
      },
      "sameAs": [
        "https://instagram.com/kalakritam.in",
        "https://facebook.com/kalakritam"
      ]
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://kalakritam.in/#localbusiness",
      "name": "Kalakritam Art Workshops",
      "description": "Weekend art workshops in Hyderabad cafes and restaurants. Traditional and contemporary Indian art classes for all skill levels.",
      "url": "https://kalakritam.in",
      "telephone": "+91-7032201999",
      "email": "contact@kalakritam.in",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Hyderabad",
        "addressRegion": "Telangana",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "17.3850",
        "longitude": "78.4867"
      },
      "openingHours": "Sa-Su 10:00-18:00",
      "priceRange": "₹₹",
      "category": "Art Workshop",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Art Workshop Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Traditional Art Workshops",
              "description": "Learn traditional Indian art techniques in weekend workshops"
            }
          },
          {
            "@type": "Offer", 
            "itemOffered": {
              "@type": "Service",
              "name": "Contemporary Art Classes",
              "description": "Modern art techniques and contemporary painting workshops"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service", 
              "name": "Group Workshop Sessions",
              "description": "Group art workshops in cafes and restaurants across Hyderabad"
            }
          }
        ]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://kalakritam.in/#website",
      "url": "https://kalakritam.in",
      "name": "Kalakritam",
      "description": "Art Workshops in Hyderabad",
      "publisher": {
        "@id": "https://kalakritam.in/#organization"
      },
      "potentialAction": [
        {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://kalakritam.in/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      ]
    }
  ]
};

// Performance optimization settings
export const performanceConfig = {
  prefetch: [
    '/',
    '/about',
    '/workshops',
    '/gallery',
    '/contact'
  ],
  preload: [
    '/intro-video.mp4'
  ],
  critical: [
    // CSS is bundled by Vite and injected automatically
  ]
};

export default {
  seoMetaTags,
  structuredData,
  performanceConfig
};
