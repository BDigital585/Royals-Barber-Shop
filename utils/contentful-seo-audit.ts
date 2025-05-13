#!/usr/bin/env tsx

/**
 * Contentful SEO Audit Tool for Royals Barbershop Blog
 * 
 * This script audits all blog posts in the "Royals Blog" content model to ensure
 * they follow SEO best practices. It checks for:
 * - Title presence and length (under 60 chars)
 * - Description presence and length (under 155 chars)
 * - Clean slugs (lowercase, hyphenated, no special chars)
 * - Featured image alt text
 * - Content structure (H1/H2 headings)
 * 
 * Results are displayed with status indicators:
 * ✅ = Passed
 * ⚠️ = Warning
 * ❌ = Failed
 */

import dotenv from 'dotenv';
import { createClient } from 'contentful-management';
import chalk from 'chalk';
import { BLOCKS } from '@contentful/rich-text-types';

// Set up environment
dotenv.config();

// Define constants
const CONTENT_MODEL = 'royalsBlog'; // The content model ID to audit
const MAX_TITLE_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 155;
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Interfaces
interface AuditResult {
  postId: string;
  postTitle: string;
  slug: string;
  publishedAt: string;
  checks: {
    title: {
      status: 'pass' | 'warning' | 'fail';
      message: string;
    };
    description: {
      status: 'pass' | 'warning' | 'fail';
      message: string;
    };
    slug: {
      status: 'pass' | 'warning' | 'fail';
      message: string;
    };
    featuredImage: {
      status: 'pass' | 'warning' | 'fail';
      message: string;
    };
    headings: {
      status: 'pass' | 'warning' | 'fail';
      message: string;
    };
  };
  overallStatus: 'pass' | 'warning' | 'fail';
}

// Contentful client setup
const client = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN || '',
});

/**
 * Main function to run the SEO audit
 */
