// SEO Manager - Centralized SEO management for Kalakritam
import { seoMetaTags, structuredData } from '../config/seo.js';

export class SEOManager {
  constructor() {
    this.defaultTitle = seoMetaTags.title;
    this.defaultDescription = seoMetaTags.description;
    this.siteName = 'Kalakritam';
    this.baseUrl = 'https://kalakritam.in';
  }

  // Set page-specific meta tags
  setPageMeta(options = {}) {
    const {
      title,
      description,
      keywords,
      canonical,
      ogTitle,
      ogDescription,
      ogImage,
      ogUrl,
      twitterTitle,
      twitterDescription,
      twitterImage,
      noIndex = false
    } = options;

    // Set document title
    document.title = title || this.defaultTitle;

    // Set meta description
    this.updateMetaTag('name', 'description', description || this.defaultDescription);

    // Set keywords
    if (keywords) {
      this.updateMetaTag('name', 'keywords', keywords);
    }

    // Set robots
    this.updateMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Set canonical URL
    this.updateLinkTag('canonical', canonical || window.location.href);

    // Open Graph tags
    this.updateMetaTag('property', 'og:title', ogTitle || title || this.defaultTitle);
    this.updateMetaTag('property', 'og:description', ogDescription || description || this.defaultDescription);
    this.updateMetaTag('property', 'og:image', ogImage || `${this.baseUrl}/images/og-image.jpg`);
    this.updateMetaTag('property', 'og:url', ogUrl || window.location.href);
    this.updateMetaTag('property', 'og:type', 'website');
    this.updateMetaTag('property', 'og:site_name', this.siteName);

    // Twitter Card tags
    this.updateMetaTag('name', 'twitter:card', 'summary_large_image');
    this.updateMetaTag('name', 'twitter:title', twitterTitle || title || this.defaultTitle);
    this.updateMetaTag('name', 'twitter:description', twitterDescription || description || this.defaultDescription);
    this.updateMetaTag('name', 'twitter:image', twitterImage || ogImage || `${this.baseUrl}/images/twitter-card.jpg`);
    this.updateMetaTag('name', 'twitter:site', '@kalakritam');
  }

  // Update or create meta tag
  updateMetaTag(attribute, name, content) {
    if (!content) return;

    let element = document.querySelector(`meta[${attribute}="${name}"]`);
    if (element) {
      element.setAttribute('content', content);
    } else {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      element.setAttribute('content', content);
      document.head.appendChild(element);
    }
  }

  // Update or create link tag
  updateLinkTag(rel, href) {
    if (!href) return;

    let element = document.querySelector(`link[rel="${rel}"]`);
    if (element) {
      element.setAttribute('href', href);
    } else {
      element = document.createElement('link');
      element.setAttribute('rel', rel);
      element.setAttribute('href', href);
      document.head.appendChild(element);
    }
  }

