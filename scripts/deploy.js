#!/usr/bin/env node

// Simple script to run the deployment process with a confirmation prompt
import readline from 'readline';
import { execSync } from 'child_process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Royals Barbershop Deployment Tool 🚀');
console.log('=====================================');
console.log('');
console.log('This tool will deploy the site to Netlify and configure the Porkbun domain.');
console.log('It will use the following secrets:');
console.log('- NETLIFY_AUTH_TOKEN (for Netlify deployment)');
console.log('- PORKBUN_API_KEY (for Porkbun domain configuration)');
console.log('- PORKBUN_API_SECRET (for Porkbun domain configuration)');
console.log('');

rl.question('Are you sure you want to proceed with deployment? (yes/no): ', (answer) => {
  if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
    console.log('\nStarting deployment process...');
    try {
      execSync('node scripts/deploy-to-netlify.js', { 
        stdio: 'inherit',
        env: process.env // Pass through environment variables including secrets
      });
      console.log('\n✅ Deployment script completed successfully.');
    } catch (error) {
      console.error('\n❌ Deployment failed:', error.message);
    }
  } else {
    console.log('\nDeployment cancelled.');
  }
  rl.close();
});