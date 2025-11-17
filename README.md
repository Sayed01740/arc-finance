# Arc Finance - AMM DEX on Arc Testnet

A complete decentralized exchange (DEX) built on Arc testnet featuring an ERC20 token, Automated Market Maker (AMM) swap contract, and Next.js frontend interface.

## Project Structure

```
arc_finance/
├── contracts/              # Solidity smart contracts
│   ├── TestToken.sol      # ERC20 token contract
│   ├── SimpleAMM.sol      # AMM swap contract
│   └── MathHelper.sol     # Price calculation helpers
├── scripts/                # Hardhat deployment scripts
│   ├── deployToken.ts     # Deploy token contracts
│   ├── deployAMM.ts       # Deploy AMM contract
│   └── addLiquidity.ts    # Add initial liquidity
├── frontend/               # Next.js frontend application
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── utils/             # Utility functions and ABIs
│   └── wagmi.config.ts    # Wagmi/viem configuration
├── hardhat.config.ts      # Hardhat configuration
├── tsconfig.json          # TypeScript config for contracts
└── package.json           # Root package.json
```

## Features

### Smart Contracts
- **TestToken**: Standard ERC20 token with minting capability
- **SimpleAMM**: Uniswap V2-style AMM with:
  - `addLiquidity()`: Add tokens to liquidity pool
  - `removeLiquidity()`: Remove liquidity and receive tokens back
  - `swapExactTokens()`: Swap tokens using constant product formula (x * y = k)
  - `getReserves()`: View current pool reserves
  - `getAmountOut()`: Calculate swap output amount
  - 0.3% swap fee (built into the formula)

### Frontend
- Wallet connection with wagmi
- Swap interface with real-time price preview
- Add/remove liquidity interface
- Pool statistics display (reserves, price)
- Automatic chain configuration for Arc testnet

## Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask or compatible Web3 wallet
- Arc testnet configured in your wallet
- Private key with testnet tokens (for deployment)

## Installation

### 1. Clone and Install Dependencies

```bash
# Install root dependencies (for contracts)
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
ARC_RPC_URL=https://rpc.testnet.arc.network
ARC_CHAIN_ID=5042002
PRIVATE_KEY=0x977738ca359f57adaad9c44937bc9a3e1410b53068e7c893762cc1418f6eca79

# After deployment, add contract addresses:
TOKEN_A_ADDRESS=0x...
TOKEN_B_ADDRESS=0x...
AMM_ADDRESS=0x...
LIQUIDITY_AMOUNT_A=1000
LIQUIDITY_AMOUNT_B=1000
```

Create a `frontend/.env.local` file:

```env
NEXT_PUBLIC_ARC_RPC_URL=https://rpc.testnet.arc.network
NEXT_PUBLIC_ARC_CHAIN_ID=5042002
NEXT_PUBLIC_TOKEN_A_ADDRESS=0x...
NEXT_PUBLIC_TOKEN_B_ADDRESS=0x...
NEXT_PUBLIC_AMM_ADDRESS=0x...
```

## Deployment

### Step 1: Compile Contracts

```bash
npm run compile
```

### Step 2: Deploy Tokens

Deploy both test tokens (Token A and Token B):

```bash
npm run deploy:token
```

Save the deployed addresses and update your `.env` file:
- `TOKEN_A_ADDRESS`
- `TOKEN_B_ADDRESS`

### Step 3: Deploy AMM Contract

Update `.env` with token addresses, then deploy:

```bash
npm run deploy:amm
```

Save the AMM address and update both `.env` files:
- Root `.env`: `AMM_ADDRESS`
- `frontend/.env.local`: `NEXT_PUBLIC_AMM_ADDRESS`

### Step 4: Add Initial Liquidity

Add initial liquidity to the pool:

```bash
npm run add-liquidity
```

Or manually set amounts in `.env`:
```env
LIQUIDITY_AMOUNT_A=1000
LIQUIDITY_AMOUNT_B=1000
```

## Running the Frontend

### Development

```bash
cd frontend
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
cd frontend
npm run build
npm start
```

## Testing Locally (Before Arc Deployment)

