# ⚠️ CRITICAL: Vercel Environment Variables Setup

## Problem: Tokens Not Showing

If token balances are not showing, it's likely because **environment variables are not set in Vercel**.

## 🔧 Solution: Set Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard

1. Visit: https://vercel.com/sayeds-projects-e086c1e7/frontend/settings/environment-variables
2. Or navigate to: Project → Settings → Environment Variables

### Step 2: Add These Variables

Add the following environment variables (with values from your `.env` file):

```env
NEXT_PUBLIC_TOKEN_A_ADDRESS=0xf8BF7E1938886b6d8D7e94A93FDd7d857E425496
NEXT_PUBLIC_TOKEN_B_ADDRESS=0xe25A6bcDAFB93762fD727d1375403506F1e4d381
NEXT_PUBLIC_AMM_ADDRESS=0xFb2ecDB978FE3c6597F44D3e0B3B5442a6F10aAf
NEXT_PUBLIC_ARC_RPC_URL=https://rpc.testnet.arc.network
NEXT_PUBLIC_ARC_CHAIN_ID=5042002
```

### Step 3: Deploy Again

After adding variables:
1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait for deployment to complete

## 📋 Required Environment Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_TOKEN_A_ADDRESS` | `0xf8BF7E1938886b6d8D7e94A93FDd7d857E425496` | TKA token address |
| `NEXT_PUBLIC_TOKEN_B_ADDRESS` | `0xe25A6bcDAFB93762fD727d1375403506F1e4d381` | TKB token address |
| `NEXT_PUBLIC_AMM_ADDRESS` | `0xFb2ecDB978FE3c6597F44D3e0B3B5442a6F10aAf` | AMM pool address |
| `NEXT_PUBLIC_ARC_RPC_URL` | `https://rpc.testnet.arc.network` | Arc testnet RPC |
| `NEXT_PUBLIC_ARC_CHAIN_ID` | `5042002` | Arc testnet Chain ID |

## ✅ Verify Setup

1. Open the app: https://frontend-jh4ls30rg-sayeds-projects-e086c1e7.vercel.app
2. Open browser console (F12)
3. Look for "🔍 Environment Variables Check" log
4. All variables should show ✅

## 🐛 Debug Panel

I've added a debug panel to the app. To access:
1. Open the app
2. Click the "🐛 Debug" button in bottom-right corner
3. Check:
   - Wallet connection status
   - Environment variables
   - Token balances
   - Any errors

## 💡 Common Issues

### Issue: Variables show as "undefined"
**Solution**: Make sure variables start with `NEXT_PUBLIC_` prefix

### Issue: Variables set but still not working
**Solution**: 
1. Redeploy after adding variables
2. Hard refresh browser (Ctrl+Shift+R)
3. Clear browser cache

### Issue: Wallet connected but no balances
**Solution**:
1. Verify you're on Arc Testnet (Chain ID: 5042002)
2. Check if you actually have tokens in your wallet
3. Check browser console for errors

---

**After setting environment variables and redeploying, your tokens should show!** 🚀

