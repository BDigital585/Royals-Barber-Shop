/**
 * This file handles the client-side fetching of Contentful content.
 * Instead of direct Contentful API calls, we now use our server API endpoint
 * which has access to environment variables.
 */

// Types for the Hero Content from Contentful
export interface SiteHero {
  title: string;
  subtitle?: string;
  videoUrl?: string;
  backgroundImage?: {
    fields: {
      file: {
        url: string;
      };
    };
  };
}

// Function to get the hero content by fetching from our server API
export async function getHeroContent(): Promise<SiteHero | null> {
  try {
    // Fetch content from our server endpoint instead of directly from Contentful
    const response = await fetch('/api/contentful/hero');
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Contentful data from API:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching hero content from API:', error);
    return null;
  }
}