import { useState, useCallback } from 'react';
import { useEIP712_ERC20secret,} from '@/dapp/hooks/EIP712';
import { 
    SignPermitParams , 
    EIP712Permit, 
    PermitType 
} from '@/dapp/hooks/EIP712/types_ERC20secret';
import { useSimpleSecretStore } from '@/dapp/store/simpleSecretStore';
import { useWalletContext } from '@dapp/context/useAccount/WalletContext';

/**
 * 这个是适配当前前端的
 * 检查并获取有效的 permit（如果过期则自动生成新签名）
 * 
 */

export interface GetValidPermitOptions {
    contractAddress?: string;
    domainName?: string;
    domainVersion?: string;
    customDeadline?: number;
}


export interface UseCheckEIP712PermitResult {
    getValidPermit: (
        params: EIP712Permit | SignPermitParams,
        options?: GetValidPermitOptions
    ) => Promise<EIP712Permit>;
    signAndSavePermit: (params: SignPermitParams) => Promise<EIP712Permit>;
    isExpired: (permit: EIP712Permit) => boolean;
    getCurrentEip712Permit: (label: PermitType, spender: string) => EIP712Permit | null;
    isLoading: boolean;
    error: Error | null;
}

export const useEIP712Permit = (): UseCheckEIP712PermitResult => {
    const { address, chainId } = useWalletContext();
    const { signPermit, isLoading: isSigningLoading, error: signError } = useEIP712_ERC20secret(chainId ?? 0, address ?? '');
    
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
            if (import.meta.env.DEV) {
                console.log(`[EIP712] Permit expired. Deadline: ${permit.deadline}, Now: ${now}`);
            }
        }
        
        return expired;
    }, []);


    /**
     * 类型守卫：检查是否为 EIP712Permit
     */
    const isEIP712Permit = (p: EIP712Permit | SignPermitParams): p is EIP712Permit => {
        return 'signature' in p && 'deadline' in p;
    };

    /**
     * 解析传入的参数，返回 SignPermitParams
     * 如果传入的是 EIP712Permit 且未过期，返回 null（表示可以直接使用）
     */
    const parseSignPermitParams = useCallback((
        params: EIP712Permit | SignPermitParams,
        options?: GetValidPermitOptions
    ): SignPermitParams | null => {
        // 如果传入的是 EIP712Permit 且未过期，返回 null
        if (isEIP712Permit(params) && !isExpired(params)) {
            return null;
        }

        let label: PermitType;
        let spender: string;
        let amount: bigint | string;
        let contractAddress: string;
        let domainName: string | undefined;
        let domainVersion: string | undefined;
        let customDeadline: number | undefined;

        // 情况1: 传入的是已存在的 EIP712Permit（已过期）
        if (isEIP712Permit(params)) {
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
            domainName = options?.domainName;
            domainVersion = options?.domainVersion;
            customDeadline = options?.customDeadline;
        } else {
            // 情况2: 传入的是 SignPermitParams
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

        // 验证必要参数
        if (!spender) {
            throw new Error('Missing spender parameter');
        }

        if (!contractAddress) {
            throw new Error('Missing contractAddress parameter');
        }

        return {
            label,
            spender,
            amount,
            contractAddress,
            domainName,
            domainVersion,
            customDeadline
        };
    }, [isExpired]);
    
    /**
     * 生成新的 EIP712 签名并保存到 store
     */
    const signAndSavePermit = useCallback(async (
        params: SignPermitParams,
    ): Promise<EIP712Permit> => {
        try {
            // 生成新的 EIP712 签名
            const newPermit = await signPermit(params);

            if (!newPermit) {
                throw new Error('Failed to generate signature');
            }

            // 保存到 store
            setEip712Permit(params.label, params.spender, newPermit);

            return newPermit;
        } catch (signError) {
            const error = signError instanceof Error 
                ? signError 
                : new Error('Failed to generate EIP712 signature');
            console.error('[EIP712] Failed to generate permit:', error);
            setError(error);
            throw error;
        }
    }, [address, chainId, signPermit, setEip712Permit]);

    const getCurrentEip712Permit = useCallback((
        label: PermitType,
        spender: string,
    ): EIP712Permit | null => {
            const existingPermit = getEip712Permit(label, spender);
            if (
                existingPermit && 
                !isExpired(existingPermit) && 
                existingPermit.label=== label && 
                existingPermit.spender=== spender
            ) {
                return existingPermit;
            } 
            return null;
    }, [getEip712Permit, isExpired]);

    /**
     * 获取有效的 permit
     * 1. 如果传入的是 EIP712Permit 且未过期，直接返回
     * 2. 如果传入的是 EIP712Permit 但已过期，需要重新生成
     * 3. 如果传入的是 SignPermitParams，检查 store 中是否有有效的 permit
     * 4. 如果没有或过期，生成新的 permit
     */
    const getValidPermit = useCallback(async (
        params: EIP712Permit | SignPermitParams,
        options?: GetValidPermitOptions
    ): Promise<EIP712Permit> => {
        setError(null);
        setIsLoading(true);

        try {
            if (isEIP712Permit(params) && !isExpired(params)) {
                return params;
            }
            const signPermitParams = parseSignPermitParams(params, options);
            if (!signPermitParams) {
                if (isEIP712Permit(params)) {
                    return params;
                }
                throw new Error('Unexpected error: failed to parse permit params');
            }

            const { label, spender } = signPermitParams;
            const currentPermit = getCurrentEip712Permit(label, spender);
            if (currentPermit) {
                return currentPermit;
            }

            const newPermit = await signAndSavePermit(signPermitParams);
            return newPermit;

        } catch (err) {
            const error = err instanceof Error 
                ? err 
                : new Error('Failed to get valid permit');
            console.error('[useEIP712Permit] Error:', error);
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [
        address,
        chainId,
        isExpired,
        parseSignPermitParams,
        getEip712Permit,
        signAndSavePermit
    ]);

    return {
        getValidPermit,
        isExpired,
        signAndSavePermit,
        getCurrentEip712Permit,
        isLoading: isLoading || isSigningLoading,
        error: error || signError
    };
};