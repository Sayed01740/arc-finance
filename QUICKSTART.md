# Quick Start Guide

## Prerequisites
- Node.js 18+
- MetaMask installed
- Arc testnet configured in MetaMask

## Step 1: Install Dependencies

```bash
# Install contract dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

## Step 2: Configure Environment

### Root `.env` file:
```env
ARC_RPC_URL=https://rpc.testnet.arc.network
ARC_CHAIN_ID=5042002
PRIVATE_KEY=0x977738ca359f57adaad9c44937bc9a3e1410b53068e7c893762cc1418f6eca79
```

### Frontend `frontend/.env.local` file:
```env
NEXT_PUBLIC_ARC_RPC_URL=https://rpc.testnet.arc.network
NEXT_PUBLIC_ARC_CHAIN_ID=5042002
```

After deployment, add:
```env
NEXT_PUBLIC_TOKEN_A_ADDRESS=0x...
NEXT_PUBLIC_TOKEN_B_ADDRESS=0x...
NEXT_PUBLIC_AMM_ADDRESS=0x...
```

## Step 3: Deploy Contracts

```bash
# Compile contracts
npm run compile

# Deploy tokens
npm run deploy:token
# Copy TOKEN_A_ADDRESS and TOKEN_B_ADDRESS to .env

# Deploy AMM
npm run deploy:amm
# Copy AMM_ADDRESS to .env and frontend/.env.local

# Add initial liquidity
npm run add-liquidity
```

## Step 4: Run Frontend

```bash
cd frontend
npm run dev
```

Visit http://localhost:3000

## Step 5: Connect Wallet

1. Open MetaMask
2. Ensure Arc testnet is added
3. Click "Connect Wallet" in the app
4. Approve connection

## Step 6: Use the DEX

### Swap Tokens
1. Select "Swap" tab
2. Choose token to swap from
3. Enter amount
4. Approve token (first time)
5. Click "Swap"

### Add Liquidity
1. Select "Liquidity" tab
2. Enter amounts for both tokens
3. Click "Add Liquidity"
4. Approve tokens if needed

### Remove Liquidity
1. Select "Liquidity" tab
2. Click "Remove"
3. Enter LP token amount
4. Click "Remove Liquidity"

## Testing Locally

```bash
# Terminal 1: Start local node
npm run node

# Terminal 2: Deploy to localhost
hardhat run scripts/deployToken.ts --network localhost
hardhat run scripts/deployAMM.ts --network localhost
hardhat run scripts/addLiquidity.ts --network localhost

# Update frontend/.env.local:
NEXT_PUBLIC_ARC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_ARC_CHAIN_ID=31337
```

## Deploy to Vercel

1. Push to GitHub
2. Import repository in Vercel
3. Set root directory to `frontend`
4. Add environment variables
5. Deploy

See README.md for detailed instructions.
