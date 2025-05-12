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
    // Cache the original values to restore when component unmounts
    const originalTitle = document.title;
    const originalDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    
    // Update standard meta tags
    document.title = title;
    
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute('content', description);
    }
    
    // Update Open Graph tags
    const ogTitleTag = document.querySelector('meta[property="og:title"]');
    const ogDescTag = document.querySelector('meta[property="og:description"]');
    const ogImageTag = document.querySelector('meta[property="og:image"]');
    const ogTypeTag = document.querySelector('meta[property="og:type"]');
    const ogUrlTag = document.querySelector('meta[property="og:url"]');
    
    if (ogTitleTag) ogTitleTag.setAttribute('content', title);
    if (ogDescTag) ogDescTag.setAttribute('content', description);
    if (ogImageTag && imageUrl) ogImageTag.setAttribute('content', imageUrl);
    if (ogTypeTag) ogTypeTag.setAttribute('content', type);
    if (ogUrlTag && url) ogUrlTag.setAttribute('content', url);
    
    // Update Twitter tags
    const twitterTitleTag = document.querySelector('meta[name="twitter:title"]');
    const twitterDescTag = document.querySelector('meta[name="twitter:description"]');
    const twitterImageTag = document.querySelector('meta[name="twitter:image"]');
    
    if (twitterTitleTag) twitterTitleTag.setAttribute('content', title);
    if (twitterDescTag) twitterDescTag.setAttribute('content', description);
    if (twitterImageTag && imageUrl) twitterImageTag.setAttribute('content', imageUrl);
    
    // Cleanup function to restore original meta tags when component unmounts
    return () => {
      document.title = originalTitle;
      
      if (descriptionTag) {
        descriptionTag.setAttribute('content', originalDescription);
      }
      
      if (ogTitleTag) ogTitleTag.setAttribute('content', originalTitle);
      if (ogDescTag) ogDescTag.setAttribute('content', originalDescription);
      
      if (twitterTitleTag) twitterTitleTag.setAttribute('content', originalTitle);
      if (twitterDescTag) twitterDescTag.setAttribute('content', originalDescription);
    };
  }, [title, description, imageUrl, type, url]);
  
  // This component doesn't render anything, it just updates the meta tags
  return null;
};

export default MetaTags;