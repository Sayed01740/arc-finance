# 🤖 AI-Powered Minting Enabler

I've created an automated system to check and enable minting for your NFT contract. Here's what's been set up:

## ✨ What's Been Created

### 1. **Automated Scripts**
- ✅ `scripts/enableMinting.ts` - Automatically enables minting if you're the owner
- ✅ `scripts/checkMintingStatus.ts` - Checks current minting status and contract info
- ✅ `enable-minting.ps1` - PowerShell automation script (one-click solution)

### 2. **Admin Panel** (Web Interface)
- ✅ `/admin` page - Visual interface to manage minting
- ✅ Shows contract status, owner info, and minting controls
- ✅ One-click enable/disable buttons (owner only)

### 3. **Improved Error Messages**
- ✅ Better feedback on mint page when minting is disabled
- ✅ Clear instructions on how to fix the issue
- ✅ Links to admin panel for owners

## 🚀 Quick Start - Enable Minting Now

### **Easiest Method (Recommended):**

```powershell
.\enable-minting.ps1
```

This will:
1. Check your configuration
2. Verify you're the owner
3. Show current status
4. Ask if you want to enable minting
5. Automatically enable it if you confirm

### **Alternative Methods:**

**Option 1: Check Status First**
```bash
npm run check-minting
```

**Option 2: Enable Directly**
```bash
npm run enable-minting
```

**Option 3: Use Web Interface**
1. Visit `http://localhost:3000/admin` (or your deployed URL)
2. Connect your wallet (must be the owner)
3. Click "Enable Minting"

## 📋 Prerequisites

Before running, make sure you have:

1. **`.env` file** with:
   ```env
   ARC_RPC_URL=https://rpc.testnet.arc.network
   PRIVATE_KEY=your_private_key_here
   NFT_CONTRACT_ADDRESS=your_contract_address_here
   ```

2. **Owner Wallet**: The `PRIVATE_KEY` must be from the wallet that deployed the contract

3. **Gas Fees**: Your wallet needs tokens for transaction fees

## 🔍 What Gets Checked

The scripts automatically verify:
- ✅ Contract address is configured
- ✅ You can connect to the network
- ✅ You're the contract owner
- ✅ Current minting status
- ✅ Contract statistics (supply, price, etc.)

## 🎯 Expected Output

When you run `.\enable-minting.ps1`, you'll see:

```
🚀 Arc NFT - Automated Minting Enabler
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Step 1: Checking current minting status...

📊 Contract Status:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Owner: 0x...
  Your Address: 0x...
  Is Owner: ✅ Yes
  Minting Status: ❌ DISABLED
  Total Supply: 0 / 10000
  Mint Price: 0.01 USDC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Do you want to enable minting? (y/n): y

🔄 Step 2: Enabling minting...
✅ Transaction confirmed!
🎉 SUCCESS! Minting has been enabled!
```

## 🛠️ Troubleshooting

### Issue: "You are not the contract owner"
**Solution:** Use the private key from the wallet that deployed the contract

### Issue: "Contract address not set"
**Solution:** Add `NFT_CONTRACT_ADDRESS` to your `.env` file

### Issue: "Network connection error"
**Solution:** Check your `ARC_RPC_URL` and internet connection

### Issue: "Insufficient balance"
**Solution:** Add tokens to your wallet for gas fees

## 📱 Web Interface Alternative

If scripts don't work, use the web interface:

1. Start your frontend: `npm run dev`
2. Visit: `http://localhost:3000/admin`
3. Connect your wallet (owner wallet)
4. Click "Enable Minting"

## ✅ Verification

After enabling, verify it worked:

```bash
npm run check-minting
```

Or visit the mint page - the button should now say "Mint" instead of "Minting Disabled"

## 🎉 Success!

Once minting is enabled:
- ✅ Users can mint NFTs
- ✅ Mint page shows active minting
- ✅ All minting functions work
- ✅ Create page works for custom NFTs

---

**Ready to go?** Run `.\enable-minting.ps1` now! 🚀


