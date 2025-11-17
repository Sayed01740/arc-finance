#!/bin/bash
# Arc Finance - Vercel Deployment Script (for Linux/Mac)

echo "🚀 Arc Finance - Vercel Deployment Setup"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "Initializing Git repository..."
    git init
    git config user.name "Arc Finance"
    git config user.email "deploy@arcfinance.com"
fi

echo "✅ Git repository ready"
echo ""
echo "📋 Next Steps for Vercel Deployment:"
echo ""
echo "1. Create GitHub Repository:"
echo "   - Go to: https://github.com/new"
echo "   - Create new repository (don't initialize with files)"
echo "   - Copy the repository URL"
echo ""
echo "2. Push to GitHub:"
echo "   git remote add origin YOUR_GITHUB_REPO_URL"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Deploy on Vercel:"
echo "   - Go to: https://vercel.com"
echo "   - Sign in with GitHub"
echo "   - Click 'Add New...' → 'Project'"
echo "   - Import your repository"
echo "   - Set Root Directory to: frontend"
echo "   - Add environment variables"
echo "   - Click 'Deploy'"
echo ""
echo "✅ Project is ready for deployment!"
