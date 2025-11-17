# Arc Finance Frontend

A modern, beautiful decentralized exchange (DEX) frontend inspired by iZUMi Finance, built with Next.js 14, TypeScript, Tailwind CSS, and wagmi.

## 🚀 Features

- **Modern UI/UX**: Clean, minimal design with smooth animations
- **Dark Mode**: Full theme support with automatic system detection
- **Multi-page Navigation**: Home, Swap, Limit Orders, Liquidity, Farming, About
- **Wallet Integration**: Seamless wallet connection with wagmi + viem
- **Real-time Data**: Live pool statistics, reserves, and prices
- **Interactive Charts**: Price charts using Recharts
- **Toast Notifications**: User feedback for all transactions
- **Responsive Design**: Works perfectly on mobile and desktop
- **Type-safe**: Full TypeScript support

## 📋 Pages

### Home / Dashboard
- Hero section with connect wallet button
- Key metrics: TVL, 24h Volume, Active Pools
- Feature highlights
- User balance display

### Swap
- Token selection (From/To)
- Real-time price preview
- Slippage and price impact display
- Swap settings panel
- Transaction status tracking

### Limit Order
- Place limit orders
- View open orders
- Cancel orders
- Order history

### Liquidity
- Add liquidity to pools
- Remove liquidity
- Pool statistics display
- Price charts
- LP token management

### Farming
- View farming pools
- Stake LP tokens
- Unstake tokens
- Claim rewards
- Pool statistics

### About
- Protocol information
- FAQ section
- Feature highlights
- Resource links

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Wallet**: wagmi + viem
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Notifications**: react-hot-toast
- **Icons**: Lucide React

## 📦 Installation

```bash
# Install dependencies
npm install

# Or with yarn
yarn install
```

## 🔧 Configuration

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_ARC_RPC_URL=https://rpc.testnet.arc.network
NEXT_PUBLIC_ARC_CHAIN_ID=5042002
NEXT_PUBLIC_TOKEN_A_ADDRESS=0x...
NEXT_PUBLIC_TOKEN_B_ADDRESS=0x...
NEXT_PUBLIC_AMM_ADDRESS=0x...
```

## 🚀 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

The app will be available at http://localhost:3000

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Set the root directory to `frontend`
4. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_ARC_RPC_URL`
   - `NEXT_PUBLIC_ARC_CHAIN_ID`
   - `NEXT_PUBLIC_TOKEN_A_ADDRESS`
   - `NEXT_PUBLIC_TOKEN_B_ADDRESS`
   - `NEXT_PUBLIC_AMM_ADDRESS`
5. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean
- AWS Amplify

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── swap/              # Swap page
│   ├── limit-order/       # Limit order page
│   ├── liquidity/         # Liquidity page
│   ├── farming/           # Farming page
│   ├── about/             # About page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # UI components
│   ├── Navbar.tsx        # Navigation bar
│   ├── ThemeProvider.tsx # Theme context
│   └── TokenInput.tsx    # Token input component
├── hooks/                # Custom hooks
│   └── useWallet.ts      # Wallet hook
├── utils/                # Utility functions
│   ├── abi.ts           # Contract ABIs
│   └── priceCalculator.ts # Price calculations
├── wagmi.config.ts       # Wagmi configuration
├── tailwind.config.js    # Tailwind config
├── tsconfig.json         # TypeScript config
└── package.json          # Dependencies
```

## 🎨 Styling

The project uses Tailwind CSS with a custom configuration:

- **Colors**: Custom primary colors and dark mode support
- **Animations**: Custom animations for smooth transitions
- **Responsive**: Mobile-first responsive design
- **Theme**: Dark/light mode with system preference detection

## 🔐 Wallet Integration

The app uses wagmi for wallet integration:

- Supports MetaMask and other injected wallets
- Automatic network switching to Arc testnet
- Chain ID validation
- Connection state management

### Adding Arc Testnet to MetaMask

1. Open MetaMask
2. Go to Settings → Networks → Add Network
3. Enter:
   - **Network Name**: Arc Testnet
   - **RPC URL**: https://rpc.testnet.arc.network
   - **Chain ID**: 5042002
   - **Currency Symbol**: USDC
   - **Block Explorer**: https://testnet.arcscan.app

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check
npm run type-check
```

## 📝 Features in Detail

### Dark Mode
- Automatic system preference detection
- Manual toggle in navbar
- Persists user preference in localStorage
- Smooth transitions

### Toast Notifications
- Success notifications for transactions
- Error handling with user-friendly messages
- Loading states for pending transactions
- Custom styling

### Charts
- Price history charts
- Responsive design
- Interactive tooltips
- Smooth animations

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Collapsible navigation

## 🐛 Troubleshooting

### Wallet not connecting
- Ensure MetaMask is installed
- Verify Arc testnet is added
- Check browser console for errors

### Transactions failing
- Verify sufficient USDC for gas
- Check token approvals
- Ensure correct network is selected
- Check contract addresses in .env.local

### Build errors
- Clear `.next` directory
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check the documentation
- Review the FAQ on the About page

---

Built with ❤️ for the Arc Network community
