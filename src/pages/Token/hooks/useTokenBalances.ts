import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useChainConfig } from '@dapp/config/contractsConfig';
import { useAccountQuery } from '@dapp/oasisQuery/app/hooks/useAccountQuery';
import { SearchScope } from '@dapp/oasisQuery/types/searchScope';
import { RuntimeEvmBalance, RuntimeAccount, RuntimeSdkBalance } from '@dapp/oasisQuery/oasis-nexus/api';
import { EvmTokenType } from '@dapp/oasisQuery/oasis-nexus/generated/api';
import { TokenInfo } from '../types';

/**
 * Hook for managing token balances
 */
export const useTokenBalances = () => {
    const { address } = useAccount();
    const chainConfig = useChainConfig();

    // Build SearchScope
    const scope: SearchScope = useMemo(() => {
        return {
            network: chainConfig.network,
            layer: chainConfig.layer,
        };
    }, [chainConfig]);

    // Use useAccountQuery to query account information
    const { data: accountData, isLoading, error } = useAccountQuery({
        scope,
        address: address as `0x${string}`,
        enabled: !!address,
    });

    // Get account data
    const account = accountData?.data as RuntimeAccount | undefined;

    // Get native token balance list
    const nativeBalances: RuntimeSdkBalance[] = useMemo(() => {
        if (account && 'balances' in account) {
            return account.balances || [];
        }
        return [];
    }, [account]);

    // Get ERC20 token list and convert to TokenInfo format (filter out ERC721 etc.)
    const erc20Tokens: TokenInfo[] = useMemo(() => {
        if (account && 'evm_balances' in account) {
            return (account.evm_balances || [])
                .filter((balance: RuntimeEvmBalance) => balance.token_type === EvmTokenType.ERC20)
                .map((balance: RuntimeEvmBalance) => ({
                    address: balance.token_contract_addr_eth as `0x${string}`,
                    symbol: balance.token_symbol || 'UNKNOWN',
                    name: balance.token_name || 'Unknown Token',
                    decimals: balance.token_decimals,
                    balance: balance.balance,
                }));
        }
        return [];
    }, [account]);

    // Convert native token to TokenInfo format (for SecretTokenWrap)
    const nativeTokensAsTokenInfo: TokenInfo[] = useMemo(() => {
        return nativeBalances.map((balance) => ({
            address: '0x0000000000000000000000000000000000000000' as `0x${string}`, // native token address
            symbol: balance.token_symbol || chainConfig.nativeCurrency.symbol,
            name: balance.token_symbol || chainConfig.nativeCurrency.name,
            decimals: balance.token_decimals,
            balance: balance.balance,
        }));
    }, [nativeBalances, chainConfig]);

    // Merge all tokens (native token + ERC20 token), for passing to SecretTokenWrap
    const allTokens: TokenInfo[] = useMemo(() => {
        return [...nativeTokensAsTokenInfo, ...erc20Tokens];
    }, [nativeTokensAsTokenInfo, erc20Tokens]);

    return {
        nativeBalances,
        erc20Tokens,
        allTokens,
        isLoading,
        error,
        scope,
    };
};

