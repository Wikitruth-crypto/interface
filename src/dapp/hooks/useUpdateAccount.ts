'use client';

import { useEffect } from 'react';
import { useAccount, usePublicClient, useChainId } from 'wagmi';
import { Address_0} from '@/dapp/constants/addressRoles';
import { useAccountStore } from '@/dapp/store/accountStore';


export const useUpdateAccount = () => {
    const { address, isConnected } = useAccount();
    const { setCurrentAccount, setCurrentChainId, initAccount} = useAccountStore();
    const chainId = useChainId();
    const publicClient = usePublicClient();

    useEffect(() => {
        if (publicClient) {
            setCurrentChainId(publicClient.chain?.id);
        } 
    }, [publicClient]);

    useEffect(() => {
        if (address && isConnected && address !== Address_0) {
            setCurrentAccount(address);
            initAccount(address, chainId);
        } else {
            setCurrentAccount(null);
            initAccount('', chainId);
        }
    }, [address, isConnected, chainId]);

};
