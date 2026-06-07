// Notifications disabled - all functions are no-ops
// This file maintains API compatibility with existing code

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  LOADING: 'loading'
};

export const NOTIFICATION_POSITIONS = {
  TOP_RIGHT: 'top-right',
  TOP_LEFT: 'top-left',
  TOP_CENTER: 'top-center',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_CENTER: 'bottom-center'
};

// No-op notification manager for compatibility
class NotificationManager {
  constructor() {
    this.activeToasts = new Map();
  }

  // All methods return a fake ID and do nothing
  success() { return 'noop'; }
  error() { return 'noop'; }
  warning() { return 'noop'; }
  info() { return 'noop'; }
  loading() { return 'noop'; }
  promise(promise) { return promise; }
  update() {}
  remove() {}
  dismiss() {}
  clear() {}

  // Server connection notifications (no-ops)
  serverConnecting() { return 'noop'; }
  serverConnected() { return 'noop'; }
  serverDisconnected() { return 'noop'; }
  serverError() { return 'noop'; }

  // API notifications (no-ops)
  apiRequest() { return 'noop'; }
  apiSuccess() { return 'noop'; }
  apiError() { return 'noop'; }

  // Data operations (no-ops)
  dataSaving() { return 'noop'; }
  dataSaved() { return 'noop'; }
  dataLoading() { return 'noop'; }
  dataLoaded() { return 'noop'; }

  // File operations (no-ops)
  fileUploading() { return 'noop'; }
  fileUploaded() { return 'noop'; }
  fileDeleting() { return 'noop'; }
  fileDeleted() { return 'noop'; }

  // Authentication (no-ops)
  authLoading() { return 'noop'; }
  authSuccess() { return 'noop'; }
  authError() { return 'noop'; }

  // Form operations (no-ops)
  formSubmitting() { return 'noop'; }
  formSubmitted() { return 'noop'; }
  formError() { return 'noop'; }

  // Validation (no-ops)
  validationError() { return 'noop'; }

  // Utility (no-ops)
  copied() { return 'noop'; }

  // Legacy methods (no-ops)
  add() { return 'noop'; }
  subscribe() { return () => {}; }
}

// Create global instance
export const notificationManager = new NotificationManager();

// Export convenience methods (all no-ops)
export const toast = {
  success: () => 'noop',
  error: () => 'noop',
  warning: () => 'noop',
  info: () => 'noop',
  loading: () => 'noop',
  promise: (promise) => promise,

  // Server connection methods
  serverConnecting: () => 'noop',
  serverConnected: () => 'noop',
  serverDisconnected: () => 'noop',
  serverError: () => 'noop',

  // API methods
  apiRequest: () => 'noop',
  apiSuccess: () => 'noop',
  apiError: () => 'noop',

  // Data operations
  dataSaving: () => 'noop',
  dataSaved: () => 'noop',
  dataLoading: () => 'noop',
  dataLoaded: () => 'noop',

  // File operations
  fileUploading: () => 'noop',
  fileUploaded: () => 'noop',
  fileDeleting: () => 'noop',
  fileDeleted: () => 'noop',

  // Authentication
  authLoading: () => 'noop',
  authSuccess: () => 'noop',
  authError: () => 'noop',

  // Form operations
  formSubmitting: () => 'noop',
  formSubmitted: () => 'noop',
  formError: () => 'noop',

  // Validation
  validationError: () => 'noop',

  // Utility
  copied: () => 'noop',

  // Utility methods
  dismiss: () => {},
  update: () => {},
  clear: () => {},
};

export default notificationManager;
