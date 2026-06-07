/**
 * Dynamic SEO Generator for Events and Workshops
 * Generates comprehensive SEO metadata based on content details
 */

/**
 * Detect event/workshop type and return appropriate terminology
 */
const getEventType = (category, title, description) => {
  const combined = `${category || ''} ${title || ''} ${description || ''}`.toLowerCase();
  
  if (combined.includes('workshop')) return { type: 'Workshop', article: 'a' };
  if (combined.includes('exhibition')) return { type: 'Exhibition', article: 'an' };
  if (combined.includes('art show')) return { type: 'Art Show', article: 'an' };
  if (combined.includes('gallery')) return { type: 'Gallery Event', article: 'a' };
  if (combined.includes('performance')) return { type: 'Performance', article: 'a' };
  if (combined.includes('concert')) return { type: 'Concert', article: 'a' };
  if (combined.includes('festival')) return { type: 'Festival', article: 'a' };
  if (combined.includes('seminar')) return { type: 'Seminar', article: 'a' };
  if (combined.includes('masterclass')) return { type: 'Masterclass', article: 'a' };
  if (combined.includes('class')) return { type: 'Class', article: 'a' };
  if (combined.includes('cultural')) return { type: 'Cultural Event', article: 'a' };
  if (combined.includes('art party')) return { type: 'Art Party', article: 'an' };
  
  return { type: 'Event', article: 'an' };
};

/**
 * Generate smart keywords based on type
 */
const generateSmartKeywords = (title, category, venue, eventType) => {
  const baseKeywords = [
    title,
    category,
    `${title.toLowerCase()}`,
    `${eventType.type.toLowerCase()} Hyderabad`,
    `${eventType.type.toLowerCase()} in Hyderabad`
  ];
  
  if (venue) {
    baseKeywords.push(
      `${venue} events`,
      `${eventType.type.toLowerCase()} at ${venue}`,
      `events in ${venue}`
    );
  }
  
  // Add type-specific keywords
  if (eventType.type.includes('Workshop')) {
    baseKeywords.push('art workshops Hyderabad', 'creative workshops', 'art classes Hyderabad');
  } else if (eventType.type.includes('Exhibition')) {
    baseKeywords.push('art exhibition Hyderabad', 'art gallery Hyderabad', 'contemporary art');
  } else if (eventType.type.includes('Cultural')) {
    baseKeywords.push('cultural events Hyderabad', 'cultural programs', 'Indian art events');
  }
  
  baseKeywords.push('Kalakritam', 'Kalakritam events', 'art events Hyderabad');
  
  return baseKeywords.filter(Boolean).join(', ');
};

/**
 * Generate dynamic SEO metadata for an Event
 * @param {Object} event - Event data object
 * @returns {Object} SEO metadata object
 */
export const generateEventSEO = (event) => {
  if (!event) return null;

  const baseUrl = 'https://kalakritam.in';
  const eventUrl = `${baseUrl}/events/${event.slug || event._slug}`;
  
  // Detect event type
  const eventType = getEventType(event.category, event.title, event.description);
  
  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const startDateFormatted = formatDate(event.startDate);
  const endDateFormatted = formatDate(event.endDate);
  
  // Generate comprehensive title with type
  const title = event.venue 
    ? `${event.title} - ${eventType.type} at ${event.venue} | Kalakritam`
    : `${event.title} - ${eventType.type} | Kalakritam`;
  
  // Generate detailed description with proper type
  const descriptionPrefix = event.description 
    ? event.description.substring(0, 120)
    : `Join us for ${eventType.article} ${eventType.type.toLowerCase()} - ${event.title}`;
  
  const descriptionParts = [descriptionPrefix];
  if (event.venue && startDateFormatted) {
    descriptionParts.push(`at ${event.venue} on ${startDateFormatted}`);
  } else if (event.venue) {
    descriptionParts.push(`at ${event.venue}`);
  } else if (startDateFormatted) {
    descriptionParts.push(`on ${startDateFormatted}`);
  }
  if (event.ticketPrice) {
    descriptionParts.push(`Tickets: ₹${event.ticketPrice}`);
  }
  descriptionParts.push(`by Kalakritam in Hyderabad.`);
  
  const description = descriptionParts.join('. ').substring(0, 155);

  // Generate smart keywords
  const keywords = generateSmartKeywords(event.title, event.category, event.venue, eventType);

  // Generate structured data for Event - use appropriate schema type
  const schemaType = eventType.type.includes('Workshop') ? 'EducationEvent' : 
                     eventType.type.includes('Exhibition') ? 'ExhibitionEvent' : 'Event';
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": event.title,
    "description": event.description || `${eventType.article} ${eventType.type.toLowerCase()} - ${event.title}${event.venue ? ` at ${event.venue}` : ''}`,
    "eventStatus": event.active ? "https://schema.org/EventScheduled" : "https://schema.org/EventCancelled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": event.imageUrl || `${baseUrl}/images/og-image.jpg`,
    "organizer": {
      "@type": "Organization",
      "name": "Kalakritam",
      "url": baseUrl
    }
  };
  
  // Add dates if available
  if (event.startDate) structuredData.startDate = event.startDate;
  if (event.endDate) structuredData.endDate = event.endDate;
  
  // Add location if available
  if (event.venue) {
    structuredData.location = {
      "@type": "Place",
      "name": event.venue,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Hyderabad",
        "addressRegion": "Telangana",
        "addressCountry": "IN"
      }
    };
  }
  
  // Add offers if price available
  if (event.ticketPrice) {
    structuredData.offers = {
      "@type": "Offer",
      "price": event.ticketPrice,
      "priceCurrency": "INR",
      "url": eventUrl,
      "availability": event.active ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      "validFrom": new Date().toISOString()
    };
  }

  // Add maxAttendees if available
  if (event.maxAttendees) {
    structuredData.maximumAttendeeCapacity = event.maxAttendees;
  }

  return {
    title,
    description,
    keywords,
    canonical: eventUrl,
    ogTitle: event.venue ? `${event.title} - ${eventType.type} at ${event.venue}` : `${event.title} - ${eventType.type}`,
    ogDescription: description,
    ogImage: event.imageUrl || `${baseUrl}/images/og-image.jpg`,
    ogUrl: eventUrl,
    ogType: 'event',
    twitterCard: 'summary_large_image',
    twitterTitle: event.venue ? `${event.title} at ${event.venue}` : event.title,
    twitterDescription: description,
    twitterImage: event.imageUrl || `${baseUrl}/images/twitter-card.jpg`,
    structuredData
  };
};

