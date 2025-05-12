import { useMemo } from 'react';

// Auto-import every image in sub-folders of assets/haircuts
const modules = import.meta.glob('/src/assets/haircuts/*/*.{jpg,jpeg,png,webp}', { eager: true });

type ImageMap = Record<string, string[]>;

// Build an object { "fades": [url1,url2], ... }
export function useHaircutImages() {
  return useMemo(() => {
    const map: ImageMap = {};
    
    for (const path in modules) {
      const match = path.match(/haircuts\/([^/]+)\/([^/]+)$/);
      if (match) {
        const [, folder, file] = match;
        if (!map[folder]) map[folder] = [];
        
        // Vite's import.meta.glob returns a module with a default export for images
        // @ts-ignore - TypeScript doesn't know about Vite's module structure
        const imageUrl = modules[path].default;
        
        if (imageUrl) {
          map[folder].push(imageUrl);
          console.log(`Added image: ${path} -> ${imageUrl}`);
        }
      }
    }
    
    console.log('Image map:', map);
    return map;
  }, []);
}