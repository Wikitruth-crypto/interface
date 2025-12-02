'use client';

import { useReadContract } from './useReadContract';
import { ContractName } from '@dapp/contractsConfig';

/**
 * TruthBox 合约读取 Hook
 */
export function useTruthBox() {
    const { readContract } = useReadContract();

    // function getStatus(uint256 boxId_) external view returns(Status);
    const getStatus = async (id: number | string): Promise<number> => {
        try {
            const tx = await readContract({
                contractName: ContractName.TRUTH_BOX,
                functionName: 'getStatus',
                args: [id],
            });
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('getStatus error:', error);
            return 0;
        }
    };

    // function getBasicData(uint256 boxId_) external view returns(Status, uint256, uint256);
    const getBasicData = async (id: number | string): Promise<[number, number, number]> => {
        try {
            const tx = await readContract({
                contractName: ContractName.TRUTH_BOX,
                functionName: 'getBasicData',
                args: [id],
            });
            if (tx && Array.isArray(tx) && tx.length >= 3) {
                return [Number(tx[0]), Number(tx[1]), Number(tx[2])];
            }
            return [0, 0, 0];
        } catch (error) {
            console.error('getBasicData error:', error);
            return [0, 0, 0];
        }
    };

    const getDeadline = async (id: number | string): Promise<number> => {
        try {
            const tx = await readContract({
                contractName: ContractName.TRUTH_BOX,
                functionName: 'getDeadline',
                args: [id],
            });
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('getDeadline error:', error);
            return 0;
        }
    };

    // function getPrivateData(uint256 boxId_, bytes memory siweToken_) external view returns (bytes memory);
    const getPrivateData = async (id: number | string, siweToken: string): Promise<string> => {
        try {
            const tx = await readContract({
                contractName: ContractName.TRUTH_BOX,
                functionName: 'getPrivateData',
                args: [id, siweToken],
            });
            return tx ? String(tx) : '';
        } catch (error) {
            console.error('getPrivateData error:', error);
            return '';
        }
    };

    const getPrice = async (id: number | string): Promise<number> => {
        try {
            const tx = await readContract({
                contractName: ContractName.TRUTH_BOX,
                functionName: 'getPrice',
                args: [id],
            });
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('getPrice error:', error);
            return 0;
        }
    };

    const blacklistSupply = async (): Promise<number> => {
        try {
            const tx = await readContract({
                contractName: ContractName.TRUTH_BOX,
                functionName: 'blacklistSupply',
                args: [],
            });
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('blacklistSupply error:', error);
            return 0;
        }
    };

    const completeCounts = async (): Promise<number> => {
        try {
            const tx = await readContract({
                contractName: ContractName.TRUTH_BOX,
                functionName: 'completeCounts',
                args: [],
            });
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('completeCounts error:', error);
            return 0;
        }
    };

    // 状态查询
    const isInBlacklist = async (id: number | string): Promise<boolean> => {
        try {
            const tx = await readContract({
                contractName: ContractName.TRUTH_BOX,
                functionName: 'isInBlacklist',
                args: [id],
            });
            return tx ? Boolean(tx) : false;
        } catch (error) {
            console.error('isInBlacklist error:', error);
            return false;
        }
    };

    return {
        // NFT信息
        getBasicData,
        getStatus,
        getDeadline,
        getPrice,
        // 所有权相关
        getPrivateData,
        // 统计相关
        blacklistSupply,
        completeCounts,
        // 状态查询
        isInBlacklist,
    };
}

