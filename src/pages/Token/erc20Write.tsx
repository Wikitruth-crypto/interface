// import React, { useState, useEffect, useCallback } from 'react';
// import { Card, Space, Typography, Select, Tabs, Row, Col } from 'antd';
// import { useTokenPageContext } from './context/TokenPageContext';
// import { useTokenOperations } from './hooks/useTokenOperations';
// import TokenTransferForm from './components/TokenTransferForm';
// import TokenBurnForm from './components/TokenBurnForm';

// const { Text } = Typography;
// const { Option } = Select;

// const ERC20Write: React.FC = () => {
//     const { erc20Tokens: tokens,} = useTokenPageContext();
//     const [selectedTokenAddress, setSelectedTokenAddress] = useState<string>('');
//     const [activeTab, setActiveTab] = useState<string>('transfer');
//     const { transfer, burn, isLoading } = useTokenOperations();

//     useEffect(() => {
//         if (!selectedTokenAddress && tokens.length > 0) {
//             setSelectedTokenAddress(tokens[0].address);
//         }
//     }, [tokens, selectedTokenAddress]);

//     const selectedToken =
//         tokens.find(
//             (t) => t.address.toLowerCase() === (selectedTokenAddress || tokens[0]?.address || '').toLowerCase()
//         ) || tokens[0];

//     const handleTransfer = useCallback(
//         async (tokenAddress: `0x${string}`, to: `0x${string}`, amount: string) => {
//             if (!selectedToken) return;
//             try {
//                 await transfer(tokenAddress, to, amount, selectedToken.decimals);
//             } catch (error) {
//                 console.error('Transfer error:', error);
//             }
//         },
//         [transfer, selectedToken]
//     );

//     const handleBurn = useCallback(
//         async (tokenAddress: `0x${string}`, amount: string) => {
//             if (!selectedToken) return;
//             try {
//                 await burn(tokenAddress, amount, selectedToken.decimals);
//             } catch (error) {
//                 console.error('Burn error:', error);
//             }
//         },
//         [burn, selectedToken]
//     );

//     if (tokens.length === 0) {
//         return null;
//     }

//     const tabItems = [
//         {
//             key: 'transfer',
//             label: 'Transfer',
//             children: (
//                 <TokenTransferForm
//                     tokens={tokens}
//                     selectedTokenAddress={selectedTokenAddress}
//                     onTokenChange={setSelectedTokenAddress}
//                     onTransfer={handleTransfer}
//                     isLoading={isLoading}
//                 />
//             ),
//         },
//         {
//             key: 'burn',
//             label: 'Burn',
//             children: (
//                 <TokenBurnForm
//                     tokens={tokens}
//                     selectedTokenAddress={selectedTokenAddress}
//                     onTokenChange={setSelectedTokenAddress}
//                     onBurn={handleBurn}
//                     isLoading={isLoading}
//                 />
//             ),
//         },
//     ];

//     return (
//         <Card style={{ marginTop: '24px' }}>
//             <Space direction="vertical" size="large" style={{ width: '100%' }}>
//                 {tokens.length > 1 && (
//                     <Col>
//                         <Row>
//                             <Text strong style={{ marginRight: '8px' }}>Select Token: </Text>
//                             <Select
//                                 value={selectedTokenAddress}
//                                 onChange={setSelectedTokenAddress}
//                                 style={{ width: '100%', maxWidth: '400px' }}
//                                 disabled={isLoading}
//                             >
//                                 {tokens.map((token) => (
//                                     <Option
//                                         key={token.address}
//                                         value={token.address}
//                                     >
//                                         {token.symbol} ({token.name})
//                                     </Option>
//                                 ))}
//                             </Select>
//                         </Row>
//                         {selectedToken && (
//                             <Space style={{ marginTop: '12px' }} direction="vertical" size="small">
//                                 <Text strong>
//                                     {selectedToken.name} ({selectedToken.symbol})
//                                 </Text>
//                                 <Text type="secondary" copyable>
//                                     {selectedToken.address}
//                                 </Text>
//                             </Space>
//                         )}
//                     </Col>
//                 )}

//                 <Tabs
//                     activeKey={activeTab}
//                     onChange={setActiveTab}
//                     items={tabItems}
//                 />
//             </Space>
//         </Card>
//     );
// };

// export default ERC20Write;
