'use client'

import { createConfig, http } from 'wagmi'
import { injected } from '@wagmi/connectors'
import { walletConnect } from '@wagmi/connectors'
import { sapphire, sapphireTestnet } from 'wagmi/chains'
import { RPC } from '@/config/env'

// https://cloud.walletconnect.com/
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

const connectors = [
    injected({
        shimDisconnect: true,
    }),
    ...(walletConnectProjectId
        ? [
            walletConnect({
                projectId: walletConnectProjectId,
                showQrModal: true,
            }),
        ]
        : []),
]

export const config = createConfig({
    connectors,
    chains: [
        {
            ...sapphire,
            iconUrl: 'https://example.com/icons/sapphire.png',
        },
        {
            ...sapphireTestnet,
            iconUrl: 'https://example.com/icons/sapphireTestnet.png',
        },
    ],
    transports: {
        [sapphire.id]: http(RPC.sapphire.one),
        [sapphireTestnet.id]: http(RPC.sapphireTestnet.one),
    },
})
