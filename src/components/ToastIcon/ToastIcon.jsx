import React from 'react';

// Professional SVG Icons for Toast Notifications
const ToastIcons = {
  success: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"
        fill="currentColor"
      />
    </svg>
  ),

  error: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z"
        fill="currentColor"
      />
    </svg>
  ),

  warning: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 17H19L10 2L1 17ZM11 14H9V12H11V14ZM11 10H9V6H11V10Z"
        fill="currentColor"
      />
    </svg>
  ),

  info: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V9H11V15ZM11 7H9V5H11V7Z"
        fill="currentColor"
      />
    </svg>
  ),

  loading: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 2V6M10 14V18M4.22 4.22L6.34 6.34M13.66 13.66L15.78 15.78M2 10H6M14 10H18M4.22 15.78L6.34 13.66M13.66 6.34L15.78 4.22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  server: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 3H16C17.1 3 18 3.9 18 5V7C18 8.1 17.1 9 16 9H4C2.9 9 2 8.1 2 7V5C2 3.9 2.9 3 4 3ZM4 11H16C17.1 11 18 11.9 18 13V15C18 16.1 17.1 17 16 17H4C2.9 17 2 16.1 2 15V13C2 11.9 2.9 11 4 11ZM15 6C15.6 6 16 5.6 16 5C16 4.4 15.6 4 15 4C14.4 4 14 4.4 14 5C14 5.6 14.4 6 15 6ZM15 14C15.6 14 16 13.6 16 13C16 12.4 15.6 12 15 12C14.4 12 14 12.4 14 13C14 13.6 14.4 14 15 14Z"
        fill="currentColor"
      />
    </svg>
  ),

  network: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 9L2 8C6.97 3.03 13.03 3.03 18 8L19 9L18 10C13.03 14.97 6.97 14.97 2 10L1 9ZM10 6C12.76 6 15 8.24 15 11C15 13.76 12.76 16 10 16C7.24 16 5 13.76 5 11C5 8.24 7.24 6 10 6ZM10 8C8.34 8 7 9.34 7 11C7 12.66 8.34 14 10 14C11.66 14 13 12.66 13 11C13 9.34 11.66 8 10 8Z"
        fill="currentColor"
      />
    </svg>
  ),

  close: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 4L4 12M4 4L12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  upload: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 1L6 5H8V11H12V5H14L10 1ZM4 13V17H16V13H18V17C18 18.1 17.1 19 16 19H4C2.9 19 2 18.1 2 17V13H4Z"
        fill="currentColor"
      />
    </svg>
  ),

  download: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 15L14 11H12V5H8V11H6L10 15ZM4 17H16V19H4V17Z"
        fill="currentColor"
      />
    </svg>
  ),

  save: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 9H5L6.5 3H13.5L15 9ZM7 10H13V14H7V10ZM5 2L3 9V19H17V9L15 2H5Z"
        fill="currentColor"
      />
    </svg>
  ),

  delete: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 19C6 20.1 6.9 21 8 21H12C13.1 21 14 20.1 14 19V7H6V19ZM15 4H12.5L11.5 3H8.5L7.5 4H5V6H15V4Z"
        fill="currentColor"
      />
    </svg>
  ),

  edit: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 17.25V14.25L14.25 3L17.25 6L6 17.25H3ZM16.06 2.94C16.45 2.55 17.08 2.55 17.47 2.94L18.06 3.53C18.45 3.92 18.45 4.55 18.06 4.94L17.25 5.75L15.25 3.75L16.06 2.94Z"
        fill="currentColor"
      />
    </svg>
  ),

  copy: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 1H4C2.9 1 2 1.9 2 3V13H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V17C6 18.1 6.9 19 8 19H19C20.1 19 21 18.1 21 17V7C21 5.9 20.1 5 19 5ZM19 17H8V7H19V17Z"
        fill="currentColor"
      />
    </svg>
  )
};

const ToastIcon = ({ type, customIcon, className = '' }) => {
  // If custom icon is provided (string or ReactNode)
  if (customIcon) {
    if (typeof customIcon === 'string') {
      return <span className={`toast-icon-emoji ${className}`}>{customIcon}</span>;
    }
    return <span className={`toast-icon-custom ${className}`}>{customIcon}</span>;
  }

  // Use professional SVG icons
  const IconComponent = ToastIcons[type] || ToastIcons.info;
  
  return (
    <span className={`toast-icon-svg ${className}`}>
      {IconComponent}
    </span>
  );
};

export default ToastIcon;
export { ToastIcons };
