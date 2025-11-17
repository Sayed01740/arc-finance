# ✅ AMM Pools Deployment Status

## 📦 Deployed Pools

### 1. TKA ↔ TKB Pool (Original)
- **Address**: `0xFb2ecDB978FE3c6597F44D3e0B3B5442a6F10aAf`
- **Token A**: TKA (`0xf8BF7E1938886b6d8D7e94A93FDd7d857E425496`)
- **Token B**: TKB (`0xe25A6bcDAFB93762fD727d1375403506F1e4d381`)
- **Status**: ✅ Active with liquidity (1,000 TKA + 1,000 TKB)

### 2. USDC ↔ TKA Pool (NEW)
- **Address**: `0xeCa87Acf0A8D038ed94BD4C755109fA1D391ca32`
- **Token A**: USDC (`0x3600000000000000000000000000000000000000`)
- **Token B**: TKA (`0xf8BF7E1938886b6d8D7e94A93FDd7d857E425496`)
- **Status**: ✅ Deployed (liquidity pending)
- **Explorer**: https://testnet.arcscan.app/address/0xeCa87Acf0A8D038ed94BD4C755109fA1D391ca32

### 3. USDT ↔ TKA Pool (NEW)
- **Address**: `0xb29E57E2B5b86F0637825fb898bf53E1C1244245`
- **Token A**: USDT (`0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a`)
- **Token B**: TKA (`0xf8BF7E1938886b6d8D7e94A93FDd7d857E425496`)
- **Status**: ✅ Deployed (liquidity pending)
- **Explorer**: https://testnet.arcscan.app/address/0xb29E57E2B5b86F0637825fb898bf53E1C1244245

---

## ⚠️ Liquidity Status

### Pools with Liquidity
- ✅ **TKA/TKB**: 1,000 TKA + 1,000 TKB

### Pools Needing Liquidity
- ⏳ **USDC/TKA**: Needs USDC and TKA tokens
- ⏳ **USDT/TKA**: Needs USDT and TKA tokens

**Note**: To add liquidity, you need:
- USDC tokens (from faucet or transfer)
- USDT tokens (from faucet or transfer)
- TKA tokens (you have 999,000 TKA available)

---

## 🔄 Available Swap Routes

### Direct Swaps (Working Now)
- ✅ **TKA ↔ TKB** (Pool 1)

### Direct Swaps (After Adding Liquidity)
- ⏳ **USDC ↔ TKA** (Pool 2) - Pool deployed, needs liquidity
- ⏳ **USDT ↔ TKA** (Pool 3) - Pool deployed, needs liquidity

### Multi-Hop Swaps (Future)
- ⏳ **USDC → TKA → TKB** (via TKA bridge)
- ⏳ **USDT → TKA → TKB** (via TKA bridge)
- ⏳ **USDC → TKA → USDT** (via TKA bridge)

---

## 📝 How to Add Liquidity

### For USDC/TKA Pool:
```bash
# Set in .env:
TOKEN_A_ADDRESS=0x3600000000000000000000000000000000000000  # USDC
TOKEN_B_ADDRESS=0xf8BF7E1938886b6d8D7e94A93FDd7d857E425496  # TKA
AMM_ADDRESS=0xeCa87Acf0A8D038ed94BD4C755109fA1D391ca32
LIQUIDITY_AMOUNT_A=100  # Amount of USDC
LIQUIDITY_AMOUNT_B=100  # Amount of TKA

# Run:
npm run add-liquidity-pool
```

### For USDT/TKA Pool:
```bash
# Set in .env:
TOKEN_A_ADDRESS=0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a  # USDT
TOKEN_B_ADDRESS=0xf8BF7E1938886b6d8D7e94A93FDd7d857E425496  # TKA
AMM_ADDRESS=0xb29E57E2B5b86F0637825fb898bf53E1C1244245
LIQUIDITY_AMOUNT_A=100  # Amount of USDT
LIQUIDITY_AMOUNT_B=100  # Amount of TKA

# Run:
npm run add-liquidity-pool
```

---

## 🎯 Frontend Updates

The frontend has been updated to:
- ✅ Support multiple pools
- ✅ Auto-detect which pool to use for each token pair
- ✅ Show available tokens with pools
- ✅ Display warnings for tokens without pools
- ✅ Route swaps to correct pool address

---

## 📊 Pool Summary

| Pool | Address | Pair | Liquidity | Status |
|------|---------|------|-----------|--------|
| Pool 1 | `0xFb2ec...aAf` | TKA/TKB | ✅ Active | ✅ Working |
| Pool 2 | `0xeCa87...a32` | USDC/TKA | ⏳ Pending | ✅ Deployed |
| Pool 3 | `0xb29E5...245` | USDT/TKA | ⏳ Pending | ✅ Deployed |

---

**Status**: ✅ **All pools deployed, frontend updated!**

**Next Step**: Add liquidity to USDC/TKA and USDT/TKA pools to enable swaps.

