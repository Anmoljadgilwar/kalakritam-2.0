// API utility functions for admin operations
import { config } from '../config/environment.js';
import { toast } from '../utils/notifications.js';

// Common API call function with admin authentication
export const apiCall = async (endpoint, method = 'GET', data = null) => {
  try {
    const token = localStorage.getItem('adminToken');
    
    // Use endpoint as-is since it already includes admin/ prefix where needed
    const url = `${config.apiBaseUrl}/${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const requestOptions = {
      method,
      headers,
      mode: 'cors',
      credentials: 'include', // Essential for CORS with credentials
    };
    
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      requestOptions.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || result.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return result;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Gallery API functions
export const galleryApi = {
  // Fetch artworks with optional pagination/search; default to a high limit so admin sees all
  getArtworks: ({ page = 1, limit = 1000, search } = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    return apiCall(`admin/gallery?${params.toString()}`);
  },
  addArtwork: (artwork) => apiCall('admin/gallery', 'POST', artwork),
  updateArtwork: async (id, artwork) => {
    // If there's an old image and a new one, delete the old one
    if (artwork.oldImageUrl && artwork.imageUrl && artwork.oldImageUrl !== artwork.imageUrl) {
      try {
        await uploadApi.deleteImage(artwork.oldImageUrl);
        console.log('✅ Old artwork image deleted successfully');
      } catch (error) {
        console.warn('⚠️ Failed to delete old artwork image:', error);
        // Continue with update even if image deletion fails
      }
      
      // Remove oldImageUrl from the data sent to backend
      const { oldImageUrl, ...updateData } = artwork;
      return apiCall(`admin/gallery/${id}`, 'PUT', updateData);
    }
    
    return apiCall(`admin/gallery/${id}`, 'PUT', artwork);
  },
  deleteArtwork: async (id) => {
    try {
      // First get the artwork to find the image URL
      const artworks = await galleryApi.getArtworks();
      const artwork = artworks.data?.find(item => item.id === id);
      
      console.log('🔍 Found artwork for deletion:', artwork);
      
      // Delete the artwork record
      const result = await apiCall(`admin/gallery/${id}`, 'DELETE');
      
      // If successful and artwork had an image, delete it from R2
      if (result.success && artwork) {
        // Try multiple possible field names for the image URL
        const imageUrl = artwork.imageUrl || artwork.image_url || artwork.imageURL;
        
        console.log('🖼️ Image URL to delete:', imageUrl);
        
        if (imageUrl) {
          try {
            await uploadApi.deleteImage(imageUrl);
            console.log('✅ Artwork image deleted from R2 successfully');
          } catch (imageError) {
            console.warn('⚠️ Failed to delete artwork image from R2:', imageError);
            // Don't fail the whole operation if image deletion fails
          }
        } else {
          console.log('ℹ️ No image URL found for artwork, skipping image deletion');
        }
      }
      
      return result;
    } catch (error) {
      console.error('❌ Failed to delete artwork:', error);
      throw error;
    }
  },
};

// Helper function to transform workshop data from snake_case to camelCase
const transformWorkshopFromDB = (workshop) => {
  if (!workshop) return null;
  return {
    id: workshop.id,
    title: workshop.title,
    instructor: workshop.instructor,
    description: workshop.description,
    startDate: workshop.start_date,
    endDate: workshop.end_date,
    venue: workshop.venue,
    duration: workshop.duration,
    price: workshop.price,
    maxParticipants: workshop.max_participants,
    currentParticipants: workshop.current_participants,
    imageUrl: workshop.image_url,
    active: workshop.active,
    slug: workshop.slug,
    metaTitle: workshop.meta_title,
    metaDescription: workshop.meta_description,
    metaKeywords: workshop.meta_keywords,
    ogTitle: workshop.og_title,
    ogDescription: workshop.og_description,
    ogImage: workshop.og_image,
    createdAt: workshop.created_at,
    updatedAt: workshop.updated_at
  };
};

// Transform event data from snake_case (database) to camelCase (frontend)
const transformEventFromDB = (event) => {
  if (!event) return null;
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    category: event.category,
    startDate: event.start_date,
    endDate: event.end_date,
    venue: event.venue,
    ticketPrice: event.ticket_price,
    maxAttendees: event.max_attendees,
    imageUrl: event.image_url,
    videoUrl: event.video_url,
    districtUrl: event.district_url,
    bookMyShowUrl: event.book_my_show_url,
    active: event.active,
    slug: event.slug,
    metaTitle: event.meta_title,
    metaDescription: event.meta_description,
    metaKeywords: event.meta_keywords,
    ogTitle: event.og_title,
    ogDescription: event.og_description,
    ogImage: event.og_image,
    createdAt: event.created_at,
    updatedAt: event.updated_at
  };
};

// Workshops API functions
export const workshopsApi = {
  getAll: async ({ page = 1, limit = 1000 } = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    const response = await apiCall(`admin/workshops?${params.toString()}`);
    
    // Transform the data from snake_case to camelCase
    if (response.success && response.data) {
      response.data = response.data.map(transformWorkshopFromDB);
    }
    
    return response;
  },
  create: async (workshop) => {
    const response = await apiCall('admin/workshops', 'POST', workshop);
    
    // Transform the response data from snake_case to camelCase
    if (response.success && response.data) {
      response.data = transformWorkshopFromDB(response.data);
    }
    
    return response;
  },
  update: async (id, workshop) => {
    // If there's an old image and a new one, delete the old one
    if (workshop.oldImageUrl && workshop.imageUrl && workshop.oldImageUrl !== workshop.imageUrl) {
      try {
        await uploadApi.deleteImage(workshop.oldImageUrl);
        console.log('✅ Old workshop image deleted successfully');
      } catch (error) {
        console.warn('⚠️ Failed to delete old workshop image:', error);
      }
      
      // Remove oldImageUrl from the data sent to backend
      const { oldImageUrl, ...updateData } = workshop;
      const response = await apiCall(`admin/workshops/${id}`, 'PUT', updateData);
      
      // Transform the response data from snake_case to camelCase
      if (response.success && response.data) {
        response.data = transformWorkshopFromDB(response.data);
      }
      
      return response;
    }
    
    const response = await apiCall(`admin/workshops/${id}`, 'PUT', workshop);
    
    // Transform the response data from snake_case to camelCase
    if (response.success && response.data) {
      response.data = transformWorkshopFromDB(response.data);
    }
    
    return response;
  },
  delete: async (id) => {
    try {
      // First get the workshop to find the image URL
      const workshops = await workshopsApi.getAll();
      const workshop = workshops.data?.find(item => item.id === id);
      
      console.log('🔍 Found workshop for deletion:', workshop);
      
      // Delete the workshop record
      const result = await apiCall(`admin/workshops/${id}`, 'DELETE');
      
      // If successful and workshop had an image, delete it from R2
      if (result.success && workshop) {
        // Try multiple possible field names for the image URL
        const imageUrl = workshop.imageUrl || workshop.image_url || workshop.imageURL;
        
        console.log('🖼️ Image URL to delete:', imageUrl);
        
        if (imageUrl) {
          try {
            await uploadApi.deleteImage(imageUrl);
            console.log('✅ Workshop image deleted from R2 successfully');
          } catch (imageError) {
            console.warn('⚠️ Failed to delete workshop image from R2:', imageError);
          }
        } else {
          console.log('ℹ️ No image URL found for workshop, skipping image deletion');
        }
      }
      
      return result;
    } catch (error) {
      console.error('❌ Failed to delete workshop:', error);
      throw error;
    }
  },
};

// Events API functions
export const eventsApi = {
  getAll: async ({ page = 1, limit = 1000 } = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    const response = await apiCall(`admin/events?${params.toString()}`);
    
    console.log('🔍 Raw API response before transformation:', {
      success: response.success,
      firstEventRaw: response.data?.[0],
      hasVideoUrl: !!response.data?.[0]?.video_url,
      hasCategory: !!response.data?.[0]?.category
    });
    
    // Transform the data from snake_case to camelCase
    if (response.success && response.data) {
      response.data = response.data.map(transformEventFromDB);
      
      console.log('🔄 After transformation:', {
        firstEventTransformed: response.data?.[0],
        hasVideoUrl: !!response.data?.[0]?.videoUrl,
        hasCategory: !!response.data?.[0]?.category
      });
    }
    
    return response;
  },
  addEvent: (event) => apiCall('admin/events', 'POST', event),
  updateEvent: async (id, event) => {
    // If there's an old image and a new one, delete the old one
    if (event.oldImageUrl && event.imageUrl && event.oldImageUrl !== event.imageUrl) {
      try {
        await uploadApi.deleteImage(event.oldImageUrl);
        console.log('✅ Old event image deleted successfully');
      } catch (error) {
        console.warn('⚠️ Failed to delete old event image:', error);
      }
      
      // Remove oldImageUrl from the data sent to backend
      const { oldImageUrl, ...updateData } = event;
      return apiCall(`admin/events/${id}`, 'PUT', updateData);
    }
    
    return apiCall(`admin/events/${id}`, 'PUT', event);
  },
  deleteEvent: async (id) => {
    try {
      // First get the event to find the image URL
      const events = await eventsApi.getAll();
      const event = events.data?.find(item => item.id === id);
      
      console.log('🔍 Found event for deletion:', event);
      
      // Delete the event record
      const result = await apiCall(`admin/events/${id}`, 'DELETE');
      
      // If successful and event had an image, delete it from R2
      if (result.success && event) {
        // Try multiple possible field names for the image URL
        const imageUrl = event.imageUrl || event.image_url || event.imageURL;
        
        console.log('🖼️ Image URL to delete:', imageUrl);
        
        if (imageUrl) {
          try {
            await uploadApi.deleteImage(imageUrl);
            console.log('✅ Event image deleted from R2 successfully');
          } catch (imageError) {
            console.warn('⚠️ Failed to delete event image from R2:', imageError);
          }
        } else {
          console.log('ℹ️ No image URL found for event, skipping image deletion');
        }
      }
      
      return result;
    } catch (error) {
      console.error('❌ Failed to delete event:', error);
      throw error;
    }
  },
};

// Artists API functions
export const artistsApi = {
  getAll: ({ page = 1, limit = 1000 } = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    return apiCall(`admin/artists?${params.toString()}`);
  },
  create: (artist) => apiCall('admin/artists', 'POST', artist),
  update: async (id, artist) => {
    // If there's an old image and a new one, delete the old one
    if (artist.oldImageUrl && artist.imageUrl && artist.oldImageUrl !== artist.imageUrl) {
      try {
        await uploadApi.deleteImage(artist.oldImageUrl);
        console.log('✅ Old artist image deleted successfully');
      } catch (error) {
        console.warn('⚠️ Failed to delete old artist image:', error);
      }
      
      // Remove oldImageUrl from the data sent to backend
      const { oldImageUrl, ...updateData } = artist;
      return apiCall(`admin/artists/${id}`, 'PUT', updateData);
    }
    
    return apiCall(`admin/artists/${id}`, 'PUT', artist);
  },
  delete: async (id) => {
    try {
      // First get the artist to find the image URL
      const artists = await artistsApi.getAll();
      const artist = artists.data?.find(item => item.id === id);
      
      console.log('🔍 Found artist for deletion:', artist);
      
      // Delete the artist record
      const result = await apiCall(`admin/artists/${id}`, 'DELETE');
      
      // If successful and artist had an image, delete it from R2
      if (result.success && artist) {
        // Try multiple possible field names for the image URL
        const imageUrl = artist.imageUrl || artist.image_url || artist.imageURL;
        
        console.log('🖼️ Image URL to delete:', imageUrl);
        
        if (imageUrl) {
          try {
            await uploadApi.deleteImage(imageUrl);
            console.log('✅ Artist image deleted from R2 successfully');
          } catch (imageError) {
            console.warn('⚠️ Failed to delete artist image from R2:', imageError);
          }
        } else {
          console.log('ℹ️ No image URL found for artist, skipping image deletion');
        }
      }
      
      return result;
    } catch (error) {
      console.error('❌ Failed to delete artist:', error);
      throw error;
    }
  },
};

// Blogs API functions
export const blogsApi = {
  getAll: () => apiCall('admin/blogs'),
  create: (blog) => apiCall('admin/blogs', 'POST', blog),
  update: async (id, blog) => {
    // If there's an old image and a new one, delete the old one
    if (blog.oldImageUrl && blog.imageUrl && blog.oldImageUrl !== blog.imageUrl) {
      try {
        await uploadApi.deleteImage(blog.oldImageUrl);
        console.log('✅ Old blog image deleted successfully');
      } catch (error) {
        console.warn('⚠️ Failed to delete old blog image:', error);
      }
      
      // Remove oldImageUrl from the data sent to backend
      const { oldImageUrl, ...updateData } = blog;
      return apiCall(`admin/blogs/${id}`, 'PUT', updateData);
    }
    
    return apiCall(`admin/blogs/${id}`, 'PUT', blog);
  },
  delete: async (id) => {
    try {
      // First get the blog to find the image URL
      const blogs = await blogsApi.getAll();
      const blog = blogs.data?.find(item => item.id === id);
      
      console.log('🔍 Found blog for deletion:', blog);
      
      // Delete the blog record
      const result = await apiCall(`admin/blogs/${id}`, 'DELETE');
      
      // If successful and blog had an image, delete it from R2
      if (result.success && blog) {
        // Try multiple possible field names for the image URL
        const imageUrl = blog.imageUrl || blog.image_url || blog.imageURL;
        
        console.log('🖼️ Image URL to delete:', imageUrl);
        
        if (imageUrl) {
          try {
            await uploadApi.deleteImage(imageUrl);
            console.log('✅ Blog image deleted from R2 successfully');
          } catch (imageError) {
            console.warn('⚠️ Failed to delete blog image from R2:', imageError);
          }
        } else {
          console.log('ℹ️ No image URL found for blog, skipping image deletion');
        }
      }
      
      return result;
    } catch (error) {
      console.error('❌ Failed to delete blog:', error);
      throw error;
    }
  },
};

// Images (General Media) API functions
export const imagesApi = {
  getAll: () => apiCall('admin/images'),
  create: async (imageItem) => apiCall('admin/images', 'POST', imageItem),
  update: async (id, imageItem) => {
    // If there's an old image and a new one, delete the old one in R2
    if (imageItem.oldImageUrl && imageItem.imageUrl && imageItem.oldImageUrl !== imageItem.imageUrl) {
      try {
        await uploadApi.deleteImage(imageItem.oldImageUrl);
        console.log('✅ Old image asset deleted successfully');
      } catch (error) {
        console.warn('⚠️ Failed to delete old image asset:', error);
      }
      const { oldImageUrl, ...updateData } = imageItem;
      return apiCall(`admin/images/${id}`, 'PUT', updateData);
    }
    return apiCall(`admin/images/${id}`, 'PUT', imageItem);
  },
  delete: async (id) => {
    try {
      // Fetch current to find image URL
      const list = await imagesApi.getAll();
      const found = list.data?.find(item => item.id === id);
      const result = await apiCall(`admin/images/${id}`, 'DELETE');
      if (result.success && found) {
        const imageUrl = found.imageUrl || found.image_url || found.url;
        if (imageUrl) {
          try {
            await uploadApi.deleteImage(imageUrl);
            console.log('✅ Image asset deleted from R2 successfully');
          } catch (imgErr) {
            console.warn('⚠️ Failed to delete image asset from R2:', imgErr);
          }
        }
      }
      return result;
    } catch (error) {
      console.error('❌ Failed to delete image asset:', error);
      throw error;
    }
  },
};

// Contacts API functions (consolidated and fixed)
export const contactsApi = {
  getAll: () => apiCall('admin/contacts'),
  update: (id, contact) => apiCall(`admin/contacts/${id}`, 'PUT', contact),
  delete: (id) => apiCall(`admin/contacts/${id}`, 'DELETE'),
  markAsRead: (id) => apiCall(`admin/contacts/${id}/read`, 'PUT'),
  reply: (replyData) => apiCall('admin/contacts/reply', 'POST', replyData),
};

// Upload API functions
export const uploadApi = {
  uploadImage: async (file, folder = 'general', name = undefined) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file');
      }
      
      // Check file size (5MB limit to match backend)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }
      
      console.log('🔼 Starting image upload:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        folder: folder,
        endpoint: `${config.apiBaseUrl}/upload/image`
      });
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder); // Add folder parameter
      if (name && typeof name === 'string') {
        formData.append('name', name);
      }
      
      const response = await fetch(`${config.apiBaseUrl}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      const result = await response.json();
      
      console.log('📤 Upload response received:', {
        status: response.status,
        result
      });
      
      if (!response.ok) {
        throw new Error(result.message || 'Image upload failed');
      }
      
      // Validate the response structure
      if (result.success && result.data && result.data.url) {
        console.log('✅ Image uploaded successfully to R2:', result.data.url);
      } else {
        console.warn('⚠️ Unexpected response structure:', result);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Image upload error:', error);
      throw error;
    }
  },

  uploadVideo: async (file, folder = 'videos', name = undefined) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Validate file
      if (!file.type.startsWith('video/')) {
        throw new Error('Please select a valid video file');
      }
      
      // Check file size (50MB limit for videos to match backend)
      if (file.size > 50 * 1024 * 1024) {
        throw new Error('Video file size must be less than 50MB');
      }
      
      console.log('🎬 Starting video upload:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        folder: folder,
        endpoint: `${config.apiBaseUrl}/upload/image`  // Using /upload/image which supports videos
      });
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      if (name && typeof name === 'string') {
        formData.append('name', name);
      }
      
      const response = await fetch(`${config.apiBaseUrl}/upload/image`, {  // Using /upload/image
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      const result = await response.json();
      
      console.log('📤 Video upload response received:', {
        status: response.status,
        result
      });
      
      if (!response.ok) {
        throw new Error(result.message || 'Video upload failed');
      }
      
      // Validate the response structure
      if (result.success && result.data && result.data.url) {
        console.log('✅ Video uploaded successfully to R2:', result.data.url);
      } else {
        console.warn('⚠️ Unexpected response structure:', result);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Video upload error:', error);
      throw error;
    }
  },

  uploadTicketPDF: async (pdfBlob, ticketId) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Check file size (10MB limit for PDFs)
      if (pdfBlob.size > 10 * 1024 * 1024) {
        throw new Error('PDF file size must be less than 10MB');
      }
      
      console.log('🎫 Starting ticket PDF upload:', {
        ticketId: ticketId,
        fileSize: pdfBlob.size,
        fileType: pdfBlob.type,
        folder: 'tickets',
        endpoint: `${config.apiBaseUrl}/upload/pdf`
      });
      
      const formData = new FormData();
      formData.append('file', pdfBlob, `ticket_${ticketId}.pdf`);
      formData.append('folder', 'tickets');
      formData.append('ticketId', ticketId);
      
      const response = await fetch(`${config.apiBaseUrl}/upload/pdf`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      const result = await response.json();
      
      console.log('🎫 Ticket PDF upload response:', {
        status: response.status,
        result
      });
      
      if (!response.ok) {
        throw new Error(result.message || 'Ticket PDF upload failed');
      }
      
      if (result.success && result.data && result.data.url) {
        console.log('✅ Ticket PDF uploaded successfully to R2:', result.data.url);
      } else {
        console.warn('⚠️ Unexpected response structure:', result);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Ticket PDF upload error:', error);
      throw error;
    }
  },

  // Utility function to safely extract R2 URL from upload result
  getImageUrl: (uploadResult) => {
    if (uploadResult && uploadResult.success && uploadResult.data && uploadResult.data.url) {
      return uploadResult.data.url;
    }
    console.warn('⚠️ Invalid upload result structure:', uploadResult);
    return null;
  },
  
  // Utility function to extract image key from R2 URL for deletion
  extractImageKey: (imageUrl) => {
    if (!imageUrl) return null;
    
    try {
      // Handle different URL formats
      // Format 1: https://pub-9cdd84716e0341ba9fa9c0b6875b5572.r2.dev/folder/filename.jpg
      // Format 2: https://custom-domain.com/folder/filename.jpg
      const url = new URL(imageUrl);
      const pathname = url.pathname;
      
      // Remove leading slash and return the path (includes folder/filename)
      return pathname.startsWith('/') ? pathname.substring(1) : pathname;
    } catch (error) {
      console.warn('⚠️ Failed to extract image key from URL:', imageUrl, error);
      return null;
    }
  },
  
  deleteImage: async (imageUrl) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Extract the image key from the URL
      const imageKey = uploadApi.extractImageKey(imageUrl);
      
      if (!imageKey) {
        throw new Error('Invalid image URL - cannot extract key for deletion');
      }
      
      console.log('🗑️ Deleting image:', {
        originalUrl: imageUrl,
        extractedKey: imageKey
      });
      
      const response = await fetch(`${config.apiBaseUrl}/upload/image/${encodeURIComponent(imageKey)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      console.log('🗑️ Delete response:', {
        status: response.status,
        result
      });
      
      if (!response.ok) {
        throw new Error(result.message || 'Image deletion failed');
      }
      
      return result;
    } catch (error) {
      console.error('❌ Image deletion error:', error);
      throw error;
    }
  },
  
  generatePresignedUrl: async (filename, contentType) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${config.apiBaseUrl}/upload/presigned-url`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename, contentType }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to generate presigned URL');
      }
      
      return result;
    } catch (error) {
      console.error('Presigned URL generation error:', error);
      throw error;
    }
  }
};

