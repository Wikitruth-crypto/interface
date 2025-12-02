'use client';

import { useReadContract } from './useReadContract';
import { ContractName } from '@dapp/contractsConfig';

/**
 * Exchange 合约读取 Hook
 */
export function useExchange() {
    const { readContract } = useReadContract();

    // 支付相关
    // function calcPayMoney(uint256 boxId_) external view returns (uint256);
    const calcPayMoney = async (id: number | string, address: string): Promise<number> => {
        try {
            const tx = await readContract({
                contractName: ContractName.EXCHANGE,
                functionName: 'calcPayMoney',
                args: [id, address],
            });
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('calcPayMoney error:', error);
            return 0;
        }
    };

    const refundPermit = async (id: number | string): Promise<boolean> => {
        try {
            const tx = await readContract({
                contractName: ContractName.EXCHANGE,
                functionName: 'refundPermit',
                args: [id],
            });
            return tx ? Boolean(tx) : false;
        } catch (error) {
            console.error('refundPermit error:', error);
            return false;
        }
    };

    const acceptedToken = async (id: number | string): Promise<string> => {
        try {
            const tx = await readContract({
                contractName: ContractName.EXCHANGE,
                functionName: 'acceptedToken',
                args: [id],
            });
            return tx ? String(tx) : '';
        } catch (error) {
            console.error('acceptedToken error:', error);
            return '';
        }
    };

    // 时间戳查询
    // function refundReviewDeadline(uint256 boxId_) external view returns (uint256);
    const refundReviewDeadline = async (id: number | string): Promise<number> => {
        try {
            const tx = await readContract({
                contractName: ContractName.EXCHANGE,
                functionName: 'refundReviewDeadline',
                args: [id],
            });
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('refundReviewDeadline error:', error);
            return 0;
        }
    };

    // function refundRequestDeadline(uint256 boxId_) external view returns (uint256);
    const refundRequestDeadline = async (id: number | string): Promise<number> => {
        try {
            const tx = await readContract({
                contractName: ContractName.EXCHANGE,
                functionName: 'refundRequestDeadline',
                args: [id],
            });
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('refundRequestDeadline error:', error);
            return 0;
        }
    };

    // 状态查询
    // function isInRequestRefundDeadline(uint256 boxId_) external view returns (bool);
    const isInRequestRefundDeadline = async (id: number | string): Promise<boolean> => {
        try {
            const tx = await readContract({
                contractName: ContractName.EXCHANGE,
                functionName: 'inRequestRefundDeadline',
                args: [id],
            });
            return tx ? Boolean(tx) : false;
        } catch (error) {
            console.error('inRequestRefundDeadline error:', error);
            return false;
        }
    };

    // function isInReviewDeadline(uint256 boxId_) external view returns (bool);
    const isInReviewDeadline = async (id: number | string): Promise<boolean> => {
        try {
            const tx = await readContract({
                contractName: ContractName.EXCHANGE,
                functionName: 'inReviewDeadline',
                args: [id],
            });
            return tx ? Boolean(tx) : false;
        } catch (error) {
            console.error('inReviewDeadline error:', error);
            return false;
        }
    };

    return {
        refundPermit,
        acceptedToken,
        // 时间戳
        refundReviewDeadline,
        refundRequestDeadline,
        // 状态查询
        isInRequestRefundDeadline,
        isInReviewDeadline,
        // 支付相关
        calcPayMoney,
    };
}

