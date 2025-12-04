import React from 'react';
import { Card, Alert, Spin } from 'antd';
import { useAccount } from 'wagmi';
import { useTokenBalances } from './hooks/useTokenBalances';
import TokenBalanceList from './components/TokenBalanceList';
import ERC20Write from './erc20Write';
import SecretTokenWrap from './secretTokenWrap';
export type { TokenInfo } from './types';

const ERC20Token: React.FC = () => {
    const { address } = useAccount();
    const { nativeBalances, erc20Tokens, allTokens, isLoading, error, scope } = useTokenBalances();

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
    if (isLoading) {
        return (
            <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                <Card>
                    <Spin size="large" style={{ display: 'block', textAlign: 'center', padding: '40px' }} />
                </Card>
            </div>
        );
    }

    // 如果查询出错
    if (error) {
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
            <TokenBalanceList
                nativeBalances={nativeBalances}
                erc20Tokens={erc20Tokens}
                scope={scope}
            />
            {/* ERC20 代币操作区域 */}
            {erc20Tokens.length > 0 && (
                <ERC20Write tokens={erc20Tokens} />
            )}
            <SecretTokenWrap tokens={allTokens} />
        </div>
    );
};

export default ERC20Token;
