// import { useState,} from 'react';
// import { 
//     useERC20, 
//     useERC20Secret 
// } from '../index';
// import { useWalletContext } from '@dapp/context/useAccount/WalletContext';
// import {
//     TokenMetadata,
// } from '@dapp/contractsConfig';
// import { EIP712Permit } from '@/dapp/hooks/EIP712';

// /**
//  * 标准 ERC20 代币授权查询参数
//  */
// export interface AllowanceERC20Params {
//     type: 'ERC20';
//     amount: number | string | bigint; 
//     owner: `0x${string}`;
//     spender: `0x${string}`;
    
// }

// /**
//  * 隐私 ERC20 代币授权查询参数
//  * 需要提供 EIP712 签名授权
//  */
// export interface AllowanceERC20SecretParams {
//     type: 'Secret';
//     amount: number | string | bigint; 
//     eip712Permit: EIP712Permit; 
// }

// /**
//  * 授权检查结果
//  */
// export interface AllowanceBaseResult {
//     isEnough: boolean;
//     allowanceAmount: number;
// }

// export const useAllowanceBase = () => {
//     const { allowance} = useERC20();
//     const { allowanceWithPermit } = useERC20Secret();
//     const { address } = useWalletContext() || {};
//     const [isEnough, setIsEnough] = useState<boolean>(false);
//     const [amount, setAmount] = useState<number>(0);
    
//     /**
//      * @example
//      * // 检查标准 ERC20 代币
//      * checkAllowance(tokenAddress, {
//      *   type: 'ERC20',
//      *   owner: userAddress,
//      *   spender: spenderAddress,
//      *   amount: 1000
//      * });
//      * 
//      * @example
//      * // 检查隐私 ERC20 代币
//      * checkAllowance(tokenAddress, {
//      *   type: 'Secret',
//      *   amount: 1000,
//      *   eip712Permit: signedPermit
//      * });
//      */
//     const getAllowanceBase = async (
//         tokenAddress: `0x${string}`,
//         tokenType: 'ERC20' | 'Secret',
//         params: AllowanceERC20Params | AllowanceERC20SecretParams,
//     ): Promise<AllowanceBaseResult> => {
//         // 验证钱包连接
//         if (!address) {
//             console.warn('Wallet not connected');
//             return { isEnough: false, allowanceAmount: 0 };
//         }

//         try {
//             // 验证代币类型与参数类型一致
//             if (tokenType !== params.type) {
//                 console.error(
//                     `Token type mismatch: expected ${tokenType}, got ${params.type}`
//                 );
//                 return { isEnough: false, allowanceAmount: 0 };
//             }

//             let targetAmount = params.amount as number;
//             let allowanceAmount = 0;

//             if (params.type === 'ERC20') {
//                 const owner = params.owner;
//                 const spender = params.spender;
                
//                 allowanceAmount = await allowance(tokenAddress, owner, spender);
                
//                 console.log(`[ERC20] Allowance: ${allowanceAmount}, Target: ${targetAmount}`);
                
//             } else if (params.type === 'Secret') {
//                 allowanceAmount = await allowanceWithPermit(tokenAddress, params.eip712Permit);

//                 console.log(`[Secret] Allowance with permit: ${allowanceAmount}`);
//             }

//             // 判断授权是否足够
//             const isEnoughValue = allowanceAmount >= targetAmount;

//             setIsEnough(isEnoughValue);
//             setAmount(allowanceAmount);

//             return { isEnough: isEnoughValue, allowanceAmount: allowanceAmount };

//         } catch (error) {
//             console.error("Check allowance error:", error);
//             return { isEnough: false, allowanceAmount: 0 };
//         }
//     };

//     return { getAllowanceBase, amount, isEnough };
// };