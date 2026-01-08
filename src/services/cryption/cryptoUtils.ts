import { Base64ToEthereumBytes, EthereumBytesToBase64 } from "./bytes_base64";

export interface KeyType { 
    privateKey_bytes: string;
    publicKey_bytes: string;
}

export interface CryptionDataBytesType { 
    iv_bytes: string;
    encrypted_bytes: string;
}

/**
 * Encryption tool class
 * Provides core functions such as encryption, decryption, key generation, etc.
 * This is a pure function implementation, does not depend on React
 */
export class CryptoUtils {
    
    /**
     * Convert CryptoKey to Base64 string
     */
    private static async cryptoKeyToBase64(cryptoKey: CryptoKey): Promise<string> {
        const rawKey = await window.crypto.subtle.exportKey('raw', cryptoKey);
        const binaryString = String.fromCharCode(...new Uint8Array(rawKey));
        return btoa(binaryString);
    }

    /**
     * Convert Base64 string to CryptoKey
     */
    private static async base64ToCryptoKey(
        base64Str: string,
        algorithm: { name: 'AES-GCM' } = { name: 'AES-GCM' }
    ): Promise<CryptoKey> {
        const binaryString = atob(base64Str);
        const rawKey = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
            rawKey[i] = binaryString.charCodeAt(i);
        }

        return await window.crypto.subtle.importKey('raw', rawKey, algorithm, true, ['encrypt', 'decrypt']);
    }
    
    /**
     * Convert ArrayBuffer to Base64
     */
    private static arrayBufferToBase64(buffer: ArrayBuffer): string {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    /**
     * Convert Base64 to ArrayBuffer
     */
    private static base64ToArrayBuffer(base64: string): ArrayBuffer {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    /**
     * Convert ECDH CryptoKey to Base64 (supports public and private keys)
     */
    private static async cryptoKeyToBase64_ECDH(cryptoKey: CryptoKey, isPublic: boolean): Promise<string> {
        const format = isPublic ? 'spki' : 'pkcs8';
        const rawKey = await window.crypto.subtle.exportKey(format, cryptoKey);
        return this.arrayBufferToBase64(rawKey);
    }
    
    /**
     * Convert Base64 to ECDH CryptoKey (supports public and private keys)
     */
    private static async base64ToCryptoKey_ECDH(
        base64Str: string,
        isPublic: boolean
    ): Promise<CryptoKey> {
        const keyData = this.base64ToArrayBuffer(base64Str);
        const format = isPublic ? 'spki' : 'pkcs8';
        const algorithm = { name: 'ECDH', namedCurve: 'P-256' };
        const extractable = true;
        const keyUsages = isPublic ? [] : ['deriveKey'];
    
        return await window.crypto.subtle.importKey(
            format,
            keyData,
            algorithm,
            extractable,
            keyUsages as KeyUsage[]
        );
    }

    /**
     * Generate ECDH key pair
     * @returns Returns public and private keys (in bytes format)
     */
    static async generateKeyPair(): Promise<KeyType> {
        const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
            {
                name: 'ECDH',
                namedCurve: 'P-256', 
            },
            true,
            ['deriveKey']
        );

        const privateKey_base64 = await this.cryptoKeyToBase64_ECDH(privateKey, false);
        const publicKey_base64 = await this.cryptoKeyToBase64_ECDH(publicKey, true);

        const privateKey_bytes = Base64ToEthereumBytes(privateKey_base64);
        const publicKey_bytes = Base64ToEthereumBytes(publicKey_base64);
        
        // console.log('Generated publicKey:', publicKey_bytes);
        // console.log('Generated privateKey:', privateKey_bytes);

        return { privateKey_bytes, publicKey_bytes };
    }

    /**
     * Generate shared key
     * @param publicKey_bytes - Public key of the other party (in bytes format)
     * @param privateKey_bytes - Private key of yourself (in bytes format)
     * @returns Shared key (in bytes format)
     */
    static async generateSharedKey(publicKey_bytes: string, privateKey_bytes: string): Promise<string> {
        const public_Key = EthereumBytesToBase64(publicKey_bytes);
        const private_Key = EthereumBytesToBase64(privateKey_bytes);
        
        const publicKey = await this.base64ToCryptoKey_ECDH(public_Key, true);
        const privateKey = await this.base64ToCryptoKey_ECDH(private_Key, false);

            // Use your private key and the other party's public key to generate a shared key
        const sharedKey = await window.crypto.subtle.deriveKey(
            {
                name: 'ECDH',
                public: publicKey as CryptoKey,
            },
            privateKey as CryptoKey,
            { name: 'AES-GCM', length: 256 },
            true, 
            ['encrypt', 'decrypt'] 
        );

        const key_base64 = await this.cryptoKeyToBase64(sharedKey);
        const key_bytes = Base64ToEthereumBytes(key_base64);
        
        // console.log('Generated shareKey_bytes:', key_bytes);
        return key_bytes;
    }

    /**
     * Encrypt data
     * @param data - Data to encrypt
     * @param shareKey_bytes - Shared key (in bytes format)
     * @returns Encrypted IV and ciphertext (in bytes format)
     */
    static async encryptBase(data: string, shareKey_bytes: string): Promise<CryptionDataBytesType> {
        const Key = EthereumBytesToBase64(shareKey_bytes);
        const sharedKey = await this.base64ToCryptoKey(Key);

        // Generate random IV
        const iv_uint8 = window.crypto.getRandomValues(new Uint8Array(12));

        // Use shared key to encrypt data
        const encodedData = new TextEncoder().encode(data);
        const encryptedData_array = await window.crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv_uint8,
            },
            sharedKey,
            encodedData
        );

        // Convert to Base64
        const iv_base64 = this.arrayBufferToBase64(iv_uint8.buffer);
        const encrypted_base64 = this.arrayBufferToBase64(encryptedData_array);

        const iv_bytes = Base64ToEthereumBytes(iv_base64);
        const encrypted_bytes = Base64ToEthereumBytes(encrypted_base64);

        // console.log('Encrypted iv_bytes:', iv_bytes);
        // console.log('Encrypted data_bytes:', encrypted_bytes);
        
        return { iv_bytes, encrypted_bytes };
    }

    /**
     * Decrypt data
     * @param iv_bytes - Initialization vector (in bytes format)
     * @param encrypted_bytes - Encrypted data (in bytes format)
     * @param shareKey_bytes - Shared key (in bytes format)
     * @returns Decrypted original data
     */
    static async decryptBase(iv_bytes: string, encrypted_bytes: string, shareKey_bytes: string): Promise<string> {
        const iv_base64 = EthereumBytesToBase64(iv_bytes);
        const encrypted_base64 = EthereumBytesToBase64(encrypted_bytes);
        const shareKey_base64 = EthereumBytesToBase64(shareKey_bytes);

        const ivArray = this.base64ToArrayBuffer(iv_base64);
        const encryptedArray = this.base64ToArrayBuffer(encrypted_base64);
        const key = await this.base64ToCryptoKey(shareKey_base64);

        if (!key) {
            throw new Error('shareKey is null');
        }

        const decryptedData = await window.crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: ivArray,
            },
            key,
            encryptedArray
        );

        const decodedData = new TextDecoder().decode(decryptedData);
        // console.log('Decrypted data:', decodedData);
        
        return decodedData;
    }
}

