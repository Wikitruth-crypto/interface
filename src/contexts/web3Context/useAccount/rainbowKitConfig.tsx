'use client'

import type { ReactNode } from 'react'
import type { Chain } from 'viem'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { sapphireTestnet } from 'viem/chains'
import {
  createSapphireConfig,
  sapphireHttpTransport,
} from '@oasisprotocol/sapphire-wagmi-v2'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import { metaMaskWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets'
import { RPC } from '@/config/env'
import { defaultQueryClient } from '@/config/queryClient'

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'abaaea706f833818f64597c0063d0db9'

const chains = [sapphireTestnet] as const satisfies readonly [Chain, ...Chain[]]

// Create connectors using Rainbow Kit
// createSapphireConfig will handle Sapphire wrap at the provider level, so no need to manually wrap the connector
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        walletConnectWallet,
      ],
    },
  ],
  {
    appName: 'WikiTruth',
    projectId,
  },
)

// Configure transport layer
const transports: Record<number, ReturnType<typeof sapphireHttpTransport>> = {
  // [sapphire.id]: sapphireHttpTransport(undefined, RPC.sapphire.one),
  [sapphireTestnet.id]: sapphireHttpTransport(undefined, RPC.sapphireTestnet.one),
}

// Use createSapphireConfig to create wagmi configuration that supports Sapphire wrap
// createSapphireConfig will automatically handle Sapphire wrap, no need to manually wrap the connector
const wagmiConfig = createSapphireConfig({
  sapphireConfig: {
    replaceProviders: true,
  },
  chains,
  connectors,
  transports,
})

/**
 * Rainbow Kit Provider with Oasis Sapphire support
 * Integrate Rainbow Kit and support encrypted transactions on the Oasis Sapphire network
 */
export function RainbowKitSapphireProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={defaultQueryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

