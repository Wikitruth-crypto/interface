'use client'

import type { ReactNode } from 'react'
import type { Chain } from 'viem'
import { WagmiProvider } from 'wagmi'
import { sapphire, sapphireTestnet } from 'viem/chains'
import {
  createSapphireConfig, // 创建Oasis Sapphire网络的wagmi配置
  injectedWithSapphire, // 创建Oasis Sapphire网络的wagmi连接器
  sapphireHttpTransport // 创建Oasis Sapphire网络的wagmi传输器
} from '@oasisprotocol/sapphire-wagmi-v2'
import { RPC } from '@/config/env'

/**
 * 使用Oasis官方的wagmi库，支持Oasis Sapphire网络加密交易
 */

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
