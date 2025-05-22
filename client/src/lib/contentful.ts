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
  backgroundImage?: string | null;
}

// Types for the Royals Body Content from Contentful
export interface RoyalsBody {
  id: string;
  content?: any; // Rich text content from Contentful
}

// Types for Blog Posts from Contentful
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  content?: any; // Rich text content from Contentful
  authorName?: string;
  publishedAt: string;
}

// Function to get the homepage hero content by fetching from our server API
export async function getHeroContent(): Promise<SiteHero | null> {
  try {
    // Fetch content from our server endpoint instead of directly from Contentful
    const response = await fetch('/api/contentful/hero');
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Homepage hero content from API:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching hero content from API:', error);
    return null;
  }
}

// Function to get the Browse Haircuts hero content
export async function getBrowseHaircutsHeroContent(): Promise<SiteHero | null> {
  try {
    const response = await fetch('/api/contentful/browse-haircuts-hero');
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Browse Haircuts hero content from API:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching Browse Haircuts hero content from API:', error);
    return null;
  }
}

// Function to fetch all blog posts from Contentful via our server API
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch('/api/contentful/blog');
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Blog posts from API:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching blog posts from API:', error);
    return [];
  }
}

// Function to fetch the Royals Body content
export async function getRoyalsBodyContent(): Promise<RoyalsBody | null> {
  try {
    const response = await fetch('/api/contentful/royals-body');
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Royals Body content from API:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching Royals Body content from API:', error);
    return null;
  }
}

// Function to fetch a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`/api/contentful/blog/${slug}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
}