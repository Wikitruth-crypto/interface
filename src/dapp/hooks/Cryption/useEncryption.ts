import { useState } from "react";
import { CryptionDataBytesType, EncryptionService } from "@/dapp/services/cryption";

/**
 * 加密 Hook（基于 Service 层实现）
 * 
 * 职责：为 React 组件提供加密功能的 Hook 封装
 * 
 * @特点
 * - 基于 EncryptionService 实现
 * - 管理加密状态（data, error, isLoading）
 * - 保持原有的 API 接口不变
 * 
 * @使用示例
 * ```typescript
 * const { encryption, data, error, isLoading } = useEncryption();
 * 
 * const handleEncrypt = async () => {
 *   const result = await encryption(publicKey, privateKey, fileCid, password);
 *   if (result) {
 *     console.log('加密成功:', result);
 *   }
 * };
 * ```
 */
export const useEncryption = () => {
    const [dataList, setDataList] = useState<CryptionDataBytesType[] | null>(null);
    const [data, setData] = useState<CryptionDataBytesType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * 加密单个数据
     * 
     * @param publicKey - 公钥（bytes 格式）
     * @param privateKey - 私钥（bytes 格式）
     * @param data - 数据
     * @returns 加密后的数据，失败返回 null
     */
    const encrypt = async (
        publicKey: string,
        privateKey: string,
        data: string,
    ): Promise<CryptionDataBytesType | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await EncryptionService.encrypt(publicKey, privateKey, data);
            if (result.success && result.data) {
                setData(result.data);
                return result.data;
            } else {
                const errorMsg = result.error || 'Encryption failed';
                setError(errorMsg);
                console.error('Encryption error:', errorMsg);
                return null;
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown encryption error';
            setError(errorMsg);
            console.error('useEncryption error:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    /**
     * 加密文件 CID 和密码
     * 
     * @param publicKey - 公钥（bytes 格式）
     * @param privateKey - 私钥（bytes 格式）
     * @param fileCid - 文件 CID
     * @param password - 密码
     * @returns 加密后的数据，失败返回 null
     */
    const encryptList = async (
        publicKey: string,
        privateKey: string,
        datas: string[],
    ): Promise<CryptionDataBytesType[] | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const results = await EncryptionService.encryptList(
                publicKey,
                privateKey,
                datas
            );
            if (results.success && results.data) {
                setDataList(results.data);
                return results.data;
            } else {
                const errorMsg = results.error || 'Encryption failed';
                setError(errorMsg);
                console.error('Encryption error:', errorMsg);
                return null;
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown encryption error';
            setError(errorMsg);
            console.error('useEncryption error:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { encrypt, encryptList, data, dataList, error, isLoading };
};