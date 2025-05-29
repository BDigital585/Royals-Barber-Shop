import { useEffect } from 'react';

interface MetaTagsProps {
  title: string;
  description: string;
  imageUrl?: string;
  type?: string;
  url?: string;
}

/**
 * A component to dynamically update meta tags for SEO and social sharing
 */
const MetaTags = ({ 
  title, 
  description, 
  imageUrl, 
  type = 'website',
  url
}: MetaTagsProps) => {
  useEffect(() => {
    // Get the current URL if not provided
    const currentUrl = url || window.location.href;
    
    // Use a default image if none provided
    const defaultImage = '/shophero.JPG';
    const metaImage = imageUrl || defaultImage;
    
    // Ensure image URL is absolute
    const absoluteImageUrl = metaImage.startsWith('http') 
      ? metaImage 
      : `${window.location.origin}${metaImage}`;

    // Update document title
    document.title = title;
    
    // Helper function to update or create meta tag
    const updateOrCreateMeta = (selector: string, content: string, attribute = 'content') => {
      let tag = document.querySelector(selector);
      if (tag) {
        tag.setAttribute(attribute, content);
      } else {
        tag = document.createElement('meta');
        if (selector.includes('property=')) {
          const property = selector.match(/property="([^"]+)"/)?.[1];
          if (property) tag.setAttribute('property', property);
        } else if (selector.includes('name=')) {
          const name = selector.match(/name="([^"]+)"/)?.[1];
          if (name) tag.setAttribute('name', name);
        }
        tag.setAttribute(attribute, content);
        document.head.appendChild(tag);
      }
    };

    // Update standard meta tags
    updateOrCreateMeta('meta[name="description"]', description);
    
    // Update Open Graph tags
    updateOrCreateMeta('meta[property="og:type"]', type);
    updateOrCreateMeta('meta[property="og:title"]', title);
    updateOrCreateMeta('meta[property="og:description"]', description);
    updateOrCreateMeta('meta[property="og:image"]', absoluteImageUrl);
    updateOrCreateMeta('meta[property="og:image:width"]', '1200');
    updateOrCreateMeta('meta[property="og:image:height"]', '630');
    updateOrCreateMeta('meta[property="og:url"]', currentUrl);
    updateOrCreateMeta('meta[property="og:site_name"]', 'Royals Barber Shop');
    
    // Update Twitter Card tags
    updateOrCreateMeta('meta[name="twitter:card"]', 'summary_large_image');
    updateOrCreateMeta('meta[name="twitter:title"]', title);
    updateOrCreateMeta('meta[name="twitter:description"]', description);
    updateOrCreateMeta('meta[name="twitter:image"]', absoluteImageUrl);
    updateOrCreateMeta('meta[name="twitter:site"]', '@royalsbarbershop585');
    
    // Add article-specific tags if type is article
    if (type === 'article') {
      updateOrCreateMeta('meta[property="article:author"]', 'Royals Barber Shop');
      updateOrCreateMeta('meta[property="article:section"]', 'Barbershop');
    }
    
  }, [title, description, imageUrl, type, url]);
  
  return null;
};

export default MetaTags;