import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Robust scroll restoration & reset on route changes.
// - Scrolls window, documentElement, body, and known scrollable containers
// - Avoids resetting when navigating to an in-page hash
export default function ScrollToTop() {
  const location = useLocation();
  const lastPathRef = useRef(location.pathname + location.search + location.hash);

  useEffect(() => {
    const { pathname, hash } = location;
    const full = pathname + location.search + hash;
    const comingFrom = lastPathRef.current;
    lastPathRef.current = full;

    // If navigating to same path hash anchor, don't force top
    if (hash && comingFrom.startsWith(pathname) && comingFrom !== full) {
      return;
    }

    // Force instant scroll behavior via CSS
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';

    const scrollTargets = [
      window,
      document.documentElement,
      document.body,
      document.querySelector('.app-content'),
      document.querySelector('.app'),
      document.querySelector('#root')
    ].filter(Boolean);

    const doScroll = () => {
      // Force scroll position to 0
      scrollTargets.forEach(t => {
        if (t === window) {
          window.scrollTo(0, 0);
        } else {
          t.scrollTop = 0;
        }
      });
    };

    // Perform immediately, synchronously - multiple times to ensure it sticks
    doScroll();
    requestAnimationFrame(doScroll);
    setTimeout(doScroll, 0);
    setTimeout(doScroll, 10);
    setTimeout(doScroll, 50);
    setTimeout(doScroll, 100);
    setTimeout(doScroll, 200);
    setTimeout(doScroll, 500);
    setTimeout(doScroll, 1000);
  }, [location]);

  return null;
}
