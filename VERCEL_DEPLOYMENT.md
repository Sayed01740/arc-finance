# Vercel Deployment Guide

Complete guide to deploy your Arc NFT Mint website to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free tier available)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **Contract Deployed**: Your NFT contract should be deployed on Arc Testnet

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Prepare Your Repository

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

### Step 2: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

### Step 3: Configure Environment Variables

In the Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_ARC_RPC_URL=https://rpc.testnet.arc.network
NEXT_PUBLIC_ARC_CHAIN_ID=5042002
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x610F67164aEDF56a2BE9067CbDF5f85BFFb335d3
```

**How to add:**
1. Go to your project in Vercel dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: `NEXT_PUBLIC_ARC_RPC_URL`
   - **Value**: `https://rpc.testnet.arc.network`
   - **Environment**: Production, Preview, Development (select all)
4. Repeat for all three variables

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-3 minutes)
3. Your site will be live at `https://your-project.vercel.app`

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 4: Deploy

```bash
# First deployment (preview)
vercel

# Production deployment
vercel --prod
```

### Step 5: Set Environment Variables

```bash
vercel env add NEXT_PUBLIC_ARC_RPC_URL
# Enter: https://rpc.testnet.arc.network
# Select: Production, Preview, Development

vercel env add NEXT_PUBLIC_ARC_CHAIN_ID
# Enter: 5042002
# Select: Production, Preview, Development

vercel env add NEXT_PUBLIC_NFT_CONTRACT_ADDRESS
# Enter: your_contract_address_here
# Select: Production, Preview, Development
```

## Method 3: Use the Automated Script

We've included a PowerShell script for easy deployment:

```powershell
.\deploy-vercel.ps1
```

This script will:
1. Check if Vercel CLI is installed
2. Create `.env.local` template if missing
3. Build the project
4. Deploy to Vercel

## Post-Deployment Checklist

- [ ] Verify site is accessible
- [ ] Test wallet connection
- [ ] Verify network detection (should show Arc Testnet)
- [ ] Test NFT creation flow
- [ ] Test NFT minting
- [ ] Check all pages load correctly
- [ ] Verify environment variables are set correctly

## Custom Domain (Optional)

1. Go to your project in Vercel dashboard
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

## Environment Variables Reference

| Variable | Value | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_ARC_RPC_URL` | `https://rpc.testnet.arc.network` | Yes |
| `NEXT_PUBLIC_ARC_CHAIN_ID` | `5042002` | Yes |
| `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` | Your contract address | Yes |

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Ensure `next.config.js` is correct
- Check build logs in Vercel dashboard

### Environment Variables Not Working

- Make sure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

### Wallet Connection Issues

- Verify network configuration in `wagmi.config.ts`
- Check that RPC URL is accessible
- Ensure contract address is correct

### Network Detection Not Working

- Verify `NEXT_PUBLIC_ARC_CHAIN_ID` is set to `5042002`
- Check `wagmi.config.ts` chain configuration
- Clear browser cache and try again

## Updating Your Deployment

After making changes:

1. **Via GitHub**: Push changes, Vercel will auto-deploy
2. **Via CLI**: Run `vercel --prod` from frontend directory
3. **Via Dashboard**: Go to Deployments → Redeploy

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- Arc Network: https://arc.network

