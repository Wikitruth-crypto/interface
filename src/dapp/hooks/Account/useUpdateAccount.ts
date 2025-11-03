'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, usePublicClient, } from 'wagmi';
// import { BrowserProvider, JsonRpcSigner } from 'ethers';
// import { AccountRoleType } from '@/dapp/types/account';
import { Address_Admin } from '@/dapp/constants/addressRoles';
import { useAccountStore } from '@/dapp/store/accountStore';


export const useUpdateAccount = () => {
    const { address, isConnected } = useAccount();
    const { setCurrentAccount, setCurrentChainId, initAccount, setRole } = useAccountStore();
    // const { chain } = http();
    const publicClient = usePublicClient();

    useEffect(() => {
        if (publicClient) {
            setCurrentChainId(publicClient.chain?.id);
        } 
        if (publicClient && address && isConnected) {
            initAccount(address, publicClient.chain?.id);
        } 
        if (address && isConnected) {
            setCurrentAccount(address);
            const isAdmin = (address === Address_Admin);
            setRole(isAdmin ? 'Admin' : 'User');
        } else {
            setCurrentAccount(null);
            setRole(null);
        }
    }, [publicClient, address, isConnected]);

    useEffect(() => {
        if (address && isConnected) {
            
        } else {
            setCurrentAccount(null);
            setRole(null);
        }
    }, [address, isConnected]);

};
