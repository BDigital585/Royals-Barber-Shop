#!/usr/bin/env node

// Script to deploy to Netlify and configure Porkbun domain
// Using ES Modules syntax since the project is ESM
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// Get current file directory name (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const NETLIFY_SITE_NAME = 'royals-barbershop';
const DOMAIN_NAME = 'royalsbatavia.com';
const WWW_SUBDOMAIN = 'www';
const FULL_DOMAIN = `${WWW_SUBDOMAIN}.${DOMAIN_NAME}`;
const NETLIFY_DOMAIN = `${NETLIFY_SITE_NAME}.netlify.app`;

// Make sure we have all required environment variables
const requiredEnvVars = [
  'NETLIFY_AUTH_TOKEN',
  'PORKBUN_API_KEY',
  'PORKBUN_API_SECRET'
];

// Check for missing environment variables
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Step 1: Build the project for production and ensure SEO files are included
console.log('Preparing SEO files...');
try {
  // Run the prepare-deploy script to ensure SEO files are ready
  execSync('node scripts/prepare-deploy.js', { stdio: 'inherit' });
  
  console.log('Building project for production...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 2: Create or update Netlify site
console.log(`\nDeploying to Netlify as "${NETLIFY_SITE_NAME}"...`);

// Check if netlify-cli is installed, if not install it
try {
  execSync('which netlify', { stdio: 'ignore' });
} catch (error) {
  console.log('Installing netlify-cli...');
  execSync('npm install -g netlify-cli', { stdio: 'inherit' });
}

// Deploy to Netlify using the CLI (this handles creating the site if it doesn't exist)
try {
  // First, authenticate with Netlify using the token
  execSync(`netlify login --auth ${process.env.NETLIFY_AUTH_TOKEN}`, { stdio: 'inherit' });
  
  // Deploy the site (create if it doesn't exist)
  console.log('Deploying to Netlify...');
  execSync(`netlify deploy --prod --dir=dist --site=${NETLIFY_SITE_NAME} --auth=${process.env.NETLIFY_AUTH_TOKEN}`, { 
    stdio: 'inherit'
  });
  
  console.log('✅ Netlify deployment successful');
} catch (error) {
  console.error('❌ Netlify deployment failed:', error.message);
  process.exit(1);
}

// Step 3: Configure Porkbun DNS settings
console.log(`\nConfiguring DNS for ${FULL_DOMAIN}...`);

// Helper function for making Porkbun API requests
function porkbunRequest(endpoint, data) {
  return new Promise((resolve, reject) => {
    const requestData = JSON.stringify({
      apikey: process.env.PORKBUN_API_KEY,
      secretapikey: process.env.PORKBUN_API_SECRET,
      ...data
    });
    
    const options = {
      hostname: 'porkbun.com',
      port: 443,
      path: `/api/json/v3/${endpoint}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData),
      },
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          if (parsedData.status === 'SUCCESS') {
            resolve(parsedData);
          } else {
            reject(new Error(`Porkbun API error: ${parsedData.message || 'Unknown error'}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse Porkbun API response: ${error.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(new Error(`Porkbun API request failed: ${error.message}`));
    });
    
    req.write(requestData);
    req.end();
  });
}

// Create CNAME record for www subdomain
async function setupDNS() {
  try {
    // First retrieve existing records to check if we need to update or create
    console.log(`Checking existing DNS records for ${FULL_DOMAIN}...`);
    const records = await porkbunRequest(`dns/retrieve/${DOMAIN_NAME}`);
    
    // Check if we already have a CNAME record for www
    const existingWwwRecord = records.records?.find(
      record => record.type === 'CNAME' && record.name === WWW_SUBDOMAIN
    );
    
    if (existingWwwRecord) {
      // Update the CNAME record if it exists
      console.log(`Updating CNAME record for ${WWW_SUBDOMAIN}...`);
      await porkbunRequest(`dns/edit/${DOMAIN_NAME}/${existingWwwRecord.id}`, {
        type: 'CNAME',
        name: WWW_SUBDOMAIN,
        content: NETLIFY_DOMAIN,
        ttl: '600'
      });
      console.log(`✅ Updated CNAME record for ${WWW_SUBDOMAIN}`);
    } else {
      // Create a new CNAME record if it doesn't exist
      console.log(`Creating CNAME record for ${WWW_SUBDOMAIN}...`);
      await porkbunRequest(`dns/create/${DOMAIN_NAME}`, {
        type: 'CNAME',
        name: WWW_SUBDOMAIN,
        content: NETLIFY_DOMAIN,
        ttl: '600'
      });
      console.log(`✅ Created CNAME record for ${WWW_SUBDOMAIN}`);
    }
    
    // Set up the root domain (@ record) to point to Netlify
    // Using Netlify's load balancer IPs
    const netlifyIPs = ['75.2.60.5', '99.83.190.102'];
    
    // Check if we already have A records for @
    const existingARecords = records.records?.filter(
      record => record.type === 'A' && record.name === ''
    );
    
    if (existingARecords && existingARecords.length > 0) {
      // If we have existing A records, update them
      for (let i = 0; i < existingARecords.length; i++) {
        if (i < netlifyIPs.length) {
          console.log(`Updating A record for @ to ${netlifyIPs[i]}...`);
          await porkbunRequest(`dns/edit/${DOMAIN_NAME}/${existingARecords[i].id}`, {
            type: 'A',
            name: '',
            content: netlifyIPs[i],
            ttl: '600'
          });
          console.log(`✅ Updated A record for @ to ${netlifyIPs[i]}`);
        }
      }
      
      // Add missing IPs if needed
      if (existingARecords.length < netlifyIPs.length) {
        for (let i = existingARecords.length; i < netlifyIPs.length; i++) {
          console.log(`Creating A record for @ to ${netlifyIPs[i]}...`);
          await porkbunRequest(`dns/create/${DOMAIN_NAME}`, {
            type: 'A',
            name: '',
            content: netlifyIPs[i],
            ttl: '600'
          });
          console.log(`✅ Created A record for @ to ${netlifyIPs[i]}`);
        }
      }
    } else {
      // Create new A records for each Netlify IP
      for (const ip of netlifyIPs) {
        console.log(`Creating A record for @ to ${ip}...`);
        await porkbunRequest(`dns/create/${DOMAIN_NAME}`, {
          type: 'A',
          name: '',
          content: ip,
          ttl: '600'
        });
        console.log(`✅ Created A record for @ to ${ip}`);
      }
    }
    
    console.log('✅ DNS configuration completed successfully');
  } catch (error) {
    console.error('❌ DNS configuration failed:', error.message);
    process.exit(1);
  }
}

// Run the DNS setup
setupDNS();

// Step 4: Instructions for Netlify SSL
console.log('\n🔒 SSL Setup:');
console.log(`1. Go to https://app.netlify.com/sites/${NETLIFY_SITE_NAME}/settings/domain`);
console.log(`2. Add both ${DOMAIN_NAME} and ${FULL_DOMAIN} as custom domains`);
console.log('3. Netlify will automatically provision SSL certificates once DNS propagates');
console.log('4. DNS changes may take up to 24-48 hours to fully propagate');

console.log('\n🎉 Deployment process completed!');
console.log(`Your site should be available at: https://${FULL_DOMAIN} once DNS propagates`);