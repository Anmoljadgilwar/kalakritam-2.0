// Database operations using the backend API
import { config } from '../config/environment.js';

const API_BASE_URL = config.apiBaseUrl;

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call error for ${endpoint}:`, error);
    throw error;
  }
}

export const db = {
  // Artworks
  async getArtworks() {
    const response = await apiCall('/gallery');
    return response.data || [];
  },

  async createArtwork(artwork) {
    const response = await apiCall('/gallery', {
      method: 'POST',
      body: JSON.stringify(artwork),
    });
    return response.data;
  },

  async updateArtwork(id, artwork) {
    const response = await apiCall(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(artwork),
    });
    return response.data;
  },

  async deleteArtwork(id) {
    const response = await apiCall(`/gallery/${id}`, {
      method: 'DELETE',
    });
    return response.success;
  },

  // Workshops
  async getWorkshops() {
    const response = await apiCall('/workshops');
    return response.data || [];
  },

  async createWorkshop(workshop) {
    const response = await apiCall('/workshops', {
      method: 'POST',
      body: JSON.stringify(workshop),
    });
    return response.data;
  },

  // Events
  async getEvents() {
    const response = await apiCall('/events');
    return response.data || [];
  },

  async createEvent(event) {
    const response = await apiCall('/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
    return response.data;
  },

  // Blogs
  async getBlogs() {
    const response = await apiCall('/blogs');
    return response.data || [];
  },

  async createBlog(blog) {
    const response = await apiCall('/blogs', {
      method: 'POST',
      body: JSON.stringify(blog),
    });
    return response.data;
  },

  // Artists
  async getArtists() {
    const response = await apiCall('/artists');
    return response.data || [];
  },

  async createArtist(artist) {
    const response = await apiCall('/artists', {
      method: 'POST',
      body: JSON.stringify(artist),
    });
    return response.data;
  },

  // Contacts
  async getContacts() {
    const response = await apiCall('/contact');
    return response.data || [];
  },

  async createContact(contact) {
    const response = await apiCall('/contact', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
    return response.data;
  }
};