// Optimized Service Worker - Smart chunk caching
// Caches chunks on-demand, no upfront loading

const CACHE_NAME = 'kalakritam-v3';
const RUNTIME_CACHE = 'kalakritam-runtime-v3';

// Only cache essential static assets initially
const STATIC_ASSETS = [
  '/',
  '/index.html'
];

// Install - minimal caching, skip waiting to activate immediately
self.addEventListener('install', (event) => {
  console.log('SW: Installing with smart caching...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - Smart caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip all API requests and external resources - let them go directly to network
  if (url.pathname.includes('/api/') || 
      url.hostname.includes('api.') ||
      url.hostname.includes('analytics') ||
      url.hostname.includes('google') ||
      url.hostname.includes('cloudflareinsights') ||
      url.hostname !== self.location.hostname) {
    return; // Let the request go to network
  }
  
  // For JS/CSS chunks: Always go to network to avoid stale bundle mismatches
  if (request.destination === 'script' || request.destination === 'style') {
    return;
  }
  
  // For images: Cache-first strategy
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        });
      })
    );
    return;
  }
  
  // For navigation requests, network-first with fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/index.html');
      })
    );
    return;
  }
  
  // For everything else: Network first, cache fallback
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});
