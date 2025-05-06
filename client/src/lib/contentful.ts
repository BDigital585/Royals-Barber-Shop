import { createClient, Entry, EntrySkeletonType } from 'contentful';

// Create a Contentful client instance
export const contentfulClient = createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID || '',
  accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN || '',
  environment: import.meta.env.CONTENTFUL_ENVIRONMENT || 'master',
});

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

// Function to get the hero content by ID
export async function getHeroContent(entryId: string): Promise<SiteHero | null> {
  try {
    const entry = await contentfulClient.getEntry(entryId);
    
    // Safely cast the entry fields to our expected type
    const heroData = {
      title: entry.fields.title as string,
      subtitle: entry.fields.subtitle as string | undefined,
      videoUrl: entry.fields.videoUrl as string | undefined,
      backgroundImage: entry.fields.backgroundImage as any,
    };
    
    return heroData;
  } catch (error) {
    console.error('Error fetching hero content from Contentful:', error);
    return null;
  }
}