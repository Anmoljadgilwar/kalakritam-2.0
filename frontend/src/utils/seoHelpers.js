// SEO Utility Functions for Admin Portal
import { generateEventSEO, generateWorkshopSEO } from './dynamicSeo';

/**
 * Detect event/workshop type from text
 */
const detectEventType = (title, description, category) => {
  const combined = `${category || ''} ${title || ''} ${description || ''}`.toLowerCase();
  
  if (combined.includes('workshop')) return 'Workshop';
  if (combined.includes('exhibition')) return 'Exhibition';
  if (combined.includes('art show')) return 'Art Show';
  if (combined.includes('masterclass')) return 'Masterclass';
  if (combined.includes('seminar')) return 'Seminar';
  if (combined.includes('festival')) return 'Festival';
  if (combined.includes('performance')) return 'Performance';
  if (combined.includes('cultural')) return 'Cultural Event';
  
  return 'Event';
};

/**
 * Generate URL-friendly slug from text
 */
export const generateSlug = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Generate optimized meta title
 */
export const generateMetaTitle = (title, type = 'general', siteName = 'Kalakritam', category = '', description = '') => {
  if (!title) return '';
  
  const maxLength = 60;
  let metaTitle = '';
  
  switch (type) {
    case 'artwork':
      metaTitle = `${title} - Original Artwork | ${siteName}`;
      break;
    case 'artist':
      metaTitle = `${title} - Artist Profile | ${siteName}`;
      break;
    case 'event':
      // Detect actual event type
      const eventType = detectEventType(title, description, category);
      metaTitle = `${title} - ${eventType} | ${siteName}`;
      break;
    case 'workshop':
      // Detect actual workshop type
      const workshopType = detectEventType(title, description, category);
      metaTitle = `${title} - ${workshopType} | ${siteName}`;
      break;
    case 'blog':
      metaTitle = `${title} - Art Blog | ${siteName}`;
      break;
    default:
      metaTitle = `${title} | ${siteName}`;
  }
  
  // Truncate if too long
  if (metaTitle.length > maxLength) {
    metaTitle = metaTitle.substring(0, maxLength - 3) + '...';
  }
  
  return metaTitle;
};

/**
 * Generate optimized meta description
 */
export const generateMetaDescription = (description, title, type = 'general') => {
  if (!description && !title) return '';
  
  const maxLength = 155;
  let metaDescription = '';
  
  const baseDescription = description || title;
  
  switch (type) {
    case 'artwork':
      metaDescription = `Discover "${title}" - ${baseDescription}. Explore unique artworks and cultural heritage at Kalakritam's online gallery.`;
      break;
    case 'artist':
      metaDescription = `Meet ${title} - ${baseDescription}. Explore their artistic journey and works at Kalakritam's artist showcase.`;
      break;
    case 'event':
      metaDescription = `Join "${title}" - ${baseDescription}. Experience cultural events and artistic celebrations with Kalakritam.`;
      break;
    case 'workshop':
      metaDescription = `Learn in "${title}" workshop - ${baseDescription}. Develop your artistic skills with expert guidance at Kalakritam.`;
      break;
    case 'blog':
      metaDescription = `Read about "${title}" - ${baseDescription}. Insights into art, culture, and creativity from Kalakritam.`;
      break;
    default:
      metaDescription = `${baseDescription} - Discover art, culture, and creativity at Kalakritam.`;
  }
  
  // Truncate if too long
  if (metaDescription.length > maxLength) {
    metaDescription = metaDescription.substring(0, maxLength - 3) + '...';
  }
  
  return metaDescription;
};

/**
 * Generate relevant keywords
 */
export const generateKeywords = (title, description, type = 'general', category = '') => {
  const baseKeywords = ['kalakritam', 'art', 'culture', 'traditional art', 'contemporary art'];
  const typeKeywords = {
    artwork: ['artwork', 'painting', 'sculpture', 'gallery', 'art collection', 'original art'],
    artist: ['artist', 'artist profile', 'art biography', 'creative artist', 'art portfolio'],
    event: ['art event', 'cultural event', 'art exhibition', 'art show', 'cultural program'],
    workshop: ['art workshop', 'art class', 'learn art', 'art training', 'art education'],
    blog: ['art blog', 'art article', 'art insights', 'art story', 'art news']
  };
  
  let keywords = [...baseKeywords];
  
  // Add type-specific keywords
  if (typeKeywords[type]) {
    keywords.push(...typeKeywords[type]);
  }
  
  // Add category-specific keywords
  if (category) {
    keywords.push(category.toLowerCase(), `${category.toLowerCase()} art`);
  }
  
  // Extract keywords from title and description
  const text = `${title} ${description}`.toLowerCase();
  const commonArtTerms = [
    'painting', 'sculpture', 'drawing', 'sketch', 'canvas', 'oil', 'acrylic', 'watercolor',
    'abstract', 'realistic', 'modern', 'traditional', 'folk', 'classical', 'contemporary',
    'portrait', 'landscape', 'still life', 'figurative', 'expressionism', 'impressionism'
  ];
  
  commonArtTerms.forEach(term => {
    if (text.includes(term) && !keywords.includes(term)) {
      keywords.push(term);
    }
  });
  
  // Remove duplicates and limit to 10 keywords
  keywords = [...new Set(keywords)].slice(0, 10);
  
  return keywords.join(', ');
};

