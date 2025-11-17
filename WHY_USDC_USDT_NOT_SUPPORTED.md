# Why USDC/USDT Are Not Supported

## 🔍 Technical Explanation

### Current AMM Architecture

The **SimpleAMM** contract is designed as a **single-pair AMM**. This means:

1. **One Pool Per Contract**: Each AMM contract only supports **ONE token pair**
2. **Hardcoded Tokens**: The tokens are set during deployment and cannot be changed
3. **Constructor Configuration**: 
   ```solidity
   constructor(address _tokenA, address _tokenB) {
       tokenA = IERC20(_tokenA);  // Fixed at deployment
       tokenB = IERC20(_tokenB);  // Fixed at deployment
   }
   ```

### Current Deployment

- **AMM Address**: `0xFb2ecDB978FE3c6597F44D3e0B3B5442a6F10aAf`
- **Token A**: `0xf8BF7E1938886b6d8D7e94A93FDd7d857E425496` (TKA)
- **Token B**: `0xe25A6bcDAFB93762fD727d1375403506F1e4d381` (TKB)
- **Supported Pair**: **TKA ↔ TKB only**

### Why USDC/USDT Don't Work

The contract validates tokens during swaps:
```solidity
require(tokenIn == address(tokenA) || tokenIn == address(tokenB), "Invalid token");
```

This means:
- ✅ **TKA → TKB**: Works (both tokens are in the pool)
- ✅ **TKB → TKA**: Works (both tokens are in the pool)
- ❌ **USDC → TKA**: Fails (USDC is not tokenA or tokenB)
- ❌ **USDT → TKA**: Fails (USDT is not tokenA or tokenB)
- ❌ **USDC → USDT**: Fails (neither token is in this pool)

---

## 🔧 Solution: Deploy Additional Pools

To support USDC/USDT, you need to deploy **additional AMM pools**:

### Option 1: Deploy New Pools

#### Pool 1: USDC ↔ TKA
```bash
npx hardhat run scripts/deployAMM.ts --network arc
# Use USDC address and TKA address
```

#### Pool 2: USDT ↔ TKA
```bash
npx hardhat run scripts/deployAMM.ts --network arc
# Use USDT address and TKA address
```

#### Pool 3: USDC ↔ USDT
```bash
npx hardhat run scripts/deployAMM.ts --network arc
# Use USDC address and USDT address
```

### Option 2: Use TKA as Bridge Token

You could swap through TKA:
- USDC → TKA → TKB
- USDT → TKA → TKB

This requires:
1. **USDC/TKA pool**
2. **USDT/TKA pool**
3. **TKA/TKB pool** (already exists)

Then implement **multi-hop routing** in the frontend.

---

## 📊 Current Token Support

### ✅ Supported (In Current AMM)
- **TKA** ↔ **TKB**
  - Address: `0xFb2ecDB978FE3c6597F44D3e0B3B5442a6F10aAf`
  - Liquidity: Active

### ❌ Not Supported (No Pool Exists)
- **USDC** (Address: `0x3600000000000000000000000000000000000000`)
  - No AMM pool deployed
  - Cannot be swapped directly

- **USDT** (Address: `0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a`)
  - No AMM pool deployed
  - Cannot be swapped directly

---

## 🚀 How to Add USDC/USDT Support

### Step 1: Deploy USDC/TKA Pool

1. **Deploy new AMM contract**:
   ```bash
   # Set in .env:
   TOKEN_A_ADDRESS=0x3600000000000000000000000000000000000000  # USDC
   TOKEN_B_ADDRESS=0xf8BF7E1938886b6d8D7e94A93FDd7d857E425496  # TKA
   
   npx hardhat run scripts/deployAMM.ts --network arc
   ```

2. **Add liquidity**:
   ```bash
   # Set in .env:
   AMM_ADDRESS=<new_usdc_tka_pool_address>
   
   npx hardhat run scripts/addLiquidity.ts --network arc
   ```

### Step 2: Deploy USDT/TKA Pool

1. **Deploy new AMM contract**:
   ```bash
   # Set in .env:
   TOKEN_A_ADDRESS=0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a  # USDT
   TOKEN_B_ADDRESS=0xf8BF7E1938886b6d8D7e94A93FDd7d857E425496  # TKA
   
   npx hardhat run scripts/deployAMM.ts --network arc
   ```

2. **Add liquidity**:
   ```bash
   npx hardhat run scripts/addLiquidity.ts --network arc
   ```

### Step 3: Update Frontend

Update the frontend to support multiple pools and routing:

1. **Store multiple AMM addresses**
2. **Implement pool detection** (which pool supports which tokens)
3. **Add multi-hop routing** (if needed)

---

## 💡 Alternative: Multi-Pair AMM Contract

For better scalability, you could deploy a **Uniswap V2-style factory** that:
- Supports multiple token pairs
- Uses a factory pattern to create pools
- Allows dynamic pair creation

This would require:
- **AMM Factory contract**
- **Router contract** (for multi-hop)
- **More complex frontend logic**

---

## 📝 Summary

**Why USDC/USDT aren't supported:**
- The current AMM only has **one pool**: TKA/TKB
- Each AMM contract supports **only one pair**
- USDC/USDT tokens are **not in the deployed pool**

**To add support:**
1. Deploy new AMM pools for USDC/TKA and USDT/TKA
2. Add liquidity to each pool
3. Update frontend to route through multiple pools
4. Or implement a factory/router pattern for better scalability

---

**Current Status**: 
- ✅ TKA ↔ TKB: **Supported**
- ❌ USDC: **Not Supported** (no pool)
- ❌ USDT: **Not Supported** (no pool)

