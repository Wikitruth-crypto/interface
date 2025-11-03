import { CryptoUtils } from './cryptoUtils';
import { CryptionDataBytesType } from './cryptoUtils';

/**
 * 解密服务结果接口
 */
export interface DecryptionResult {
    success: boolean;
    data?: string;
    error?: string;
}

export interface DecryptionResultList {
    success: boolean;
    data?: string[];
    error?: string;
}

/**
 * 解密服务
 * 提供数据解密功能，不依赖 React hooks
 */
export class DecryptionService {

    /**
     * 仅解密文件 CID
     * @param publicKey - 公钥（bytes 格式）
     * @param privateKey - 私钥（bytes 格式）
     * @param data_iv - 数据 IV
     * @param data_encryption - 加密的数据
     * @returns 解密后的文件 CID
     */
    static async decrypt(
        publicKey: string,
        privateKey: string,
        iv_bytes: string,
        encrypted_bytes: string,
    ): Promise<DecryptionResult> {
        if (!publicKey || !privateKey || !iv_bytes || !encrypted_bytes) {
            return {
                success: false,
                error: 'Missing required parameters'
            };
        }

        try {
            const sharedKey = await CryptoUtils.generateSharedKey(publicKey, privateKey);

            if (!sharedKey) {
                return {
                    success: false,
                    error: 'Failed to generate shared key'
                };
            }

            const data = await CryptoUtils.decryptBase(iv_bytes, encrypted_bytes, sharedKey);

            return {
                success: true,
                data: data
            };

        } catch (error) {
            console.error('Decryption error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown decryption error'
            };
        }
    }


    /*
     * 解密多个数据
     * @param publicKey - 公钥（bytes 格式）
     * @param privateKey - 私钥（bytes 格式）
     * @param cryptionDatas - 加密的数据
     * @returns 解密后的数据
     */
    static async decryptList(
        publicKey: string,
        privateKey: string,
        cryptionDatas: CryptionDataBytesType[],
    ): Promise<DecryptionResultList> {
        if (!publicKey || !privateKey || !cryptionDatas) {
            return {
                success: false,
                error: 'Missing required parameters'
            };
        }

        try {

            let result: string[] = [];
            for (const data of cryptionDatas) {
                const results = await this.decrypt(publicKey, privateKey, data.iv_bytes, data.encrypted_bytes);
                if (results.success && results.data) {
                    result.push(results.data);
                } else {
                    const errorMsg = results.error || 'Decryption failed';
                    console.error('Decryption error:', errorMsg);
                    return {
                        success: false,
                        error: errorMsg
                    }
                }
            }
            return {
                success: true,
                data: result
            };
        } catch (error) {
            console.error('Decryption error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown decryption error'
            };
        }
    }
}

