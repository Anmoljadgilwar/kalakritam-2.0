import React from 'react';
import './KalakritamLogo.css';

/**
 * KalakritamLogo Component
 * 
 * A reusable logo component that displays the Kalakritam logo from a CDN URL.
 * No local image imports required - uses direct HTTPS link for maximum portability.
 * 
 * @param {Object} props
 * @param {string} props.width - Custom width (default: '140px')
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.alt - Custom alt text (default: 'Kalakritam - Manifesting Through Art')
 * @param {function} props.onClick - Optional click handler
 */
const KalakritamLogo = ({ 
  width = '140px', 
  className = '', 
  alt = 'Kalakritam - Manifesting Through Art',
  onClick 
}) => {
  const logoUrl = 'https://pub-9cdd84716e0341ba9fa9c0b6875b5572.r2.dev/kalakritamLogo.png';

  return (
    <img
      src={logoUrl}
      alt={alt}
      className={`kalakritam-logo ${className}`}
      style={{ width }}
      onClick={onClick}
      loading="lazy"
      decoding="async"
    />
  );
};

export default KalakritamLogo;

/**
 * HTML EMAIL SNIPPET - Copy & Paste Ready
 * =======================================
 * Use this snippet in HTML emails with inline styling:
 * 
 * <img 
 *   src="https://pub-9cdd84716e0341ba9fa9c0b6875b5572.r2.dev/kalakritamLogo.png" 
 *   alt="Kalakritam - Manifesting Through Art" 
 *   style="width: 140px; height: auto; display: block; max-width: 100%;" 
 * />
 * 
 * For centered logo in emails:
 * 
 * <div style="text-align: center;">
 *   <img 
 *     src="https://pub-9cdd84716e0341ba9fa9c0b6875b5572.r2.dev/kalakritamLogo.png" 
 *     alt="Kalakritam - Manifesting Through Art" 
 *     style="width: 140px; height: auto; display: inline-block; max-width: 100%;" 
 *   />
 * </div>
 */
