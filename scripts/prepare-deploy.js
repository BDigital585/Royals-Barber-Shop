#!/usr/bin/env node

// Script to prepare files for deployment
// This script ensures that robots.txt and sitemap.xml are copied to the build directory

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory name (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// File paths
const srcRobotsPath = path.join(rootDir, 'public', 'robots.txt');
const srcSitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
const distDir = path.join(rootDir, 'dist');
const destRobotsPath = path.join(distDir, 'robots.txt');
const destSitemapPath = path.join(distDir, 'sitemap.xml');

// Ensure the build directory exists
async function ensureBuildDir() {
  try {
    await fs.mkdir(distDir, { recursive: true });
    console.log('✅ Ensured build directory exists');
  } catch (error) {
    console.error('❌ Failed to create build directory:', error.message);
    process.exit(1);
  }
}

// Copy SEO files to the build directory
async function copySeoFiles() {
  try {
    // Copy robots.txt
    await fs.copyFile(srcRobotsPath, destRobotsPath);
    console.log('✅ Copied robots.txt to build directory');
    
    // Copy sitemap.xml
    await fs.copyFile(srcSitemapPath, destSitemapPath);
    console.log('✅ Copied sitemap.xml to build directory');
  } catch (error) {
    console.error('❌ Failed to copy SEO files:', error.message);
    process.exit(1);
  }
}

// Main function
async function main() {
  console.log('Preparing files for deployment...');
  await ensureBuildDir();
  await copySeoFiles();
  console.log('✅ All files prepared for deployment');
}

// Run the script
main().catch(error => {
  console.error('❌ Preparation failed:', error.message);
  process.exit(1);
});