#!/usr/bin/env node

/**
 * Scheduled SEO Audit Script
 * 
 * This script is designed to be run on a schedule (daily/weekly) to perform
 * SEO audits on all blog posts and generate a report.
 * 
 * You can set this up with a cron job or use a service like GitHub Actions.
 * 
 * Example cron job (weekly on Monday at 8am):
 * 0 8 * * 1 /path/to/node /path/to/run-scheduled-audit.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

// Configuration
const REPORTS_DIR = path.join(__dirname, '../reports');
const SEO_AUDIT_SCRIPT = path.join(__dirname, 'contentful-seo-audit.ts');

// Create reports directory if it doesn't exist
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

// Format current date for the report filename
const date = new Date();
const timestamp = date.toISOString().replace(/[:.]/g, '-');
const reportFilename = `seo-audit-${timestamp}.txt`;
const reportPath = path.join(REPORTS_DIR, reportFilename);

// Verify environment variables
const requiredEnvVars = ['CONTENTFUL_SPACE_ID', 'CONTENTFUL_ACCESS_TOKEN', 'CONTENTFUL_ENVIRONMENT'];
const missingEnvVars = requiredEnvVars.filter(variable => !process.env[variable]);

if (missingEnvVars.length > 0) {
  console.error(chalk.red('Error: Missing required environment variables:'));
  missingEnvVars.forEach(variable => {
    console.error(chalk.red(`- ${variable}`));
  });
  process.exit(1);
}

console.log(chalk.blue('Starting scheduled SEO audit...'));
console.log(chalk.gray(`Report will be saved to: ${reportPath}`));

try {
  // Run the TypeScript audit script and capture its output
  const auditOutput = execSync(`npx tsx ${SEO_AUDIT_SCRIPT}`, { encoding: 'utf8' });
  
  // Save the audit results to a report file
  const header = `
=========================================
  ROYALS BARBERSHOP BLOG SEO AUDIT REPORT
  ${date.toLocaleString()}
=========================================

`;
  
  fs.writeFileSync(reportPath, header + auditOutput);
  
  console.log(chalk.green('SEO audit completed successfully!'));
  console.log(chalk.gray(`Report saved to: ${reportPath}`));
  
  // Return the path for use by other processes
  console.log(reportPath);
  
} catch (error) {
  console.error(chalk.red('Error running SEO audit:'), error);
  process.exit(1);
}