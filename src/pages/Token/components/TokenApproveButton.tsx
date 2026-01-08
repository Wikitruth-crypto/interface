// import React from 'react';
// import { Button, Space, Typography, Alert } from 'antd';
// import { formatUnits } from 'viem';

// const { Text } = Typography;

// export interface TokenApproveButtonProps {
//     tokenAddress: `0x${string}`;
//     spender: `0x${string}`;
//     amount: string;
//     decimals: number;
//     currentAllowance?: bigint | number;
//     onApprove: (tokenAddress: `0x${string}`, spender: `0x${string}`, amount: string) => void;
//     isLoading: boolean;
// }


// const TokenApproveButton: React.FC<TokenApproveButtonProps> = ({
//     tokenAddress,
//     spender,
//     amount,
//     decimals,
//     currentAllowance,
//     onApprove,
//     isLoading,
// }) => {
//     const handleApprove = () => {
//         onApprove(tokenAddress, spender, amount);
//     };

//     const currentAllowanceFormatted = currentAllowance
//         ? formatUnits(BigInt(currentAllowance.toString()), decimals)
//         : '0';

//     return (
//         <Space direction="vertical" size="small" style={{ width: '100%' }}>
//             <Alert
//                 type="warning"
//                 message={
//                     <Space direction="vertical" size="small">
//                         <Text>
//                             Insufficient allowance. Current: {currentAllowanceFormatted}, Required: {amount}
//                         </Text>
//                         <Text type="secondary" style={{ fontSize: '12px' }}>
//                             Please approve the token before wrapping.
//                         </Text>
//                     </Space>
//                 }
//                 showIcon
//             />
//             <Button
//                 type="primary"
//                 onClick={handleApprove}
//                 loading={isLoading}
//                 disabled={isLoading}
//                 block
//             >
//                 Approve {amount}
//             </Button>
//         </Space>
//     );
// };

// export default TokenApproveButton;

