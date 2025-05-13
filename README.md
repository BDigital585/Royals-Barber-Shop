# Royals Barbershop Website

A mobile-first responsive website for Royals Barbershop in Batavia, NY.

## Features

- Mobile-first responsive design
- Contentful CMS integration for content management
- Gallery with categorized haircut images
- SEO optimization with schema markup
- Newsletter subscription functionality
- Contact information and booking links
- Automated deployment to Netlify

## Development

To start the development server:

```bash
npm run dev
```

This will start the Express server with Vite for hot-reloading during development.

## Deployment

The project is set up for automated deployment to Netlify with a custom domain (royalsbatavia.com) through Porkbun.

### Prerequisites

Before deployment, ensure you have set the following environment variables:

- `NETLIFY_AUTH_TOKEN`: Your Netlify authentication token
- `PORKBUN_API_KEY`: Your Porkbun API key
- `PORKBUN_API_SECRET`: Your Porkbun API secret

### Running the Deployment

To deploy the website, you can use either the Node.js script or the bash script:

#### Using Node.js:
```bash
node scripts/deploy.js
```

#### Using Bash:
```bash
./deploy.sh
```

This script will:

1. Build the site for production
2. Copy SEO files (robots.txt, sitemap.xml) to the build directory
3. Deploy to Netlify
4. Configure DNS settings on Porkbun to point to Netlify

### Deployment Scripts

- `scripts/deploy.js`: Main deployment script with user confirmation
- `scripts/deploy-to-netlify.js`: Handles the Netlify deployment and Porkbun DNS configuration
- `scripts/prepare-deploy.js`: Ensures SEO files are correctly included in the build

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