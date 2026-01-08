'use client';

import { useReadContract } from './useReadContract';
import { ContractName } from '@dapp/config/contractsConfig';

/**
 * FundManager contract read hook
 */
export function useFundManager() {
    const { readContract } = useReadContract();


    // function orderAmounts(uint256 boxId_, bytes memory siweToken_) external view returns (uint256);
    const orderAmounts = async (
        id: number | string, 
        siweToken: string, 
        force: boolean = false
    ): Promise<bigint> => {
        try {
            const tx = await readContract({
                contractName: ContractName.FUND_MANAGER,
                functionName: 'orderAmounts',
                args: [id, siweToken],
                force
            });
            if (typeof tx === 'bigint') {
                return tx;
            }
            if (typeof tx === 'number') {
                return BigInt(tx);
            }
            if (typeof tx === 'string') {
                return BigInt(tx);
            }
            return BigInt(0);
        } catch (error) {
            console.error('orderAmounts error:', error);
            return BigInt(0);
        }
    };

    // function minterRewardAmounts(address token_, bytes memory siweToken_) external view returns (uint256);
    const minterRewardAmounts = async (
        token: string, 
        siweToken: string, 
        force: boolean = false
    ): Promise<bigint> => {
        try {
            const tx = await readContract({
                contractName: ContractName.FUND_MANAGER,
                functionName: 'minterRewardAmounts',
                args: [token, siweToken],
                force
            });
            if (typeof tx === 'bigint') {
                return tx;
            }
            if (typeof tx === 'number') {
                return BigInt(tx);
            }
            if (typeof tx === 'string') {
                return BigInt(tx);
            }
            return BigInt(0);
        } catch (error) {
            console.error('minterRewardAmounts error:', error);
            return BigInt(0);
        }
    };

    // Get helper reward amount (with SIWE token)
    // function helperRewardAmounts(address token_, bytes memory siweToken_) external view returns (uint256);
    const helperRewardAmounts = async (
        token: string, siweToken: 
        string, force: 
        boolean = false
    ): Promise<bigint> => {
        try {
            const tx = await readContract({
                contractName: ContractName.FUND_MANAGER,
                functionName: 'helperRewardAmounts',
                args: [token, siweToken],
                force
            });
            if (typeof tx === 'bigint') {
                return tx;
            }
            if (typeof tx === 'number') {
                return BigInt(tx);
            }
            if (typeof tx === 'string') {
                return BigInt(tx);
            }
            return BigInt(0);
        } catch (error) {
            console.error('helperRewardAmounts error:', error);
            return BigInt(0);
        }
    };

    // Get total reward amount
    // function totalRewardAmounts(address token_) external view returns (uint256);
    const totalRewardAmounts = async (
        token: string, 
        force: boolean = false
    ): Promise<bigint> => {
        try {
            const tx = await readContract({
                contractName: ContractName.FUND_MANAGER,
                functionName: 'totalRewardAmounts',
                args: [token],
                force
            });
            if (typeof tx === 'bigint') {
                return tx;
            }
            if (typeof tx === 'number') {
                return BigInt(tx);
            }
            if (typeof tx === 'string') {
                return BigInt(tx);
            }
            return BigInt(0);
        } catch (error) {
            console.error('totalRewardAmounts error:', error);
            return BigInt(0);
        }
    };

    // Get slippage protection
    // function slippageProtection() external view returns (uint8);
    const slippageProtection = async (): Promise<number> => {
        try {
            const tx = await readContract({
                contractName: ContractName.FUND_MANAGER,
                functionName: 'slippageProtection',
                args: [],
            });
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('slippageProtection error:', error);
            return 0;
        }
    };

    const isWithdrawPaused = async (): Promise<boolean> => {
        try {
            const tx = await readContract({
                contractName: ContractName.FUND_MANAGER,
                functionName: 'isWithdrawPaused',
                args: [],
            });
            return tx ? Boolean(tx) : false;
        } catch (error) {
            console.error('isWithdrawPaused error:', error);
            return false;
        }
    };

    return {
        // otherRewardRate,
        // serviceFeeRate,
        orderAmounts,
        minterRewardAmounts,
        helperRewardAmounts,
        totalRewardAmounts,
        isWithdrawPaused,
        slippageProtection,
    };
}

