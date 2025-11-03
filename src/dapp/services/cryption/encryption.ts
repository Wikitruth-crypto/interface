import { CryptoUtils } from './cryptoUtils';

/**
 * 加密服务结果接口
 */
export interface EncryptionResult {
    success: boolean;
    data?: {
        iv_bytes: string;
        encrypted_bytes: string;
    }
    error?: string;
}

export interface EncryptionResultList {
    success: boolean;
    data?: {
        iv_bytes: string;
        encrypted_bytes: string;
    }[];
    error?: string;
}

/**
 * 加密服务
 * 提供数据加密功能，不依赖 React hooks
 */
export class EncryptionService {
    
    /**
     * 加密文件 CID 和密码
     * @param publicKey - 公钥（bytes 格式）
     * @param privateKey - 私钥（bytes 格式）
     * @param data - 数据
     * @returns 加密结果，包含加密后的数据或错误信息
     */
    static async encrypt(
        publicKey: string,
        privateKey: string,
        data: string,
    ): Promise<EncryptionResult> {
        // 参数验证
        if (!publicKey || !privateKey || !data) {
            return {
                success: false,
                error: 'Missing required parameters: publicKey, privateKey, fileCid, or password is empty'
            };
        }

        try {
            // 生成共享密钥
            const sharedKey = await CryptoUtils.generateSharedKey(publicKey, privateKey);

            if (!sharedKey) {
                return {
                    success: false,
                    error: 'Failed to generate shared key'
                };
            }

            // 加密文件 CID
            const { iv_bytes: data_iv, encrypted_bytes: data_encryption } = 
                await CryptoUtils.encryptBase(data, sharedKey);
            

            // 验证加密结果（通过解密验证）
            const data_decrypted = await CryptoUtils.decryptBase(data_iv, data_encryption, sharedKey);

            // 验证解密后的数据是否与原数据一致
            if (data === data_decrypted) {
                return {
                    success: true,
                    data: { iv_bytes: data_iv, encrypted_bytes: data_encryption }
                };
            } else {
                console.error('Encryption verification failed: decrypted data does not match original data');
                return {
                    success: false,
                    error: 'Encryption verification failed'
                };
            }

        } catch (error) {
            console.error('Encryption error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown encryption error'
            };
        }
    }


    /*
     * 加密多个数据
     * @param publicKey - 公钥（bytes 格式）
     * @param privateKey - 私钥（bytes 格式）
     * @param datas - 数据
     * @returns 加密后的数据
     */
    static async encryptList(
        publicKey: string,
        privateKey: string,
        datas: string[],
    ): Promise<EncryptionResultList> {
        if (!publicKey || !privateKey || !datas) {
            return {
                success: false,
                error: 'Missing required parameters'
            };
        }
        try {
            let result: {
                iv_bytes: string;
                encrypted_bytes: string;
            }[] = [];
            for (const data of datas) {
                const results = await this.encrypt(publicKey, privateKey, data);
                if (results.success && results.data) {
                    result.push(results.data);
                } else {
                    const errorMsg = results.error || 'Encryption failed';
                    console.error('Encryption error:', errorMsg);
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
            console.error('Encryption error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown encryption error'
            };
        }
    }
}

