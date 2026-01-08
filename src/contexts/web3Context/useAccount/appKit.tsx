'use client'

import type { ReactNode } from 'react'
import type { Chain } from 'viem'
import { WagmiProvider } from 'wagmi'
import { sapphire, sapphireTestnet } from 'viem/chains'
import {
  createSapphireConfig,
  injectedWithSapphire,
  sapphireHttpTransport,
} from '@oasisprotocol/sapphire-wagmi-v2'
import { RPC } from '@/config/env'


const chains = [sapphire, sapphireTestnet] as const satisfies readonly [Chain, ...Chain[]]
const connectors = [injectedWithSapphire()]
const transports: Record<number, ReturnType<typeof sapphireHttpTransport>> = {
  [sapphire.id]: sapphireHttpTransport(undefined, RPC.sapphire.one),
  [sapphireTestnet.id]: sapphireHttpTransport(undefined, RPC.sapphireTestnet.one)
}

const wagmiConfig = createSapphireConfig({
  sapphireConfig: {
    replaceProviders: true
  },
  chains,
  connectors,
  transports
})

export function WikiTruthAppKitProvider({ children }: { children: ReactNode }) {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
}
