# ⚡ Quick Deploy to Vercel

## 🚀 5-Minute Deployment Guide

### Step 1: Push to GitHub (if not already done)

```bash
git init
git add .
git commit -m "Arc Finance DEX - Ready for Vercel"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy on Vercel

1. **Go to**: https://vercel.com
2. **Sign in** with GitHub
3. **Click**: "Add New..." → "Project"
4. **Import** your repository
5. **Configure**:
   - **Root Directory**: Set to `frontend` ⚠️ IMPORTANT!
   - Leave everything else as default

### Step 3: Add Environment Variables

In Vercel project → Settings → Environment Variables:

Add these 5 variables (set for all environments):

```env
NEXT_PUBLIC_ARC_RPC_URL=https://rpc.testnet.arc.network
NEXT_PUBLIC_ARC_CHAIN_ID=5042002
NEXT_PUBLIC_TOKEN_A_ADDRESS=0xc73768EDfe84d1cd3273a4D79074aD7874eFc0D2
NEXT_PUBLIC_TOKEN_B_ADDRESS=0x20f5f88e3e483595D11f95299411B77061709B9E
NEXT_PUBLIC_AMM_ADDRESS=0xf7E21C3DEAA8D32B4b99bbd5469b32c65F974514
```

### Step 4: Deploy!

Click **"Deploy"** → Wait 2-5 minutes → Done! ✅

---

## ✅ Your Live URL

After deployment:
- **Production**: `https://your-project-name.vercel.app`
- **HTTPS**: Automatically enabled
- **Global CDN**: Fast worldwide

---

## 📋 Contract Addresses (Already Configured)

All addresses are already deployed on Arc Testnet:
- Token A: `0xc73768EDfe84d1cd3273a4D79074aD7874eFc0D2`
- Token B: `0x20f5f88e3e483595D11f95299411B77061709B9E`
- AMM: `0xf7E21C3DEAA8D32B4b99bbd5469b32c65F974514`

---

## 🎉 That's It!

Your DEX is now live on Vercel with:
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Auto-deployments on every push
- ✅ Preview URLs for PRs

---

**Ready to deploy! 🚀**