/**
 * Generate dynamic SEO metadata for a Workshop
 * @param {Object} workshop - Workshop data object
 * @returns {Object} SEO metadata object
 */
export const generateWorkshopSEO = (workshop) => {
  if (!workshop) return null;

  const baseUrl = 'https://kalakritam.in';
  const workshopUrl = `${baseUrl}/workshops/${workshop.slug || workshop._slug}`;
  
  // Detect workshop type (could be masterclass, class, training, etc.)
  const workshopType = getEventType('workshop', workshop.title, workshop.description);
  
  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const startDateFormatted = formatDate(workshop.startDate);
  
  // Generate comprehensive title with instructor and type
  const titleParts = [workshop.title];
  if (workshop.instructor) titleParts.push(`by ${workshop.instructor}`);
  titleParts.push(`| Kalakritam ${workshopType.type}s`);
  const title = titleParts.join(' ');
  
  // Generate detailed description with all relevant info
  const descriptionParts = [];
  if (workshop.description) {
    descriptionParts.push(workshop.description.substring(0, 100));
  } else {
    descriptionParts.push(`Join ${workshop.title}`);
  }
  
  if (workshop.instructor) descriptionParts.push(`with ${workshop.instructor}`);
  if (workshop.venue && startDateFormatted) {
    descriptionParts.push(`at ${workshop.venue} on ${startDateFormatted}`);
  } else if (workshop.venue) {
    descriptionParts.push(`at ${workshop.venue}`);
  }
  if (workshop.duration) descriptionParts.push(`Duration: ${workshop.duration}`);
  if (workshop.price) descriptionParts.push(`Price: ₹${workshop.price}`);
  descriptionParts.push('by Kalakritam in Hyderabad');
  
  const description = descriptionParts.join('. ').substring(0, 155);

  // Generate smart keywords for workshops
  const keywords = generateSmartKeywords(
    workshop.title, 
    workshop.category || 'workshop', 
    workshop.venue, 
    workshopType
  ) + (workshop.instructor ? `, ${workshop.instructor}, ${workshop.instructor} workshop` : '');

  // Generate structured data for Course/Workshop - more flexible schema
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": workshop.title,
    "description": workshop.description || `${workshop.title}${workshop.venue ? ` at ${workshop.venue}` : ''}`,
    "provider": {
      "@type": "Organization",
      "name": "Kalakritam",
      "url": baseUrl
    },
    "courseMode": "Offline",
    "image": workshop.imageUrl || `${baseUrl}/images/og-image.jpg`
  };
  
  // Build course instance dynamically
  const courseInstance = { "@type": "CourseInstance" };
  
  if (workshop.startDate) courseInstance.startDate = workshop.startDate;
  if (workshop.endDate) courseInstance.endDate = workshop.endDate;
  
  if (workshop.venue) {
    courseInstance.location = {
      "@type": "Place",
      "name": workshop.venue,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Hyderabad",
        "addressRegion": "Telangana",
        "addressCountry": "IN"
      }
    };
  }
  
  if (workshop.instructor) {
    courseInstance.instructor = {
      "@type": "Person",
      "name": workshop.instructor
    };
  }
  
  // Only add courseInstance if it has properties
  if (Object.keys(courseInstance).length > 1) {
    structuredData.hasCourseInstance = courseInstance;
  }
  
  // Add duration if available
  if (workshop.duration) {
    structuredData.timeRequired = workshop.duration;
  }

  // Add max participants if available
  if (workshop.maxParticipants) {
    structuredData.maximumAttendeeCapacity = workshop.maxParticipants;
  }
  
  // Add offers if price available
  if (workshop.price) {
    structuredData.offers = {
      "@type": "Offer",
      "price": workshop.price,
      "priceCurrency": "INR",
      "url": workshopUrl,
      "availability": workshop.active ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      "validFrom": new Date().toISOString()
    };
  }

  return {
    title,
    description,
    keywords,
    canonical: workshopUrl,
    ogTitle: workshop.instructor 
      ? `${workshop.title} by ${workshop.instructor}`
      : workshop.title,
    ogDescription: description,
    ogImage: workshop.imageUrl || `${baseUrl}/images/og-image.jpg`,
    ogUrl: workshopUrl,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: workshop.instructor 
      ? `${workshop.title} by ${workshop.instructor}`
      : workshop.title,
    twitterDescription: description,
    twitterImage: workshop.imageUrl || `${baseUrl}/images/twitter-card.jpg`,
    structuredData
  };
};

/**
 * Helper to truncate text for SEO descriptions
 */
export const truncateDescription = (text, maxLength = 160) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};
