

// -----------------IPFS PINATA------------------------
export const IPFS_PINATA = {
    // key: import.meta.env.VITE_IPFS_PINTA_key,
    // secret: import.meta.env.VITE_IPFS_PINTA_secret,
    jwt: import.meta.env.VITE_IPFS_PINTA_JWT,
    gateway: import.meta.env.VITE_IPFS_PINTA_Gateway,
    groups: {
        sapphire_testnet: import.meta.env.VITE_IPFS_PINTA_Sapphire_Testnet_Groups,
        sapphire_testnet_resultData: import.meta.env.VITE_IPFS_PINTA_Sapphire_Testnet_ResultData_Groups,
        sapphire_mainnet: import.meta.env.VITE_IPFS_PINTA_Sapphire_Mainnet_Groups,
        sapphire_mainnet_resultData: import.meta.env.VITE_IPFS_PINTA_Sapphire_Mainnet_ResultData_Groups,
        sapphire_testnet_custome: import.meta.env.VITE_IPFS_PINTA_Sapphire_Testnet_Custome_Groups,
        sapphire_mainnet_custome: import.meta.env.VITE_IPFS_PINTA_Sapphire_Mainnet_Custome_Groups
    }
}


// --------------------RPC------------------------
export const RPC = {
    sapphire: {
        one: import.meta.env.VITE_Sapphire_Chainstack_RPC_1,
    },
    sapphireTestnet: { 
        one: import.meta.env.VITE_Sapphire_Testnet_Public_RPC_1,
    }
}

