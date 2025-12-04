import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { parseUnits } from 'viem';
import { ActiveButton } from '../types';
import { useWriteToken } from '@/dapp/hooks/useWriteToken';

/**
 * Hook for managing token operations
 * 统一管理代币操作
 */
export const useTokenOperations = () => {
    const { writeToken, status, isPending, isError, isSuccessed } = useWriteToken();
    const { address } = useAccount();
    const [activeButton, setActiveButton] = useState<ActiveButton>(null);
    const [error, setError] = useState<Error | null>(null);

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
            const amountInWei = parseUnits(amount, decimals);
            setActiveButton('transfer');
            setError(null);
            writeToken({
                contractAddress: tokenAddress,
                functionName: 'transfer',
                args: [to, amountInWei],
            });
        } catch (err) {
            console.error('Transfer error:', err);
            setError(err as Error);
            setActiveButton(null);
            throw err;
        }
    }, [address, writeToken]);

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

            const amountInWei = parseUnits(amount, decimals);
            setActiveButton('burn');
            setError(null);
            writeToken({
                contractAddress: tokenAddress,
                functionName: 'burn',
                args: [amountInWei],
            });
        } catch (err) {
            console.error('Burn error:', err);
            setError(err as Error);
            setActiveButton(null);
            throw err;
        }
    }, [address, writeToken]);

    /**
     * Wrap 操作：ERC20 -> Secret Token
     */
    const wrap = useCallback(async (
        secretTokenAddress: `0x${string}`,
        amount: string,
        decimals: number
    ): Promise<void> => {
        if (!address) {
            throw new Error('Wallet not connected');
        }
        try {
            const amountInWei = parseUnits(amount, decimals);
            setActiveButton('wrap');
            setError(null);
            writeToken({
                contractAddress: secretTokenAddress,
                functionName: 'wrap',
                args: [amountInWei],
            });
        } catch (err) {
            console.error('Wrap error:', err);
            setError(err as Error);
            setActiveButton(null);
            throw err;
        }
    }, [address, writeToken]);

    /**
     * Unwrap 操作：Secret Token -> ERC20
     */
    const unwrap = useCallback(async (
        secretTokenAddress: `0x${string}`,
        amount: string,
        decimals: number
    ): Promise<void> => {
        if (!address) {
            throw new Error('Wallet not connected');
        }

        try {

            const amountInWei = parseUnits(amount, decimals);
            setActiveButton('unwrap');
            setError(null);
            writeToken({
                contractAddress: secretTokenAddress,
                functionName: 'unwrap',
                args: [amountInWei],
            });
        } catch (err) {
            console.error('Unwrap error:', err);
            setError(err as Error);
            setActiveButton(null);
            throw err;
        }
    }, [address, writeToken]);

    /**
     * Deposit 操作：原生 ROSE -> wROSE.S
     * function deposit() external payable{}
     */
    const deposit = useCallback(async (
        secretTokenAddress: `0x${string}`,
        amount: string,
        decimals: number
    ): Promise<void> => {
        if (!address) {
            throw new Error('Wallet not connected');
        }

        try {

            const amountInWei = parseUnits(amount, decimals);
            setActiveButton('deposit');
            setError(null);
            writeToken({
                contractAddress: secretTokenAddress,
                functionName: 'deposit',
                args: [], // deposit() 函数无参数
                value: amountInWei, // 通过 value 发送原生代币
            });
        } catch (err) {
            console.error('Deposit error:', err);
            setError(err as Error);
            setActiveButton(null);
            throw err;
        }
    }, [address, writeToken]);

    /**
     * Withdraw 操作：wROSE.S -> 原生 ROSE
     */
    const withdraw = useCallback(async (
        secretTokenAddress: `0x${string}`,
        amount: string,
        decimals: number
    ): Promise<void> => {
        if (!address) {
            throw new Error('Wallet not connected');
        }

        try {

            const amountInWei = parseUnits(amount, decimals);
            setActiveButton('withdraw');
            setError(null);
            writeToken({
                contractAddress: secretTokenAddress,
                functionName: 'withdraw',
                args: [amountInWei],
            });
        } catch (err) {
            console.error('Withdraw error:', err);
            setError(err as Error);
            setActiveButton(null);
            throw err;
        }
    }, [address, writeToken]);

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
            const amountInWei = parseUnits(amount, decimals);
            setActiveButton('approve');
            setError(null);
            writeToken({
                contractAddress: tokenAddress,
                functionName: 'approve',
                args: [spender, amountInWei],
            });
        } catch (err) {
            console.error('Approve error:', err);
            setError(err as Error);
            setActiveButton(null);
            throw err;
        }
    }, [address, writeToken]);

    return {
        transfer,
        burn,
        wrap,
        unwrap,
        deposit,
        withdraw,
        approve,
        isLoading: isPending || activeButton !== null ,
        activeButton,
        error,
        status,
        isError,
        isSuccessed,
    };
};

