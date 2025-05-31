import { useEffect } from 'react';

interface PreloadOptions {
  priority?: 'high' | 'low';
  delay?: number;
}

export function usePreloadImages(imageUrls: string[], options: PreloadOptions = {}) {
  const { priority = 'low', delay = 0 } = options;

  useEffect(() => {
    const preloadTimeout = setTimeout(() => {
      imageUrls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        if (priority === 'high') {
          link.setAttribute('fetchpriority', 'high');
        }
        document.head.appendChild(link);
      });
    }, delay);

    return () => {
      clearTimeout(preloadTimeout);
    };
  }, [imageUrls, priority, delay]);
}

export function usePreloadImagesInBackground(imageUrls: string[]) {
  useEffect(() => {
    // Use requestIdleCallback if available, otherwise use setTimeout
    const schedulePreload = (callback: () => void) => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(callback);
      } else {
        setTimeout(callback, 100);
      }
    };

    schedulePreload(() => {
      imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    });
  }, [imageUrls]);
}