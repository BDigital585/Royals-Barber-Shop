# Royals Barbershop Website

A mobile-first responsive website for Royals Barbershop in Batavia, NY.

## Features

- Mobile-first responsive design
- Contentful CMS integration for content management
- Gallery with categorized haircut images
- SEO optimization with schema markup
- Newsletter subscription functionality
- Contact information and booking links

## Development

To start the development server:

```bash
npm run dev
```

This will start the Express server with Vite for hot-reloading during development.

## Deployment

The project can be deployed directly through Replit's deployment platform, which handles all deployment aspects automatically.

To deploy, simply click the "Deploy" button in the Replit interface. Replit will build and host the application with its own domain.

## Content Management

The website uses Contentful as its CMS. The following environment variables are required for Contentful integration:

- `CONTENTFUL_SPACE_ID`: Your Contentful space ID
- `CONTENTFUL_ACCESS_TOKEN`: Your Contentful delivery API access token
- `CONTENTFUL_ENVIRONMENT`: Your Contentful environment (typically "master")

## SEO Optimization

The site includes:

- Schema.org markup for local business
- Optimized meta tags
- robots.txt file
- XML sitemap
- Keyword-rich image alt text

## Technologies Used

- React with TypeScript
- Tailwind CSS with shadcn/ui components
- Express backend with Node.js
- Contentful CMS
- Drizzle ORM with PostgreSQL
- React Query for data fetching
- Wouter for routing