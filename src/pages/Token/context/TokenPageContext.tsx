import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { SearchScope } from '@dapp/oasisQuery/types/searchScope';
import { RuntimeSdkBalance } from '@dapp/oasisQuery/oasis-nexus/api';
import { useTokenBalances } from '../hooks/useTokenBalances';
import { useTokenPairs } from '../hooks/useTokenPairs';
import { TokenInfo, TokenPair,} from '../types';

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
}

const TokenPageContext = createContext<TokenPageContextValue | null>(null);

export const TokenPageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { address } = useAccount();
    const balances = useTokenBalances();
    const tokenPairState = useTokenPairs(balances.allTokens);
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
