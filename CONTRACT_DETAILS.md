# 📋 Complete Contract Details - Arc Finance

## 🌐 Network Configuration

### Arc Testnet
- **Network Name**: Arc Testnet
- **RPC URL**: `https://rpc.testnet.arc.network`
- **Chain ID**: `5042002`
- **Currency Symbol**: `USDC`
- **Block Explorer**: `https://testnet.arcscan.app`
- **Testnet**: Yes

---

## 📦 Deployed Smart Contracts

### 1. Token A (TKA)
- **Contract Address**: `0xc73768EDfe84d1cd3273a4D79074aD7874eFc0D2`
- **Name**: Token A
- **Symbol**: TKA
- **Decimals**: 18
- **Total Supply**: 1,000,000 TKA
- **Type**: ERC20 (Standard)
- **Contract**: TestToken.sol
- **Block Explorer**: https://testnet.arcscan.app/address/0xc73768EDfe84d1cd3273a4D79074aD7874eFc0D2
- **Status**: ✅ Deployed & Active

### 2. Token B (TKB)
- **Contract Address**: `0x20f5f88e3e483595D11f95299411B77061709B9E`
- **Name**: Token B
- **Symbol**: TKB
- **Decimals**: 18
- **Total Supply**: 1,000,000 TKB
- **Type**: ERC20 (Standard)
- **Contract**: TestToken.sol
- **Block Explorer**: https://testnet.arcscan.app/address/0x20f5f88e3e483595D11f95299411B77061709B9E
- **Status**: ✅ Deployed & Active

### 3. AMM Swap Contract (SimpleAMM)
- **Contract Address**: `0xf7E21C3DEAA8D32B4b99bbd5469b32c65F974514`
- **Name**: SimpleAMM
- **Type**: Uniswap V2-style AMM
- **Token A (Reserve)**: `0xc73768EDfe84d1cd3273a4D79074aD7874eFc0D2` (TKA)
- **Token B (Reserve)**: `0x20f5f88e3e483595D11f95299411B77061709B9E` (TKB)
- **Contract**: SimpleAMM.sol
- **Block Explorer**: https://testnet.arcscan.app/address/0xf7E21C3DEAA8D32B4b99bbd5469b32c65F974514
- **Status**: ✅ Deployed & Active
- **Liquidity**: Active (Initial liquidity added)

### 4. Official Arc Testnet USDC
- **Contract Address**: `0x3600000000000000000000000000000000000000`
- **Name**: USD Coin
- **Symbol**: USDC
- **Decimals**: 18
- **Type**: ERC20 (Official Arc Testnet Token)
- **Status**: ✅ Available
- **Note**: This is the native gas token on Arc Testnet with ERC20 interface

---

## 🔑 Deployment Account

- **Address**: `0xC351Fd8F7f82452b3e531490b5FFa8b80a45Fa04`
- **Network**: Arc Testnet (Chain ID: 5042002)
- **Balance**: ~9.64 USDC (for gas fees)
- **Token Holdings**:
  - Token A: 999,000 TKA (after adding 1000 to liquidity)
  - Token B: 999,000 TKB (after adding 1000 to liquidity)

---

## 💧 Pool Information

### Current Reserves
- **Token A Reserve**: 1,000 TKA
- **Token B Reserve**: 1,000 TKB
- **Current Price**: 1 TKA = 1 TKB
- **Liquidity Status**: ✅ Active
- **LP Token**: Managed by AMM contract

---

## 📜 Contract ABIs

### TestToken ABI (ERC20)
```solidity
// Standard ERC20 Functions
- name(): string
- symbol(): string
- decimals(): uint8
- totalSupply(): uint256
- balanceOf(address): uint256
- transfer(address, uint256): bool
- approve(address, uint256): bool
- allowance(address, address): uint256
- transferFrom(address, address, uint256): bool

// Additional Functions
- mint(address, uint256): void (for testing)
```