// Tickets API functions
export const ticketsApi = {
  getAll: async () => {
    try {
      return await apiCall('admin/tickets');
    } catch (error) {
      console.warn('Admin tickets endpoint not available, trying public tickets:', error);
      try {
        return await apiCall('tickets');
      } catch (fallbackError) {
        console.warn('Tickets endpoint not available, returning empty array:', fallbackError);
        return {
          success: false,
          data: [],
          message: 'Tickets endpoint not yet implemented'
        };
      }
    }
  },
  create: async (ticket) => {
    // Create the ticket record - no automatic PDF generation
    const response = await apiCall('admin/tickets', 'POST', ticket);
    return response;
  },
  update: (id, ticket) => apiCall(`admin/tickets/${id}`, 'PUT', ticket),
  updatePartial: (id, updates) => apiCall(`admin/tickets/${id}`, 'PATCH', updates),
  delete: async (id) => {
    try {
      // First get the ticket to find the PDF URL
      const tickets = await ticketsApi.getAll();
      const ticket = tickets.data?.find(item => item.id === id);
      
      console.log('🔍 Found ticket for deletion:', ticket);
      
      // Delete the ticket record
      const result = await apiCall(`admin/tickets/${id}`, 'DELETE');
      
      // If successful and ticket had a PDF, delete it from R2
      if (result.success && ticket) {
        const pdfUrl = ticket.url;
        
        console.log('🎫 PDF URL to delete:', pdfUrl);
        
        if (pdfUrl) {
          try {
            await uploadApi.deleteImage(pdfUrl); // Uses same delete function
            console.log('✅ Ticket PDF deleted from R2 successfully');
          } catch (pdfError) {
            console.warn('⚠️ Failed to delete ticket PDF from R2:', pdfError);
          }
        } else {
          console.log('ℹ️ No PDF URL found for ticket, skipping PDF deletion');
        }
      }
      
      return result;
    } catch (error) {
      console.error('❌ Failed to delete ticket:', error);
      throw error;
    }
  },
  verify: (ticketCode) => apiCall('tickets/verify', 'POST', { code: ticketCode }),
  verifyById: (ticketId) => apiCall(`tickets/verify/${ticketId}`, 'GET'),
  
  // Helper function to generate PDF blob (to be implemented)
  generatePDFBlob: async (ticket) => {
    // This will be implemented to generate PDF blob from ticket data
    // For now, return null to avoid breaking existing functionality
    console.log('🎫 PDF generation requested for ticket:', ticket.ticket_number);
    return null;
  },
};

