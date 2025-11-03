import { useState } from "react";
import { DecryptionResult, DecryptionService } from "@/dapp/services/cryption";
import { CryptionDataBytesType } from "@/dapp/services/cryption";

/**
 * 解密 Hook（基于 Service 层实现）
 * 
 * 职责：为 React 组件提供解密功能的 Hook 封装
 * 
 * @特点
 * - 基于 DecryptionService 实现
 * - 管理解密状态（data, error, isLoading）
 * - 保持原有的 API 接口不变
 * 
 * @使用示例
 * ```typescript
 * const { decryption, data, error, isLoading } = useDecryption();
 * 
 * const handleDecrypt = async () => {
 *   const results = await decryption(publicKey, privateKey, cryptionDatas);
 *   if (results) {
 *     console.log('解密成功:', results.data);
 *   } else {
 *     console.error('解密失败:', results.error);
 *     return null;
 *   }
 * };
 * ```
 */

export const useDecryption = () => {
    const [data, setData] = useState<string | null>(null);
    const [dataList, setDataList] = useState<string[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const decrypt = async (
        publicKey: string,
        privateKey: string,
        iv_bytes: string,
        encrypted_bytes: string,
    ): Promise<string | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await DecryptionService.decrypt(publicKey, privateKey, iv_bytes, encrypted_bytes);
            if (result.success && result.data) {
                setData(result.data);
                return result.data;
            } else {
                const errorMsg = result.error || 'Decryption failed';
                setError(errorMsg);
                console.error('Decryption error:', errorMsg);
                return null;
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown decryption error';
            setError(errorMsg);
            console.error('useDecryption error:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * 解密文件 CID 和密码
     * 
     * @param publicKey - 公钥（bytes 格式）
     * @param privateKey - 私钥（bytes 格式）
     * @param cryptionDatas - 加密的数据列表
     * @returns 解密后的数据，失败返回 null
     */
    const decryptList = async (
        publicKey: string,
        privateKey: string,
        cryptionDatas: CryptionDataBytesType[],
    ): Promise<string[] | null> => {
        setIsLoading(true);
        setError(null);

        try {

            const results = await DecryptionService.decryptList(publicKey, privateKey, cryptionDatas);

            if (results.success && results.data) {
                setDataList(results.data);
                return results.data;
            } else {
                const errorMsg = results.error || 'Decryption failed';
                setError(errorMsg);
                console.error('Decryption error:', errorMsg);
                return null;
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown decryption error';
            setError(errorMsg);
            console.error('useDecryption error:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { decrypt, decryptList, data, dataList, error, isLoading };
};