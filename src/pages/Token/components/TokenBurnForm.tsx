// import React, { useState, useCallback } from 'react';
// import { Button, Input, Space, Typography, Select } from 'antd';
// import { formatBalance } from '@dapp/utils/formatBalance';
// import { TokenInfo } from '../types';

// const { Option } = Select;

// export interface TokenBurnFormProps {
//     tokens: TokenInfo[];
//     selectedTokenAddress?: string;
//     onTokenChange?: (tokenAddress: string) => void;
//     onBurn: (tokenAddress: `0x${string}`, amount: string) => void;
//     isLoading: boolean;
// }

// /**
//  * Component for Burn operation form
//  * Burn operation form
//  */
// const TokenBurnForm: React.FC<TokenBurnFormProps> = ({
//     tokens,
//     selectedTokenAddress,
//     onTokenChange,
//     onBurn,
//     isLoading,
// }) => {
//     const [burnAmount, setBurnAmount] = useState<string>('');

//     const selectedToken = tokens.find(
//         (t) => t.address.toLowerCase() === (selectedTokenAddress || tokens[0]?.address || '').toLowerCase()
//     ) || tokens[0];

//     const handleBurnAmount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         // Only allow input numbers and decimal points
//         const numberRegex = /^\d*\.?\d*$/;
//         if (value === '' || numberRegex.test(value)) {
//             setBurnAmount(value);
//         }
//     }, []);

//     const handleAll = useCallback(() => {
//         if (selectedToken && selectedToken.balance) {
//             setBurnAmount(formatBalance(selectedToken.balance));
//         }
//     }, [selectedToken]);

//     const handleBurn = useCallback(() => {
//         if (!burnAmount || !selectedToken) return;
//         onBurn(selectedToken.address, burnAmount);
//     }, [burnAmount, selectedToken, onBurn]);

//     return (
//         <Space direction="vertical" size="middle">
//             {tokens.length > 1 && (
//                 <Select
//                     value={selectedTokenAddress || selectedToken?.address}
//                     onChange={onTokenChange}
//                     style={{ width: '100%' }}
//                     disabled={isLoading}
//                 >
//                     {tokens.map((token) => (
//                         <Option key={token.address} value={token.address}>
//                             {token.symbol} ({token.name})
//                         </Option>
//                     ))}
//                 </Select>
//             )}
//             <Space.Compact style={{ width: '100%' }}>
//                 <Input
//                     placeholder="Amount"
//                     value={burnAmount}
//                     suffix={selectedToken?.symbol || ''}
//                     onChange={handleBurnAmount}
//                     disabled={isLoading || !selectedToken}
//                     style={{ flex: 1 }}
//                 />
//                 <Button
//                     onClick={handleAll}
//                     disabled={!selectedToken?.balance || isLoading || !selectedToken}
//                 >
//                     All
//                 </Button>
//                 <Button
//                     type="primary"
//                     danger
//                     onClick={handleBurn}
//                     loading={isLoading}
//                     disabled={!burnAmount || isLoading || !selectedToken}
//                 >
//                     Burn
//                 </Button>
//             </Space.Compact>
//         </Space>
//     );
// };

// export default TokenBurnForm;

