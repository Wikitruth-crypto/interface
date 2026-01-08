import { CryptoUtils } from './cryptoUtils';
import { CryptionDataBytesType } from './cryptoUtils';

/**
 * Decryption Service Result Interface
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
 * Decryption Service
 * Provides data decryption functionality, independent of React hooks
 */
export class DecryptionService {

    /**
     * Decrypt file CID only
     * @param publicKey - Public key (bytes format)
     * @param privateKey - Private key (bytes format)
     * @param data_iv - Data IV
     * @param data_encryption - Encrypted data
     * @returns Decrypted file CID
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
     * Decrypt multiple data
     * @param publicKey - Public key (bytes format)
     * @param privateKey - Private key (bytes format)
     * @param cryptionDatas - Encrypted data
     * @returns Decrypted data
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

