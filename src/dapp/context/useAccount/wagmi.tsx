
// import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
// import { createStorage } from '@wagmi/core'
// import { http } from 'wagmi'
// import { sapphire, sapphireTestnet } from 'wagmi/chains'
// import { RPC } from '@/config/env'

// const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

// if (!projectId) {
//   console.warn('VITE_WALLETCONNECT_PROJECT_ID is not set. WalletConnect features will be limited.')
// }

// // const sapphireChain = {
// //   ...sapphire,
// //   // iconUrl: 'https://example.com/icons/sapphire.png',
// // }

// // const sapphireTestnetChain = {
// //   ...sapphireTestnet,
// //   // iconUrl: 'https://example.com/icons/sapphireTestnet.png',
// // }

// export const wagmiAdapter = new WagmiAdapter({
//   storage: createStorage({ storage: typeof window !== 'undefined' ? window.localStorage : undefined }),
//   ssr: false, // 关键修复：改为 false，因为项目是 CSR
//   projectId: projectId ?? '',
//   networks: [sapphire, sapphireTestnet],
//   transports: {
//     [sapphire.id]: http(RPC.sapphire.one),
//     [sapphireTestnet.id]: http(RPC.sapphireTestnet.one),
//   },
// })

// export const config = wagmiAdapter.wagmiConfig
