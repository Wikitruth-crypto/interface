// import { RPC } from "@/config/env";

// const NETWORK_URLS = {
//     infura: {
//         mainnet: 'https://mainnet.infura.io/v3/',
//         sepolia: 'https://sepolia.infura.io/v3/'
//     },
//     alchemy: {
//         mainnet: 'https://eth-mainnet.g.alchemy.com/v2/',
//         sepolia: 'https://eth-sepolia.g.alchemy.com/v2/'
//     }
// } as const;

// const API_KEYS = {
//     infura: [
//         RPC.infura.zero,
//         RPC.infura.one,
//         RPC.infura.two,
//         RPC.infura.three,
//     ],
//     alchemy: [
//         RPC.alchemy.zero,
//     ]
// } as const;

// const ALL_API_KEYS = [...API_KEYS.infura, ...API_KEYS.alchemy];

// // 获取当前时间对应的API URL索引
// const getCurrentApiIndex = (provider?: 'infura' | 'alchemy') => {
//     const now = new Date();
//     const minutes = now.getMinutes();
//     const keys = provider ? API_KEYS[provider] : ALL_API_KEYS;
//     return Math.floor(minutes / 5) % keys.length;
// };

// const getBaseUrl = (network: 'mainnet' | 'sepolia', provider: 'infura' | 'alchemy') => {
//     return NETWORK_URLS[provider][network];
// };

// const getApiKey = (index: number, provider?: 'infura' | 'alchemy') => {
//     if (!provider) {
//         return ALL_API_KEYS[index];
//     }
//     return API_KEYS[provider][index];
// };

// export const getApiUrl = (network: 'mainnet' | 'sepolia', provider?: 'infura' | 'alchemy'): string => {
//     const currentIndex = getCurrentApiIndex(provider);
    
//     if (!provider) {
//         const isInfura = currentIndex < API_KEYS.infura.length;
//         const selectedProvider = isInfura ? 'infura' : 'alchemy';
//         const apiUrl = getBaseUrl(network, selectedProvider) + getApiKey(currentIndex);
//         console.log('apiUrl:', apiUrl);
//         return apiUrl;
//     }
    
//     const apiUrl = getBaseUrl(network, provider) + getApiKey(currentIndex, provider);
//     console.log('apiUrl:', apiUrl);
//     return apiUrl;
// };

