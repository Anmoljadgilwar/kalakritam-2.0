// Dynamic Sitemap Generator for Kalakritam
import { generateSlug } from './seoHelpers.js';

export class SitemapGenerator {
  constructor(baseUrl = 'https://kalakritam.in') {
    this.baseUrl = baseUrl;
    this.staticPages = [
      {
        url: '/',
        lastmod: '2025-01-08',
        changefreq: 'weekly',
        priority: '1.0'
      },
      {
        url: '/about',
        lastmod: '2025-01-08',
        changefreq: 'monthly',
        priority: '0.9'
      },
      {
        url: '/workshops',
        lastmod: '2025-01-08',
        changefreq: 'weekly',
        priority: '0.9'
      },
      {
        url: '/gallery',
        lastmod: '2025-01-08',
        changefreq: 'weekly',
        priority: '0.8'
      },
      {
        url: '/artists',
        lastmod: '2025-01-08',
        changefreq: 'monthly',
        priority: '0.7'
      },
      {
        url: '/events',
        lastmod: '2025-01-08',
        changefreq: 'weekly',
        priority: '0.7'
      },
      {
        url: '/contact',
        lastmod: '2025-01-08',
        changefreq: 'monthly',
        priority: '0.6'
      },
      {
        url: '/blogs',
        lastmod: '2025-01-08',
        changefreq: 'weekly',
        priority: '0.6'
      },
      {
        url: '/ticket-verification',
        lastmod: '2025-01-08',
        changefreq: 'monthly',
        priority: '0.4'
      }
    ];
  }

