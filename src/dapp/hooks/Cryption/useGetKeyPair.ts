import { useState } from "react";
import { CryptoUtils } from "@/dapp/services/cryption";

/**
 * 密钥对生成 Hook（基于 Service 层实现）
 * 
 * 职责：为 React 组件提供密钥对生成功能的 Hook 封装
 * 
 * @特点
 * - 基于 CryptoUtils 实现
 * - 管理密钥对状态（keyPair, error, isLoading）
 * - 自动生成或手动触发生成
 * 
 * @使用示例
 * ```typescript
 * const { generateKeyPair, keyPair, error, isLoading } = useGetKeyPair();
 * 
 * // 手动生成密钥对
 * const handleGenerate = async () => {
 *   const newKeyPair = await generateKeyPair();
 *   if (newKeyPair) {
 *     console.log('公钥:', newKeyPair.publicKey_bytes);
 *     console.log('私钥:', newKeyPair.privateKey_bytes);
 *   }
 * };
 * ```
 */
export const useGetKeyPair = () => {
    const [keyPair, setKeyPair] = useState<{
        publicKey_bytes: string;
        privateKey_bytes: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * 生成密钥对
     * 
     * @returns 生成的密钥对，失败返回 null
     */
    const generateKeyPair = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // 调用 Service 层生成密钥对
            const newKeyPair = await CryptoUtils.generateKeyPair();
            setKeyPair(newKeyPair);
            return newKeyPair;
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Failed to generate key pair';
            setError(errorMsg);
            console.error('useGetKeyPair error:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { generateKeyPair, keyPair, error, isLoading };
};

