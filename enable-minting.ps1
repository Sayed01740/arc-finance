# Automated Minting Enabler Script
# This script automatically checks and enables minting if you're the contract owner
param(
    [string]$EnableMinting = ""
)

Write-Host "🚀 Arc NFT - Automated Minting Enabler" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (!(Test-Path .env)) {
    Write-Host "⚠️  .env file not found. Creating template..." -ForegroundColor Yellow
    Write-Host ""
    
    $envContent = @"
# Arc Network Configuration
ARC_RPC_URL=https://rpc.testnet.arc.network

# Your wallet private key (keep this secret!)
PRIVATE_KEY=your_private_key_here

# NFT Contract Address
NFT_CONTRACT_ADDRESS=your_contract_address_here
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=your_contract_address_here
"@
    
    Set-Content -Path .env -Value $envContent
    Write-Host "✅ Created .env file template" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Please update the .env file with:" -ForegroundColor Yellow
    Write-Host "   1. Your PRIVATE_KEY (the wallet that deployed the contract)" -ForegroundColor White
    Write-Host "   2. Your NFT_CONTRACT_ADDRESS" -ForegroundColor White
    Write-Host ""
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 1
}

# Check if dotenv is installed
Write-Host "📦 Checking dependencies..." -ForegroundColor Cyan
npm list dotenv 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "   Installing dotenv..." -ForegroundColor Yellow
    npm install dotenv
}

# First, check the current status
Write-Host ""
Write-Host "🔍 Step 1: Checking current minting status..." -ForegroundColor Cyan
Write-Host ""
npx hardhat run scripts/checkMintingStatus.ts --network arc

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Failed to check status. Please verify:" -ForegroundColor Red
    Write-Host "   1. Your .env file has PRIVATE_KEY and NFT_CONTRACT_ADDRESS set" -ForegroundColor White
    Write-Host "   2. You have sufficient balance for gas fees" -ForegroundColor White
    Write-Host "   3. The contract address is correct" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Ask user if they want to enable minting
if ($EnableMinting -eq "") {
    $response = Read-Host "Do you want to enable minting? (y/n)"
} else {
    $response = $EnableMinting
}

if ($response -eq "y" -or $response -eq "Y" -or $response -eq "yes") {
    Write-Host ""
    Write-Host "🔄 Step 2: Enabling minting..." -ForegroundColor Cyan
    Write-Host ""
    npx hardhat run scripts/enableMinting.ts --network arc
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ SUCCESS! Minting has been enabled!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 Your NFT contract is now ready for minting!" -ForegroundColor Green
        Write-Host "   Users can now mint NFTs from your contract." -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "❌ Failed to enable minting. Please check:" -ForegroundColor Red
        Write-Host "   1. You are the contract owner" -ForegroundColor White
        Write-Host "   2. You have sufficient balance for gas fees" -ForegroundColor White
        Write-Host "   3. The network connection is working" -ForegroundColor White
    }
} else {
    Write-Host ""
    Write-Host "ℹ️  Skipping enable step. Minting status unchanged." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✨ Done!" -ForegroundColor Cyan

