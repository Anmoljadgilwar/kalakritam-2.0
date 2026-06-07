import { toast } from './notifications.js';

class ApiClient {
  constructor(baseURL = '', options = {}) {
    this.baseURL = baseURL;
    this.defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...this.defaultOptions,
      ...options,
      headers: {
        ...this.defaultOptions.headers,
        ...options.headers
      }
    };

    // Show loading notification for non-GET requests or if explicitly requested
    const shouldShowLoading = options.showLoading || (config.method && config.method !== 'GET');
    let loadingNotificationId = null;

    if (shouldShowLoading) {
      loadingNotificationId = toast.loading(
        options.loadingMessage || 'Processing request...'
      );
    }

    try {
      const response = await fetch(url, config);

      // Dismiss loading notification
      if (loadingNotificationId) {
        toast.dismiss(loadingNotificationId);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Show success notification if explicitly requested
      if (options.showSuccess && options.successMessage) {
        toast.success(options.successMessage);
      }

      return {
        data,
        status: response.status,
        headers: response.headers
      };
    } catch (error) {
      // Dismiss loading notification
      if (loadingNotificationId) {
        toast.dismiss(loadingNotificationId);
      }

      // Handle different types of errors
      if (error.name === 'AbortError') {
        toast.warning('Request was cancelled');
      } else if (error.message.includes('Failed to fetch')) {
        toast.serverError('Network error - please check your connection');
      } else {
        const errorMessage = options.errorMessage || error.message || 'An error occurred';
        toast.error(errorMessage);
      }

      throw error;
    }
  }

  // Convenience methods
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  // File upload method
  upload(endpoint, formData, options = {}) {
    const uploadOptions = {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
        ...Object.fromEntries(
          Object.entries(options.headers || {}).filter(([key]) => 
            key.toLowerCase() !== 'content-type'
          )
        )
      }
    };

    return this.request(endpoint, uploadOptions);
  }
}

// Create a default API client instance
export const apiClient = new ApiClient();

// Export the class for custom instances
export default ApiClient;
