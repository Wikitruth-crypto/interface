import React from 'react';
import { Card, Alert, Spin, Space } from 'antd';
import TokenBalanceList from './components/TokenBalanceList';
// import ERC20Write from './erc20Write';
import SecretTokenWrap from './secretTokenWrap';
import SecretTokenUnWrap from './secretTokenUnWrap';
import { TokenPageProvider, useTokenPageContext } from './context/TokenPageContext';
export type { TokenInfo } from './types';

const TokenContent: React.FC = () => {
    const {
        address,
        nativeBalances,
        erc20Tokens,
        scope,
        isBalancesLoading,
        balancesError,
    } = useTokenPageContext();

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

    if (isBalancesLoading) {
        return (
            <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                <Card>
                    <Spin size="large" style={{ display: 'block', textAlign: 'center', padding: '40px' }} />
                </Card>
            </div>
        );
    }

    if (balancesError) {
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
            {/* {erc20Tokens.length > 0 && <ERC20Write />} */}

            <Space direction="horizontal" size="large" align="start" style={{ width: '100%' }}>
                <SecretTokenWrap />
                <SecretTokenUnWrap />
            </Space>
        </div>
    );
};

const ERC20Token: React.FC = () => (
    <TokenPageProvider>
        <TokenContent />
    </TokenPageProvider>
);

export default ERC20Token;
