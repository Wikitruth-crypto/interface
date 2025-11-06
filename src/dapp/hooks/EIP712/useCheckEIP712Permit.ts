import { useState, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useEIP712_ERC20secret, EIP712Permit, PermitType } from '@/dapp/hooks/EIP712';
import { SignPermitParams } from './types_ERC20secret';
import { useSimpleSecretStore } from '@/dapp/store/simpleSecretStore';

/**
 * 获取有效 Permit 的选项
 */
export interface GetValidPermitOptions {
    /** 合约地址（当传入 EIP712Permit 且过期时必需） */
    contractAddress?: string;
    /** 域名名称（可选） */
    domainName?: string;
    /** 域名版本（可选） */
    domainVersion?: string;
    /** 自定义过期时间（可选） */
    customDeadline?: number;
}

/**
 * Hook 返回值
 */
export interface UseCheckEIP712PermitResult {
    /** 检查并获取有效的 permit（如果过期则自动生成新签名） */
    getValidPermit: (
        params: EIP712Permit | SignPermitParams,
        options?: GetValidPermitOptions
    ) => Promise<EIP712Permit>;
    /** 检查 permit 是否过期 */
    isExpired: (permit: EIP712Permit) => boolean;
    /** 是否正在处理中 */
    isLoading: boolean;
    /** 错误信息 */
    error: Error | null;
}

/**
 * 检查 EIP712 Permit 是否过期
 * 如果过期或不存在，自动生成新签名
 * 
 * @example
 * ```tsx
 * const { getValidPermit, isLoading } = useIsPermitExpired();
 * 
 * // 方式1: 传入已存在的 permit（未过期则直接返回，过期则自动重新生成）
 * const permit = existingPermit;
 * const validPermit = await getValidPermit(permit, {
 *   contractAddress: tokenAddress  // 过期时需要提供
 * });
 * // 使用 permit 调用合约
 * 
 * // 方式2: 传入签名参数（自动获取或生成）
 * const validPermit = await getValidPermit({
 *   spender: recipientAddress,
 *   amount: 1000n,
 *   label: PermitType.VIEW,
 *   contractAddress: tokenAddress
 * });
 * ```
 */
export const useCheckEIP712Permit = (): UseCheckEIP712PermitResult => {
    const { address } = useAccount();
    const chainId = useChainId();
    const { signPermit, isLoading: isSigningLoading } = useEIP712_ERC20secret();
    
    const getEip712Permit = useSimpleSecretStore((state) => state.getEip712Permit);
    const setEip712Permit = useSimpleSecretStore((state) => state.setEip712Permit);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * 检查 EIP712 Permit 是否过期
     * @param permit - EIP712 许可证
     * @returns 是否过期
     */
    const isExpired = useCallback((permit: EIP712Permit): boolean => {
        if (!permit.deadline) {
            return true; // 没有过期时间视为过期
        }
        
        const now = Math.floor(Date.now() / 1000); // 当前时间戳（秒）
        const expired = now >= permit.deadline;
        
        if (expired) {
            console.log(`[EIP712] Permit expired. Deadline: ${permit.deadline}, Now: ${now}`);
        }
        
        return expired;
    }, []);

    /**
     * 检查并获取有效的 permit
     * 如果过期或不存在，自动生成新签名
     */
    const getValidPermit = useCallback(async (
        params: EIP712Permit | SignPermitParams,
        options?: GetValidPermitOptions
    ): Promise<EIP712Permit> => {
        setError(null);
        setIsLoading(true);

        try {
            // 类型守卫：检查是否为 EIP712Permit
            const isEIP712Permit = (p: EIP712Permit | SignPermitParams): p is EIP712Permit => {
                return 'signature' in p && 'deadline' in p;
            };

            // 验证钱包连接
            if (!address) {
                throw new Error('钱包未连接，请先连接钱包');
            }

            let label: PermitType;
            let spender: string;
            let amount: bigint | string;
            let contractAddress: string;
            let domainName: string | undefined;
            let domainVersion: string | undefined;
            let customDeadline: number | undefined;

            // 情况1: 传入的是已存在的 EIP712Permit
            if (isEIP712Permit(params)) {
                // 检查是否过期
                if (!isExpired(params)) {
                    // 未过期，直接返回
                    return params;
                }
                
                // 已过期，需要重新生成签名
                console.log('[EIP712] Permit expired, regenerating signature...');
                
                // 从 permit 中提取参数
                label = params.label;
                spender = params.spender;
                // 统一转换为 bigint 或 string
                amount = typeof params.amount === 'bigint' 
                    ? params.amount 
                    : typeof params.amount === 'string' 
                        ? params.amount 
                        : BigInt(params.amount);
                
                // contractAddress 需要从 options 中获取
                contractAddress = options?.contractAddress || '';
                
                if (!contractAddress) {
                    throw new Error(
                        'Permit 已过期，需要 contractAddress 来重新生成签名。' +
                        '请通过 options 参数提供: getValidPermit(permit, { contractAddress: "0x..." })'
                    );
                }
                
                // 从 options 中获取可选参数
                domainName = options?.domainName;
                domainVersion = options?.domainVersion;
                customDeadline = options?.customDeadline;
            } else {
                // 情况2: 传入的是 SignPermitParams，需要获取或生成签名
                const signParams = params;
                
                label = signParams.label;
                spender = signParams.spender;
                // 统一类型：number 转换为 bigint
                amount = typeof signParams.amount === 'number' 
                    ? BigInt(signParams.amount) 
                    : signParams.amount;
                contractAddress = signParams.contractAddress;
                domainName = signParams.domainName || options?.domainName;
                domainVersion = signParams.domainVersion || options?.domainVersion;
                customDeadline = signParams.customDeadline || options?.customDeadline;
            }

            if (!spender) {
                throw new Error('缺少 spender 参数');
            }

            if (!contractAddress) {
                throw new Error('缺少 contractAddress 参数');
            }

            // 尝试从 store 获取已存在的 permit
            let existingPermit = getEip712Permit(label, spender, chainId);

            // 检查是否存在且未过期
            if (existingPermit && !isExpired(existingPermit)) {
                console.log('[EIP712] Using cached permit');
                return existingPermit;
            }

            try {
                // 生成新的 EIP712 签名
                // signPermit 内部会使用当前连接的钱包地址作为 owner（通过 useAccount）
                const newPermit = await signPermit({
                    spender: spender as `0x${string}`,
                    amount,
                    label,
                    contractAddress,
                    domainName,
                    domainVersion,
                    customDeadline
                });

                if (!newPermit) {
                    throw new Error('生成签名失败');
                }

                // 保存到 store
                setEip712Permit(label, spender, newPermit, chainId);
                
                console.log('[EIP712] Permit generated and cached');
                return newPermit;

            } catch (signError) {
                const error = signError instanceof Error 
                    ? signError 
                    : new Error('生成 EIP712 签名失败');
                console.error('[EIP712] Failed to generate permit:', error);
                setError(error);
                throw error;
            }

        } catch (err) {
            const error = err instanceof Error ? err : new Error('检查 permit 失败');
            console.error('[useIsPermitExpired] Error:', error);
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [
        address,
        chainId,
        signPermit,
        getEip712Permit,
        setEip712Permit,
        isExpired
    ]);

    return {
        getValidPermit,
        isExpired,
        isLoading: isLoading || isSigningLoading,
        error
    };
};
