# Arc NFT Mint - Automated Vercel Deployment Script
# This script helps you deploy your NFT minting website to Vercel

Write-Host "🚀 Arc NFT Mint - Vercel Deployment" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host ""
}

# Navigate to frontend directory
Write-Host "📁 Navigating to frontend directory..." -ForegroundColor Cyan
Set-Location frontend

# Check if .env.local exists
if (!(Test-Path .env.local)) {
    Write-Host "⚠️  .env.local not found. Creating template..." -ForegroundColor Yellow
    Write-Host ""
    
    $envContent = @"
# Arc Network Configuration
NEXT_PUBLIC_ARC_RPC_URL=https://rpc.testnet.arc.network
NEXT_PUBLIC_ARC_CHAIN_ID=5042002

# NFT Contract Address (update this with your deployed contract address)
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x610F67164aEDF56a2BE9067CbDF5f85BFFb335d3
"@
    
    Set-Content -Path .env.local -Value $envContent
    Write-Host "✅ Created .env.local template" -ForegroundColor Green
    Write-Host "   Please update NEXT_PUBLIC_NFT_CONTRACT_ADDRESS if needed!" -ForegroundColor Yellow
    Write-Host ""
}

# Build the project
Write-Host "🔨 Building Next.js project..." -ForegroundColor Cyan
Write-Host ""
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Build failed! Please fix errors and try again." -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host ""
Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""

# Check if user is logged in to Vercel
Write-Host "🔐 Checking Vercel authentication..." -ForegroundColor Cyan
$vercelWhoami = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Not logged in to Vercel. Please login..." -ForegroundColor Yellow
    Write-Host ""
    vercel login
    Write-Host ""
}

# Deploy to Vercel
Write-Host "🌐 Deploying to Vercel..." -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Tip: If this is your first deployment, you'll be asked to:" -ForegroundColor Yellow
Write-Host "   1. Link to existing project or create new" -ForegroundColor White
Write-Host "   2. Set project name" -ForegroundColor White
Write-Host "   3. Confirm deployment settings" -ForegroundColor White
Write-Host ""

vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Important Next Steps:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Add these environment variables:" -ForegroundColor White
    Write-Host "   • NEXT_PUBLIC_ARC_RPC_URL = https://rpc.testnet.arc.network" -ForegroundColor Yellow
    Write-Host "   • NEXT_PUBLIC_ARC_CHAIN_ID = 5042002" -ForegroundColor Yellow
    Write-Host "   • NEXT_PUBLIC_NFT_CONTRACT_ADDRESS = your_contract_address" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "3. Select ALL environments (Production, Preview, Development)" -ForegroundColor White
    Write-Host ""
    Write-Host "4. Redeploy your project (or wait for auto-redeploy)" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 Your site will be live at: https://your-project.vercel.app" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host "   Check the error messages above for details." -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Common issues:" -ForegroundColor Yellow
    Write-Host "   • Not logged in: Run 'vercel login' first" -ForegroundColor White
    Write-Host "   • Build errors: Fix errors and rebuild" -ForegroundColor White
    Write-Host "   • Network issues: Check your internet connection" -ForegroundColor White
    Write-Host ""
}

Set-Location ..
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✨ Done!" -ForegroundColor Cyan
