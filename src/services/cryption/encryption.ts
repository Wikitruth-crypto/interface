import { CryptoUtils } from './cryptoUtils';

/**
 * Encryption Service Result Interface
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
 * Encryption Service
 * Provides data encryption functionality, independent of React hooks
 */
export class EncryptionService {
    
    /**
     * Encrypt file CID and password
     * @param publicKey - Public key (bytes format)
     * @param privateKey - Private key (bytes format)
     * @param data - Data
     * @returns Encryption result, containing encrypted data or error info
     */
    static async encrypt(
        publicKey: string,
        privateKey: string,
        data: string,
    ): Promise<EncryptionResult> {
        // Parameter validation
        if (!publicKey || !privateKey || !data) {
            return {
                success: false,
                error: 'Missing required parameters: publicKey, privateKey, fileCid, or password is empty'
            };
        }

        try {
            // Generate shared key
            const sharedKey = await CryptoUtils.generateSharedKey(publicKey, privateKey);

            if (!sharedKey) {
                return {
                    success: false,
                    error: 'Failed to generate shared key'
                };
            }

            // Encrypt file CID
            const { iv_bytes: data_iv, encrypted_bytes: data_encryption } = 
                await CryptoUtils.encryptBase(data, sharedKey);
            

            // Verify encryption result (verify via decryption)
            const data_decrypted = await CryptoUtils.decryptBase(data_iv, data_encryption, sharedKey);

            // Verify if decrypted data matches original data
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
     * Encrypt multiple data
     * @param publicKey - Public key (bytes format)
     * @param privateKey - Private key (bytes format)
     * @param datas - Data
     * @returns Encrypted data
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

