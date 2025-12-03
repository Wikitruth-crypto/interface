import React, { useMemo, useState, useEffect } from 'react';
import { Card, Space, Typography, Alert, Row, Col, Spin, Statistic, Tag } from 'antd';
import { useChainConfig } from '@/dapp/contractsConfig';
import { useAccount } from 'wagmi';
import { useAccountQuery } from '@/dapp/oasisQuery/app/hooks/useAccountQuery';
import { SearchScope } from '@/dapp/oasisQuery/types/searchScope';
import { RuntimeEvmBalance, RuntimeAccount, RuntimeSdkBalance } from '@/dapp/oasisQuery/oasis-nexus/api';
import { EvmTokenType } from '@/dapp/oasisQuery/oasis-nexus/generated/api';
import { formatBalance } from '@dapp/utils/formatBalance';
import { getColorByAddress } from '@dapp/utils/tagColor';
import ERC20Write from './erc20Write';
import SecretTokenWrap from './secretTokenWrap';

const { Title } = Typography;

// 代币数据类型
export interface TokenInfo {
    address: `0x${string}`;
    symbol: string;
    name: string;
    decimals: number;
    balance: string;
}

const ERC20Token: React.FC = () => {
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
    const { data: accountData, isLoading: isLoadingAccount, error: accountError } = useAccountQuery({
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

    // 如果没有连接钱包
    if (!address) {
        return (
            <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                <Card>
                    <Alert
                        type="warning"
                        message="Please connect your wallet to view and manage your tokens."
                        showIcon
                    />
                </Card>
            </div>
        );
    }

    // 如果正在加载账户数据
    if (isLoadingAccount) {
        return (
            <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                <Card>
                    <Spin size="large" style={{ display: 'block', textAlign: 'center', padding: '40px' }} />
                </Card>
            </div>
        );
    }

    // 如果查询出错
    if (accountError) {
        return (
            <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                <Card>
                    <Alert
                        type="error"
                        message="Failed to load account data. Please try again later."
                        showIcon
                    />
                </Card>
            </div>
        );
    }

    return (
        <div>
            <Card>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Row >
                        <Title level={3}>Token Balances:</Title>

                        {/* 原生代币余额 */}
                        {scope.layer !== 'consensus' && nativeBalances.length > 0 && (
                            <Row >
                                {nativeBalances.map((balance, index) => (
                                    <Tag
                                        key={'NativeToken' + index}
                                        style={{ marginLeft: '10px', fontSize: '16px', display: 'flex', alignItems: 'center' }}
                                        color="blue"
                                    >
                                        {balance.token_symbol || 'Unknown'} {formatBalance(balance.balance)}
                                    </Tag>

                                ))}
                            </Row>
                        )}
                    </Row>

                    {/* ERC20 代币余额 */}
                    {scope.layer !== 'consensus' && erc20Tokens.length > 0 && (
                        <Card title="ERC20 Token Balances" size="small">
                            <Row gutter={[16, 16]}>
                                {erc20Tokens.map((token) => (
                                    <Tag
                                        key={'ERC20Token' + token.address}
                                        style={{ fontSize: '14px', padding: '5px 10px' }}
                                        color={getColorByAddress(token.address)}
                                    >
                                        {token.symbol || token.name || 'Unknown'} {formatBalance(token.balance)}
                                    </Tag>
                                    
                                ))}
                            </Row>
                        </Card>
                    )}

                    {/* 如果没有代币 */}
                    {nativeBalances.length === 0 && erc20Tokens.length === 0 && (
                        <Alert
                            type="info"
                            message="You don't have any tokens yet. Use the Faucet tab to mint some test tokens."
                            showIcon
                        />
                    )}


                </Space>
            </Card>
            {/* ERC20 代币操作区域 */}
            {erc20Tokens.length > 0 && (
                <>
                    <ERC20Write tokens={erc20Tokens} />
                    
                </>
            )}
            <SecretTokenWrap tokens={allTokens} />
        </div>
    );
};

export default ERC20Token;
