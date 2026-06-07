// Environment Configuration Utility
export const config = {
  // Determine if we're in production
  isProduction: import.meta.env.PROD,
  
  // API Base URL - now always uses production API
  apiBaseUrl: 'https://api.kalakritam.in',
  
  // App URL
  appUrl: import.meta.env.PROD
    ? 'https://kalakritam.in'
    : 'http://localhost:5173',
  
  // Xata Configuration
  xata: {
    apiKey: import.meta.env.VITE_XATA_API_KEY,
    databaseUrl: import.meta.env.VITE_XATA_DATABASE_URL,
    branch: import.meta.env.VITE_XATA_BRANCH || 'main'
  },
  
  // JWT Secret
  jwtSecret: import.meta.env.VITE_JWT_SECRET,
  
  // Image URL transformation
  transformImageUrl: (url) => {
    if (!url) return url;
    
    // If the URL is pointing to localhost:5000, transform it to a placeholder or working URL
    if (url.includes('localhost:5000') || url.includes('http://localhost:5000')) {
      // For now, return a placeholder since we don't have a production image service
      // In production, this should point to your actual image CDN/service
      console.warn('Image URL pointing to localhost:', url);
      return null; // This will trigger the fallback image logic
    }
    
    return url;
  }
};

// API Endpoints
export const endpoints = {
  // Authentication
  auth: {
    login: `${config.apiBaseUrl}/admin/login`,
    logout: `${config.apiBaseUrl}/admin/logout`,
    refresh: `${config.apiBaseUrl}/admin/refresh`,
    verify: `${config.apiBaseUrl}/admin/verify`
  },
  
  // Gallery/Artworks
  gallery: {
    base: `${config.apiBaseUrl}/gallery`,
    artworks: `${config.apiBaseUrl}/gallery`,
    categories: `${config.apiBaseUrl}/gallery/categories`
  },
  
  // Artists
  artists: {
    base: `${config.apiBaseUrl}/artists`,
    featured: `${config.apiBaseUrl}/artists/featured`
  },
  
  // Workshops
  workshops: {
    base: `${config.apiBaseUrl}/workshops`,
    upcoming: `${config.apiBaseUrl}/workshops/upcoming`
  },
  
  // Events
  events: {
    base: `${config.apiBaseUrl}/events`,
    upcoming: `${config.apiBaseUrl}/events/upcoming`
  },
  
  // Blogs
  blogs: {
    base: `${config.apiBaseUrl}/blogs`,
    featured: `${config.apiBaseUrl}/blogs/featured`
  },
  
  // Contacts
  contacts: {
    base: `${config.apiBaseUrl}/contact`,
    submit: `${config.apiBaseUrl}/contact`
  }
};

// Helper function to get API URL with endpoint
export const getApiUrl = (endpoint) => {
  return `${config.apiBaseUrl}${endpoint}`;
};

// Helper function to handle API requests with proper headers
export const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('adminToken');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const requestOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };
  
  try {
    const response = await fetch(url, requestOptions);
    
    // Handle unauthorized responses
    if (response.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      // Redirect to home since admin routes are removed
      window.location.href = '/home';
      return null;
    }
    
    return response;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export default config;
