import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { useLoading } from '../contexts/LoadingContext.jsx';

// Map paths to custom loading messages
const getLoadingMessage = (path) => {
  const normalizedPath = path.toLowerCase().replace(/\/u\/[^\/]+/, '');
  
  if (normalizedPath === '/' || normalizedPath === '/home' || normalizedPath === '') {
    return 'Loading Home...';
  }
  if (normalizedPath.startsWith('/gallery/')) {
    return 'Loading Artwork...';
  }
  if (normalizedPath === '/gallery') {
    return 'Loading Gallery...';
  }
  if (normalizedPath.startsWith('/workshops/')) {
    return 'Loading Workshop...';
  }
  if (normalizedPath === '/workshops') {
    return 'Loading Workshops...';
  }
  if (normalizedPath.startsWith('/events/')) {
    return 'Loading Event...';
  }
  if (normalizedPath === '/events') {
    return 'Loading Events...';
  }
  if (normalizedPath === '/artists') {
    return 'Loading Artists...';
  }
  if (normalizedPath === '/art-party') {
    return 'Loading Art Party...';
  }
  if (normalizedPath === '/blogs' || normalizedPath === '/art-blogs') {
    return 'Loading Blogs...';
  }
  if (normalizedPath === '/contact') {
    return 'Loading Contact...';
  }
  if (normalizedPath === '/about') {
    return 'Loading About...';
  }
  if (normalizedPath === '/moments') {
    return 'Loading Moments...';
  }
  if (normalizedPath === '/dashboard') {
    return 'Loading Dashboard...';
  }
  if (normalizedPath === '/login' || normalizedPath === '/user-login') {
    return 'Loading Login...';
  }
  if (normalizedPath.startsWith('/admin')) {
    return 'Loading Admin Panel...';
  }
  if (normalizedPath === '/privacy-policy') {
    return 'Loading Privacy Policy...';
  }
  if (normalizedPath === '/terms-of-service') {
    return 'Loading Terms of Service...';
  }
  
  return 'Loading...';
};

export const useNavigationWithLoading = () => {
  const { isLoading, setIsLoading, setLoadingMessage } = useLoading();
  const navigate = useNavigate();

  const navigateWithLoading = useCallback((path) => {
    // Force scroll to top immediately and synchronously
    const forceScrollTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      const appContent = document.querySelector('.app-content');
      if (appContent) appContent.scrollTop = 0;
      
      const app = document.querySelector('.app');
      if (app) app.scrollTop = 0;
    };
    
    // Scroll immediately
    forceScrollTop();
    
    // Set custom loading message based on path
    setLoadingMessage(getLoadingMessage(path));
    setIsLoading(true);
    
    // Navigate immediately without delay
    requestAnimationFrame(() => {
      forceScrollTop();
      navigate(path);
      
      // Hide loading after a short delay
      setTimeout(() => {
        setIsLoading(false);
        setLoadingMessage('');
      }, 300);
    });
  }, [navigate, setIsLoading, setLoadingMessage]);

  return { isLoading, navigateWithLoading };
};
