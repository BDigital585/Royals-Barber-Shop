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

// Function to initialize or reinitialize the OpenAI client
// This allows us to update the API key without restarting the server
function createOpenAIClient() {
  // Force reload environment variables to get the latest API key
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️ OpenAI API key is missing. Chatbot functionality will be unavailable.');
    return null;
  }
  
  console.log('Creating new OpenAI client with refreshed API key - length:', apiKey.length);
  return new OpenAI({
    apiKey: apiKey,
  });
}

// Initialize OpenAI client - will be refreshed on each request
let openai = null;

// The system prompt for the chatbot
const CHATBOT_SYSTEM_PROMPT = `You are Royals Barber Shop's helpful assistant. Your job is to greet visitors, help them navigate the site, answer common questions, and encourage them to book an appointment.
Always stay professional, confident, and friendly. Keep answers short and helpful. If the user seems unsure, offer to help them find what they need.
The barber shop is located at 317 Ellicott Street, Batavia, NY. Hours are Tue 9–3, Wed–Fri 9–5, Sat 9–2. Phone: 585-536-6576.
If someone mentions being new, offer a warm welcome and briefly explain that Royals focuses on delivering a premium haircut experience with a community feel.
Avoid long responses. Don't make up info not listed here. Only talk about barber shop related things. If you're unsure, say: 'Let me have someone follow up with you!'

⸻

Shop Pricing (all barbers except Brandon):
• Toddler Haircut: $20
• Kids Haircut: $25 (add $5 for long hairstyles)
• Adult Haircut: $30 (add $5 for long hairstyles)
• Haircut + Beard: $40
• Edge-Up: $20

Brandon's Pricing:
• Haircut: $35
• Haircut + Beard: $50
• Edge-Up: $25

When asked about pricing, clearly explain that shop prices apply to all barbers except Brandon, whose prices are listed separately. Provide these prices confidently and suggest booking online for full service options.

⸻

Frequently Asked Questions:
• Why does Brandon charge more?
Brandon has been cutting hair for 16 years. He's the owner of Royals Barber Shop and is in high demand due to his experience and skill level.
• Do you accept walk-ins?
Yes, walk-ins are welcome — but availability is not guaranteed. Booking online is the best way to ensure your spot.
• Do you cut curly or straight hair (or other hair types)?
Yes. Royals Barber Shop serves all hair types — curly, straight, coarse, fine, and everything in between.
• What's the difference between a fade and a taper?
A fade blends the hair evenly all the way around the head, while a taper focuses only on the temple area and the neckline. You can check the 'Browse Haircuts' section on our website to see visual examples of both — we break each style down to help you choose the right look.
• What are your hours? / When are you open? / Is a specific barber available?
Each of our barbers sets their own schedule, so availability can vary. The best way to find out is to check our online booking system — it shows up-to-date availability for every barber. Or feel free to call the shop during open hours if you'd like to ask about a specific schedule.

⸻

Make sure to keep answers short, helpful, and confident. If any other question comes in that you don't know, reply: "Let me have someone follow up with you on that!"`;

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

      // Check if OpenAI client is available
      if (!openai) {
        // Try to reinitialize the client (in case API key was added after server start)
        openai = createOpenAIClient();
        
        // If still not available, return a friendly error message
        if (!openai) {
          return res.status(503).json({ 
            error: "Chatbot temporarily unavailable",
            message: "The chatbot is currently being updated. Please try again in a few minutes."
          });
        }
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
      
      // More descriptive error messages
      if (error.message && error.message.includes('API key')) {
        return res.status(503).json({
          error: "Chatbot configuration issue",
          message: "The chatbot is being updated with new credentials. Please try again in a few minutes."
        });
      }
      
      res.status(500).json({ 
        error: "Failed to process chatbot request",
        details: error.message || "Unknown error"
      });
    }
  });

  // Get Royals Body content from Contentful
  app.get(`${apiPrefix}/contentful/royals-body`, async (req, res) => {
    try {
      const { createClient } = await import('contentful');
      
      // Create client with environment variables
      const client = createClient({
        space: process.env.CONTENTFUL_SPACE_ID || '',
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
        environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
      });
      
      // Fetch Royals Body entries (get the latest one)
      const entries = await client.getEntries({
        content_type: 'royalsBody',
        order: ['-sys.updatedAt'],
        limit: 1,
        include: 2
      });
      
      console.log(`Found ${entries.items.length} Royals Body entries`);
      
      if (!entries.items.length) {
        return res.status(404).json({ message: 'No Royals Body content found' });
      }
      
      const entry = entries.items[0];
      const fields = entry.fields as any;
      
      // Return the content
      return res.status(200).json({
        id: entry.sys.id,
        content: fields.content || null
      });
    } catch (error) {
      console.error('Error fetching Royals Body content from Contentful:', error);
      return res.status(500).json({ 
        message: 'Failed to fetch Royals Body content',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Get Homepage hero content - using specific video file
  app.get(`${apiPrefix}/contentful/hero`, async (req, res) => {
    try {
      // Return the specific homepage hero video
      console.log('Using the specified video for homepage hero: /superhero.mp4');
      
      return res.status(200).json({
        title: 'Ready for a fresh look?',
        subtitle: 'Walk-ins welcome or schedule online today',
        videoUrl: '/superhero.mp4', // Use the specified video from public folder
        backgroundImage: null
      });
    } catch (error) {
      console.error("Error serving homepage hero content:", error);
      
      // Fallback to the same video even if there's an error
      return res.status(200).json({
        title: 'Ready for a fresh look?',
        subtitle: 'Walk-ins welcome or schedule online today',
        videoUrl: '/superhero.mp4', 
        backgroundImage: null
      });
    }
  });
  
  // Get Browse Haircuts hero content from Contentful
  app.get(`${apiPrefix}/contentful/browse-haircuts-hero`, async (req, res) => {
    try {
      const { createClient } = await import('contentful');
      
      // Create client with environment variables
      const client = createClient({
        space: process.env.CONTENTFUL_SPACE_ID || '',
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
        environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
      });
      
      // First, try to get all assets to find a suitable video
      const assets = await client.getAssets({
        limit: 20, // Get a reasonable number of assets
        order: ['-sys.updatedAt'] as any,
      });
      
      // Look for a video file asset that might be used for the browse haircuts page
      let heroAsset = null;
      for (const asset of assets.items) {
        if (asset.fields.file && 
            (asset.fields.file.contentType === 'video/mp4' || 
             asset.fields.file.contentType === 'video/quicktime')) {
          console.log('Found a video asset for Browse Haircuts:', asset.fields.title);
          heroAsset = asset;
          break;
        }
      }
      
      // If we found a suitable asset, extract the details
      if (heroAsset) {
        const videoUrl = heroAsset.fields.file.url.startsWith('//') 
          ? `https:${heroAsset.fields.file.url}` 
          : heroAsset.fields.file.url;
          
        console.log('Found Browse Haircuts video URL:', videoUrl);
        
        // Return the hero data
        return res.status(200).json({
          title: 'Find Your Perfect Style',
          subtitle: 'Browse our gallery of premium haircuts to find the perfect look for your next visit to Royals Barber Shop.',
          videoUrl: videoUrl,
          backgroundImage: null
        });
      }
      
      // If no video asset found, return default data
      return res.status(200).json({
        title: 'Find Your Perfect Style',
        subtitle: 'Browse our gallery of premium haircuts to find the perfect look for your next visit to Royals Barber Shop.',
        videoUrl: '', 
        backgroundImage: null
      });
    } catch (error) {
      console.error("Error fetching Browse Haircuts hero content:", error);
      
      // Return default data even if there's an error
      return res.status(200).json({
        title: 'Find Your Perfect Style',
        subtitle: 'Browse our gallery of premium haircuts to find the perfect look for your next visit to Royals Barber Shop.',
        videoUrl: '', 
        backgroundImage: null
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
