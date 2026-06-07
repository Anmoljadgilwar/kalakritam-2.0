// React Toastify Configuration
import { Bounce, Slide, Zoom, Flip } from 'react-toastify';

export const toastConfig = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
  transition: Bounce,
  newestOnTop: true,
  rtl: false,
  closeButton: true,
  icon: true,
  style: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    color: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  }
};

// Different positions
export const TOAST_POSITIONS = {
  TOP_LEFT: "top-left",
  TOP_RIGHT: "top-right",
  TOP_CENTER: "top-center",
  BOTTOM_LEFT: "bottom-left",
  BOTTOM_RIGHT: "bottom-right",
  BOTTOM_CENTER: "bottom-center",
};

// Different transitions
export const TOAST_TRANSITIONS = {
  BOUNCE: Bounce,
  SLIDE: Slide,
  ZOOM: Zoom,
  FLIP: Flip,
};

// Toast types with custom icons
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  DEFAULT: 'default',
  PROMISE: 'promise',
};

// Custom icons for each type
export const TOAST_ICONS = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
  loading: '⏳',
  promise: '🔄',
};

export default toastConfig;
