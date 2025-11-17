# Arc Finance - Automated Vercel Deployment Script
# PowerShell script to deploy to Vercel

Write-Host "🚀 Deploying Arc Finance to Vercel..." -ForegroundColor Green
Write-Host ""

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed" -ForegroundColor Green
}

# Navigate to frontend directory
Set-Location frontend

Write-Host "🚀 Starting Vercel deployment..." -ForegroundColor Cyan
Write-Host ""
Write-Host "You will be prompted to:" -ForegroundColor Yellow
Write-Host "  1. Log in to Vercel (if not already logged in)" -ForegroundColor White
Write-Host "  2. Link project to your Vercel account" -ForegroundColor White
Write-Host "  3. Confirm deployment settings" -ForegroundColor White
Write-Host ""

# Check if already linked to a Vercel project
if (Test-Path .vercel) {
    Write-Host "✅ Project already linked to Vercel" -ForegroundColor Green
    Write-Host "Deploying to production..." -ForegroundColor Cyan
    vercel --prod
} else {
    Write-Host "🔗 Linking project to Vercel..." -ForegroundColor Cyan
    vercel link
    Write-Host ""
    Write-Host "🌐 Deploying to production..." -ForegroundColor Cyan
    vercel --prod
}

Write-Host ""
Write-Host "✅ Deployment initiated!" -ForegroundColor Green
Write-Host "Check your Vercel dashboard for the deployment status" -ForegroundColor Cyan

# Return to root
Set-Location ..