### 1. Start Local Hardhat Node

```bash
npm run node
```

This starts a local blockchain at `http://127.0.0.1:8545`

### 2. Deploy to Local Network

```bash
# Deploy tokens
hardhat run scripts/deployToken.ts --network localhost

# Deploy AMM (update .env with local addresses)
hardhat run scripts/deployAMM.ts --network localhost

# Add liquidity
hardhat run scripts/addLiquidity.ts --network localhost
```

### 3. Configure Frontend for Local Testing

Update `frontend/.env.local`:
```env
NEXT_PUBLIC_ARC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_ARC_CHAIN_ID=31337
```

Add localhost to MetaMask:
- Network Name: Hardhat Local
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Currency Symbol: ETH

### 4. Import Test Account

In MetaMask, import the first Hardhat account (found in node output) to test swaps locally.

## Vercel Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `frontend`
4. Add environment variables:
   - `NEXT_PUBLIC_ARC_RPC_URL`
   - `NEXT_PUBLIC_ARC_CHAIN_ID`
   - `NEXT_PUBLIC_TOKEN_A_ADDRESS`
   - `NEXT_PUBLIC_TOKEN_B_ADDRESS`
   - `NEXT_PUBLIC_AMM_ADDRESS`
5. Deploy

### 3. Update Environment Variables

In Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add all `NEXT_PUBLIC_*` variables
- Redeploy after adding variables

## Usage

### Swap Tokens

1. Connect your wallet
2. Select "Swap" tab
3. Choose token to swap from (A or B)
4. Enter amount
5. View estimated output
6. Click "Approve Token" (first time only)
7. Click "Swap"

### Add Liquidity

1. Connect your wallet
2. Select "Liquidity" tab
3. Enter amounts for both tokens
4. Click "Add Liquidity"
5. Approve tokens if needed
6. Confirm transaction

### Remove Liquidity

1. Connect your wallet
2. Select "Liquidity" tab
3. Click "Remove" button
4. Enter LP token amount
5. Click "Remove Liquidity"
6. Receive both tokens back

## Arc Testnet Configuration

Add Arc testnet to MetaMask:

- **Network Name**: Arc Testnet
- **RPC URL**: https://rpc.testnet.arc.network
- **Chain ID**: 5042002
- **Currency Symbol**: USDC
- **Block Explorer**: https://testnet.arcscan.app

## Contract Functions

### SimpleAMM

- `addLiquidity(uint256 amountA, uint256 amountB, address to)`: Add liquidity, returns LP tokens
- `removeLiquidity(uint256 liquidity, address to)`: Remove liquidity, returns (amountA, amountB)
- `swapExactTokens(uint256 amountIn, address tokenIn, address to)`: Swap tokens, returns amountOut
- `getReserves()`: Returns (reserveA, reserveB)
- `getAmountOut(uint256 amountIn, address tokenIn)`: Calculate output amount

### TestToken

- `mint(address to, uint256 amount)`: Mint new tokens (for testing)
- Standard ERC20 functions: `transfer`, `approve`, `transferFrom`, etc.

## Troubleshooting

### "Invalid token address" error
- Ensure contract addresses in `.env` are correct
- Verify contracts are deployed on Arc testnet

### Transaction fails
- Check you have enough gas (USDC tokens)
- Verify token approvals are set
- Ensure sufficient token balance

### Frontend not connecting to wallet
- Ensure MetaMask is installed
- Verify Arc testnet is added to MetaMask
- Check browser console for errors

### Build errors
- Ensure all dependencies are installed
- Check TypeScript version compatibility
- Verify environment variables are set

## Security Notes

⚠️ **Important**: 
- The private key in this repo is for testing only
- Never commit private keys to production repositories
- Use environment variables or secure key management for production
- Test contracts thoroughly before mainnet deployment

## License

MIT

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review contract deployment logs
3. Verify environment configuration
4. Test on local Hardhat network first

## Future Enhancements

- Fee tiers (currently fixed at 0.3%)
- Multiple pool support
- Concentrated liquidity (Uniswap V3 style)
- Staking rewards
- Governance token integration