// Financials API functions
export const financialsApi = {
  list: ({ eventId, page = 1, limit = 100, year, month } = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (eventId) params.set('event_id', String(eventId));
    if (year) params.set('year', String(year));
    if (month) params.set('month', String(month));
    return apiCall(`admin/financials?${params.toString()}`);
  },
  create: (record) => apiCall('admin/financials', 'POST', record),
  update: (id, updates) => apiCall(`admin/financials/${id}`, 'PUT', updates),
  remove: (id) => apiCall(`admin/financials/${id}`, 'DELETE'),
  monthlySummary: (year) => {
    const params = new URLSearchParams();
    if (year) params.set('year', String(year));
    return apiCall(`admin/financials/summary/monthly?${params.toString()}`);
  },
  yearlySummary: () => apiCall('admin/financials/summary/yearly'),
  analytics: () => apiCall('admin/financials/analytics')
};

// Authentication API functions
export const authApi = {
  login: async (credentials) => {
    console.log('🔐 Login attempt starting...', { email: credentials.email, apiUrl: `${config.apiBaseUrl}/admin/login` });
    
    try {
      const response = await fetch(`${config.apiBaseUrl}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Essential for CORS with credentials
        body: JSON.stringify(credentials),
      });
      
      console.log('🌐 Login response received:', { 
        status: response.status, 
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url
      });
      
      const result = await response.json();
      console.log('📄 Login response data:', result);
      
      if (!response.ok) {
        console.error('❌ Login failed - HTTP error:', { status: response.status, result });
        throw new Error(result.error || result.message || 'Login failed');
      }
      
      if (result.success && result.token) {
        console.log('✅ Login successful, storing token...');
        localStorage.setItem('adminToken', result.token);
        localStorage.setItem('adminUser', JSON.stringify(result.user));
      }
      
      return result;
    } catch (error) {
      console.error('💥 Login error:', error);
      console.error('🔍 Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  },
  
  verifyToken: async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No token found');
    }
    
    try {
      const response = await fetch(`${config.apiBaseUrl}/admin/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Token verification failed');
      }
      
      return result;
    } catch (error) {
      console.error('Token verification error:', error);
      // Remove invalid token
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },
  
  isAuthenticated: () => {
    return localStorage.getItem('adminToken') !== null;
  }
};

// Hero Banners API functions
export const heroBannersApi = {
  getAll: ({ page = 1, limit = 20 } = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    return apiCall(`admin/hero-banners?${params}`);
  },

  getActive: () => {
    return apiCall('hero-banners');
  },

  create: (bannerData) => {
    return apiCall('admin/hero-banners', 'POST', bannerData);
  },

  update: (id, bannerData) => {
    return apiCall(`admin/hero-banners/${id}`, 'PUT', bannerData);
  },

  delete: (id) => {
    return apiCall(`admin/hero-banners/${id}`, 'DELETE');
  }
};

// Moments API functions
export const momentsApi = {
  getAll: async ({ page = 1, limit = 1000 } = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    return apiCall(`admin/moments?${params.toString()}`);
  },
  
  create: async (moment) => {
    return apiCall('admin/moments', 'POST', moment);
  },
  
  update: async (id, moment) => {
    // If there are old images and new ones, delete old ones
    if (moment.oldPhotos && moment.photos) {
      const oldUrls = moment.oldPhotos;
      const newUrls = moment.photos;
      
      // Find URLs that are in old but not in new (deleted images)
      const deletedUrls = oldUrls.filter(url => !newUrls.includes(url));
      
      // Delete each removed image
      for (const url of deletedUrls) {
        try {
          await uploadApi.deleteImage(url);
          console.log('✅ Old moment image deleted successfully:', url);
        } catch (error) {
          console.warn('⚠️ Failed to delete old moment image:', error);
        }
      }
      
      // Remove oldPhotos from the data sent to backend
      const { oldPhotos, ...updateData } = moment;
      return apiCall(`admin/moments/${id}`, 'PUT', updateData);
    }
    
    return apiCall(`admin/moments/${id}`, 'PUT', moment);
  },
  
  delete: async (id) => {
    try {
      // First get the moment to find the image URLs
      const moments = await momentsApi.getAll();
      const moment = moments.data?.find(item => item.id === id);
      
      console.log('🔍 Found moment for deletion:', moment);
      
      // Delete the moment record
      const result = await apiCall(`admin/moments/${id}`, 'DELETE');
      
      // If successful and moment had images, delete them from R2
      if (result.success && moment) {
        const photos = moment.photos;
        
        console.log('🖼️ Photos to delete:', photos);
        
        if (photos && Array.isArray(photos) && photos.length > 0) {
          for (const photoUrl of photos) {
            try {
              await uploadApi.deleteImage(photoUrl);
              console.log('✅ Moment image deleted from R2 successfully:', photoUrl);
            } catch (imageError) {
              console.warn('⚠️ Failed to delete moment image from R2:', imageError);
            }
          }
        } else {
          console.log('ℹ️ No photos found for moment, skipping image deletion');
        }
      }
      
      return result;
    } catch (error) {
      console.error('❌ Failed to delete moment:', error);
      throw error;
    }
  },
};

// User Authentication API functions
export const userAuthApi = {
  // User login
  login: async (credentials) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || result.message || 'Login failed');
      }
      
      if (result.success && result.token) {
        localStorage.setItem('userToken', result.token);
        localStorage.setItem('userData', JSON.stringify(result.data));
      }
      
      return result;
    } catch (error) {
      console.error('User login error:', error);
      throw error;
    }
  },
  
  // User signup
  signup: async (userData) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || result.message || 'Signup failed');
      }
      
      if (result.success && result.token) {
        localStorage.setItem('userToken', result.token);
        localStorage.setItem('userData', JSON.stringify(result.data));
      }
      
      return result;
    } catch (error) {
      console.error('User signup error:', error);
      throw error;
    }
  },
  
  // Google authentication
  googleAuth: async (googleToken) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ token: googleToken }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || result.message || 'Google authentication failed');
      }
      
      if (result.success && result.token) {
        localStorage.setItem('userToken', result.token);
        localStorage.setItem('userData', JSON.stringify(result.data));
      }
      
      return result;
    } catch (error) {
      console.error('Google auth error:', error);
      throw error;
    }
  },
  
  // Verify user token
  verifyToken: async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error('No token found');
    }
    
    try {
      console.log('userAuthApi.verifyToken - Calling /api/auth/me');
      const response = await fetch(`${config.apiBaseUrl}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      console.log('userAuthApi.verifyToken - Response status:', response.status);
      const result = await response.json();
      console.log('userAuthApi.verifyToken - Response data:', result);
      
      if (!response.ok) {
        console.error('userAuthApi.verifyToken - Failed:', response.status, result);
        // Don't remove tokens here - let the context decide
        const error = new Error(result.error || 'Token verification failed');
        error.status = response.status;
        throw error;
      }
      
      return result;
    } catch (error) {
      console.error('Token verification error:', error);
      // Only clear tokens on auth errors, not network errors
      if (error.status === 401 || error.status === 403) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
      }
      throw error;
    }
  },
  
  // Update user profile
  updateProfile: async (updates) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Profile update failed');
      }
      
      if (result.success && result.data) {
        localStorage.setItem('userData', JSON.stringify(result.data));
      }
      
      return result;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },
  
  // User logout
  logout: () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem('userToken') !== null;
  },
  
  // ============================================
  // OTP & PASSWORD RESET METHODS
  // ============================================
  
  // Request OTP for verification/login
  requestOTP: async (email, purpose = 'verification') => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, purpose }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to send OTP');
      }
      
      return result;
    } catch (error) {
      console.error('Request OTP error:', error);
      throw error;
    }
  },
  
  // Verify OTP
  verifyOTP: async (email, otp, purpose = 'verification') => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, otp, purpose }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || result.message || 'OTP verification failed');
      }
      
      // If OTP login, store token and user data
      if (result.success && result.token) {
        localStorage.setItem('userToken', result.token);
        localStorage.setItem('userData', JSON.stringify(result.data));
      }
      
      return result;
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  },
  
  // Request password reset
  forgotPassword: async (email) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to process request');
      }
      
      return result;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },
  
  // Reset password with token
  resetPassword: async (token, newPassword) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ token, newPassword }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to reset password');
      }
      
      return result;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },
  
  // Reset password with OTP (after OTP verification)
  resetPasswordWithOTP: async (email, otp, newPassword) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/reset-password-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, otp, newPassword }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to reset password');
      }
      
      return result;
    } catch (error) {
      console.error('Reset password with OTP error:', error);
      throw error;
    }
  },
  
  // Admin: Get all users
  getAllUsers: async () => {
    // Try userToken first (for regular users who are admins), then adminToken (for admin portal)
    let token = localStorage.getItem('userToken');
    let tokenType = 'user';
    
    if (!token) {
      token = localStorage.getItem('adminToken');
      tokenType = 'admin';
    }
    
    console.log('getAllUsers - Using token type:', tokenType);
    console.log('getAllUsers - Token exists:', !!token);
    console.log('getAllUsers - Token value:', token ? token.substring(0, 20) + '...' : 'null');
    
    if (!token) {
      console.error('getAllUsers - No token found. Must log in first.');
      throw new Error('Not authenticated - Please log in as admin first');
    }
    
    try {
      console.log('getAllUsers - Fetching from:', `${config.apiBaseUrl}/api/admin/users`);
      const response = await fetch(`${config.apiBaseUrl}/api/admin/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      console.log('getAllUsers - Response status:', response.status);
      const result = await response.json();
      console.log('getAllUsers - Response data:', result);
      
      if (!response.ok) {
        throw new Error(result.error || `Failed to fetch users (${response.status})`);
      }
      
      return result;
    } catch (error) {
      console.error('getAllUsers - Error:', error);
      throw error;
    }
  },
  
  // Admin: Delete user
  deleteUser: async (userId) => {
    // Try userToken first, then adminToken
    let token = localStorage.getItem('userToken');
    if (!token) {
      token = localStorage.getItem('adminToken');
    }
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete user');
      }
      
      return result;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};
