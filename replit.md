# Royals Barbershop Website

## Overview

A mobile-first responsive website for Royals Barbershop in Batavia, NY. The application serves as a complete digital presence for the barbershop, featuring content management, haircut galleries, blog functionality, and an interactive memory matching game with discount rewards.

**Primary Purpose:** Provide customers with service information, appointment booking, haircut galleries, and engage customers with a fun memory game that rewards discounts on haircuts.

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
- Page components: Home, BrowseHaircuts, HaircutShare, Blog, BlogPost, MemoryGame
- Feature components: ChatBot, ImageCarousel, LedTicker, ShareButton, Leaderboard
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
- `/api/chat` - OpenAI chatbot integration
- `/api/shop-images` - Server-side file system scanning for gallery images
- `/api/newsletter/subscribe` - Newsletter subscription handling
- `/api/memory-game/scores` - Memory game leaderboard (GET/POST) with Google Sheets integration

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

**Google Sheets Integration (Memory Game)**
- "memory match leaderboard" - Cumulative game scores with weekly display filtering
- "barber shop Contacts" - Customer contacts with email deduplication
- Weekly reset logic: Scores display from current week (Monday-Sunday) while full history persists
- Connected via Replit's Google Sheets connector (server/google-sheets-client.ts)

**Database Choice Rationale**
- PostgreSQL via Neon serverless for scalability and Replit integration
- Drizzle ORM for type-safe database queries and migrations
- Connection pooling for efficient resource usage
- Google Sheets for memory game data (accessible to business owner)

**Content Storage Strategy**
- Contentful CMS for blog posts, hero content, and marketing copy (allows non-technical content updates)
- PostgreSQL for transactional data (orders, subscriptions)
- Google Sheets for memory game leaderboard and customer contacts (easy business owner access)
- File system for haircut gallery images organized by category folders
- Static assets in `/public` directory for images, videos, logos

### External Dependencies

**Contentful CMS Integration**
- Content models: `siteHero`, `browseHaircutsHero`, `royalsBlog`, `royalsBody`
- Delivery API for fetching published content
- Server-side API proxy to protect access tokens
- Environment variables: `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN`, `CONTENTFUL_ENVIRONMENT`

**OpenAI Integration**
- GPT-4 Turbo via chat completions endpoint
- Chatbot assistant for customer inquiries
- System prompt configured for barbershop-specific knowledge
- Environment variable: `OPENAI_API_KEY`
- Dynamic client initialization to allow runtime API key updates

**Google Sheets Integration**
- Connected via Replit's Google Sheets connector for OAuth authentication
- Leaderboard spreadsheet: "memory match leaderboard" (auto-created if missing)
- Contacts spreadsheet: "barber shop Contacts" (must exist, no auto-creation)
- New clients spreadsheet: "New Barber Shop Clients" (auto-created if missing) - tracks first-time players
- 4-week cycle cumulative scores displayed (scores add up over the cycle)
- One play per week per email/phone number (play limit enforced weekly within each cycle)
- New client tracking: When a player submits their score, if their email is not in "barber shop Contacts", they are added to both Contacts and "New Barber Shop Clients" sheet

**Resend Email Integration**
- Connected via Replit's Resend connector (royalbarber585@gmail.com)
- Discount emails: Sent after game completion with discount code ($2 or $5 off)
- Winner emails: Tiered based on ties (see below)
- Email templates include: discount code, expiry date, redemption instructions, Tuesday exclusion notice
- One-time use codes generated with unique identifiers

**Memory Game Rules - 4-Week Cycle System (starts December 1, 2025)**
- 9 or fewer moves = $5 off haircut (premium tier)
- 10+ moves = $2 off haircut (standard tier)
- Discounts NOT valid on Tuesdays with $20 haircut promotion
- One play per week per email/phone number
- Scores are CUMULATIVE: each week's score adds to player's total for the cycle
- 4-week cycles reset automatically after 28 days
- **WEEKLY PLAY ENFORCEMENT:** Players MUST play every week to stay on the leaderboard and qualify for cycle prizes. Missing even one week = automatic disqualification and removal from leaderboard

**Weekly Play Enforcement System**
- Saturday reminders: Urgent emails sent to all leaderboard players who haven't played that week, warning of disqualification (deadline: Sunday 11:59 PM)
- Monday cleanup: Players who didn't play the previous week are automatically removed from the leaderboard
- Admin endpoints:
  - `POST /api/admin/weekly-reminders` - Send urgent Saturday reminder emails to non-playing leaderboard members
  - `POST /api/admin/weekly-cleanup` - Remove players who didn't play from leaderboard (call Monday morning)
  - `POST /api/admin/cleanup-sheets` - Remove duplicate emails from Contacts tab and fix leaderboard gaps

**Cycle Winner Prizes (at end of each 4-week cycle)**
- 1 winner (sole lowest cumulative score) = FREE haircut
- 2-way tie for lowest = 50% off haircut for both
- 3+ way tie for lowest = $10 off haircut for all tied players
- **Qualification:** Must have played every single week of the cycle (no missing weeks)

**Third-Party Services**
- Setmore booking system (external link integration)
- Google Maps integration for location
- Social media integrations (Instagram, Facebook, Google Reviews)

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