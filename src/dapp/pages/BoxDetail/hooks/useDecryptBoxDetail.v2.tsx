import { useState } from "react";
import { useMetadataStore } from "@/dapp/event_sapphire/useMetadataStore";
import { CryptionDataBytesType, DecryptionService } from "@/dapp/services/cryption";
import { useBoxDetailStore } from "../store/boxDetailStore";

/**
 * 解密结果类型
 * 包含文件 CID 和密码
 */
export type DecryptResult = {
    fileCid: string;
    password: string;
};

/**
 * 解密参数类型
 */
export interface DecryptDataType {
    publicKey: string;
    cryptionDatas: CryptionDataBytesType[];
}

/**
 * BoxDetail 解密 Hook（V2 版本 - 使用新的 Service API）
 * 
 * 功能：解密 Box 中的加密数据（fileCid 和 password）
 * 
 * @改进点：
 * - 使用新的 DecryptionService.decryptList 方法
 * - 支持批量解密多个数据
 * - 更好的错误处理和类型安全
 * - 适配新的 CryptionDataBytesType 类型
 * 
 * @使用示例：
 * ```typescript
 * const { decrypt_boxDetail, data, isLoading, error } = useDecryptBoxDetail();
 * 
 * // 解密 Box 数据
 * const result = await decrypt_boxDetail(privateKey, {
 *   publicKey: '0x...',
 *   cryptionDatas: [
 *     { iv_bytes: '0x...', encrypted_bytes: '0x...' },  // fileCid
 *     { iv_bytes: '0x...', encrypted_bytes: '0x...' },  // password
 *   ]
 * });
 * ```
 */
export const useDecryptBoxDetail = () => {
    const tokenId = useBoxDetailStore(state => state.tokenId);
    const [data, setData] = useState<DecryptResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const metadataBox = useMetadataStore(state => state.getBoxMetadata(tokenId));

    /**
     * 解密 Box 详情数据
     * 
     * @param privateKey - 私钥（bytes 格式）
     * @param params - 可选参数，包含 publicKey 和 cryptionDatas
     * @returns 解密结果 { fileCid, password }
     * 
     * @说明：
     * - cryptionDatas 应该包含 2 个元素：[fileCid 加密数据, password 加密数据]
     * - 如果不传 params，会从 metadataBox 中获取
     */
    const decrypt_boxDetail = async (
        privateKey: string,
        params?: DecryptDataType,
    ): Promise<DecryptResult> => {
        setIsLoading(true);
        setError(null);

        try {
            // 获取公钥和加密数据
            const publicKey = params?.publicKey || metadataBox?.publicKey || '';
            
            // 转换加密数据格式
            // 从旧格式 EncryptionDataType[] 转换为新格式 CryptionDataBytesType[]
            let cryptionDatas: CryptionDataBytesType[];
            
            if (params?.cryptionDatas) {
                // 如果提供了新格式，直接使用
                cryptionDatas = params.cryptionDatas;
            } else if (metadataBox?.encryptionDatas && metadataBox.encryptionDatas[0]) {
                // 从旧格式转换：将 fileCID 和 password 分别提取
                const encData = metadataBox.encryptionDatas[0];
                cryptionDatas = [
                    { iv_bytes: encData.fileCID_iv, encrypted_bytes: encData.fileCID_encryption },
                    { iv_bytes: encData.password_iv, encrypted_bytes: encData.password_encryption }
                ];
            } else {
                cryptionDatas = [];
            }

            // 参数验证
            if (!publicKey || !privateKey) {
                throw new Error('Missing required parameters: publicKey or privateKey is empty');
            }

            if (!cryptionDatas || cryptionDatas.length < 2) {
                throw new Error('Missing required data: cryptionDatas should contain at least 2 items (fileCid and password)');
            }

            // 使用 DecryptionService.decryptList 批量解密
            const decryptResult = await DecryptionService.decryptList(
                publicKey,
                privateKey,
                cryptionDatas
            );

            if (!decryptResult.success || !decryptResult.data) {
                throw new Error(decryptResult.error || 'Decryption failed');
            }

            // 解密结果应该是 [fileCid, password]
            const [fileCid, password] = decryptResult.data;

            if (!fileCid || !password) {
                throw new Error('Decryption result is incomplete: missing fileCid or password');
            }

            const result: DecryptResult = {
                fileCid,
                password
            };

            setData(result);
            return result;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown decryption error';
            console.error('useDecryptBoxDetail error:', errorMessage);
            setError(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        decrypt_boxDetail,
        data,
        isLoading,
        error
    };
};

