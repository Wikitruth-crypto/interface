import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useChainConfig } from '@/dapp/contractsConfig';
import { useAccountQuery } from '@/dapp/oasisQuery/app/hooks/useAccountQuery';
import { SearchScope } from '@/dapp/oasisQuery/types/searchScope';
import { RuntimeEvmBalance, RuntimeAccount, RuntimeSdkBalance } from '@/dapp/oasisQuery/oasis-nexus/api';
import { EvmTokenType } from '@/dapp/oasisQuery/oasis-nexus/generated/api';
import { TokenInfo } from '../types';

/**
 * Hook for managing token balances
 * 统一管理代币余额查询逻辑
 */
export const useTokenBalances = () => {
    const { address } = useAccount();
    const chainConfig = useChainConfig();

    // 构建 SearchScope
    const scope: SearchScope = useMemo(() => {
        return {
            network: chainConfig.network,
            layer: chainConfig.layer,
        };
    }, [chainConfig]);

    // 使用 useAccountQuery 查询账户信息
    const { data: accountData, isLoading, error } = useAccountQuery({
        scope,
        address: address as `0x${string}`,
        enabled: !!address,
    });

    // 获取账户数据
    const account = accountData?.data as RuntimeAccount | undefined;

    // 获取原生代币余额列表
    const nativeBalances: RuntimeSdkBalance[] = useMemo(() => {
        if (account && 'balances' in account) {
            return account.balances || [];
        }
        return [];
    }, [account]);

    // 获取 ERC20 代币列表并转换为 TokenInfo 格式（过滤掉 ERC721 等其他类型）
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

    // 将原生代币转换为 TokenInfo 格式（用于 SecretTokenWrap）
    const nativeTokensAsTokenInfo: TokenInfo[] = useMemo(() => {
        return nativeBalances.map((balance) => ({
            address: '0x0000000000000000000000000000000000000000' as `0x${string}`, // 原生代币使用零地址标识
            symbol: balance.token_symbol || chainConfig.nativeCurrency.symbol,
            name: balance.token_symbol || chainConfig.nativeCurrency.name,
            decimals: balance.token_decimals,
            balance: balance.balance,
        }));
    }, [nativeBalances, chainConfig]);

    // 合并所有代币（原生代币 + ERC20 代币），用于传递给 SecretTokenWrap
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

