# Royals Barber Shop Website

## Overview

A mobile-first responsive website for Royals Barber Shop in Batavia, NY. The application serves as a complete digital presence for the barbershop, featuring content management, haircut galleries, blog functionality, and an AI-powered chatbot assistant.

**Primary Purpose:** Provide customers with service information, appointment booking, and haircut galleries.

**Tech Stack:**
- Frontend: React with TypeScript, Vite build system
- Backend: Express.js (Node.js)
- Database: PostgreSQL (via Neon serverless)
- CMS: Contentful headless CMS
- UI: Tailwind CSS with shadcn/ui components
- Deployment: Replit platform

## User Preferences

Preferred communication style: Simple, everyday language.
Contact Information: 317 Ellicott St, Batavia, NY | 585-536-6576
Business Name: Royals Barber Shop (not "Royals Barber & Shave")

## System Architecture

### Frontend Architecture

**Single-Page Application (SPA) Pattern**
- React with TypeScript for type safety and component-based architecture
- Wouter for client-side routing (lightweight alternative to React Router)
- Lazy-loaded route components for optimal performance
- Mobile-first responsive design prioritizing mobile user experience

**State Management**
- TanStack Query (React Query) for server state management and caching
- Local component state with React hooks for UI state
- Query client provides centralized data fetching with automatic background refetching

**Component Organization**
- Layout components: Header, Footer, MobileMenu
- Page components: Home, BrowseHaircuts, HaircutShare, Blog, BlogPost, PrivacyPolicy, TermsOfService
- Feature components: ChatBot, ImageCarousel, LedTicker, ShareButton
- UI components from shadcn/ui library for consistent design system

**Performance Optimizations**
- Lazy loading of route components with Suspense boundaries
- Image lazy loading with custom LazyImage component using Intersection Observer
- Preloading critical assets (hero video, images) via link tags
- Auto-scroll to top behavior on route changes for better UX

### Backend Architecture

**Express.js Server Design**
- RESTful API endpoints for data operations
- Server-side rendering of initial HTML with Vite middleware in development
- Static file serving in production build
- API proxy pattern to protect environment variables (Contentful, OpenAI)

**Key API Routes**
- `/api/contentful/*` - Proxy endpoints for Contentful CMS data
- `/api/chatbot` - OpenAI chatbot integration
- `/api/shop-images` - Server-side file system scanning for gallery images
- `/api/newsletter/subscribe` - Newsletter subscription handling

**Middleware Stack**
- JSON body parsing
- URL-encoded form data handling
- Request logging with custom timing middleware
- Error handling middleware for consistent error responses

### Data Storage

**Database Schema (Drizzle ORM)**
- `users` - User authentication (currently unused but scaffolded)
- `galleryItems` - Haircut gallery images with categories
- `blogPosts` - Blog content (supplementary to Contentful)
- `services` - Service offerings and pricing
- `subscribers` - Newsletter email subscription list

**Database Choice Rationale**
- PostgreSQL via Neon serverless for scalability and Replit integration
- Drizzle ORM for type-safe database queries and migrations
- Connection pooling for efficient resource usage

**Content Storage Strategy**
- Contentful CMS for blog posts, hero content, and marketing copy (allows non-technical content updates)
- PostgreSQL for transactional data (orders, subscriptions)
- File system for haircut gallery images organized by category folders
- Static assets in `/public` directory for images, videos, logos

### External Dependencies

**Contentful CMS Integration**
- Content models: `siteHero`, `browseHaircutsHero`, `royalsBlog`, `royalsBody`
- Delivery API for fetching published content
- Server-side API proxy to protect access tokens
- Environment variables: `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN`, `CONTENTFUL_ENVIRONMENT`

**OpenAI Integration**
- GPT-4o via chat completions endpoint
- Chatbot assistant for customer inquiries
- System prompt configured for barbershop-specific knowledge
- Environment variable: `OPENAI_API_KEY`
- Dynamic client initialization to allow runtime API key updates

**Third-Party Services**
- Setmore booking system (external link integration)
- Google Maps integration for location
- Social media integrations (Instagram, Facebook, Google Reviews)

### Legal Pages

**Privacy Policy** (`/privacy-policy`)
- SMS/Text messaging compliance language
- Data collection and usage policies
- User rights and opt-out instructions

**Terms of Service** (`/terms-of-service`)
- Website usage terms
- Text message program terms
- Intellectual property and liability disclaimers

### SEO and Schema Markup

**Structured Data Implementation**
- LocalBusiness schema in base HTML for search engines
- Dynamic schema component for page-specific markup
- ImageObject schema for individual haircut images
- Meta tags component for Open Graph and Twitter Cards
- XML sitemap and robots.txt for crawler guidance

**SEO Optimization Features**
- Server-side rendered meta tags
- Semantic HTML structure
- Image alt text optimization
- Mobile-first responsive design for Core Web Vitals
- Fast page load times with lazy loading and code splitting

### Development and Build Process

**Development Mode**
- Vite dev server with HMR (Hot Module Replacement)
- Express server with tsx for TypeScript execution
- Concurrent frontend/backend development
- Source maps for debugging

**Production Build**
- Vite builds React frontend to `dist/public`
- esbuild bundles Express server to `dist/index.js`
- Environment variables injected at runtime
- Static file serving from built assets

**Database Management**
- Drizzle Kit for schema migrations
- Push command for schema synchronization
- Seed script for initial data population
