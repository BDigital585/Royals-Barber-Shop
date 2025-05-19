import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { ZodError } from "zod";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// The system prompt for the chatbot
const CHATBOT_SYSTEM_PROMPT = `You are Royals Barbershop's helpful assistant. Your job is to greet visitors, help them navigate the site, answer common questions, and encourage them to book an appointment.
Always stay professional, confident, and friendly. Keep answers short and helpful. If the user seems unsure, offer to help them find what they need.
The barbershop is located at 317 Ellicott Street, Batavia, NY. Hours are Tue 9–3, Wed–Fri 9–5, Sat 9–2. Phone: 585-536-6576.
If someone asks for pricing, services, or booking info, explain that appointments are made online, and suggest using the 'Book Now' button. Services may vary per barber.
If someone mentions being new, offer a warm welcome and briefly explain that Royals focuses on delivering a premium haircut experience with a community feel.
Avoid long responses. Don't make up info not listed here. Only talk about barber shop related things. If you're unsure, say: 'Let me have someone follow up with you!'`;

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  const apiPrefix = "/api";

  // Get shop images for the carousel
  app.get(`${apiPrefix}/shop-images`, (req, res) => {
    try {
      // Path to the shop folder
      const shopDir = path.join(process.cwd(), 'client', 'public', 'shop');
      
      // Check if directory exists
      if (!fs.existsSync(shopDir)) {
        return res.status(404).json({ message: 'Shop directory not found' });
      }
      
      // Get all files in the directory
      const files = fs.readdirSync(shopDir)
        .filter(file => {
          // Filter for image files with common extensions
          const ext = path.extname(file).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.bmp', '.jfif'].includes(ext);
        })
        .map(file => `/shop/${file}`);
      
      console.log(`Found ${files.length} shop images for carousel`);
      
      return res.status(200).json(files);
    } catch (error) {
      console.error("Error fetching shop images:", error);
      return res.status(500).json({ message: "Failed to fetch shop images" });
    }
  });

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
  
  // Chatbot API endpoint
  app.post(`${apiPrefix}/chatbot`, async (req, res) => {
    try {
      const { messages } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid request format. 'messages' array is required." });
      }

      // Prepend the system message to the conversation
      const fullMessages = [
        { role: "system", content: CHATBOT_SYSTEM_PROMPT },
        ...messages
      ];
      
      // Call OpenAI API
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 200, // Keeping responses fairly concise
      });
      
      // Extract and send the response
      const botResponse = response.choices[0].message;
      res.json({ response: botResponse });
      
    } catch (error: any) {
      console.error("Error processing chatbot request:", error);
      res.status(500).json({ 
        error: "Failed to process chatbot request",
        details: error.message || "Unknown error"
      });
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

  // Serve robots.txt directly from the public directory
  app.get('/robots.txt', (req, res) => {
    res.sendFile('robots.txt', { root: './public' });
  });

  // Generate sitemap.xml dynamically based on haircut data
  app.get('/sitemap.xml', async (req, res) => {
    try {
      // Current date in YYYY-MM-DD format for lastmod
      const today = new Date().toISOString().split('T')[0];
      
      // Start building sitemap XML
      let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
      sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      // Add static pages
      const staticPages = [
        { url: 'https://royals-barbershop.replit.app/', priority: '1.0', changefreq: 'weekly' },
        { url: 'https://royals-barbershop.replit.app/browse-haircuts', priority: '0.9', changefreq: 'weekly' },
        { url: 'https://royals-barbershop.replit.app/book-now', priority: '0.8', changefreq: 'weekly' },
        { url: 'https://royals-barbershop.replit.app/contact', priority: '0.7', changefreq: 'monthly' },
        { url: 'https://royals-barbershop.replit.app/blog', priority: '0.8', changefreq: 'weekly' },
        { url: 'https://royals-barbershop.replit.app/newsletter', priority: '0.6', changefreq: 'monthly' }
      ];
      
      // Add each static page to the sitemap
      staticPages.forEach(page => {
        sitemap += '  <url>\n';
        sitemap += `    <loc>${page.url}</loc>\n`;
        sitemap += `    <lastmod>${today}</lastmod>\n`;
        sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
        sitemap += `    <priority>${page.priority}</priority>\n`;
        sitemap += '  </url>\n';
      });
      
      // Use child_process to list haircut files
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execPromise = promisify(exec);
      
      try {
        // Get a list of all haircut files
        const { stdout } = await execPromise('find ./client/src/assets/haircuts -type f -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" -o -name "*.webp" | sort');
        
        if (stdout.trim()) {
          const files = stdout.trim().split('\n');
          
          for (const file of files) {
            // Extract category and filename from the path
            const matches = file.match(/haircuts\/([^/]+)\/([^/]+)$/);
            
            if (matches) {
              const [, category, filename] = matches;
              
              // Create the haircut URL with proper encoding
              const categorySlug = encodeURIComponent(category);
              const fileSlug = encodeURIComponent(filename);
              const haircutUrl = `https://royals-barbershop.replit.app/haircut/${categorySlug}/${fileSlug}`;
              
              // Add to sitemap
              sitemap += '  <url>\n';
              sitemap += `    <loc>${haircutUrl}</loc>\n`;
              sitemap += `    <lastmod>${today}</lastmod>\n`;
              sitemap += `    <changefreq>monthly</changefreq>\n`;
              sitemap += `    <priority>0.7</priority>\n`;
              sitemap += '  </url>\n';
            }
          }
        }
      } catch (err) {
        console.error('Error listing haircut files:', err);
      }
      
      // Close the sitemap
      sitemap += '</urlset>';
      
      // Set content type and send the generated sitemap
      res.header('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      // Fall back to static sitemap.xml file if dynamic generation fails
      res.sendFile('sitemap.xml', { root: './public' });
    }
  });

  // Get all blog posts from Contentful
  app.get(`${apiPrefix}/contentful/blog`, async (req, res) => {
    try {
      const { createClient } = await import('contentful');
      
      // Create client with environment variables
      const client = createClient({
        space: process.env.CONTENTFUL_SPACE_ID || '',
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
        environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
      });
      
      // Fetch all published entries of content type "royalsBlog"
      const blogEntries = await client.getEntries({
        content_type: 'royalsBlog',
        order: ['-sys.createdAt'], // Sort by published date descending (newest first)
        include: 2 // Include linked entries up to 2 levels deep (for images, etc.)
      });
      
      console.log(`Found ${blogEntries.items.length} blog entries`);
      
      // Transform Contentful response to a cleaner format
      const formattedPosts = blogEntries.items.map(entry => {
        const fields = entry.fields as any;
        
        // Get the featured image URL if it exists
        let featuredImageUrl = null;
        if (fields.featuredImage && fields.featuredImage.fields && fields.featuredImage.fields.file) {
          // Make sure we have a proper URL with https:
          featuredImageUrl = fields.featuredImage.fields.file.url.startsWith('//') 
            ? `https:${fields.featuredImage.fields.file.url}` 
            : fields.featuredImage.fields.file.url;
        }
        
        return {
          id: entry.sys.id,
          title: fields.title || 'Untitled Post',
          slug: fields.slug || entry.sys.id,
          excerpt: fields.excerpt || '',
          content: fields.content || null,
          authorName: fields.authorName || '',
          featuredImage: featuredImageUrl,
          publishedAt: entry.sys.createdAt
        };
      });
      
      return res.status(200).json(formattedPosts);
    } catch (error) {
      console.error("Error fetching Contentful blog posts:", error);
      return res.status(500).json({ 
        message: "Failed to fetch blog posts",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Get a single blog post by slug from Contentful
  app.get(`${apiPrefix}/contentful/blog/:slug`, async (req, res) => {
    try {
      const { slug } = req.params;
      const { createClient } = await import('contentful');
      
      // Create client with environment variables
      const client = createClient({
        space: process.env.CONTENTFUL_SPACE_ID || '',
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
        environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
      });
      
      // Fetch entry with matching slug
      const blogEntries = await client.getEntries({
        content_type: 'royalsBlog',
        'fields.slug': slug,
        include: 2 // Include linked entries (for images, etc.)
      });
      
      if (!blogEntries.items.length) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      const entry = blogEntries.items[0];
      const fields = entry.fields as any;
      
      // Get the featured image URL if it exists
      let featuredImageUrl = null;
      if (fields.featuredImage && fields.featuredImage.fields && fields.featuredImage.fields.file) {
        // Make sure we have a proper URL with https:
        featuredImageUrl = fields.featuredImage.fields.file.url.startsWith('//') 
          ? `https:${fields.featuredImage.fields.file.url}` 
          : fields.featuredImage.fields.file.url;
      }
      
      const formattedPost = {
        id: entry.sys.id,
        title: fields.title || 'Untitled Post',
        slug: fields.slug || entry.sys.id,
        excerpt: fields.excerpt || '',
        content: fields.content || null,
        authorName: fields.authorName || '',
        featuredImage: featuredImageUrl,
        publishedAt: entry.sys.createdAt
      };
      
      return res.status(200).json(formattedPost);
    } catch (error) {
      console.error("Error fetching Contentful blog post:", error);
      return res.status(500).json({ 
        message: "Failed to fetch blog post",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // SEO Audit endpoint
  app.post(`${apiPrefix}/seo/audit`, async (req, res) => {
    try {
      console.log('Running on-demand SEO audit...');
      
      // Path to the audit script
      const auditScriptPath = path.resolve('./utils/contentful-seo-audit.ts');
      
      // Create reports directory if it doesn't exist
      const reportsDir = path.resolve('./reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }
      
      // Generate report file name with date and timestamp
      const date = new Date();
      const timestamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}-${String(date.getMinutes()).padStart(2, '0')}`;
      const reportFileName = `seo-audit-${timestamp}.log`;
      const reportPath = path.join(reportsDir, reportFileName);
      
      // Run the audit script
      console.log(`Executing audit script: ${auditScriptPath}`);
      const output = execSync(`tsx ${auditScriptPath}`, { encoding: 'utf8' });
      
      // Write output to report file
      fs.writeFileSync(reportPath, output);
      
      // Return the audit results to the client
      // Clean the output from color codes for cleaner response
      const cleanOutput = output.replace(/\u001b\[\d+m/g, '');
      
      return res.status(200).json({ 
        success: true, 
        message: 'SEO audit completed successfully', 
        reportPath: `/reports/${reportFileName}`,
        output: cleanOutput
      });
      
    } catch (error) {
      console.error('Error running SEO audit:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to run SEO audit',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Endpoint to list all SEO audit reports
  app.get(`${apiPrefix}/seo/reports`, (req, res) => {
    try {
      const reportsDir = path.resolve('./reports');
      
      // Check if reports directory exists
      if (!fs.existsSync(reportsDir)) {
        return res.status(200).json({ reports: [] });
      }
      
      // Get all report files
      const files = fs.readdirSync(reportsDir)
        .filter(file => file.startsWith('seo-audit-') && file.endsWith('.log'))
        .map(file => {
          const filePath = path.join(reportsDir, file);
          const stats = fs.statSync(filePath);
          
          return {
            name: file,
            path: `/reports/${file}`,
            size: stats.size,
            createdAt: stats.birthtime
          };
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      return res.status(200).json({ reports: files });
      
    } catch (error) {
      console.error('Error listing SEO audit reports:', error);
      return res.status(500).json({ 
        message: 'Failed to list SEO audit reports',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Endpoint to get a specific SEO audit report
  app.get(`${apiPrefix}/seo/reports/:filename`, (req, res) => {
    try {
      const { filename } = req.params;
      const reportPath = path.resolve(`./reports/${filename}`);
      
      // Validate the filename to prevent directory traversal attacks
      if (!filename.startsWith('seo-audit-') || !filename.endsWith('.log')) {
        return res.status(400).json({ message: 'Invalid report filename' });
      }
      
      // Check if the report file exists
      if (!fs.existsSync(reportPath)) {
        return res.status(404).json({ message: 'Report not found' });
      }
      
      // Read the report file
      const reportContent = fs.readFileSync(reportPath, 'utf8');
      
      // Return the report content
      return res.status(200).json({ 
        name: filename,
        content: reportContent
      });
      
    } catch (error) {
      console.error('Error retrieving SEO audit report:', error);
      return res.status(500).json({ 
        message: 'Failed to retrieve SEO audit report',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
