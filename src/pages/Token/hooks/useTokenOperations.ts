import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { parseUnits } from 'viem';
import { ActiveButton } from '../types';
import { useWriteToken } from '@/hooks/useWriteToken';


export const useTokenOperations = () => {
    const { writeToken, status, isPending, isError, isSuccessed, isLoading } = useWriteToken();
    const { address } = useAccount();
    const [activeButton, setActiveButton] = useState<ActiveButton>(null);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Transfer operation
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
     * Burn operation
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
     * Wrap operation: ERC20 -> Secret Token
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
     * Unwrap operation: Secret Token -> ERC20
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
     * Deposit operation: Native ROSE -> wROSE.S
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
                args: [], // deposit() function has no parameters
                value: amountInWei, // Send native token through value
            });
        } catch (err) {
            console.error('Deposit error:', err);
            setError(err as Error);
            setActiveButton(null);
            throw err;
        }
    }, [address, writeToken]);

    /**
     * Withdraw operation: wROSE.S -> Native ROSE
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
     * Approve operation: Authorize token
     */
    const approve = useCallback(async (
        tokenAddress: `0x${string}`,
        spender: `0x${string}`,
        amount: bigint
    ): Promise<void> => {
        if (!address) {
            throw new Error('Wallet not connected');
        }

        try {
            setActiveButton('approve');
            setError(null);
            writeToken({
                contractAddress: tokenAddress,
                functionName: 'approve',
                args: [spender, amount],
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
        isPending,
        isLoading,
        activeButton,
        error,
        status,
        isError,
        isSuccessed,
    };
};

