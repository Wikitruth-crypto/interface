import React from 'react';
import { Card, Space, Typography, Alert, Row, Tag } from 'antd';
import { SearchScope } from '@dapp/oasisQuery/types/searchScope';
import { RuntimeSdkBalance } from '@dapp/oasisQuery/oasis-nexus/api';
import { formatBalance } from '@dapp/utils/formatBalance';
import { getColorByAddress } from '@dapp/utils/tagColor';
import { TokenInfo } from '../types';

const { Title } = Typography;

export interface TokenBalanceListProps {
    nativeBalances: RuntimeSdkBalance[];
    erc20Tokens: TokenInfo[];
    scope: SearchScope;
}

/**
 * Component for displaying token balances
 */
const TokenBalanceList: React.FC<TokenBalanceListProps> = ({
    nativeBalances,
    erc20Tokens,
    scope,
}) => {
    return (
        <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Row>
                    <Title level={3}>Token Balances:</Title>

                    {/* Native token balance */}
                    {scope.layer !== 'consensus' && nativeBalances.length > 0 && (
                        <Row>
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

                {/* ERC20 token balance */}
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

                {/* If there are no tokens */}
                {nativeBalances.length === 0 && erc20Tokens.length === 0 && (
                    <Alert
                        type="info"
                        message="You don't have any tokens yet. Use the Faucet tab to mint some test tokens."
                        showIcon
                    />
                )}
            </Space>
        </Card>
    );
};

export default TokenBalanceList;

