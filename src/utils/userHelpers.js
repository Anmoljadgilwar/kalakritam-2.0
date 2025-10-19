/**
 * Utility functions for user-related operations
 */

/**
 * Generate a URL-friendly username from user's name or email
 * @param {Object} user - User object with name and email
 * @returns {string} - URL-friendly username
 */
export const generateUsername = (user) => {
  if (!user) return '';
  
  // Try to use the user's name first
  if (user.name) {
    return user.name
      .toLowerCase()
      .replace(/\s+/g, '') // Remove spaces
      .replace(/[^a-z0-9]/g, '') // Remove special characters
      .substring(0, 20); // Limit length
  }
  
  // Fallback to email username
  if (user.email) {
    const emailUsername = user.email.split('@')[0];
    return emailUsername
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20);
  }
  
  // Final fallback
  return 'user';
};

/**
 * Get the user's profile URL path
 * @param {Object} user - User object
 * @param {string} page - Page name (e.g., 'home', 'dashboard', 'gallery')
 * @returns {string} - URL path
 */
export const getUserPath = (user, page = 'home') => {
  const username = generateUsername(user);
  return `/u/${username}/${page}`;
};

/**
 * Get navigation path based on authentication status
 * @param {string} path - Original path (e.g., '/gallery', '/home')
 * @param {Object} user - User object (null if not authenticated)
 * @param {boolean} isAuthenticated - Authentication status
 * @returns {string} - Personalized path if authenticated, original path otherwise
 */
export const getNavigationPath = (path, user, isAuthenticated) => {
  if (!isAuthenticated || !user) {
    return path;
  }
  
  // Extract page name from path (remove leading slash)
  const pageName = path.startsWith('/') ? path.substring(1) : path;
  
  // Generate personalized path
  return getUserPath(user, pageName);
};

/**
 * Validate if the username in URL matches the current user
 * @param {string} urlUsername - Username from URL params
 * @param {Object} user - Current user object
 * @returns {boolean} - True if username matches
 */
export const validateUsernameMatch = (urlUsername, user) => {
  if (!urlUsername || !user) return false;
  const generatedUsername = generateUsername(user);
  return urlUsername.toLowerCase() === generatedUsername.toLowerCase();
};
