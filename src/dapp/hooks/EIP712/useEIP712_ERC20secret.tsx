import { useState, useCallback } from 'react';
import { useSignTypedData, useChainId, useAccount} from 'wagmi';
import { type Hex } from 'viem';
import { useWalletContext } from '@dapp/context/useAccount/WalletContext';
import { 
    SignPermitParams, 
    EIP712Permit, 
    EIP712Domain, 
    SignatureRSV, 
    PermitType 
} from './types_ERC20secret';
// 使用ethers.js验证地址
import { ethers } from 'ethers';

/**
 * Hook 返回值
 */
export interface UseEIP712SignatureResult {
    /** 生成 EIP712 签名 */
    signPermit: (params: SignPermitParams) => Promise<EIP712Permit | null>;
    /** 签名是否正在进行中 */
    isLoading: boolean;
    /** 签名错误信息 */
    error: Error | null;
    /** 最新生成的许可数据 */
    permit: EIP712Permit | null;
    /** 重置状态 */
    reset: () => void;
}

/**
 * EIP712 签名 Hook
 * 用于为隐私代币生成 EIP712 签名授权
 * 
 * @example
 * ```tsx
 * const { signPermit, isLoading, permit } = useEIP712Signature();
 * 
 * // 生成VIEW签名
 * const viewPermit = await signPermit({
 *   spender: userAddress,
 *   amount: 0,
 *   label: PermitType.VIEW,
 *   contractAddress: tokenAddress,
 *   domainName: 'Secret ERC20 Token'
 * });
 * 
 * // 生成转账授权签名
 * const transferPermit = await signPermit({
 *   spender: recipientAddress,
 *   amount: 1000n,
 *   label: PermitType.TRANSFER,
 *   contractAddress: tokenAddress
 * });
 * ```
 */
export const useEIP712_ERC20secret = (): UseEIP712SignatureResult => {
    const { chainId, address, isConnected } = useWalletContext();
    const { signTypedDataAsync } = useSignTypedData();
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [permit, setPermit] = useState<EIP712Permit | null>(null);

    /**
     * 解析签名字符串为 RSV 结构
     */
    const parseSignature = (signature: Hex): SignatureRSV => {
        // 移除 0x 前缀
        const sig = signature.slice(2);
        
        return {
            r: '0x' + sig.slice(0, 64),
            s: '0x' + sig.slice(64, 128),
            v: parseInt(sig.slice(128, 130), 16)
        };
    };

    /**
     * 验证地址格式
     */
    const validateAddress = (addr: string, name: string): void => {
        if (!ethers.isAddress(addr)) {
            throw new Error(`The ${name} address format is invalid: ${addr}`);
        }
    };

    /**
     * 创建 EIP712 域配置
     */
    const createDomain = (
        chainId: number,
        contractAddress: string,
        domainName?: string,
        domainVersion?: string
    ): EIP712Domain => {
        return {
            name: domainName || 'Secret ERC20 Token',
            version: domainVersion || '1',
            chainId: chainId,
            verifyingContract: contractAddress as `0x${string}`
        };
    };

    /**
     * 生成 EIP712 签名
     */
    const signPermit = useCallback(async (
        params: SignPermitParams
    ): Promise<EIP712Permit | null> => {
        const {
            spender,
            amount,
            label,
            contractAddress,
            domainName,
            domainVersion,
            customDeadline
        } = params;

        // 重置状态
        setError(null);
        setIsLoading(true);

        try {

            // 在 signPermit 函数开始处添加
            if (!isConnected || !address || !chainId) {
                throw new Error('Please connect your wallet first');
            }

            validateAddress(contractAddress, 'token');
            validateAddress(spender, 'spender');

            if (!address) {
                throw new Error('The owner address is not the current wallet address');
            }

            // 验证金额
            const amountBigInt = typeof amount === 'bigint' 
                ? amount 
                : BigInt(amount);
            
            if (Number(amountBigInt) < 0) {
                throw new Error('The amount cannot be negative');
            }

            // 验证许可类型
            if (!Object.values(PermitType).includes(label)) {
                throw new Error(`The permit type is invalid: ${label}`);
            }

            // 对于 VIEW 类型，金额必须为 0
            if (label === PermitType.VIEW && Number(amountBigInt) !== 0) {
                throw new Error('The amount of VIEW type must be 0');
            }

            // 设置截止时间（默认 1 小时后过期）
            const deadline = customDeadline || Math.floor(Date.now() / 1000) + 3600;

            // 创建域配置
            const domain = createDomain(chainId, contractAddress, domainName, domainVersion);

            // EIP712 类型定义
            const types = {
                EIP712Permit: [
                    { name: 'label', type: 'uint8' },
                    { name: 'owner', type: 'address' },
                    { name: 'spender', type: 'address' },
                    { name: 'amount', type: 'uint256' },
                    { name: 'deadline', type: 'uint256' }
                ]
            };

            // 签名值
            const value = {
                label: label,
                owner: address,
                spender: spender as `0x${string}`,
                amount: amountBigInt,
                deadline: BigInt(deadline)
            };

            // 执行签名
            const signature = await signTypedDataAsync({
                domain,
                types,
                primaryType: 'EIP712Permit',
                message: value
            });

            // 解析签名
            const sig = parseSignature(signature);

            // 构造许可对象
            const permitData: EIP712Permit = {
                label: label,
                owner: address,
                spender,
                amount: amountBigInt.toString(),
                deadline,
                signature: sig
            };
            // if (import.meta.env.DEV) {
            //     console.log('✅ EIP712 signature successful:', permitData);
            // }
            
            setPermit(permitData);
            return permitData;

        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to generate EIP712 signature');
            console.error('❌ EIP712 signature failed:', error);
            setError(error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [chainId, address, isConnected, signTypedDataAsync]);

    /**
     * 重置状态
     */
    const reset = useCallback(() => {
        setError(null);
        setPermit(null);
        setIsLoading(false);
    }, []);

    return {
        signPermit,
        isLoading,
        error,
        permit,
        reset
    };
};

