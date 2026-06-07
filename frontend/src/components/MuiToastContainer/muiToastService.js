// MUI Toast Service - EventEmitter pattern
let toastId = 0;
const listeners = [];

export const muiToastService = {
  subscribe(listener) {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  },

  emit(toast) {
    listeners.forEach(listener => listener(toast));
  },

  show(severity, message, options = {}) {
    const id = `toast-${++toastId}`;
    const toast = {
      id,
      severity,
      message,
      duration: options.duration !== undefined ? options.duration : 5000,
      icon: options.icon,
      onClose: options.onClose,
      ...options
    };
    this.emit(toast);
    return id;
  },

  success(message, options = {}) {
    return this.show('success', message, { duration: 3000, ...options });
  },

  error(message, options = {}) {
    return this.show('error', message, { duration: 7000, ...options });
  },

  warning(message, options = {}) {
    return this.show('warning', message, { duration: 5000, ...options });
  },

  info(message, options = {}) {
    return this.show('info', message, { duration: 5000, ...options });
  },

  loading(message, options = {}) {
    return this.show('info', message, { duration: 0, loading: true, ...options });
  },

  promise(promise, messages, options = {}) {
    const loadingId = this.loading(messages.pending || 'Processing...');
    
    promise
      .then(() => {
        this.dismiss(loadingId);
        this.success(messages.success || 'Success!', options);
      })
      .catch(() => {
        this.dismiss(loadingId);
        this.error(messages.error || 'Error occurred', options);
      });

    return promise;
  },

  dismiss(id) {
    this.emit({ id, action: 'close' });
  },

  update(id, options) {
    this.emit({ id, action: 'update', ...options });
  },

  clear() {
    this.emit({ action: 'clear' });
  }
};

export const toast = muiToastService;
