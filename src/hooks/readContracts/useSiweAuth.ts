'use client';

import { useReadContract } from './useReadContract';
import { ContractName } from '@dapp/config/contractsConfig';
import { SignatureRSV } from '@dapp/hooks/SiweAuth/types';

/**
 */
export function useReadSiweAuth() {
    const { readContract } = useReadContract();

    // function getDomainCount() external view returns (uint256);
    const getDomainCount = async (): Promise<number> => {
        try {
            const tx = await readContract({
                contractName: ContractName.SIWE_AUTH,
                functionName: 'getDomainCount',
                args: [],
            });
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('getDomainCount error:', error);
            return 0;
        }
    };

    // function getDomainByIndex(uint256 index) external view returns (string memory);
    const getDomainByIndex = async (index: number): Promise<string> => {
        try {
            const tx = await readContract({
                contractName: ContractName.SIWE_AUTH,
                functionName: 'getDomainByIndex',
                args: [index],
            });
            return tx ? String(tx) : '';
        } catch (error) {
            console.error('getDomainByIndex error:', error);
            return '';
        }
    };

    // function login(string memory siweMsg, SignatureRSV memory sig) external view returns (bytes);
    const login = async (siweMsg: string, sig: SignatureRSV): Promise<string> => {
        try {
            const tx = await readContract({
                contractName: ContractName.SIWE_AUTH,
                functionName: 'login',
                args: [siweMsg, sig],
            });
            return tx ? String(tx) : '';
        } catch (error) {
            console.error('login error:', error);
            return '';
        }
    };

    // function getMsgSender(bytes memory token_) external view returns (address);
    const getMsgSender = async (token: string): Promise<string> => {
        try {
            const tx = await readContract({
                contractName: ContractName.SIWE_AUTH,
                functionName: 'getMsgSender',
                args: [token],
            });
            return tx ? String(tx) : '';
        } catch (error) {
            console.error('getMsgSender error:', error);
            return '';
        }
    };

    // function isSessionValid(bytes memory token) external view returns (bool)
    const isSessionValid = async (token: string, force: boolean = false): Promise<boolean> => {
        try {
            const tx = await readContract({
                contractName: ContractName.SIWE_AUTH,
                functionName: 'isSessionValid',
                args: [token],
                force
            });
            return tx ? Boolean(tx) : false;
        } catch (error) {
            console.error('isSessionValid error:', error);
            return false;
        }
    };

    // function getStatement(bytes memory token) external view returns (string memory);
    const getStatement = async (token: string): Promise<string> => {
        try {
            const tx = await readContract({
                contractName: ContractName.SIWE_AUTH,
                functionName: 'getStatement',
                args: [token],
            });
            return tx ? String(tx) : '';
        } catch (error) {
            console.error('getStatement error:', error);
            return '';
        }
    };

    // function getResources(bytes memory token) external view returns (string[] memory);
    const getResources = async (token: string): Promise<string[]> => {
        try {
            const tx = await readContract({
                contractName: ContractName.SIWE_AUTH,
                functionName: 'getResources',
                args: [token],
            });
            return tx && Array.isArray(tx) ? tx : [];
        } catch (error) {
            console.error('getResources error:', error);
            return [];
        }
    };

    return {
        getDomainCount,
        getDomainByIndex,
        isSessionValid,
        login,
        getMsgSender,
        getStatement,
        getResources,
    };
}

