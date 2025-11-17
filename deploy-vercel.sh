#!/bin/bash
# Automated Vercel Deployment Script

echo "🚀 Deploying Arc Finance to Vercel..."
echo ""

# Navigate to frontend directory
cd frontend

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "🚀 Starting Vercel deployment..."
echo ""
echo "You will be prompted to:"
echo "  1. Log in to Vercel (if not already logged in)"
echo "  2. Link project to your Vercel account"
echo "  3. Confirm deployment settings"
echo ""

# Deploy with production flag
vercel --prod --yes

echo ""
echo "✅ Deployment complete!"
echo "Check your Vercel dashboard for the deployment URL"
