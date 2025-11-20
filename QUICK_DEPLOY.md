# Quick Deploy to Vercel

## 🚀 Fastest Way (3 Steps)

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel"
git push origin main
```

### 2. Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) → Sign in
2. Click **"Add New Project"**
3. Import your GitHub repo
4. **Important**: Set **Root Directory** to `frontend`
5. Click **"Deploy"**

### 3. Add Environment Variables
After first deployment, go to **Settings → Environment Variables** and add:

```
NEXT_PUBLIC_ARC_RPC_URL = https://rpc.testnet.arc.network
NEXT_PUBLIC_ARC_CHAIN_ID = 5042002
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS = 0x610F67164aEDF56a2BE9067CbDF5f85BFFb335d3
```

**Select all environments**: Production, Preview, Development

Then click **"Redeploy"** or wait for auto-redeploy.

## ✅ Done!

Your site is now live at: `https://your-project.vercel.app`

## 🔧 Alternative: CLI Method

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

Then add environment variables via dashboard or CLI.

## 📋 What You Need

- ✅ GitHub repository with your code
- ✅ Vercel account (free)
- ✅ Contract address from Arc Testnet
- ✅ 5 minutes

## 🆘 Need Help?

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.

