# Vercel Deployment Guide - Arc Finance Frontend

## 🚀 Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier available at vercel.com)
- Your project pushed to GitHub

---

## 📋 Step-by-Step Deployment

### 1. Push to GitHub

```bash
# From the frontend directory
cd frontend
git init
git add .
git commit -m "Initial commit - Arc Finance Frontend"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Import Project in Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click **"Add New..."** → **"Project"**
4. Import your GitHub repository
5. Select the repository containing the frontend

### 3. Configure Project Settings

In the Vercel project configuration:

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `frontend` (IMPORTANT!)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### 4. Add Environment Variables

In the Vercel project settings, add these environment variables:

#### Required Environment Variables:

```env
NEXT_PUBLIC_ARC_RPC_URL=https://rpc.testnet.arc.network
NEXT_PUBLIC_ARC_CHAIN_ID=5042002
NEXT_PUBLIC_TOKEN_A_ADDRESS=0xc73768EDfe84d1cd3273a4D79074aD7874eFc0D2
NEXT_PUBLIC_TOKEN_B_ADDRESS=0x20f5f88e3e483595D11f95299411B77061709B9E
NEXT_PUBLIC_AMM_ADDRESS=0xf7E21C3DEAA8D32B4b99bbd5469b32c65F974514
```

#### How to Add Environment Variables:

1. Go to your project in Vercel dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: `NEXT_PUBLIC_ARC_RPC_URL`
   - **Value**: `https://rpc.testnet.arc.network`
   - **Environment**: Select all (Production, Preview, Development)
   - Click **Save**
4. Repeat for all environment variables above

### 5. Deploy

1. After adding environment variables, click **"Deploy"**
2. Wait for the build to complete (usually 2-5 minutes)
3. Once deployed, you'll get a URL like: `https://arc-finance.vercel.app`

---

## 🔧 Configuration Files

### vercel.json (Optional)

If you need custom configuration, create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

### next.config.js

The Next.js config is already set up with:
- Webpack configuration
- Module resolution fixes
- Transpile packages for clsx

---

## ✅ Verification

After deployment, verify:

1. **Check Build Logs**: Make sure the build completed successfully
2. **Test the Site**: Visit your Vercel URL
3. **Check Console**: Open browser console for any errors
4. **Test Wallet Connect**: Try connecting MetaMask
5. **Verify Network**: Make sure Arc Testnet is accessible

---

## 🔄 Updating Deployment

Every time you push to your main branch:
- Vercel automatically detects changes
- Creates a new deployment
- Your site is updated automatically

For preview deployments:
- Each PR gets its own preview URL
- Test changes before merging

---

## 🌐 Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation

---

## 📊 Environment Variables Reference

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_ARC_RPC_URL` | `https://rpc.testnet.arc.network` | Arc testnet RPC endpoint |
| `NEXT_PUBLIC_ARC_CHAIN_ID` | `5042002` | Arc testnet chain ID |
| `NEXT_PUBLIC_TOKEN_A_ADDRESS` | `0xc73768ED...` | Token A contract address |
| `NEXT_PUBLIC_TOKEN_B_ADDRESS` | `0x20f5f88e...` | Token B contract address |
| `NEXT_PUBLIC_AMM_ADDRESS` | `0xf7E21C3D...` | AMM contract address |

**Note**: All variables must start with `NEXT_PUBLIC_` to be accessible in the browser.

---

## 🐛 Troubleshooting

### Build Fails

1. **Check Build Logs**: Look for specific errors
2. **Verify Dependencies**: Make sure all packages are in `package.json`
3. **Check Node Version**: Vercel uses Node 18+ by default
4. **Clear Build Cache**: In Vercel settings, clear build cache

### Environment Variables Not Working

1. **Check Variable Names**: Must start with `NEXT_PUBLIC_`
2. **Redeploy**: Variables need a new deployment to take effect
3. **Verify Values**: Double-check the addresses are correct

### Module Resolution Errors

- The `next.config.js` already includes fixes for clsx and other modules
- If issues persist, check the build logs

### Network Errors

1. **Check RPC URL**: Verify it's accessible
2. **Check Chain ID**: Must match Arc testnet (5042002)
3. **Verify Contract Addresses**: Make sure they're deployed on Arc testnet

---

## 📝 Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Repository imported in Vercel
- [ ] Root directory set to `frontend`
- [ ] All environment variables added
- [ ] Build completed successfully
- [ ] Site accessible at Vercel URL
- [ ] Wallet connection working
- [ ] Contract addresses verified

---

## 🎉 After Deployment

Your DEX will be live at:
- **Production URL**: `https://your-project.vercel.app`
- **Automatic HTTPS**: Enabled by default
- **Global CDN**: Fast loading worldwide
- **Auto Deployments**: Updates on every push

---

**Deployment complete! 🚀**

For issues or questions, check Vercel documentation or project build logs.
