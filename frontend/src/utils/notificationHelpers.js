import { config } from '../config/environment';

/**
 * Creates a notification for all users when admin adds new content
 * @param {string} type - Type of notification ('gallery', 'workshop', 'event', 'blog', 'announcement')
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} link - Optional link to the new content
 * @returns {Promise<boolean>} Success status
 */
export const createNotificationForAllUsers = async (type, title, message, link = null) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      console.error('Admin token not found');
      return false;
    }

    const response = await fetch(`${config.apiBaseUrl}/api/admin/notifications/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        type,
        title,
        message,
        link
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Notification created:', data);
      return true;
    } else {
      console.error('Failed to create notification:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error creating notification:', error);
    return false;
  }
};

/**
 * Example usage in admin components after creating content:
 * 
 * // After creating a new gallery item
 * await createNotificationForAllUsers(
 *   'gallery',
 *   'New Artwork Added',
 *   'Check out the latest addition to our gallery collection!',
 *   '/gallery'
 * );
 * 
 * // After creating a new workshop
 * await createNotificationForAllUsers(
 *   'workshop',
 *   'New Workshop Available',
 *   'Join us for an exciting new art workshop. Limited seats available!',
 *   '/workshops'
 * );
 * 
 * // After creating a new event
 * await createNotificationForAllUsers(
 *   'event',
 *   'Upcoming Event',
 *   'Don\'t miss our upcoming art exhibition this weekend!',
 *   '/events'
 * );
 * 
 * // After creating a blog post
 * await createNotificationForAllUsers(
 *   'blog',
 *   'New Blog Post',
 *   'Read our latest article about contemporary art trends.',
 *   '/blogs'
 * );
 * 
 * // For general announcements
 * await createNotificationForAllUsers(
 *   'announcement',
 *   'Important Update',
 *   'Our gallery hours have been extended for the holiday season!',
 *   null
 * );
 */
