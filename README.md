# WikiTruth DApp

WikiTruth is a decentralized application (DApp) built on Oasis Sapphire, focused on creating a truth market platform for secure evidence storage and trading.

## 🚀 Tech Stack

- **Framework**: React 19 + Vite 6
- **Language**: TypeScript
- **Web3**: Wagmi + Rainbow Kit + Viem
- **UI Library**: Ant Design 5
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Database**: Supabase
- **Blockchain**: Oasis Sapphire (EVM-compatible privacy chain)

## 📋 Prerequisites

- Node.js >= 18.x
- npm >= 9.x (or yarn/pnpm)
- A Web3 wallet (MetaMask, WalletConnect, etc.)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd interface
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory (refer to `.env.example` if available):
```env
VITE_CHAIN_ID=23295
VITE_RPC_URL=your_rpc_url
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
# ... other environment variables
```

## 🏃 Development

Start the development server:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000) and will automatically open in your browser.

## 📦 Build

Build for production:

```bash
npm run build
```

The build output will be in the `dist/` directory.

## 🔍 Preview

Preview the production build locally:

```bash
npm run preview
```

## 🧹 Lint

Run ESLint to check code quality:

```bash
npm run lint
```


## 🧪 Testing

Currently, the project uses manual testing. Test pages are available at `/app/tests` in development mode.

## 📚 Documentation

- Project architecture and business logic documentation can be found in the `src/pages/` subdirectories
- Smart contract ABI files are located in `src/artifacts/`

## 🚢 Deployment

The project is configured for static deployment. Build the project and deploy the `dist/` directory to any static hosting service (Vercel, Netlify, Fleek, etc.).

For decentralized deployment on IPFS:
1. Build the project: `npm run build`
2. Upload the `dist/` directory to IPFS
3. Access via IPFS gateway or pinning service

## 🤝 Contributing

1. Follow the code style guidelines
2. Ensure all console logs are in English
3. Run `npm run lint` before committing
4. Test your changes thoroughly

## 📄 License

[Add your license information here]

## 🔗 Links

- [Oasis Sapphire](https://docs.oasis.io/dapp/sapphire/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Rainbow Kit](https://www.rainbowkit.com/)
- [Ant Design](https://ant.design/)
