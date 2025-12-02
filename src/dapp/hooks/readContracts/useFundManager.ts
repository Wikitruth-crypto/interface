'use client';

import { useReadContract } from './useReadContract';
import { ContractName } from '@dapp/contractsConfig';

/**
 * FundManager 合约读取 Hook
 */
export function useFundManager() {
    const { readContract } = useReadContract();

    // 费率查询
    const otherRewardRate = async (): Promise<number> => {
        try {
            const tx = await readContract({
                contractName: ContractName.FUND_MANAGER,
                functionName: 'otherRewardRate',
                args: [],
            });
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('otherRewardRate error:', error);
            return 0;
        }
    };

    const serviceFeeRate = async (): Promise<number> => {
        try {
            const tx = await readContract({
                contractName: ContractName.FUND_MANAGER,
                functionName: 'serviceFeeRate',
                args: [],
            });
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('serviceFeeRate error:', error);
            return 0;
        }
    };

    // 金额查询
    // function orderAmounts(uint256 boxId_, bytes memory siweToken_) external view returns (uint256);
    const orderAmounts = async (id: number | string, siweToken: string): Promise<number> => {
        try {
            const tx = await readContract({
                contractName: ContractName.FUND_MANAGER,
                functionName: 'orderAmounts',
                args: [id, siweToken],
            });
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('orderAmounts error:', error);
            return 0;
        }
    };

    // 获取铸造者奖励金额（带SIWE token）
    // function minterRewardAmounts(address token_, bytes memory siweToken_) external view returns (uint256);
    const minterRewardAmounts = async (token: string, siweToken: string): Promise<number> => {
        try {
            const tx = await readContract({
                contractName: ContractName.FUND_MANAGER,
                functionName: 'minterRewardAmounts',
                args: [token, siweToken],
            });
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('minterRewardAmounts error:', error);
            return 0;
        }
    };

    // 获取协助者奖励金额（带SIWE token）
    // function helperRewardAmounts(address token_, bytes memory siweToken_) external view returns (uint256);
    const helperRewardAmounts = async (token: string, siweToken: string): Promise<number> => {
        try {
            const tx = await readContract({
                contractName: ContractName.FUND_MANAGER,
                functionName: 'helperRewardAmounts',
                args: [token, siweToken],
            });
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('helperRewardAmounts error:', error);
            return 0;
        }
    };

    // 获取总奖励金额
    // function totalRewardAmounts(address token_) external view returns (uint256);
    const totalRewardAmounts = async (token: string): Promise<number> => {
        try {
            const tx = await readContract({
                contractName: ContractName.FUND_MANAGER,
                functionName: 'totalRewardAmounts',
                args: [token],
            });
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('totalRewardAmounts error:', error);
            return 0;
        }
    };

    // 获取滑点保护
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
        // 费率查询
        otherRewardRate,
        serviceFeeRate,
        // 金额查询
        orderAmounts,
        minterRewardAmounts,
        helperRewardAmounts,
        // 资金池查询
        totalRewardAmounts,
        // 状态查询
        isWithdrawPaused,
        slippageProtection,
    };
}

