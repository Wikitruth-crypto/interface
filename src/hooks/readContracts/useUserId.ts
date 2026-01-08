'use client';

import { useReadContract } from './useReadContract';
import { ContractName } from '@dapp/config/contractsConfig';


export function useUserId() {
    const { readContract } = useReadContract();

    // function myUserId(bytes memory token_) external view returns (uint256);
    const myUserId = async (siweToken: string): Promise<number> => {
        try {
            const tx = await readContract({
                contractName: ContractName.USER_ID,
                functionName: 'myUserId',
                args: [siweToken],
            });
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('myUserId error:', error);
            return 0;
        }
    };

    // function isBlacklisted(address user_) external view returns (bool);
    const isBlacklisted = async (user: string, force: boolean = false): Promise<boolean> => {
        try {
            const tx = await readContract({
                contractName: ContractName.USER_ID,
                functionName: 'isBlacklisted',
                args: [user],
                force
            });
            return tx ? Boolean(tx) : false;
        } catch (error) {
            console.error('isBlacklisted error:', error);
            return false;
        }
    };

    return {
        myUserId,
        isBlacklisted,
    };
}

