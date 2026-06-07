/**
 * Dynamic chunk preloading utility
 * Only preloads chunks that are likely to be needed soon
 */

const preloadedChunks = new Set();

/**
 * Preload a chunk by dynamically creating a link tag
 * @param {string} chunkPath - Path to the chunk file
 */
export const preloadChunk = (chunkPath) => {
  if (preloadedChunks.has(chunkPath)) {
    return; // Already preloaded
  }

  const link = document.createElement('link');
  link.rel = 'modulepreload';
  link.href = chunkPath;
  document.head.appendChild(link);
  preloadedChunks.add(chunkPath);
};

/**
 * Preload chunks for a specific route
 * This should be called when user hovers over navigation links
 * @param {string} route - The route name to preload chunks for
 */
export const preloadRouteChunks = (route) => {
  // Map routes to their component imports
  const routeImports = {
    '/home': () => import('../components/Home'),
    '/gallery': () => import('../components/Gallery'),
    '/workshops': () => import('../components/Workshops'),
    '/artists': () => import('../components/Artists'),
    '/events': () => import('../components/Events'),
    '/contact': () => import('../components/Contact'),
    '/about': () => import('../components/About'),
    '/artblogs': () => import('../components/ArtBlogs'),
    '/artparty': () => import('../components/ArtParty'),
    '/moments': () => import('../components/Moments'),
  };

  const importFunc = routeImports[route];
  if (importFunc) {
    // Trigger the import to start loading the chunk
    importFunc().catch(() => {
      // Silently fail - chunk will load when actually navigated to
    });
  }
};

/**
 * Priority-based preloading
 * Preload chunks based on user behavior and route priority
 */
export const preloadCriticalChunks = () => {
  // These are the most visited pages - preload after initial render
  const criticalRoutes = ['/home', '/gallery'];
  
  criticalRoutes.forEach(route => {
    // Small delay to not block initial render
    setTimeout(() => preloadRouteChunks(route), 100);
  });
};

/**
 * Intersection Observer-based preloading
 * Preload chunks when navigation elements come into view
 */
export const observeNavigationLinks = () => {
  if (!('IntersectionObserver' in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const link = entry.target;
          const href = link.getAttribute('href');
          if (href && href.startsWith('/')) {
            preloadRouteChunks(href);
            observer.unobserve(link); // Only preload once
          }
        }
      });
    },
    {
      rootMargin: '50px', // Start loading 50px before element is visible
    }
  );

  // Observe all navigation links
  document.querySelectorAll('nav a, header a').forEach((link) => {
    observer.observe(link);
  });
};

export default {
  preloadChunk,
  preloadRouteChunks,
  preloadCriticalChunks,
  observeNavigationLinks,
};