async function runSeoAudit() {
  try {
    console.log(chalk.blue.bold('🔍 Starting SEO Audit for Royals Barbershop Blog Posts\n'));
    
    // Check if we have the required environment variables
    if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_MANAGEMENT_TOKEN) {
      console.error(chalk.red('❌ Error: Missing required environment variables.'));
      console.log(chalk.yellow('Please ensure CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN are set.'));
      return;
    }
    
    // Get the space and environment
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');
    
    // Get all blog posts
    console.log(chalk.gray('Fetching blog posts from Contentful...'));
    const entries = await environment.getEntries({
      content_type: CONTENT_MODEL,
    });
    
    if (entries.items.length === 0) {
      console.log(chalk.yellow('No blog posts found. Nothing to audit.'));
      return;
    }
    
    console.log(chalk.green(`Found ${entries.items.length} blog posts to audit.\n`));
    
    // Audit each post
    const results: AuditResult[] = [];
    
    for (const entry of entries.items) {
      const fields = entry.fields;
      const title = fields.title?.['en-US'] || '';
      const description = fields.excerpt?.['en-US'] || '';
      const slug = fields.slug?.['en-US'] || '';
      const content = fields.content?.['en-US'] || null;
      const featuredImage = fields.featuredImage?.['en-US'] || null;
      
      // Initialize result object
      const result: AuditResult = {
        postId: entry.sys.id,
        postTitle: title,
        slug: slug,
        publishedAt: entry.sys.updatedAt,
        checks: {
          title: { status: 'pass', message: 'Title is good!' },
          description: { status: 'pass', message: 'Description is good!' },
          slug: { status: 'pass', message: 'Slug is well-formatted.' },
          featuredImage: { status: 'pass', message: 'Featured image has alt text.' },
          headings: { status: 'pass', message: 'Content has proper heading structure.' }
        },
        overallStatus: 'pass'
      };
      
      // Check title
      if (!title) {
        result.checks.title = { status: 'fail', message: 'Title is missing.' };
      } else if (title.length > MAX_TITLE_LENGTH) {
        result.checks.title = { 
          status: 'warning', 
          message: `Title is too long (${title.length}/${MAX_TITLE_LENGTH} chars).` 
        };
      }
      
      // Check description/excerpt
      if (!description) {
        result.checks.description = { status: 'warning', message: 'Description is missing.' };
      } else if (description.length > MAX_DESCRIPTION_LENGTH) {
        result.checks.description = { 
          status: 'warning', 
          message: `Description is too long (${description.length}/${MAX_DESCRIPTION_LENGTH} chars).` 
        };
      }
      
      // Check slug
      if (!slug) {
        result.checks.slug = { status: 'fail', message: 'Slug is missing.' };
      } else if (!SLUG_REGEX.test(slug)) {
        result.checks.slug = { 
          status: 'warning', 
          message: 'Slug contains invalid characters. Use lowercase letters, numbers, and hyphens only.' 
        };
      }
      
      // Check featured image
      if (!featuredImage) {
        result.checks.featuredImage = { status: 'warning', message: 'Featured image is missing.' };
      } else {
        const imageTitle = featuredImage.fields?.title?.['en-US'] || '';
        const imageDescription = featuredImage.fields?.description?.['en-US'] || '';
        
        if (!imageTitle && !imageDescription) {
          result.checks.featuredImage = { status: 'warning', message: 'Featured image missing alt text/description.' };
        }
      }
      
      // Check content for headings
      if (!content) {
        result.checks.headings = { status: 'fail', message: 'Content is missing.' };
      } else {
        const hasHeadings = content.content?.some(node => {
          return node.nodeType === BLOCKS.HEADING_1 || node.nodeType === BLOCKS.HEADING_2;
        });
        
        if (!hasHeadings) {
          result.checks.headings = { 
            status: 'warning', 
            message: 'Content is missing H1 or H2 headings which are important for SEO.' 
          };
        }
      }
      
      // Determine overall status
      if (Object.values(result.checks).some(check => check.status === 'fail')) {
        result.overallStatus = 'fail';
      } else if (Object.values(result.checks).some(check => check.status === 'warning')) {
        result.overallStatus = 'warning';
      }
      
      results.push(result);
    }
    
    // Display results
    console.log(chalk.blue.bold('📊 SEO Audit Results:\n'));
    
    results.forEach((result, index) => {
      const statusIcon = {
        pass: chalk.green('✅'),
        warning: chalk.yellow('⚠️'),
        fail: chalk.red('❌')
      };
      
      console.log(chalk.bold(`Post ${index + 1}: ${result.postTitle}`));
      console.log(chalk.gray(`ID: ${result.postId}`));
      console.log(chalk.gray(`Slug: ${result.slug}`));
      console.log(chalk.gray(`Last Updated: ${new Date(result.publishedAt).toLocaleDateString()}`));
      console.log();
      
      // Display checks
      console.log(`${statusIcon[result.checks.title.status]} Title: ${result.checks.title.message}`);
      console.log(`${statusIcon[result.checks.description.status]} Description: ${result.checks.description.message}`);
      console.log(`${statusIcon[result.checks.slug.status]} Slug: ${result.checks.slug.message}`);
      console.log(`${statusIcon[result.checks.featuredImage.status]} Featured Image: ${result.checks.featuredImage.message}`);
      console.log(`${statusIcon[result.checks.headings.status]} Headings: ${result.checks.headings.message}`);
      console.log();
      
      // Overall status
      const overallIcon = statusIcon[result.overallStatus];
      console.log(`Overall: ${overallIcon} ${result.overallStatus.toUpperCase()}`);
      console.log('----------------------------------------------------------------');
    });
    
    // Summary
    const passingPosts = results.filter(r => r.overallStatus === 'pass').length;
    const warningPosts = results.filter(r => r.overallStatus === 'warning').length;
    const failingPosts = results.filter(r => r.overallStatus === 'fail').length;
    
    console.log(chalk.blue.bold('\n📝 Summary:'));
    console.log(chalk.green(`✅ ${passingPosts} posts passing`));
    console.log(chalk.yellow(`⚠️ ${warningPosts} posts with warnings`));
    console.log(chalk.red(`❌ ${failingPosts} posts failing`));
    
    console.log(chalk.blue.bold('\n🏁 SEO Audit Complete!'));
    
  } catch (error) {
    console.error(chalk.red('❌ Error running SEO audit:'), error);
  }
}

// Run the audit if this script is executed directly
if (require.main === module) {
  runSeoAudit();
}

// Export for potential programmatic use
export { runSeoAudit };