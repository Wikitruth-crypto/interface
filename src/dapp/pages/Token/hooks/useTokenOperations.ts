import { useState, useEffect, useCallback } from 'react';
import { useWriteContract } from 'wagmi';
import { useAccount } from 'wagmi';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { parseUnits } from 'viem';
import { ContractConfig } from '@/dapp/contractsConfig/types';
import { ActiveButton } from '../types';

/**
 * Hook for managing token operations
 * 统一管理代币操作
 */
export const useTokenOperations = () => {
    const { writeContract, status, isPending } = useWriteContract();
    const { address } = useAccount();
    const allContracts = useAllContractConfigs();
    const [activeButton, setActiveButton] = useState<ActiveButton>(null);
    const [error, setError] = useState<Error | null>(null);

    // 重置状态当交易完成
    useEffect(() => {
        if (status === 'success' || status === 'error') {
            setActiveButton(null);
            if (status === 'error') {
                setError(new Error('Transaction failed'));
            } else {
                setError(null);
            }
        }
    }, [status]);

    /**
     * 获取代币合约配置
     */
    const getTokenContract = useCallback((tokenAddress: `0x${string}`): ContractConfig | null => {
        // 尝试从 allContracts 中找到匹配的合约
        const contract = Object.values(allContracts).find(
            (c) => c.address.toLowerCase() === tokenAddress.toLowerCase()
        );
        if (contract) return contract;
        // 如果没有找到，创建一个基本配置（使用默认 ABI）
        return {
            address: tokenAddress,
            abi: allContracts.OfficialToken.abi,
            chainId: allContracts.OfficialToken.chainId,
        };
    }, [allContracts]);

    /**
     * Transfer 操作
     */
    const transfer = useCallback(async (
        tokenAddress: `0x${string}`,
        to: `0x${string}`,
        amount: string,
        decimals: number
    ): Promise<void> => {
        if (!address) {
            throw new Error('Wallet not connected');
        }

        try {
            const tokenContract = getTokenContract(tokenAddress);
            if (!tokenContract) {
                throw new Error('Token contract not found');
            }

            const amountInWei = parseUnits(amount, decimals);
            setActiveButton('transfer');
            setError(null);
            writeContract({
                ...tokenContract,
                functionName: 'transfer',
                args: [to, amountInWei],
            });
        } catch (err) {
            console.error('Transfer error:', err);
            setError(err as Error);
            setActiveButton(null);
            throw err;
        }
    }, [address, getTokenContract, writeContract]);

    /**
     * Burn 操作
     */
    const burn = useCallback(async (
        tokenAddress: `0x${string}`,
        amount: string,
        decimals: number
    ): Promise<void> => {
        if (!address) {
            throw new Error('Wallet not connected');
        }

        try {
            const tokenContract = getTokenContract(tokenAddress);
            if (!tokenContract) {
                throw new Error('Token contract not found');
            }

            const amountInWei = parseUnits(amount, decimals);
            setActiveButton('burn');
            setError(null);
            writeContract({
                ...tokenContract,
                functionName: 'burn',
                args: [amountInWei],
            });
        } catch (err) {
            console.error('Burn error:', err);
            setError(err as Error);
            setActiveButton(null);
            throw err;
        }
    }, [address, getTokenContract, writeContract]);

    /**
     * Wrap 操作：ERC20 -> Secret Token
     */
    const wrap = useCallback(async (
        secretContractAddress: `0x${string}`,
        amount: string,
        decimals: number
    ): Promise<void> => {
        if (!address) {
            throw new Error('Wallet not connected');
        }

        try {
            const contract = Object.values(allContracts).find(
                (c) => c.address.toLowerCase() === secretContractAddress.toLowerCase()
            );
            if (!contract) {
                throw new Error('Secret contract not found');
            }

            const amountInWei = parseUnits(amount, decimals);
            setActiveButton('wrap');
            setError(null);
            writeContract({
                ...contract,
                functionName: 'wrap',
                args: [amountInWei],
            });
        } catch (err) {
            console.error('Wrap error:', err);
            setError(err as Error);
            setActiveButton(null);
            throw err;
        }
    }, [address, allContracts, writeContract]);

    /**
     * Unwrap 操作：Secret Token -> ERC20
     */
    const unwrap = useCallback(async (
        secretContractAddress: `0x${string}`,
        amount: string,
        decimals: number
    ): Promise<void> => {
        if (!address) {
            throw new Error('Wallet not connected');
        }

        try {
            const contract = Object.values(allContracts).find(
                (c) => c.address.toLowerCase() === secretContractAddress.toLowerCase()
            );
            if (!contract) {
                throw new Error('Secret contract not found');
            }

            const amountInWei = parseUnits(amount, decimals);
            setActiveButton('unwrap');
            setError(null);
            writeContract({
                ...contract,
                functionName: 'unwrap',
                args: [amountInWei],
            });
        } catch (err) {
            console.error('Unwrap error:', err);
            setError(err as Error);
            setActiveButton(null);
            throw err;
        }
    }, [address, allContracts, writeContract]);

    /**
     * Deposit 操作：原生 ROSE -> wROSE.S
     */
    const deposit = useCallback(async (
        secretContractAddress: `0x${string}`,
        amount: string,
        decimals: number
    ): Promise<void> => {
        if (!address) {
            throw new Error('Wallet not connected');
        }

        try {
            const contract = Object.values(allContracts).find(
                (c) => c.address.toLowerCase() === secretContractAddress.toLowerCase()
            );
            if (!contract) {
                throw new Error('Secret contract not found');
            }

            const amountInWei = parseUnits(amount, decimals);
            setActiveButton('deposit');
            setError(null);
            writeContract({
                address: contract.address,
                abi: contract.abi,
                functionName: 'deposit',
                args: [], // deposit 函数不需要参数
                value: amountInWei,
            });
        } catch (err) {
            console.error('Deposit error:', err);
            setError(err as Error);
            setActiveButton(null);
            throw err;
        }
    }, [address, allContracts, writeContract]);

    /**
     * Withdraw 操作：wROSE.S -> 原生 ROSE
     */
    const withdraw = useCallback(async (
        secretContractAddress: `0x${string}`,
        amount: string,
        decimals: number
    ): Promise<void> => {
        if (!address) {
            throw new Error('Wallet not connected');
        }

        try {
            const contract = Object.values(allContracts).find(
                (c) => c.address.toLowerCase() === secretContractAddress.toLowerCase()
            );
            if (!contract) {
                throw new Error('Secret contract not found');
            }

            const amountInWei = parseUnits(amount, decimals);
            setActiveButton('withdraw');
            setError(null);
            writeContract({
                address: contract.address,
                abi: contract.abi,
                functionName: 'withdraw',
                args: [amountInWei],
            });
        } catch (err) {
            console.error('Withdraw error:', err);
            setError(err as Error);
            setActiveButton(null);
            throw err;
        }
    }, [address, allContracts, writeContract]);

    /**
     * Approve 操作：授权代币
     */
    const approve = useCallback(async (
        tokenAddress: `0x${string}`,
        spender: `0x${string}`,
        amount: string,
        decimals: number
    ): Promise<void> => {
        if (!address) {
            throw new Error('Wallet not connected');
        }

        try {
            const tokenContract = getTokenContract(tokenAddress);
            if (!tokenContract) {
                throw new Error('Token contract not found');
            }

            const amountInWei = parseUnits(amount, decimals);
            setActiveButton('approve');
            setError(null);
            writeContract({
                ...tokenContract,
                functionName: 'approve',
                args: [spender, amountInWei],
            });
        } catch (err) {
            console.error('Approve error:', err);
            setError(err as Error);
            setActiveButton(null);
            throw err;
        }
    }, [address, getTokenContract, writeContract]);

    return {
        transfer,
        burn,
        wrap,
        unwrap,
        deposit,
        withdraw,
        approve,
        isLoading: isPending || activeButton !== null,
        activeButton,
        error,
        status,
    };
};

