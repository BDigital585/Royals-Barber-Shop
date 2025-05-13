#!/usr/bin/env node

/**
 * Cron Job Script for Royals Barbershop Blog SEO Audit
 * 
 * This script can be set up to run on a schedule to automatically
 * perform SEO audits and generate reports.
 * 
 * Example usage with cron:
 * 
 * Weekly audit (every Monday at 8am):
 * 0 8 * * 1 /path/to/node /path/to/utils/cron.js
 * 
 * Daily audit (every day at midnight):
 * 0 0 * * * /path/to/node /path/to/utils/cron.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const LOG_DIR = path.join(__dirname, '../logs');
const SCHEDULED_AUDIT_SCRIPT = path.join(__dirname, 'run-scheduled-audit.js');

// Create logs directory if it doesn't exist
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Log file for cron job
const date = new Date();
const logFileName = `cron-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}.log`;
const logPath = path.join(LOG_DIR, logFileName);

try {
  console.log(`Running scheduled SEO audit at ${date.toISOString()}`);
  
  // Log start of cron job
  fs.appendFileSync(logPath, `[${date.toISOString()}] Starting scheduled SEO audit\n`);
  
  // Run the scheduled audit script
  const output = execSync(`node ${SCHEDULED_AUDIT_SCRIPT}`, { encoding: 'utf8' });
  
  // Log success
  fs.appendFileSync(logPath, `[${date.toISOString()}] SEO audit completed successfully\n`);
  fs.appendFileSync(logPath, `Output: ${output}\n`);
  
  console.log('Scheduled SEO audit completed successfully');
} catch (error) {
  console.error('Error running scheduled SEO audit:', error);
  
  // Log error
  fs.appendFileSync(
    logPath, 
    `[${date.toISOString()}] ERROR: ${error.message}\n${error.stack || ''}\n`
  );
}