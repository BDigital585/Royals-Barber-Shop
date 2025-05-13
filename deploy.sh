#!/bin/bash

# Simple script to run the deployment process
echo "🚀 Royals Barbershop Deployment Tool 🚀"
echo "====================================="
echo ""
echo "This script will deploy the site to Netlify and configure the Porkbun domain."
echo "It uses the following environment variables:"
echo "- NETLIFY_AUTH_TOKEN (for Netlify deployment)"
echo "- PORKBUN_API_KEY (for Porkbun domain configuration)"
echo "- PORKBUN_API_SECRET (for Porkbun domain configuration)"
echo ""

# Check if the required environment variables are set
if [ -z "$NETLIFY_AUTH_TOKEN" ]; then
  echo "❌ NETLIFY_AUTH_TOKEN is not set. Please set it before running this script."
  exit 1
fi

if [ -z "$PORKBUN_API_KEY" ]; then
  echo "❌ PORKBUN_API_KEY is not set. Please set it before running this script."
  exit 1
fi

if [ -z "$PORKBUN_API_SECRET" ]; then
  echo "❌ PORKBUN_API_SECRET is not set. Please set it before running this script."
  exit 1
fi

# Ask for confirmation
read -p "Are you sure you want to proceed with deployment? (yes/no): " answer
if [[ $answer == "yes" || $answer == "y" ]]; then
  echo -e "\nStarting deployment process..."
  node scripts/deploy-to-netlify.js
  
  if [ $? -eq 0 ]; then
    echo -e "\n✅ Deployment completed successfully!"
  else
    echo -e "\n❌ Deployment failed. Check the logs above for details."
    exit 1
  fi
else
  echo -e "\nDeployment cancelled."
  exit 0
fi