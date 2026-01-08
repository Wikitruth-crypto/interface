'use client';

import { useReadContract } from './useReadContract';
import { ContractName } from '@dapp/config/contractsConfig';

/**
 */
export function useExchange() {
    const { readContract } = useReadContract();

    // function calcPayMoney(uint256 boxId_) external view returns (uint256);
    const calcPayMoney = async (
        id: number | string, 
        siweToken: string, 
        force: boolean = false
    ): Promise<number> => {
        try {
            const tx = await readContract({
                contractName: ContractName.EXCHANGE,
                functionName: 'calcPayMoney',
                args: [id, siweToken],
                force
            });
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('calcPayMoney error:', error);
            return 0;
        }
    };

    const refundPermit = async (
        id: number | string, 
        force: boolean = false
    ): Promise<boolean> => {
        try {
            const tx = await readContract({
                contractName: ContractName.EXCHANGE,
                functionName: 'refundPermit',
                args: [id],
                force
            });
            return tx ? Boolean(tx) : false;
        } catch (error) {
            console.error('refundPermit error:', error);
            return false;
        }
    };

    const acceptedToken = async (
        id: number | string, 
        force: boolean = false
    ): Promise<string> => {
        try {
            const tx = await readContract({
                contractName: ContractName.EXCHANGE,
                functionName: 'acceptedToken',
                args: [id],
                force
            });
            return tx ? String(tx) : '';
        } catch (error) {
            console.error('acceptedToken error:', error);
            return '';
        }
    };

    // function refundReviewDeadline(uint256 boxId_) external view returns (uint256);
    const refundReviewDeadline = async (
        id: number | string, 
        force: boolean = false
    ): Promise<number> => {
        try {
            const tx = await readContract({
                contractName: ContractName.EXCHANGE,
                functionName: 'refundReviewDeadline',
                args: [id],
                force
            });
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('refundReviewDeadline error:', error);
            return 0;
        }
    };

    // function refundRequestDeadline(uint256 boxId_) external view returns (uint256);
    const refundRequestDeadline = async (
        id: number | string, 
        force: boolean = false
    ): Promise<number> => {
        try {
            const tx = await readContract({
                contractName: ContractName.EXCHANGE,
                functionName: 'refundRequestDeadline',
                args: [id],
                force
            });
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('refundRequestDeadline error:', error);
            return 0;
        }
    };

    // function isInRequestRefundDeadline(uint256 boxId_) external view returns (bool);
    const isInRequestRefundDeadline = async (
        id: number | string, 
        force: boolean = false
    ): Promise<boolean> => {
        try {
            const tx = await readContract({
                contractName: ContractName.EXCHANGE,
                functionName: 'inRequestRefundDeadline',
                args: [id],
                force
            });
            return tx ? Boolean(tx) : false;
        } catch (error) {
            console.error('inRequestRefundDeadline error:', error);
            return false;
        }
    };

    // function isInReviewDeadline(uint256 boxId_) external view returns (bool);
    const isInReviewDeadline = async (
        id: number | string, 
        force: boolean = false
    ): Promise<boolean> => {
        try {
            const tx = await readContract({
                contractName: ContractName.EXCHANGE,
                functionName: 'inReviewDeadline',
                args: [id],
                force
            });
            return tx ? Boolean(tx) : false;
        } catch (error) {
            console.error('inReviewDeadline error:', error);
            return false;
        }
    };

    return {
        calcPayMoney,
        refundPermit,
        acceptedToken,
        refundReviewDeadline,
        refundRequestDeadline,
        isInRequestRefundDeadline,
        isInReviewDeadline,
    };
}

