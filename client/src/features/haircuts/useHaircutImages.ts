import { useMemo } from 'react';

// Auto-import every image in sub-folders of assets/haircuts
const modules = import.meta.glob('/src/assets/haircuts/*/*.{jpg,jpeg,png,webp}', { eager: true });

// Define the structure for each image item
export interface HaircutImage {
  url: string;           // The image URL for display
  folder: string;        // The folder name (category)
  filename: string;      // The filename for sharing
  fullPath: string;      // The full path for reference
}

// Define the structure for the image map
type ImageMap = Record<string, HaircutImage[]>;

// Build an object { "fades": [{url, folder, filename}], ... }
export function useHaircutImages() {
  return useMemo(() => {
    const map: ImageMap = {};
    
    for (const path in modules) {
      const match = path.match(/haircuts\/([^/]+)\/([^/]+)$/);
      if (match) {
        const [, folder, filename] = match;
        if (!map[folder]) map[folder] = [];
        
        // Vite's import.meta.glob returns a module with a default export for images
        // @ts-ignore - TypeScript doesn't know about Vite's module structure
        const imageUrl = modules[path].default;
        
        if (imageUrl) {
          map[folder].push({
            url: imageUrl,
            folder,
            filename,
            fullPath: path
          });
          console.log(`Added image: ${path} -> ${imageUrl}`);
        }
      }
    }
    
    console.log('Image map:', map);
    return map;
  }, []);
}