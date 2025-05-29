import { useState, useEffect } from 'react';

// Define the shape of our image map (folder name -> array of image URLs)
export type ImageMap = Record<string, string[]>;

// Build an object { "fades": [url1,url2], ... } from public folder
export function useHaircutImages(): ImageMap {
  const [imageMap, setImageMap] = useState<ImageMap>({});

  useEffect(() => {
    // Fetch the list of haircut images from the server
    fetch('/api/haircut-images')
      .then(response => response.json())
      .then(data => {
        console.log('Image map from server:', data);
        setImageMap(data);
      })
      .catch(error => {
        console.error('Error loading haircut images:', error);
        setImageMap({});
      });
  }, []);

  return imageMap;
}