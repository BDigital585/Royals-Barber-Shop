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
        // This is a reference to another entry
        heroContent = pageSettingsFields.hero;
      } else {
        console.log('Using pageSettings directly as hero content');
        // The pageSettings entry itself contains the hero content
        heroContent = latestEntry;
      }
      
      // Log the hero content for debugging
      console.log('Hero content fields:', Object.keys(heroContent.fields || {}));
      
      // Extract video data - using optional chaining for safety
      const videoUrl = heroContent.fields?.videoUrl || '';
      console.log('Video URL:', videoUrl);
      
      // Extract image data if present
      let backgroundImageUrl = null;
      if (heroContent.fields?.backgroundImage) {
        const imageAsset = heroContent.fields.backgroundImage;
        // Make sure we have a valid image asset
        if (imageAsset.fields && imageAsset.fields.file) {
          backgroundImageUrl = `https:${imageAsset.fields.file.url}`;
          console.log('Background image URL:', backgroundImageUrl);
        }
      }
      
      // Format the final response data
      const heroData = {
        title: heroContent.fields?.title || 'Hero Title',
        subtitle: heroContent.fields?.subtitle || '',
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

  const httpServer = createServer(app);

  return httpServer;
}
