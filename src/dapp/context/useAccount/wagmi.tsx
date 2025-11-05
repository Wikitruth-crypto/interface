'use client'

import { 
    // configureChains, 
    http , 
    createConfig } from 'wagmi'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
    rainbowWallet,
    ledgerWallet,
    argentWallet,
    omniWallet,
    imTokenWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { 
    sapphire,
    sapphireTestnet,
} from 'wagmi/chains'
// import { getApiUrl } from './apiUrl';
import { RPC } from '@/config/env';

console.log('RPC：【1】', RPC.sapphire.one);
console.log('RPC：【2】', RPC.sapphireTestnet.one);

// import { publicProvider } from 'wagmi/providers/public'

// const { chains, publicClient, webSocketPublicClient } = configureChains(
//     [sepolia],
//     [
//         publicProvider({
//             timeout: 60000, // 设置为60秒
//         }),
//     ],
// )

const connectors = connectorsForWallets(
    [
        {
            groupName: 'Recommended',
            wallets: [rainbowWallet],
        },
        {
            groupName: 'more',
            wallets: [argentWallet,omniWallet,imTokenWallet,ledgerWallet],
        },
    ],
    {
        appName: 'WikiTruth',
        projectId: 'YOUR_PROJECT_ID',
    }
);

export const config = createConfig ({
    // autoConnect: true,
    // publicClient,
    // webSocketPublicClient,
    ////
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