  // Generate XML sitemap
  generateXMLSitemap(dynamicData = {}) {
    const { workshops = [], artworks = [], events = [], blogs = [], artists = [] } = dynamicData;
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">

`;

    // Add static pages
    this.staticPages.forEach(page => {
      xml += `  <url>
    <loc>${this.baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>

`;
    });

    // Add dynamic workshop pages
    workshops.forEach(workshop => {
      const slug = workshop.slug || generateSlug(workshop.title);
      const lastmod = workshop.updated_at ? new Date(workshop.updated_at).toISOString().split('T')[0] : '2025-01-08';
      
      xml += `  <url>
    <loc>${this.baseUrl}/workshops/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    ${workshop.image_url ? `<image:image>
      <image:loc>${workshop.image_url}</image:loc>
      <image:title>${workshop.title}</image:title>
      <image:caption>${workshop.description || workshop.title}</image:caption>
    </image:image>` : ''}
  </url>

`;
    });

    // Add dynamic artwork pages
    artworks.forEach(artwork => {
      const slug = artwork.slug || generateSlug(artwork.title);
      const lastmod = artwork.updated_at ? new Date(artwork.updated_at).toISOString().split('T')[0] : '2025-01-08';
      
      xml += `  <url>
    <loc>${this.baseUrl}/gallery/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    ${artwork.image_url ? `<image:image>
      <image:loc>${artwork.image_url}</image:loc>
      <image:title>${artwork.title}</image:title>
      <image:caption>${artwork.description || `${artwork.title} by ${artwork.artist}`}</image:caption>
    </image:image>` : ''}
  </url>

`;
    });

    // Add dynamic event pages
    events.forEach(event => {
      const slug = event.slug || generateSlug(event.title);
      const lastmod = event.updated_at ? new Date(event.updated_at).toISOString().split('T')[0] : '2025-01-08';
      
      xml += `  <url>
    <loc>${this.baseUrl}/events/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
    ${event.image_url ? `<image:image>
      <image:loc>${event.image_url}</image:loc>
      <image:title>${event.title}</image:title>
      <image:caption>${event.description || event.title}</image:caption>
    </image:image>` : ''}
  </url>

`;
    });

    // Add dynamic blog pages
    blogs.forEach(blog => {
      const slug = blog.slug || generateSlug(blog.title);
      const lastmod = blog.updated_at ? new Date(blog.updated_at).toISOString().split('T')[0] : '2025-01-08';
      
      xml += `  <url>
    <loc>${this.baseUrl}/blogs/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    ${blog.image_url ? `<image:image>
      <image:loc>${blog.image_url}</image:loc>
      <image:title>${blog.title}</image:title>
      <image:caption>${blog.excerpt || blog.title}</image:caption>
    </image:image>` : ''}
  </url>

`;
    });

    // Add dynamic artist pages
    artists.forEach(artist => {
      const slug = artist.slug || generateSlug(artist.name);
      const lastmod = artist.updated_at ? new Date(artist.updated_at).toISOString().split('T')[0] : '2025-01-08';
      
      xml += `  <url>
    <loc>${this.baseUrl}/artists/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    ${artist.image_url ? `<image:image>
      <image:loc>${artist.image_url}</image:loc>
      <image:title>${artist.name}</image:title>
      <image:caption>${artist.bio || `Artist profile for ${artist.name}`}</image:caption>
    </image:image>` : ''}
  </url>

`;
    });

    xml += `</urlset>`;

    return xml;
  }

  // Generate robots.txt content
  generateRobotsTxt() {
    return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${this.baseUrl}/sitemap.xml

# Allow all search engines to access main content
Allow: /
Allow: /about
Allow: /workshops
Allow: /gallery
Allow: /artists
Allow: /events
Allow: /contact
Allow: /blogs

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /login
Disallow: /_app/
Disallow: /_document
Disallow: /static/
Disallow: /.well-known/

# Crawl delay (optional)
Crawl-delay: 1

# Host declaration
Host: ${this.baseUrl}`;
  }

  // Generate JSON-LD sitemap for structured data
  generateJSONSitemap(dynamicData = {}) {
    const { workshops = [], artworks = [], events = [], blogs = [], artists = [] } = dynamicData;
    
    const jsonSitemap = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Kalakritam Website Pages",
      "description": "Complete list of pages available on Kalakritam website",
      "url": `${this.baseUrl}/sitemap.json`,
      "itemListElement": []
    };

    // Add static pages
    this.staticPages.forEach((page, index) => {
      jsonSitemap.itemListElement.push({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${this.baseUrl}${page.url}`,
        "name": this.getPageName(page.url),
        "description": this.getPageDescription(page.url),
        "lastModified": page.lastmod
      });
    });

    let position = this.staticPages.length + 1;

    // Add dynamic pages
    workshops.forEach(workshop => {
      const slug = workshop.slug || generateSlug(workshop.title);
      jsonSitemap.itemListElement.push({
        "@type": "ListItem",
        "position": position++,
        "url": `${this.baseUrl}/workshops/${slug}`,
        "name": workshop.title,
        "description": workshop.description || `Workshop: ${workshop.title}`,
        "lastModified": workshop.updated_at || '2025-01-08'
      });
    });

    artworks.forEach(artwork => {
      const slug = artwork.slug || generateSlug(artwork.title);
      jsonSitemap.itemListElement.push({
        "@type": "ListItem",
        "position": position++,
        "url": `${this.baseUrl}/gallery/${slug}`,
        "name": artwork.title,
        "description": artwork.description || `Artwork: ${artwork.title} by ${artwork.artist}`,
        "lastModified": artwork.updated_at || '2025-01-08'
      });
    });

    events.forEach(event => {
      const slug = event.slug || generateSlug(event.title);
      jsonSitemap.itemListElement.push({
        "@type": "ListItem",
        "position": position++,
        "url": `${this.baseUrl}/events/${slug}`,
        "name": event.title,
        "description": event.description || `Event: ${event.title}`,
        "lastModified": event.updated_at || '2025-01-08'
      });
    });

    blogs.forEach(blog => {
      const slug = blog.slug || generateSlug(blog.title);
      jsonSitemap.itemListElement.push({
        "@type": "ListItem",
        "position": position++,
        "url": `${this.baseUrl}/blogs/${slug}`,
        "name": blog.title,
        "description": blog.excerpt || `Blog post: ${blog.title}`,
        "lastModified": blog.updated_at || '2025-01-08'
      });
    });

    artists.forEach(artist => {
      const slug = artist.slug || generateSlug(artist.name);
      jsonSitemap.itemListElement.push({
        "@type": "ListItem",
        "position": position++,
        "url": `${this.baseUrl}/artists/${slug}`,
        "name": artist.name,
        "description": artist.bio || `Artist profile: ${artist.name}`,
        "lastModified": artist.updated_at || '2025-01-08'
      });
    });

    return jsonSitemap;
  }

  // Helper methods
  getPageName(url) {
    const pageNames = {
      '/': 'Home - Art Workshops in Hyderabad',
      '/about': 'About Kalakritam',
      '/workshops': 'Weekend Art Workshops',
      '/gallery': 'Art Gallery - Workshop Creations',
      '/artists': 'Workshop Instructors',
      '/events': 'Art Events & Cultural Workshops',
      '/contact': 'Contact Us',
      '/blogs': 'Art Blog & Insights',
      '/ticket-verification': 'Ticket Verification'
    };
    return pageNames[url] || 'Kalakritam Page';
  }

  getPageDescription(url) {
    const pageDescriptions = {
      '/': 'Join weekend art workshops in Hyderabad cafes and restaurants. Traditional and contemporary art classes for all levels.',
      '/about': 'Learn about Kalakritam, Hyderabad\'s premier weekend art workshop provider.',
      '/workshops': 'Experience unique weekend art workshops in Hyderabad cafes and restaurants.',
      '/gallery': 'Discover artwork created during our weekend art workshops in Hyderabad.',
      '/artists': 'Meet our passionate art instructors who lead weekend workshops across Hyderabad.',
      '/events': 'Join art events and cultural workshops in Hyderabad with Kalakritam.',
      '/contact': 'Contact Kalakritam for weekend art workshops and group bookings.',
      '/blogs': 'Read about art techniques, cultural heritage, and workshop insights.',
      '/ticket-verification': 'Verify your event tickets and workshop bookings.'
    };
    return pageDescriptions[url] || 'Kalakritam page content';
  }

  // Update sitemap with fresh data (for API endpoints)
  async updateSitemap(apiEndpoint) {
    try {
      // Fetch dynamic data from API
      const response = await fetch(`${apiEndpoint}/sitemap-data`);
      const dynamicData = await response.json();
      
      // Generate updated sitemap
      const xmlSitemap = this.generateXMLSitemap(dynamicData);
      const jsonSitemap = this.generateJSONSitemap(dynamicData);
      
      return {
        xml: xmlSitemap,
        json: jsonSitemap,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error updating sitemap:', error);
      return null;
    }
  }
}

// Export singleton instance
export const sitemapGenerator = new SitemapGenerator();

export default SitemapGenerator;
