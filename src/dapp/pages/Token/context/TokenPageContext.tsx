import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { SearchScope } from '@/dapp/oasisQuery/types/searchScope';
import { RuntimeSdkBalance } from '@/dapp/oasisQuery/oasis-nexus/api';
import { useTokenBalances } from '../hooks/useTokenBalances';
import { useTokenPairs } from '../hooks/useTokenPairs';
// import { useTokenOperations } from '../hooks/useTokenOperations';
import { TokenInfo, TokenPair, ActiveButton, } from '../types';

interface TokenPageContextValue {
    address?: `0x${string}`;
    nativeBalances: RuntimeSdkBalance[];
    erc20Tokens: TokenInfo[];
    allTokens: TokenInfo[];
    scope: SearchScope;
    isBalancesLoading: boolean;
    balancesError: unknown;
    tokenPairs: TokenPair[];
    selectedPair: TokenPair | null;
    selectedPairIndex: number;
    setSelectedPairIndex: (index: number) => void;
    pairsWithSecretBalance: TokenPair[];
    // operations: ReturnType<typeof useTokenOperations>;
    // getOperationStatus: (button: ActiveButton) => OperationStatus;
    // wrapStatus: OperationStatus;
    // approveStatus: OperationStatus;
    // getButtonLoading: (button: ActiveButton) => boolean;
}

const TokenPageContext = createContext<TokenPageContextValue | null>(null);

export const TokenPageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { address } = useAccount();
    const balances = useTokenBalances();
    const tokenPairState = useTokenPairs(balances.allTokens);
    // const operations = useTokenOperations();

    // const getOperationStatus = useCallback(
    //     (button: ActiveButton): OperationStatus => {
    //         if (operations.activeButton !== button) {
    //             return 'idle';
    //         }

    //         if (operations.status === 'pending') {
    //             return 'loading';
    //         }

    //         if (operations.status === 'success') {
    //             return 'success';
    //         }

    //         if (operations.status === 'error') {
    //             return 'error';
    //         }

    //         return 'idle';
    //     },
    //     [operations.activeButton, operations.status]
    // );

    // const getButtonLoading = useCallback(
    //     (button: ActiveButton) => operations.activeButton === button && operations.isLoading,
    //     [operations.activeButton, operations.isLoading]
    // );

    const value = useMemo<TokenPageContextValue>(() => ({
        address,
        nativeBalances: balances.nativeBalances,
        erc20Tokens: balances.erc20Tokens,
        allTokens: balances.allTokens,
        scope: balances.scope,
        isBalancesLoading: balances.isLoading,
        balancesError: balances.error,
        tokenPairs: tokenPairState.tokenPairs,
        selectedPair: tokenPairState.selectedPair,
        selectedPairIndex: tokenPairState.selectedPairIndex,
        setSelectedPairIndex: tokenPairState.setSelectedPairIndex,
        pairsWithSecretBalance: tokenPairState.pairsWithSecretBalance,
        // operations,
        // getOperationStatus,
        // wrapStatus: getOperationStatus('wrap'),
        // approveStatus: getOperationStatus('approve'),
        // getButtonLoading,
    }), [
        address,
        balances.nativeBalances,
        balances.erc20Tokens,
        balances.allTokens,
        balances.scope,
        balances.isLoading,
        balances.error,
        tokenPairState.tokenPairs,
        tokenPairState.selectedPair,
        tokenPairState.selectedPairIndex,
        tokenPairState.setSelectedPairIndex,
        tokenPairState.pairsWithSecretBalance,
            // operations,
            // getOperationStatus,
            // getButtonLoading,
    ]);

    return (
        <TokenPageContext.Provider value={value}>
            {children}
        </TokenPageContext.Provider>
    );
};

export const useTokenPageContext = () => {
    const context = useContext(TokenPageContext);
    if (!context) {
        throw new Error('useTokenPage must be used within TokenPageProvider');
    }
    return context;
};
