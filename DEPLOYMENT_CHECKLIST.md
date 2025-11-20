# Vercel Deployment Checklist

Use this checklist to ensure a smooth deployment to Vercel.

## Pre-Deployment

- [ ] Code is pushed to GitHub repository
- [ ] All tests pass locally (`npm run build` works)
- [ ] Contract is deployed on Arc Testnet
- [ ] Contract address is noted down
- [ ] Vercel account is created (free tier is fine)

## Deployment Steps

### Via Dashboard (Easiest)

- [ ] Go to vercel.com and sign in
- [ ] Click "Add New Project"
- [ ] Import GitHub repository
- [ ] Set Root Directory to `frontend`
- [ ] Add environment variables:
  - [ ] `NEXT_PUBLIC_ARC_RPC_URL` = `https://rpc.testnet.arc.network`
  - [ ] `NEXT_PUBLIC_ARC_CHAIN_ID` = `5042002`
  - [ ] `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` = `your_contract_address`
- [ ] Click "Deploy"
- [ ] Wait for build to complete

### Via CLI

- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login: `vercel login`
- [ ] Navigate to frontend: `cd frontend`
- [ ] Deploy: `vercel --prod`
- [ ] Set environment variables via CLI or dashboard

## Post-Deployment Testing

- [ ] Site loads at the Vercel URL
- [ ] Home page displays correctly
- [ ] Wallet connection works
- [ ] Network detection shows "Arc Testnet"
- [ ] Can navigate to /mint page
- [ ] Can navigate to /create page
- [ ] Can navigate to /collection page
- [ ] Can navigate to /admin page
- [ ] Image upload works on /create
- [ ] Real-time preview updates correctly
- [ ] Attributes can be added/removed
- [ ] Network validation works (shows warning if wrong network)
- [ ] Minting transaction can be initiated
- [ ] Transaction confirmation works

## Environment Variables Checklist

Make sure these are set in Vercel:

```
✅ NEXT_PUBLIC_ARC_RPC_URL=https://rpc.testnet.arc.network
✅ NEXT_PUBLIC_ARC_CHAIN_ID=5042002
✅ NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...
```

**Important**: 
- Variables must start with `NEXT_PUBLIC_` to be accessible in the browser
- Set for all environments: Production, Preview, Development
- Redeploy after adding new variables

## Common Issues & Solutions

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify next.config.js is correct

### Environment Variables Not Working
- Make sure they start with `NEXT_PUBLIC_`
- Redeploy after adding variables
- Check variable names are exact (case-sensitive)

### Wallet Won't Connect
- Verify network configuration
- Check RPC URL is accessible
- Ensure contract address is correct

### Wrong Network Warning
- Verify `NEXT_PUBLIC_ARC_CHAIN_ID` is `5042002`
- Check wagmi.config.ts
- Clear browser cache

## Quick Deploy Commands

```bash
# Navigate to frontend
cd frontend

# Install Vercel CLI (if not installed)
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod

# Or use the automated script
cd ..
.\deploy-vercel.ps1
```

## Your Live URL

After deployment, your site will be available at:
- `https://your-project-name.vercel.app`
- Or your custom domain if configured

## Need Help?

- See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed guide
- Check Vercel docs: https://vercel.com/docs
- Check build logs in Vercel dashboard

