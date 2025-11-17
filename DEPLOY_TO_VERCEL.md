# 🚀 Deploy Arc Finance to Vercel - Quick Guide

## Prerequisites
✅ GitHub repository  
✅ Vercel account (sign up at vercel.com)  
✅ Deployed smart contracts on Arc testnet

---

## 📋 Quick Deployment Steps

### 1. Push Code to GitHub

```bash
# From project root
git init
git add .
git commit -m "Arc Finance - Complete DEX project"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with GitHub
3. **Click "Add New..."** → **"Project"**
4. **Import** your GitHub repository
5. **Configure**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend` ⚠️ IMPORTANT!
   - Leave other settings as default

### 3. Add Environment Variables

In Vercel project settings → Environment Variables, add:

```env
NEXT_PUBLIC_ARC_RPC_URL=https://rpc.testnet.arc.network
NEXT_PUBLIC_ARC_CHAIN_ID=5042002
NEXT_PUBLIC_TOKEN_A_ADDRESS=0xc73768EDfe84d1cd3273a4D79074aD7874eFc0D2
NEXT_PUBLIC_TOKEN_B_ADDRESS=0x20f5f88e3e483595D11f95299411B77061709B9E
NEXT_PUBLIC_AMM_ADDRESS=0xf7E21C3DEAA8D32B4b99bbd5469b32c65F974514
```

**Important**: 
- Set environment for: **Production**, **Preview**, and **Development**
- Variables must start with `NEXT_PUBLIC_`

### 4. Deploy!

Click **"Deploy"** and wait 2-5 minutes.

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Project imported in Vercel
- [ ] Root directory set to `frontend`
- [ ] All 5 environment variables added
- [ ] Deploy clicked
- [ ] Build completed successfully
- [ ] Site accessible

---

## 🌐 Your Deployed URL

After deployment, you'll get:
- **Production**: `https://your-project.vercel.app`
- **Preview URLs**: For each PR/push

---

## 📝 Current Contract Addresses (Arc Testnet)

- **Token A**: `0xc73768EDfe84d1cd3273a4D79074aD7874eFc0D2`
- **Token B**: `0x20f5f88e3e483595D11f95299411B77061709B9E`
- **AMM**: `0xf7E21C3DEAA8D32B4b99bbd5469b32c65F974514`

---

## 🔧 Project Configuration

- **Framework**: Next.js 16
- **Build Command**: `npm run build` (auto)
- **Output Directory**: `.next` (auto)
- **Node Version**: 18+ (auto)

---

## 🐛 Common Issues

### Build Fails
- Check build logs in Vercel dashboard
- Verify all dependencies in `package.json`
- Ensure `frontend` is set as root directory

### Environment Variables Not Working
- Must start with `NEXT_PUBLIC_`
- Redeploy after adding variables
- Check values are correct

### Can't Connect Wallet
- Verify Arc Testnet is added to MetaMask
- Check RPC URL is accessible
- Verify contract addresses

---

## 📖 Full Documentation

See `frontend/VERCEL_DEPLOYMENT.md` for detailed instructions.

---

**Ready to deploy! 🎉**

Your DEX will be live on Vercel with automatic HTTPS, global CDN, and auto-deployments!
