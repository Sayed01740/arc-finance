# Arc Finance - Vercel Deployment Script
# This script prepares your project for Vercel deployment

Write-Host "🚀 Arc Finance - Vercel Deployment Setup" -ForegroundColor Green
Write-Host ""

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    git config user.name "Arc Finance"
    git config user.email "deploy@arcfinance.com"
}

# Check if .gitignore exists
if (-not (Test-Path .gitignore)) {
    Write-Host "Creating .gitignore..." -ForegroundColor Yellow
    Copy-Item frontend\.gitignore .gitignore -ErrorAction SilentlyContinue
}

Write-Host "✅ Git repository ready" -ForegroundColor Green
Write-Host ""

# Display deployment instructions
Write-Host "📋 Next Steps for Vercel Deployment:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Create GitHub Repository:" -ForegroundColor Yellow
Write-Host "   - Go to: https://github.com/new"
Write-Host "   - Create new repository (don't initialize with files)"
Write-Host "   - Copy the repository URL"
Write-Host ""
Write-Host "2. Push to GitHub:" -ForegroundColor Yellow
Write-Host "   git remote add origin YOUR_GITHUB_REPO_URL"
Write-Host "   git branch -M main"
Write-Host "   git push -u origin main"
Write-Host ""
Write-Host "3. Deploy on Vercel:" -ForegroundColor Yellow
Write-Host "   - Go to: https://vercel.com"
Write-Host "   - Sign in with GitHub"
Write-Host "   - Click 'Add New...' → 'Project'"
Write-Host "   - Import your repository"
Write-Host "   - Set Root Directory to: frontend"
Write-Host "   - Add environment variables (see DEPLOYMENT_CHECKLIST.md)"
Write-Host "   - Click 'Deploy'"
Write-Host ""
Write-Host "✅ Project is ready for deployment!" -ForegroundColor Green
Write-Host ""

# Environment variables reminder
Write-Host "📝 Required Environment Variables:" -ForegroundColor Cyan
Write-Host ""
Write-Host "NEXT_PUBLIC_ARC_RPC_URL=https://rpc.testnet.arc.network"
Write-Host "NEXT_PUBLIC_ARC_CHAIN_ID=5042002"
Write-Host "NEXT_PUBLIC_TOKEN_A_ADDRESS=0xc73768EDfe84d1cd3273a4D79074aD7874eFc0D2"
Write-Host "NEXT_PUBLIC_TOKEN_B_ADDRESS=0x20f5f88e3e483595D11f95299411B77061709B9E"
Write-Host "NEXT_PUBLIC_AMM_ADDRESS=0xf7E21C3DEAA8D32B4b99bbd5469b32c65F974514"
Write-Host ""

Write-Host "📚 See DEPLOYMENT_CHECKLIST.md for detailed instructions" -ForegroundColor Cyan
