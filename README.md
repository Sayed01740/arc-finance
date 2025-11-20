# Arc NFT Mint Website

A beautiful NFT minting dApp built on Arc Testnet. Mint unique NFTs with a simple, user-friendly interface.

## Features

- 🎨 Beautiful, modern UI with animations
- 🔐 Secure wallet connection (MetaMask, Coinbase Wallet, Injected)
- 💰 Mint NFTs with USDC on Arc Testnet
- 🎨 **Create your own custom NFTs** - Upload images, add names and descriptions
- 👁️ **Real-time NFT Preview** - See exactly how your NFT will look before minting
- 🏷️ **Custom Attributes/Traits** - Add unique properties to your NFTs (Color, Rarity, etc.)
- 🔒 **Network Validation** - Automatically ensures all transactions are on Arc Testnet only
- 📊 Real-time supply tracking
- 📦 View your NFT collection
- ⚡ Fast and responsive
- 🎯 ERC721 standard NFT contract with custom URI support
- ✅ Comprehensive error handling and user feedback

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Blockchain**: Wagmi, Viem
- **Network**: Arc Testnet (Chain ID: 5042002)

## Setup

### 1. Install Dependencies

```bash
npm install
cd frontend && npm install
```

### 2. Environment Variables

Create `.env` file in root:

```env
PRIVATE_KEY=your_private_key_here
ARC_RPC_URL=https://rpc.testnet.arc.network
```

Create `.env.local` in `frontend/`:

```env
NEXT_PUBLIC_ARC_RPC_URL=https://rpc.testnet.arc.network
NEXT_PUBLIC_ARC_CHAIN_ID=5042002
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=your_deployed_contract_address
```

### 3. Deploy NFT Contract

```bash
npm run compile
npm run deploy
```

Copy the deployed contract address and add it to `frontend/.env.local`

### 4. Run Development Server

```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000`

## Contract Details

- **Name**: Arc NFT Collection
- **Symbol**: ARCNFT
- **Max Supply**: 10,000
- **Mint Price**: 0.01 USDC
- **Max Mint Per Tx**: 10
- **Features**: 
  - Standard mint (uses base URI)
  - Custom mint with URI (for user-created NFTs)
  - Metadata storage support

## Pages

- **/** - Home page with overview and features
- **/mint** - Mint pre-defined NFTs from the collection
- **/create** - Create and mint your own custom NFTs with:
  - Image upload (drag & drop or URL)
  - Real-time preview
  - Custom metadata (name, description, external URL)
  - Attributes/Traits customization
  - Network validation
- **/collection** - View your NFT collection
- **/admin** - Admin panel for contract management (owner only)

## IPFS Integration (Production)

For production use, integrate IPFS for decentralized metadata storage:

- **Pinata** (https://pinata.cloud) - Recommended for easy setup
- **NFT.Storage** (https://nft.storage) - Free decentralized storage
- **Web3.Storage** (https://web3.storage) - Simple IPFS API

Update the `uploadToIPFS` function in `frontend/app/create/page.tsx` to use your chosen IPFS service.

Example Pinata integration:
```typescript
const uploadToIPFS = async (): Promise<string> => {
  const formData = new FormData()
  formData.append('file', imageFile)
  
  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      'pinata_api_key': process.env.NEXT_PUBLIC_PINATA_API_KEY!,
      'pinata_secret_api_key': process.env.NEXT_PUBLIC_PINATA_SECRET_KEY!,
    },
    body: formData,
  })
  
  const { IpfsHash } = await res.json()
  const imageUrl = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`
  
  // Upload metadata
  const metadata = { name, description, image: imageUrl, attributes }
  // ... upload metadata to IPFS
  return `ipfs://${metadataHash}`
}
```

## Security Features

- ✅ **Network Validation** - All transactions restricted to Arc Testnet (Chain ID: 5042002)
- ✅ **Wallet Connection Verification** - Ensures wallet is connected before minting
- ✅ **Input Validation** - Comprehensive checks for all user inputs
- ✅ **Error Handling** - User-friendly error messages for all failure cases
- ✅ **Transaction Confirmation** - Clear feedback during minting process

## Deployment

### Deploy to Vercel

#### Quick Start (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Set **Root Directory** to `frontend`

3. **Add Environment Variables** (in Vercel dashboard → Settings → Environment Variables):
   ```
   NEXT_PUBLIC_ARC_RPC_URL=https://rpc.testnet.arc.network
   NEXT_PUBLIC_ARC_CHAIN_ID=5042002
   NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=your_contract_address_here
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live!

#### Alternative: Use CLI

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

#### Automated Script

```powershell
.\deploy-vercel.ps1
```

📖 **Full deployment guide**: See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.

## License

MIT
