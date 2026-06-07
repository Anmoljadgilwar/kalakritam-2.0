// Google Analytics 4 Integration for Kalakritam
export const GA4_CONFIG = {
  measurementId: 'G-XXXXXXXXXX', // Replace with your actual GA4 Measurement ID
  trackingConfig: {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
    custom_map: {
      'workshop_type': 'custom_parameter_1',
      'user_level': 'custom_parameter_2',
      'location': 'custom_parameter_3'
    }
  }
};

// GTM Configuration
export const GTM_CONFIG = {
  containerId: 'GTM-XXXXXXX', // Replace with your GTM Container ID
  dataLayerName: 'dataLayer',
  auth: '',
  preview: '',
  cookies_win: true
};

// Initialize Google Analytics 4
export const initGA4 = () => {
  // Load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_CONFIG.measurementId}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag = gtag;
  
  gtag('js', new Date());
  gtag('config', GA4_CONFIG.measurementId, GA4_CONFIG.trackingConfig);
};

// Initialize Google Tag Manager
export const initGTM = () => {
  // GTM Script
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer',GTM_CONFIG.containerId);

  // GTM NoScript fallback
  const noscript = document.createElement('noscript');
  noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_CONFIG.containerId}"
  height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
  document.body.insertBefore(noscript, document.body.firstChild);
};

// Track page views
export const trackPageView = (page_title, page_location, page_path) => {
  if (typeof gtag !== 'undefined') {
    gtag('config', GA4_CONFIG.measurementId, {
      page_title,
      page_location,
      page_path
    });
  }
};

// Track workshop-related events
export const trackWorkshopEvent = (action, workshop_type, workshop_name, user_level = 'unknown') => {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: 'Workshop',
      event_label: workshop_name,
      custom_parameter_1: workshop_type,
      custom_parameter_2: user_level,
      custom_parameter_3: 'Hyderabad'
    });
  }
};

// Track contact form submissions
export const trackContactSubmission = (form_type, subject) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'form_submission', {
      event_category: 'Contact',
      event_label: form_type,
      form_id: 'contact_form',
      form_subject: subject
    });
  }
};

// Track gallery interactions
export const trackGalleryView = (artwork_title, artist_name, category) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'view_item', {
      event_category: 'Gallery',
      event_label: artwork_title,
      item_id: artwork_title.toLowerCase().replace(/\s+/g, '_'),
      item_name: artwork_title,
      item_category: category,
      item_brand: artist_name
    });
  }
};

// Track navigation and user flow
export const trackNavigation = (from_page, to_page, navigation_type) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_navigation', {
      event_category: 'Navigation',
      event_label: `${from_page} to ${to_page}`,
      navigation_type: navigation_type,
      from_page: from_page,
      to_page: to_page
    });
  }
};

// Track search functionality
export const trackSiteSearch = (search_term, search_results_count) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'search', {
      search_term: search_term,
      search_results_count: search_results_count,
      event_category: 'Site Search'
    });
  }
};

// Track video interactions
export const trackVideoInteraction = (video_title, action, video_duration, current_time) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', `video_${action}`, {
      event_category: 'Video',
      event_label: video_title,
      video_title: video_title,
      video_duration: video_duration,
      video_current_time: current_time,
      video_provider: 'self_hosted'
    });
  }
};

// Enhanced ecommerce for workshop bookings
export const trackWorkshopBooking = (workshop_data) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'purchase', {
      transaction_id: workshop_data.booking_id,
      value: workshop_data.price,
      currency: 'INR',
      items: [{
        item_id: workshop_data.workshop_id,
        item_name: workshop_data.workshop_name,
        category: workshop_data.category,
        quantity: 1,
        price: workshop_data.price
      }]
    });
  }
};

// Track user engagement
export const trackUserEngagement = (engagement_time_msec, page_title) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'user_engagement', {
      engagement_time_msec: engagement_time_msec,
      page_title: page_title,
      event_category: 'Engagement'
    });
  }
};

// Custom exceptions tracking
export const trackException = (description, fatal = false) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'exception', {
      description: description,
      fatal: fatal
    });
  }
};

// Track social media interactions
export const trackSocialInteraction = (social_network, action, target) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'share', {
      method: social_network,
      content_type: action,
      content_id: target,
      event_category: 'Social'
    });
  }
};

// Initialize all tracking
export const initializeTracking = () => {
  // Initialize GA4
  initGA4();
  
  // Initialize GTM (if needed)
  // initGTM();
  
  // Track initial page view
  trackPageView(document.title, window.location.href, window.location.pathname);
  
  console.log('Analytics tracking initialized for Kalakritam');
};

// Export all tracking functions
export default {
  initGA4,
  initGTM,
  trackPageView,
  trackWorkshopEvent,
  trackContactSubmission,
  trackGalleryView,
  trackNavigation,
  trackSiteSearch,
  trackVideoInteraction,
  trackWorkshopBooking,
  trackUserEngagement,
  trackException,
  trackSocialInteraction,
  initializeTracking
};
