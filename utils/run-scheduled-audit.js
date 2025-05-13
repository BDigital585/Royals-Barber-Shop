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

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const REPORTS_DIR = path.join(__dirname, '../reports');
const AUDIT_SCRIPT = path.join(__dirname, 'contentful-seo-audit.ts');

// Create reports directory if it doesn't exist
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

// Generate report file name with date
const date = new Date();
const reportFileName = `seo-audit-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}.log`;
const reportPath = path.join(REPORTS_DIR, reportFileName);

try {
  console.log('Starting scheduled SEO audit...');
  
  // Run the audit script and capture output
  const output = execSync(`tsx ${AUDIT_SCRIPT}`, { encoding: 'utf8' });
  
  // Write output to report file
  fs.writeFileSync(reportPath, output);
  
  console.log(`SEO audit completed successfully. Report saved to: ${reportPath}`);
} catch (error) {
  console.error('Error running scheduled SEO audit:', error);
  
  // Write error to report file
  fs.writeFileSync(
    reportPath, 
    `ERROR RUNNING SEO AUDIT\n\n${error.message}\n\n${error.stack || ''}`
  );
}