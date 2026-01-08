// import React, { useState, useCallback } from 'react';
// import { Button, Input, Space, Typography, Select } from 'antd';
// import { TokenInfo } from '../types';

// const { Option } = Select;

// export interface TokenTransferFormProps {
//     tokens: TokenInfo[];
//     selectedTokenAddress?: string;
//     onTokenChange?: (tokenAddress: string) => void;
//     onTransfer: (tokenAddress: `0x${string}`, to: `0x${string}`, amount: string) => void;
//     isLoading: boolean;
// }

// /**
//  * Component for Transfer operation form
//  * Transfer operation form
//  */
// const TokenTransferForm: React.FC<TokenTransferFormProps> = ({
//     tokens,
//     selectedTokenAddress,
//     onTokenChange,
//     onTransfer,
//     isLoading,
// }) => {
//     const [transferAmount, setTransferAmount] = useState<string>('');
//     const [transferAddress, setTransferAddress] = useState<string>('');

//     const selectedToken = tokens.find(
//         (t) => t.address.toLowerCase() === (selectedTokenAddress || tokens[0]?.address || '').toLowerCase()
//     ) || tokens[0];

//     const handleTransferAmount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         // Only allow input numbers and decimal points
//         const numberRegex = /^\d*\.?\d*$/;
//         if (value === '' || numberRegex.test(value)) {
//             setTransferAmount(value);
//         }
//     }, []);

//     const handleTransferAddress = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//         setTransferAddress(e.target.value);
//     }, []);

//     const handleTransfer = useCallback(() => {
//         if (!transferAmount || !transferAddress || !selectedToken) return;
//         onTransfer(selectedToken.address, transferAddress as `0x${string}`, transferAmount);
//         // After success, clear the input (managed by parent component)
//     }, [transferAmount, transferAddress, selectedToken, onTransfer]);

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
//                     value={transferAmount}
//                     suffix={selectedToken?.symbol || ''}
//                     onChange={handleTransferAmount}
//                     disabled={isLoading || !selectedToken}
//                     style={{ flex: 1 }}
//                 />
                
//             </Space.Compact>
//             <Input
//                 placeholder="Recipient Address"
//                 value={transferAddress}
//                 onChange={handleTransferAddress}
//                 disabled={isLoading || !selectedToken}
//             />
//             <Button
//                 type="primary"
//                 onClick={handleTransfer}
//                 loading={isLoading}
//                 disabled={!transferAmount || !transferAddress || isLoading || !selectedToken}
//                 block
//             >
//                 Transfer
//             </Button>
//         </Space>
//     );
// };

// export default TokenTransferForm;

