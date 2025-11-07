'use client'

// import { AppKitProvider } from '@reown/appkit/react'
import { createAppKit } from '@reown/appkit/react'
// import { createStorage } from '@wagmi/core'
import type { ReactNode } from 'react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { WagmiProvider, http} from 'wagmi'
import { sapphire, sapphireTestnet } from '@reown/appkit/networks'
import { RPC } from '@/config/env'

const metadata = {
  name: 'WikiTruth',
  description: 'WikiTruth - Web3 正义事业平台',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://localhost:3000',
  icons: [],
}

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  console.warn('VITE_WALLETCONNECT_PROJECT_ID is not set. WalletConnect features will be limited.')
}

const networks = [sapphire, sapphireTestnet]
// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  // storage: createStorage({ storage: typeof window !== 'undefined' ? window.localStorage : undefined }),
  networks,
  projectId,
  ssr: false,
  transports: {
    [sapphire.id]: http(RPC.sapphire.one),
    [sapphireTestnet.id]: http(RPC.sapphireTestnet.one),
  },
})

// 关键修复：确保 AppKit 在模块加载时立即初始化
// 并且使用与 wagmi 相同的 adapter 实例
let appKitInitialized = false

if (typeof window !== 'undefined' && !appKitInitialized) {
  createAppKit({
    adapters: [wagmiAdapter],
    projectId: projectId ?? '',
    networks: networks as any,
    metadata,
    features: {
      analytics: true,
    },
  })
  appKitInitialized = true
}

export function WikiTruthAppKitProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      {children}
    </WagmiProvider>
  )
}

