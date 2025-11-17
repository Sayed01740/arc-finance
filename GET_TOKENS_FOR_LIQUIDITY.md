# 💧 How to Get Tokens for Adding Liquidity

## Current Status

### ✅ TKA Token
- **You have**: ~999,000 TKA
- **Status**: ✅ Ready for liquidity

### ⚠️ USDC Token
- **Current balance**: ~0 (insufficient)
- **Address**: `0x3600000000000000000000000000000000000000`
- **Action needed**: Get from Arc testnet faucet

### ⚠️ USDT Token  
- **Current balance**: ~0 (insufficient)
- **Address**: `0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a`
- **Action needed**: Get from Arc testnet faucet

---

## 📋 Steps to Add Liquidity

### Option 1: Use Arc Testnet Faucet (Recommended)

1. **Visit Arc Testnet Faucet**:
   - Check Arc documentation for official faucet URL
   - Usually available at: https://faucet.arc.network or similar

2. **Request Tokens**:
   - Enter your wallet address: `0xC351Fd8F7f82452b3e531490b5FFa8b80a45Fa04`
   - Request USDC tokens
   - Request USDT tokens

3. **Wait for Tokens**:
   - Usually takes a few minutes
   - Check balance using: `npm run check-balances`

4. **Add Liquidity**:
   ```bash
   # For USDC/TKA:
   TOKEN_A_ADDRESS=0x3600000000000000000000000000000000000000
   TOKEN_B_ADDRESS=0xf8BF7E1938886b6d8D7e94A93FDd7d857E425496
   AMM_ADDRESS=0xeCa87Acf0A8D038ed94BD4C755109fA1D391ca32
   LIQUIDITY_AMOUNT_A=100
   LIQUIDITY_AMOUNT_B=100
   npm run add-liquidity-pool
   
   # For USDT/TKA:
   TOKEN_A_ADDRESS=0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a
   TOKEN_B_ADDRESS=0xf8BF7E1938886b6d8D7e94A93FDd7d857E425496
   AMM_ADDRESS=0xb29E57E2B5b86F0637825fb898bf53E1C1244245
   LIQUIDITY_AMOUNT_A=100
   LIQUIDITY_AMOUNT_B=100
   npm run add-liquidity-pool
   ```

### Option 2: Transfer from Another Wallet

If you have USDC/USDT in another wallet:
1. Send USDC to: `0xC351Fd8F7f82452b3e531490b5FFa8b80a45Fa04`
2. Send USDT to: `0xC351Fd8F7f82452b3e531490b5FFa8b80a45Fa04`
3. Then run the add-liquidity commands above

### Option 3: Use Testnet Bridge (If Available)

Some testnets have bridges where you can swap native tokens for ERC20 tokens.

---

## 🔍 Check Token Balances

Create a script to check balances:

```bash
npx hardhat run scripts/getArcTokens.ts --network arc
```

Or use this quick check:

```javascript
// In Hardhat console
const usdc = await ethers.getContractAt("IERC20", "0x3600000000000000000000000000000000000000");
const usdt = await ethers.getContractAt("IERC20", "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a");
const tka = await ethers.getContractAt("TestToken", "0xf8BF7E1938886b6d8D7e94A93FDd7d857E425496");
const [deployer] = await ethers.getSigners();

console.log("USDC:", ethers.formatEther(await usdc.balanceOf(deployer.address)));
console.log("USDT:", ethers.formatEther(await usdt.balanceOf(deployer.address)));
console.log("TKA:", ethers.formatEther(await tka.balanceOf(deployer.address)));
```

---

## 📝 Note

**USDC on Arc Testnet**:
- Address: `0x3600000000000000000000000000000000000000`
- This is the official Arc testnet USDC token
- Cannot be minted directly (only through faucet or official channels)

**USDT on Arc Testnet**:
- Address: `0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a`
- This is the official Arc testnet USDT token
- Cannot be minted directly (only through faucet or official channels)

---

## ✅ Once You Have Tokens

Run the add-liquidity commands and the pools will be active!

**Minimum liquidity**: Even 1-10 tokens per side is enough to enable swaps (though more is better for price stability).

