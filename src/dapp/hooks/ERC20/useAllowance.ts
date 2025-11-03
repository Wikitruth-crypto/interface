import { useState } from 'react';
import { useAllowanceBase, AllowanceERC20Params, AllowanceERC20SecretParams, AllowanceCheckResult } from './useAllowanceBase';
import { useSupportedTokens } from '@/dapp/contractsConfig';
import { EIP712Permit, useEIP712_ERC20secret, PermitType } from '@/dapp/hooks/EIP712';
import { useAccountStore } from '@/dapp/store/accountStore';
import { TokenMetadata } from '@/dapp/contractsConfig';

/**
 * 高级授权检查 Hook
 * 
 * 功能：
 * 1. 自动识别代币类型（ERC20 / Secret）
 * 2. 自动生成对应的查询参数
 * 3. 对于 Secret 代币，自动处理 EIP712 签名
 * 4. 提供签名缓存机制
 */
export const useAllowance = () => {
    const [isLoading, setIsLoading] = useState(false);

    // ==================== 依赖项 ====================
    const { checkAllowanceBase } = useAllowanceBase();
    const supportedTokens = useSupportedTokens();
    
    // ⚠️ Hook 必须在顶层调用，不能在条件语句中
    const { signPermit } = useEIP712_ERC20secret();
    const { getEip712Permit, setEip712Permit } = useAccountStore();

    /**
     * 检查代币授权额度
     * 
     * @param tokenAddress - 代币合约地址
     * @param owner - 授权所有者地址
     * @param spender - 被授权者地址（通常是合约地址）
     * @param amount - 需要检查的金额
     * @returns 授权检查结果
     * 
     * @example
     * // 检查 ERC20 代币授权
     * const result = await checkAllowance(wtcAddress, userAddress, fundManagerAddress, 1000);
     * 
     * @example
     * // 检查 Secret 代币授权（自动处理签名）
     * const result = await checkAllowance(wroseSecretAddress, userAddress, fundManagerAddress, 500);
     */
    const checkAllowance = async (
        tokenAddress: string,
        owner: string,
        spender: string,
        amount: number | string | bigint
    ): Promise<AllowanceCheckResult> => {
        setIsLoading(true);

        try {
            // ==================== 1. 获取代币配置 ====================
            const tokenConfig = supportedTokens.find(
                (token: TokenMetadata) => token.address.toLowerCase() === tokenAddress.toLowerCase()
            );

            if (!tokenConfig) {
                console.error(`Token not found: ${tokenAddress}`);
                return { isEnough: false, allowanceAmount: 0 };
            }

            // ==================== 2. 根据代币类型生成参数 ====================
            let params: AllowanceERC20Params | AllowanceERC20SecretParams;

            if (tokenConfig.types === 'ERC20') {
                // 标准 ERC20 代币
                params = {
                    type: 'ERC20',
                    amount: amount,
                    owner: owner as `0x${string}`,
                    spender: spender as `0x${string}`,
                };

            } else if (tokenConfig.types === 'Secret') {
                // 隐私 ERC20 代币 - 需要 EIP712 签名
                let eip712Permit = getEip712Permit(PermitType.VIEW);

                // 检查是否需要生成新签名
                if (!eip712Permit || isPermitExpired(eip712Permit)) {
                    console.log('[Secret] Generating new EIP712 permit...');

                    try {
                        // 生成新的 EIP712 签名
                        const permit = await signPermit({
                            spender: spender as `0x${string}`,
                            amount: amount,
                            mode: PermitType.VIEW,
                            contractAddress: tokenAddress, // 必须提供合约地址
                        });

                        eip712Permit = permit as EIP712Permit;

                        // 缓存签名到状态管理中
                        setEip712Permit(PermitType.VIEW, eip712Permit);
                        console.log('[Secret] EIP712 permit generated and cached');

                    } catch (signError) {
                        console.error('[Secret] Failed to generate EIP712 permit:', signError);
                        setIsLoading(false);
                        return { isEnough: false, allowanceAmount: 0 };
                    }
                } else {
                    console.log('[Secret] Using cached EIP712 permit');
                }

                params = {
                    type: 'Secret',
                    amount: amount,
                    eip712Permit: eip712Permit,
                };

            } else {
                console.error(`Unsupported token type: ${tokenConfig.types}`);
                setIsLoading(false);
                return { isEnough: false, allowanceAmount: 0 };
            }

            // ==================== 3. 调用基础检查函数 ====================
            const result = await checkAllowanceBase(tokenConfig, params);

            setIsLoading(false);
            return result;

        } catch (error) {
            console.error('[checkAllowance] Error:', error);
            setIsLoading(false);
            return { isEnough: false, allowanceAmount: 0 };
        }
    };

    return {
        checkAllowance,
        isLoading,
    };
};

/**
 * 检查 EIP712 Permit 是否过期
 * @param permit - EIP712 许可证
 * @returns 是否过期
 */
function isPermitExpired(permit: EIP712Permit): boolean {
    if (!permit.deadline) return true;
    
    const now = Math.floor(Date.now() / 1000); // 当前时间戳（秒）
    const isExpired = now >= permit.deadline;
    
    if (isExpired) {
        console.log(`[EIP712] Permit expired. Deadline: ${permit.deadline}, Now: ${now}`);
    }
    
    return isExpired;
}
