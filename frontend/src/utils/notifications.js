import { muiToastService } from '../components/MuiToastContainer/muiToastService.js';

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

// Dynamic notification manager connecting to MUI Toast Service
class NotificationManager {
  subscribe(listener) {
    return muiToastService.subscribe(listener);
  }

  add(notification) {
    const severity = notification.type === 'error' ? 'error' :
                     notification.type === 'success' ? 'success' :
                     notification.type === 'warning' ? 'warning' : 'info';
    return muiToastService.show(severity, notification.message, {
      duration: notification.duration,
      ...notification
    });
  }

  remove(id) {
    muiToastService.dismiss(id);
  }

  dismiss(id) {
    muiToastService.dismiss(id);
  }

  clear() {
    muiToastService.clear();
  }

  success(msg, opts) { return muiToastService.success(msg, opts); }
  error(msg, opts) { return muiToastService.error(msg, opts); }
  warning(msg, opts) { return muiToastService.warning(msg, opts); }
  info(msg, opts) { return muiToastService.info(msg, opts); }
  loading(msg, opts) { return muiToastService.loading(msg, opts); }
  promise(promise, msgs, opts) { return muiToastService.promise(promise, msgs, opts); }
  update(id, opts) { muiToastService.update(id, opts); }

  // Semantic connection & operation wrappers
  serverConnecting(msg, opts) { return muiToastService.show('info', msg || 'Connecting to server...', { duration: 0, loading: true, ...opts }); }
  serverConnected(msg, opts) { return muiToastService.success(msg || 'Server connected!', opts); }
  serverDisconnected(msg, opts) { return muiToastService.error(msg || 'Server connection lost', opts); }
  serverError(msg, opts) { return muiToastService.error(msg || 'Server error occurred', opts); }

  apiRequest(msg, opts) { return muiToastService.loading(msg || 'Making API request...', opts); }
  apiSuccess(msg, opts) { return muiToastService.success(msg || 'API request completed!', opts); }
  apiError(msg, opts) { return muiToastService.error(msg || 'API request failed', opts); }

  dataSaving(msg, opts) { return muiToastService.loading(msg || 'Saving data...', opts); }
  dataSaved(msg, opts) { return muiToastService.success(msg || 'Data saved successfully!', opts); }
  dataLoading(msg, opts) { return muiToastService.loading(msg || 'Loading data...', opts); }
  dataLoaded(msg, opts) { return muiToastService.success(msg || 'Data loaded successfully!', opts); }

  fileUploading(msg, opts) { return muiToastService.loading(msg || 'Uploading file...', opts); }
  fileUploaded(msg, opts) { return muiToastService.success(msg || 'File uploaded successfully!', opts); }
  fileDeleting(msg, opts) { return muiToastService.loading(msg || 'Deleting file...', opts); }
  fileDeleted(msg, opts) { return muiToastService.success(msg || 'File deleted successfully!', opts); }

  authLoading(msg, opts) { return muiToastService.loading(msg || 'Authenticating...', opts); }
  authSuccess(msg, opts) { return muiToastService.success(msg || 'Authenticated successfully!', opts); }
  authError(msg, opts) { return muiToastService.error(msg || 'Authentication failed', opts); }

  formSubmitting(msg, opts) { return muiToastService.loading(msg || 'Submitting form...', opts); }
  formSubmitted(msg, opts) { return muiToastService.success(msg || 'Form submitted successfully!', opts); }
  formError(msg, opts) { return muiToastService.error(msg || 'Form submission failed', opts); }

  validationError(msg, opts) { return muiToastService.warning(msg || 'Validation failed', opts); }
  copied(msg, opts) { return muiToastService.success(msg || 'Copied to clipboard!', { duration: 2000, ...opts }); }
}

export const notificationManager = new NotificationManager();

export const toast = {
  success: (msg, opts) => muiToastService.success(msg, opts),
  error: (msg, opts) => muiToastService.error(msg, opts),
  warning: (msg, opts) => muiToastService.warning(msg, opts),
  info: (msg, opts) => muiToastService.info(msg, opts),
  loading: (msg, opts) => muiToastService.loading(msg, opts),
  promise: (promise, msgs, opts) => muiToastService.promise(promise, msgs, opts),
  dismiss: (id) => muiToastService.dismiss(id),
  update: (id, opts) => muiToastService.update(id, opts),
  clear: () => muiToastService.clear(),

  serverConnecting: (msg, opts) => muiToastService.show('info', msg || 'Connecting to server...', { duration: 0, loading: true, ...opts }),
  serverConnected: (msg, opts) => muiToastService.success(msg || 'Server connected!', opts),
  serverDisconnected: (msg, opts) => muiToastService.error(msg || 'Server connection lost', opts),
  serverError: (msg, opts) => muiToastService.error(msg || 'Server error occurred', opts),

  apiRequest: (msg, opts) => muiToastService.loading(msg || 'Making API request...', opts),
  apiSuccess: (msg, opts) => muiToastService.success(msg || 'API request completed!', opts),
  apiError: (msg, opts) => muiToastService.error(msg || 'API request failed', opts),

  dataSaving: (msg, opts) => muiToastService.loading(msg || 'Saving data...', opts),
  dataSaved: (msg, opts) => muiToastService.success(msg || 'Data saved successfully!', opts),
  dataLoading: (msg, opts) => muiToastService.loading(msg || 'Loading data...', opts),
  dataLoaded: (msg, opts) => muiToastService.success(msg || 'Data loaded successfully!', opts),

  fileUploading: (msg, opts) => muiToastService.loading(msg || 'Uploading file...', opts),
  fileUploaded: (msg, opts) => muiToastService.success(msg || 'File uploaded successfully!', opts),
  fileDeleting: (msg, opts) => muiToastService.loading(msg || 'Deleting file...', opts),
  fileDeleted: (msg, opts) => muiToastService.success(msg || 'File deleted successfully!', opts),

  authLoading: (msg, opts) => muiToastService.loading(msg || 'Authenticating...', opts),
  authSuccess: (msg, opts) => muiToastService.success(msg || 'Authenticated successfully!', opts),
  authError: (msg, opts) => muiToastService.error(msg || 'Authentication failed', opts),

  formSubmitting: (msg, opts) => muiToastService.loading(msg || 'Submitting form...', opts),
  formSubmitted: (msg, opts) => muiToastService.success(msg || 'Form submitted successfully!', opts),
  formError: (msg, opts) => muiToastService.error(msg || 'Form submission failed', opts),

  validationError: (msg, opts) => muiToastService.warning(msg || 'Validation failed', opts),
  copied: (msg, opts) => muiToastService.success(msg || 'Copied to clipboard!', { duration: 2000, ...opts }),
};

export default notificationManager;
