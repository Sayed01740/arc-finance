# Troubleshooting Minting Issues

## Common Issues and Solutions

### 1. "Unable to fetch mint price" Error

**Symptoms:**
- Error message appears when clicking mint
- Price shows as "Loading..." or "Default"

**Possible Causes:**
- Not connected to Arc Testnet
- RPC connection issues
- Contract address incorrect

**Solutions:**
1. **Check Network:**
   - Ensure you're on Arc Testnet (Chain ID: 5042002)
   - Switch network in your wallet if needed

2. **Check Contract Address:**
   - Verify `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` is set correctly
   - Should be: `0x610F67164aEDF56a2BE9067CbDF5f85BFFb335d3`

3. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

### 2. Transaction Not Appearing in Wallet

**Symptoms:**
- Click mint button, nothing happens
- No wallet popup appears

**Possible Causes:**
- Wallet not connected
- Wrong network
- JavaScript errors

**Solutions:**
1. **Check Wallet Connection:**
   - Ensure wallet is connected
   - Try disconnecting and reconnecting

2. **Check Browser Console:**
   - Look for errors starting with "🚀 Starting mint transaction"
   - Check for any red error messages

3. **Check Network:**
   - Must be on Arc Testnet
   - Check chain ID in console logs

### 3. Transaction Fails/Rejected

**Symptoms:**
- Wallet popup appears but transaction fails
- Error message shows

**Possible Causes:**
- Insufficient balance
- Contract requirements not met
- Network congestion

**Solutions:**
1. **Check Balance:**
   - Need at least 0.01 USDC per NFT
   - Check balance display on page

2. **Check Contract Status:**
   - Minting must be enabled
   - Supply must not be maxed out

3. **Check Error Message:**
   - Read the specific error in the toast notification
   - Check browser console for details

### 4. Transaction Stuck/Pending

**Symptoms:**
- Transaction sent but never confirms
- Shows "Confirming..." forever

**Possible Causes:**
- Network congestion
- Low gas price
- RPC issues

**Solutions:**
1. **Wait:**
   - Arc Testnet can be slow
   - Wait up to 2 minutes

2. **Check Transaction:**
   - Copy transaction hash from console
   - Check on Arc Testnet explorer

3. **Retry:**
   - If stuck > 5 minutes, try again

## Debug Steps

### Step 1: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for these logs:
   - `🚀 Starting mint transaction:` - Transaction started
   - `✅ writeContract called` - Contract call made
   - `✅ Transaction sent successfully` - Transaction sent
   - `🎉 Transaction confirmed!` - Transaction confirmed
   - Any red error messages

### Step 2: Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Look for failed requests to RPC

### Step 3: Verify Contract

Run this command to check contract status:
```bash
npx hardhat run scripts/checkMintingStatus.ts --network arc
```

### Step 4: Test Minting via Script

Test if minting works via script:
```bash
npx hardhat run scripts/mintNFT.ts --network arc
```

If this works but frontend doesn't, it's a frontend issue.

## Quick Checks

- [ ] Wallet connected?
- [ ] On Arc Testnet (Chain ID: 5042002)?
- [ ] Contract address correct?
- [ ] Balance sufficient (0.01+ USDC)?
- [ ] Minting enabled on contract?
- [ ] Browser console shows no errors?
- [ ] Network requests successful?

## Getting Help

If still not working:

1. **Check Console Logs:**
   - Copy all console logs
   - Look for error messages

2. **Check Transaction Hash:**
   - If transaction was sent, copy the hash
   - Check on explorer: https://testnet.explorer.arc.network

3. **Provide Information:**
   - Error message shown
   - Console logs
   - Network (Arc Testnet?)
   - Wallet type (MetaMask, etc.)
   - Browser type

## Expected Behavior

When minting works correctly:

1. Click "Mint" button
2. See "Preparing transaction..." toast
3. Wallet popup appears
4. Confirm transaction in wallet
5. See "Transaction sent! Waiting for confirmation..."
6. See "NFTs minted successfully!" after confirmation
7. Console shows: `🎉 Transaction confirmed! Hash: 0x...`