/**
 * Generate Open Graph title
 */
export const generateOGTitle = (title, type = 'general', category = '', description = '') => {
  if (!title) return '';
  
  const maxLength = 60;
  let ogTitle = '';
  
  switch (type) {
    case 'artwork':
      ogTitle = `${title} - Discover Original Artwork`;
      break;
    case 'artist':
      ogTitle = `${title} - Artist Showcase`;
      break;
    case 'event':
      // Detect actual event type
      const eventType = detectEventType(title, description, category);
      ogTitle = `${title} - ${eventType}`;
      break;
    case 'workshop':
      // Detect actual workshop type
      const workshopType = detectEventType(title, description, category);
      ogTitle = `${title} - ${workshopType}`;
      break;
    case 'blog':
      ogTitle = `${title} - Art & Culture Blog`;
      break;
    default:
      ogTitle = title;
  }
  
  if (ogTitle.length > maxLength) {
    ogTitle = ogTitle.substring(0, maxLength - 3) + '...';
  }
  
  return ogTitle;
};

/**
 * Generate Open Graph description
 */
export const generateOGDescription = (description, title, type = 'general') => {
  if (!description && !title) return '';
  
  const maxLength = 200;
  const baseDescription = description || title;
  
  let ogDescription = '';
  
  switch (type) {
    case 'artwork':
      ogDescription = `Experience "${title}" and explore the rich world of art and culture at Kalakritam. ${baseDescription}`;
      break;
    case 'artist':
      ogDescription = `Discover the artistic journey of ${title}. ${baseDescription} - Featured artist at Kalakritam.`;
      break;
    case 'event':
      ogDescription = `Join us for "${title}" - an enriching cultural experience. ${baseDescription}`;
      break;
    case 'workshop':
      ogDescription = `Enhance your artistic skills with "${title}" workshop. ${baseDescription}`;
      break;
    case 'blog':
      ogDescription = `Insights into art and culture: "${title}". ${baseDescription}`;
      break;
    default:
      ogDescription = `${baseDescription} - Kalakritam: Where art meets culture.`;
  }
  
  if (ogDescription.length > maxLength) {
    ogDescription = ogDescription.substring(0, maxLength - 3) + '...';
  }
  
  return ogDescription;
};

/**
 * Generate all SEO fields at once
 */
export const generateSEOFields = (data) => {
  const { title, description, type = 'general', category = '', image = '' } = data;
  
  return {
    metaTitle: generateMetaTitle(title, type, 'Kalakritam', category, description),
    metaDescription: generateMetaDescription(description, title, type),
    metaKeywords: generateKeywords(title, description, type, category),
    slug: generateSlug(title),
    ogTitle: generateOGTitle(title, type, category, description),
    ogDescription: generateOGDescription(description, title, type),
    ogImage: image || ''
  };
};

/**
 * Content type specific SEO generators
 */
export const seoGenerators = {
  artwork: (data) => generateSEOFields({ ...data, type: 'artwork' }),
  artist: (data) => generateSEOFields({ ...data, type: 'artist' }),
  event: (data) => generateSEOFields({ ...data, type: 'event' }),
  workshop: (data) => generateSEOFields({ ...data, type: 'workshop' }),
  blog: (data) => generateSEOFields({ ...data, type: 'blog' }),
  general: (data) => generateSEOFields({ ...data, type: 'general' })
};

/**
 * Validate SEO field lengths
 */
export const validateSEOFields = (seoData) => {
  const validation = {
    metaTitle: {
      isValid: !seoData.metaTitle || seoData.metaTitle.length <= 60,
      message: 'Meta title should be 60 characters or less'
    },
    metaDescription: {
      isValid: !seoData.metaDescription || seoData.metaDescription.length <= 155,
      message: 'Meta description should be 155 characters or less'
    },
    slug: {
      isValid: !seoData.slug || /^[a-z0-9-]+$/.test(seoData.slug),
      message: 'Slug should only contain lowercase letters, numbers, and hyphens'
    },
    ogTitle: {
      isValid: !seoData.ogTitle || seoData.ogTitle.length <= 60,
      message: 'Open Graph title should be 60 characters or less'
    },
    ogDescription: {
      isValid: !seoData.ogDescription || seoData.ogDescription.length <= 200,
      message: 'Open Graph description should be 200 characters or less'
    }
  };
  
  return validation;
};

export default {
  generateSlug,
  generateMetaTitle,
  generateMetaDescription,
  generateKeywords,
  generateOGTitle,
  generateOGDescription,
  generateSEOFields,
  seoGenerators,
  validateSEOFields
};
