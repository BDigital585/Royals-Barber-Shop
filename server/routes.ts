import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  const apiPrefix = "/api";

  // Get services
  app.get(`${apiPrefix}/services`, async (req, res) => {
    try {
      const services = await db.query.services.findMany();
      return res.status(200).json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      return res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Get gallery items with optional category filter
  app.get(`${apiPrefix}/gallery`, async (req, res) => {
    try {
      const { category } = req.query;
      
      if (category && typeof category === 'string' && category !== 'all') {
        const galleryItems = await db.query.galleryItems.findMany({
          where: eq(schema.galleryItems.category, category)
        });
        return res.status(200).json(galleryItems);
      } else {
        const galleryItems = await db.query.galleryItems.findMany();
        return res.status(200).json(galleryItems);
      }
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      return res.status(500).json({ message: "Failed to fetch gallery items" });
    }
  });

  // Get blog posts
  app.get(`${apiPrefix}/blog/posts`, async (req, res) => {
    try {
      const blogPosts = await db.query.blogPosts.findMany();
      return res.status(200).json(blogPosts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Get single blog post by ID
  app.get(`${apiPrefix}/blog/posts/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const blogPost = await db.query.blogPosts.findFirst({
        where: eq(schema.blogPosts.id, parseInt(id))
      });
      
      if (!blogPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      return res.status(200).json(blogPost);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Subscribe to newsletter
  app.post(`${apiPrefix}/newsletter/subscribe`, async (req, res) => {
    try {
      const { email } = req.body;
      
      // Validate email
      const validatedData = schema.subscribersInsertSchema.parse({ email });
      
      // Check if email already exists
      const existingSubscriber = await db.query.subscribers.findFirst({
        where: eq(schema.subscribers.email, validatedData.email)
      });
      
      if (existingSubscriber) {
        return res.status(400).json({ message: "Email already subscribed" });
      }
      
      // Insert new subscriber
      const [newSubscriber] = await db.insert(schema.subscribers)
        .values(validatedData)
        .returning();
      
      return res.status(201).json({ 
        message: "Successfully subscribed to newsletter",
        subscriber: newSubscriber
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid email address", 
          errors: error.errors 
        });
      }
      
      console.error("Error subscribing to newsletter:", error);
      return res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // Get subscribers (for admin purposes)
  app.get(`${apiPrefix}/newsletter/subscribers`, async (req, res) => {
    try {
      const subscribers = await db.query.subscribers.findMany();
      return res.status(200).json(subscribers);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      return res.status(500).json({ message: "Failed to fetch subscribers" });
    }
  });

  // Get Contentful hero content
  app.get(`${apiPrefix}/contentful/hero`, async (req, res) => {
    try {
      // Import directly at the top level in the main file
      const { createClient } = await import('contentful');
      
      // Print environment variables for debugging
      console.log('Contentful environment variables check:', {
        spaceId: process.env.CONTENTFUL_SPACE_ID ? 'exists' : 'missing',
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN ? 'exists' : 'missing',
        environment: process.env.CONTENTFUL_ENVIRONMENT ? 'exists' : 'missing'
      });
      
      // Create client with environment variables
      const client = createClient({
        space: process.env.CONTENTFUL_SPACE_ID || '',
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
        environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
      });
      
      // Fetch the latest published entry of content type "pageSettings"
      // Sort by sys.updatedAt in descending order to get the most recently updated entry
      const pageSettings = await client.getEntries({
        content_type: 'pageSettings',
        // TypeScript doesn't like the string format for order, but it works
        order: ['-sys.updatedAt'] as any, // Sort by updated date descending
        limit: 1,
        include: 10 // Include linked entries (up to 10 levels deep to ensure we get everything)
      });
      
      console.log('Found pageSettings entries:', pageSettings.items.length);
      
      if (!pageSettings.items.length) {
        throw new Error('No pageSettings found');
      }
      
      // Log the entry ID and title for debugging
      const latestEntry = pageSettings.items[0];
      console.log('Latest pageSettings entry:', {
        id: latestEntry.sys?.id,
        contentType: latestEntry.sys?.contentType?.sys?.id,
        updatedAt: latestEntry.sys?.updatedAt,
        fieldKeys: Object.keys(latestEntry.fields || {})
      });
      
      // Get the hero content directly from the pageSettings entry
      const pageSettingsFields = latestEntry.fields as any;
      
      // Check if we have a direct hero content or need to follow a reference
      let heroContent: any;
      
      if (pageSettingsFields.hero) {
        console.log('Found hero reference in pageSettings');
        
        // This is a reference to another entry - log the complete hero reference object
        console.log('Hero reference object:', JSON.stringify(pageSettingsFields.hero, null, 2));
        
        heroContent = pageSettingsFields.hero;
      } else {
        console.log('Using pageSettings directly as hero content');
        // The pageSettings entry itself contains the hero content
        heroContent = latestEntry;
      }
      
      // Log the hero content fields structure
      console.log('Hero content fields structure:', heroContent.fields ? Object.keys(heroContent.fields) : 'No fields found');
      
      // For the sitehero content type, extract the needed fields
      // The structure might be different than expected, let's check various possibilities
      
      // Extract title - may be directly in fields or in a nested structure
      const title = heroContent.fields?.title || 'Royals Barbershop';
      console.log('Title:', title);
      
      // Extract subtitle if available
      const subtitle = heroContent.fields?.subtitle || '';
      console.log('Subtitle:', subtitle);
      
      // Try different possible paths for the video URL
      let videoUrl = '';
      
      // Looking at the logs, we can see the actual structure is different
      // The video URL is directly in heroContent.fields.file.url
      if (heroContent.fields?.file && heroContent.fields.file.url) {
        console.log('Found video file in direct file field');
        const fileData = heroContent.fields.file;
        
        // For Contentful assets, we always want to use the file URL
        // QuickTime video files (.MOV) are valid and should work in browsers
        // Make sure we have a proper URL with https:
        videoUrl = fileData.url.startsWith('//') 
          ? `https:${fileData.url}` 
          : fileData.url;
        
        console.log('Extracted video URL:', videoUrl);
        console.log('Video content type:', fileData.contentType);
        console.log('Video filename:', fileData.fileName);
      } else if (heroContent.fields?.videoUrl) {
        // Direct videoUrl field
        videoUrl = heroContent.fields.videoUrl;
      }
      console.log('Video URL:', videoUrl);
      
      // Extract image data - check multiple possible paths
      let backgroundImageUrl = null;
      
      // Check if backgroundImage is a direct field
      if (heroContent.fields?.backgroundImage) {
        const imageAsset = heroContent.fields.backgroundImage;
        console.log('Image asset found:', imageAsset);
        
        // If it's a direct asset reference with fields
        if (imageAsset.fields && imageAsset.fields.file) {
          backgroundImageUrl = `https:${imageAsset.fields.file.url}`;
        }
      } 
      // If the image is stored in 'file' field instead
      else if (heroContent.fields?.file) {
        const fileData = heroContent.fields.file;
        console.log('File field found:', fileData);
        
        // It might be a direct file object or a reference to an asset
        if (fileData.fields && fileData.fields.file) {
          backgroundImageUrl = `https:${fileData.fields.file.url}`;
        }
      }
      
      console.log('Background image URL:', backgroundImageUrl);
      
      // Format the final response data
      const heroData = {
        title: title,
        subtitle: subtitle,
        videoUrl: videoUrl,
        backgroundImage: backgroundImageUrl
      };
      
      return res.status(200).json(heroData);
    } catch (error) {
      console.error("Error fetching Contentful hero content:", error);
      return res.status(500).json({ 
        message: "Failed to fetch Contentful content",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Serve SEO-related files directly from the public directory
  app.get('/robots.txt', (req, res) => {
    res.sendFile('robots.txt', { root: './public' });
  });

  app.get('/sitemap.xml', (req, res) => {
    res.sendFile('sitemap.xml', { root: './public' });
  });

  const httpServer = createServer(app);

  return httpServer;
}