### SimpleAMM ABI
```solidity
// Main Functions
- addLiquidity(uint256 amountA, uint256 amountB, address to): uint256
- removeLiquidity(uint256 liquidity, address to): (uint256, uint256)
- swapExactTokens(uint256 amountIn, address tokenIn, address to): uint256

// View Functions
- getReserves(): (uint256, uint256)
- getAmountOut(uint256 amountIn, address tokenIn): uint256

// State Variables
- balanceOf[address]: uint256
- totalSupply: uint256
- reserveA: uint256
- reserveB: uint256
- tokenA: address
- tokenB: address
```

---

## 🌍 Frontend Configuration

### Environment Variables (.env.local)
```env
NEXT_PUBLIC_ARC_RPC_URL=https://rpc.testnet.arc.network
NEXT_PUBLIC_ARC_CHAIN_ID=5042002
NEXT_PUBLIC_TOKEN_A_ADDRESS=0xc73768EDfe84d1cd3273a4D79074aD7874eFc0D2
NEXT_PUBLIC_TOKEN_B_ADDRESS=0x20f5f88e3e483595D11f95299411B77061709B9E
NEXT_PUBLIC_AMM_ADDRESS=0xf7E21C3DEAA8D32B4b99bbd5469b32c65F974514
```

### Backend Configuration (.env)
```env
ARC_RPC_URL=https://rpc.testnet.arc.network
ARC_CHAIN_ID=5042002
PRIVATE_KEY=0x977738ca359f57adaad9c44937bc9a3e1410b53068e7c893762cc1418f6eca79
TOKEN_A_ADDRESS=0xc73768EDfe84d1cd3273a4D79074aD7874eFc0D2
TOKEN_B_ADDRESS=0x20f5f88e3e483595D11f95299411B77061709B9E
AMM_ADDRESS=0xf7E21C3DEAA8D32B4b99bbd5469b32c65F974514
```

---

## 🔧 Contract Functions

### SimpleAMM Functions

#### `addLiquidity(uint256 amountA, uint256 amountB, address to)`
- **Description**: Add liquidity to the pool
- **Parameters**:
  - `amountA`: Amount of Token A to add
  - `amountB`: Amount of Token B to add
  - `to`: Address to receive LP tokens
- **Returns**: `uint256` - Amount of LP tokens minted
- **Events**: `Mint(address indexed sender, uint256 amount)`

#### `removeLiquidity(uint256 liquidity, address to)`
- **Description**: Remove liquidity from the pool
- **Parameters**:
  - `liquidity`: Amount of LP tokens to burn
  - `to`: Address to receive tokens
- **Returns**: `(uint256, uint256)` - Amounts of Token A and Token B returned
- **Events**: `Burn(address indexed sender, uint256 amount, address indexed to)`

#### `swapExactTokens(uint256 amountIn, address tokenIn, address to)`
- **Description**: Swap exact amount of input tokens
- **Parameters**:
  - `amountIn`: Exact amount of input tokens
  - `tokenIn`: Address of input token
  - `to`: Address to receive output tokens
- **Returns**: `uint256` - Amount of output tokens received
- **Events**: `Swap(address indexed sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address indexed to)`

#### `getReserves()`
- **Description**: Get current pool reserves
- **Returns**: `(uint256, uint256)` - ReserveA, ReserveB
- **View Function**: Yes (no gas cost)

#### `getAmountOut(uint256 amountIn, address tokenIn)`
- **Description**: Calculate output amount for a given input
- **Parameters**:
  - `amountIn`: Input amount
  - `tokenIn`: Input token address
- **Returns**: `uint256` - Expected output amount
- **View Function**: Yes (no gas cost)

---

## 📊 Token Details

### Token A (TKA)
```json
{
  "address": "0xc73768EDfe84d1cd3273a4D79074aD7874eFc0D2",
  "name": "Token A",
  "symbol": "TKA",
  "decimals": 18,
  "totalSupply": "1000000000000000000000000",
  "type": "ERC20",
  "contract": "TestToken.sol"
}
```

