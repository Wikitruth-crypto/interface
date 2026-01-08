'use client';

import React, { createContext, useContext } from 'react';
import { useAccount, useWalletClient, usePublicClient, useChainId } from 'wagmi';

interface WalletContextType {
    address: string | undefined;
    isConnected: boolean;
    chainId: number | undefined;
    publicClient: ReturnType<typeof usePublicClient> | undefined;
    walletClient: ReturnType<typeof useWalletClient>['data'];
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWalletContext = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWalletContext must be used within a WalletProvider');
    }
    return context;
};

/**
 * Simplified Wallet Provider
 * Only provide basic wagmi hooks wrapping, no longer handle signer and Sapphire wrap
 * Sapphire wrap is automatically handled by createSapphireConfig
 */
export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();

    return (
        <WalletContext.Provider
            value={{
                address,
                isConnected,
                chainId,
                publicClient,
                walletClient,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};