  // Add structured data (JSON-LD)
  addStructuredData(data = null) {
    // Remove existing structured data
    const existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) {
      existing.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data || structuredData);
    document.head.appendChild(script);
  }

  // Generate breadcrumb structured data
  generateBreadcrumbs(items) {
    const breadcrumbList = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": `${this.baseUrl}${item.url}`
      }))
    };

    return breadcrumbList;
  }

  // Add page-specific structured data
  addPageStructuredData(type, data) {
    let schemaData = { ...structuredData };

    switch (type) {
      case 'workshop':
        schemaData["@graph"].push({
          "@type": "Event",
          "name": data.title,
          "description": data.description,
          "startDate": data.startDate,
          "endDate": data.endDate,
          "location": {
            "@type": "Place",
            "name": data.venue,
            "address": data.address
          },
          "organizer": {
            "@id": "https://kalakritam.in/#organization"
          },
          "offers": {
            "@type": "Offer",
            "price": data.price,
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock"
          }
        });
        break;

      case 'artwork':
        schemaData["@graph"].push({
          "@type": "CreativeWork",
          "name": data.title,
          "description": data.description,
          "creator": {
            "@type": "Person",
            "name": data.artist
          },
          "image": data.image,
          "material": data.medium,
          "artform": data.category
        });
        break;

      case 'article':
        schemaData["@graph"].push({
          "@type": "Article",
          "headline": data.title,
          "description": data.description,
          "author": {
            "@type": "Person",
            "name": data.author
          },
          "publisher": {
            "@id": "https://kalakritam.in/#organization"
          },
          "datePublished": data.publishedDate,
          "dateModified": data.modifiedDate,
          "image": data.image
        });
        break;
    }

    this.addStructuredData(schemaData);
  }

  // Generate sitemap dynamically (for client-side routing)
  generateSitemap(routes) {
    const sitemap = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Kalakritam Site Pages",
      "itemListElement": routes.map((route, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${this.baseUrl}${route.path}`,
        "name": route.name,
        "description": route.description
      }))
    };

    return sitemap;
  }

  // Performance optimization
  preloadCriticalResources() {
    // Disabled preloading of video and og-image.jpg to prevent browser console warnings:
    // 1. Chrome does not support video preloading via link preload (triggers "unsupported as value").
    // 2. Preloading og-image.jpg triggers "preloaded but not used" warning since it is only metadata.
    const criticalResources = [];

    criticalResources.forEach(resource => {
      try {
        if (document.querySelector(`link[rel="preload"][href="${resource.href}"]`)) return;
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        if (resource.type) link.type = resource.type;
        if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
        document.head.appendChild(link);
      } catch (e) {
        // Silently ignore preload errors (e.g., Safari not supporting some as values)
      }
    });
  }

  // Initialize SEO for the entire app
  init() {
    // Set default meta tags
    this.setPageMeta();
    
    // Add default structured data
    this.addStructuredData();
    
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Add manifest link
    this.updateLinkTag('manifest', '/manifest.json');
    
    // Add theme color
    this.updateMetaTag('name', 'theme-color', '#c38f21');
    this.updateMetaTag('name', 'msapplication-TileColor', '#c38f21');
    
    // Add apple touch icon
    this.updateLinkTag('apple-touch-icon', '/images/icon-192x192.png');
    
    // Add favicon
    this.updateLinkTag('icon', '/favicon.ico');
  }
}

// Create and export singleton instance
export const seoManager = new SEOManager();

// Page-specific SEO configurations
export const pageConfigs = {
  home: {
    title: 'Kalakritam',
    description: 'Join Kalakritam weekend art workshops in Hyderabad cafes and restaurants. Learn traditional Indian art, contemporary painting. Expert-led classes for all levels.',
    keywords: 'Kalakritam, art workshops Hyderabad, weekend art classes, traditional Indian art, contemporary painting, art workshops in cafes, manifesting through art'
  },
  
  about: {
    title: 'Kalakritam',
    description: 'Learn about Kalakritam, Hyderabad\'s premier weekend art workshop provider. Manifesting through art with expert-led traditional and contemporary art classes in cafes.',
    keywords: 'about Kalakritam, art workshops Hyderabad, weekend art classes, traditional art workshops, contemporary art training, Indian art education'
  },
  
  workshops: {
    title: 'Kalakritam',
    description: 'Experience unique weekend art workshops in Hyderabad cafes and restaurants. Traditional Indian art techniques and contemporary expressions for all skill levels.',
    keywords: 'weekend art workshops Hyderabad, art classes in cafes, traditional art workshops, contemporary painting classes, group art sessions'
  },
  
  gallery: {
    title: 'Kalakritam',
    description: 'Discover inspiring artwork created during our weekend art workshops in Hyderabad. Gallery showcasing traditional and contemporary pieces from workshop participants.',
    keywords: 'art gallery Hyderabad, workshop artwork, traditional Indian art, contemporary art gallery, art exhibition'
  },
  
  artists: {
    title: 'Kalakritam',
    description: 'Meet our passionate art instructors who lead weekend workshops in Hyderabad cafes and restaurants. Expert teachers in traditional and contemporary art forms.',
    keywords: 'art instructors Hyderabad, art teachers, workshop instructors, traditional art teachers, contemporary art instructors'
  },
  
  events: {
    title: 'Kalakritam',
    description: 'Join art events and cultural workshops in Hyderabad. Weekend creative sessions, art exhibitions, and cultural experiences with Kalakritam.',
    keywords: 'art events Hyderabad, cultural workshops, weekend art events, art exhibitions, creative workshops'
  },
  
  contact: {
    title: 'Kalakritam',
    description: 'Contact Kalakritam for weekend art workshops in Hyderabad. Book group sessions, private workshops, or inquire about our cafe and restaurant art classes.',
    keywords: 'contact Kalakritam, art workshop booking, weekend art classes Hyderabad, group workshop booking, private art sessions'
  },
  
  blogs: {
    title: 'Kalakritam',
    description: 'Read about art techniques, cultural heritage, and creative insights from Kalakritam workshop experiences. Art education and cultural stories from Hyderabad.',
    keywords: 'art blog, workshop insights, traditional art techniques, contemporary art tips, cultural heritage, art education'
  }
};

export default SEOManager;