### Token B (TKB)
```json
{
  "address": "0x20f5f88e3e483595D11f95299411B77061709B9E",
  "name": "Token B",
  "symbol": "TKB",
  "decimals": 18,
  "totalSupply": "1000000000000000000000000",
  "type": "ERC20",
  "contract": "TestToken.sol"
}
```

### USDC (Official)
```json
{
  "address": "0x3600000000000000000000000000000000000000",
  "name": "USD Coin",
  "symbol": "USDC",
  "decimals": 18,
  "type": "ERC20",
  "status": "Official Arc Testnet Token",
  "note": "Native gas token with ERC20 interface"
}
```

---

## 🔍 Contract Verification

All contracts are deployed on Arc Testnet and can be verified on the block explorer:

1. **Token A**: https://testnet.arcscan.app/address/0xc73768EDfe84d1cd3273a4D79074aD7874eFc0D2
2. **Token B**: https://testnet.arcscan.app/address/0x20f5f88e3e483595D11f95299411B77061709B9E
3. **AMM Contract**: https://testnet.arcscan.app/address/0xf7E21C3DEAA8D32B4b99bbd5469b32c65F974514

---

## 📁 Contract Files

### Solidity Contracts
- **Location**: `contracts/`
- **TestToken.sol**: ERC20 token contract
- **SimpleAMM.sol**: AMM swap contract

### Contract ABIs
- **Location**: `frontend/utils/abi.ts`
- Contains TypeScript interfaces for all contracts

---

## 🚀 Deployment Scripts

### Deploy Token
```bash
npm run deploy:token
```
- Deploys Token A and Token B
- Outputs contract addresses

### Deploy AMM
```bash
npm run deploy:amm
```
- Deploys SimpleAMM contract
- Links Token A and Token B
- Requires TOKEN_A_ADDRESS and TOKEN_B_ADDRESS

### Add Liquidity
```bash
npm run add-liquidity
```
- Adds initial liquidity to the pool
- Requires TOKEN_A_ADDRESS, TOKEN_B_ADDRESS, and AMM_ADDRESS
- Configurable amounts via environment variables

---

## 📝 Contract Events

### SimpleAMM Events
```solidity
event Mint(address indexed sender, uint256 amount);
event Burn(address indexed sender, uint256 amount, address indexed to);
event Swap(
    address indexed sender,
    uint256 amount0In,
    uint256 amount1In,
    uint256 amount0Out,
    uint256 amount1Out,
    address indexed to
);
```

### ERC20 Events
```solidity
event Transfer(address indexed from, address indexed to, uint256 value);
event Approval(address indexed owner, address indexed spender, uint256 value);
```

---

## ✅ Deployment Status

- ✅ Token A: Deployed
- ✅ Token B: Deployed
- ✅ AMM Contract: Deployed
- ✅ Initial Liquidity: Added (1000 TKA + 1000 TKB)
- ✅ Frontend: Configured and deployed
- ✅ Contract Verification: Ready for verification on block explorer

---

## 🔐 Security Notes

⚠️ **Important**:
- The private key in `.env` is for testing only
- Never commit private keys to production repositories
- Use environment variables or secure key management for production
- Test contracts thoroughly before mainnet deployment

---

## 📞 Support & Links

- **Network**: Arc Testnet (Chain ID: 5042002)
- **RPC**: https://rpc.testnet.arc.network
- **Explorer**: https://testnet.arcscan.app
- **GitHub**: https://github.com/Sayed01740/arc-finance
- **Frontend**: https://frontend-2d8ib5k5e-sayeds-projects-e086c1e7.vercel.app

---

**Last Updated**: 2025-11-17
**Network**: Arc Testnet
**Status**: ✅ All Contracts Deployed & Active

