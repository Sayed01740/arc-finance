# 🚀 Automated Minting Setup Guide

This guide will help you automatically check and enable minting for your NFT contract.

## Quick Start (Automated)

### Option 1: PowerShell Script (Windows - Recommended)

1. **Set up your environment:**
   ```powershell
   # Create .env file if it doesn't exist
   # The script will create a template for you
   ```

2. **Run the automated script:**
   ```powershell
   .\enable-minting.ps1
   ```

   The script will:
   - ✅ Check if your .env file is configured
   - ✅ Check current minting status
   - ✅ Verify you're the contract owner
   - ✅ Enable minting if it's disabled

### Option 2: Manual Commands

1. **Check minting status:**
   ```bash
   npm run check-minting
   ```

2. **Enable minting (if you're the owner):**
   ```bash
   npm run enable-minting
   ```

## Environment Setup

Create a `.env` file in the root directory with:

```env
# Arc Network Configuration
ARC_RPC_URL=https://rpc.testnet.arc.network

# Your wallet private key (the one that deployed the contract)
PRIVATE_KEY=your_private_key_here

# NFT Contract Address
NFT_CONTRACT_ADDRESS=your_contract_address_here
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=your_contract_address_here
```

⚠️ **Security Note:** Never commit your `.env` file to git! It contains your private key.

## What the Scripts Do

### `checkMintingStatus.ts`
- Checks if minting is enabled/disabled
- Shows contract owner address
- Shows your wallet address
- Verifies if you're the owner
- Displays contract statistics (supply, price, etc.)

### `enableMinting.ts`
- Verifies you're the contract owner
- Checks current minting status
- Automatically enables minting if disabled
- Provides transaction confirmation

## Troubleshooting

### "You are not the contract owner"
- Make sure you're using the private key of the wallet that deployed the contract
- Check that `PRIVATE_KEY` in `.env` matches the deployer wallet

### "Contract address not set"
- Set `NFT_CONTRACT_ADDRESS` in your `.env` file
- Make sure the address is correct (starts with `0x`)

### "Insufficient balance"
- Make sure your wallet has enough tokens for gas fees
- Check your balance on Arc Testnet

### "Network connection error"
- Verify `ARC_RPC_URL` is correct
- Check your internet connection
- Try the RPC URL: `https://rpc.testnet.arc.network`

## Manual Steps (If Scripts Don't Work)

1. **Connect to the contract using a blockchain explorer:**
   - Go to Arc Testnet explorer
   - Find your contract
   - Connect with the owner wallet
   - Call `setMintingEnabled(true)`

2. **Use the Admin Panel:**
   - Visit `/admin` in your frontend
   - Connect with the owner wallet
   - Click "Enable Minting"

## Verification

After enabling minting, verify it worked:

```bash
npm run check-minting
```

You should see:
```
Minting Status: ✅ ENABLED
```

## Next Steps

Once minting is enabled:
1. ✅ Users can mint NFTs from your contract
2. ✅ The mint page will show "Mint" button instead of "Minting Disabled"
3. ✅ All minting functions will work properly

---

**Need Help?** Check the admin panel at `/admin` for a visual interface to manage minting.


