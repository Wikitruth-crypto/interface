'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useWalletClient, usePublicClient, useChainId } from 'wagmi';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { AccountRoleType } from '@/dapp/types/account';
import { Address_0, Address_Admin } from '@/dapp/constants/addressRoles';

interface WalletContextType {
    address: string | undefined;
    isConnected: boolean;
    chainId: number | undefined;
    publicClient: any;
    walletClient: any;
    signer: JsonRpcSigner | null;
    accountRole: AccountRoleType;
}

// 创建 WalletContext，初始值为 null
const WalletContext = createContext<WalletContextType>({
    address: undefined,
    isConnected: false,
    chainId: undefined,
    publicClient: null,
    walletClient: null,
    signer: null,
    accountRole: null,
});

// 创建一个自定义 hook 以便在其他组件中使用 WalletContext
export const useWalletContext = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const { data: walletClient } = useWalletClient();
    const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
    const [accountRole, setAccountRole] = useState<AccountRoleType>(null);
    const publicClient = usePublicClient();

    useEffect(() => {
        const updateSigner = async () => {
            if (walletClient) {
                const provider = new BrowserProvider(walletClient as any);
                const newSigner = await provider.getSigner();
                setSigner(newSigner);
            } else {
                setSigner(null);
            }
        };

        updateSigner();
    }, [walletClient]);

    useEffect(() => {
        if (address && isConnected && address !== Address_0) {
            const isAdmin = (address === Address_Admin);
            setAccountRole(isAdmin ? 'Admin' : 'User');
        } else {
            setAccountRole(null);
        }
    }, [address, isConnected, chainId]);

    return (
        <WalletContext.Provider
            value={{
                address,
                isConnected,
                chainId, 
                publicClient, 
                walletClient,
                signer,
                accountRole
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};
