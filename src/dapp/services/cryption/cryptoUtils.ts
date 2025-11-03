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
 * 加密工具类
 * 提供加密、解密、密钥生成等核心功能
 * 这是一个纯函数实现，不依赖 React
 */
export class CryptoUtils {
    
    /**
     * 将 CryptoKey 转换为 Base64 字符串
     */
    private static async cryptoKeyToBase64(cryptoKey: CryptoKey): Promise<string> {
        const rawKey = await window.crypto.subtle.exportKey('raw', cryptoKey);
        const binaryString = String.fromCharCode(...new Uint8Array(rawKey));
        return btoa(binaryString);
    }

    /**
     * 将 Base64 字符串转换为 CryptoKey
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
     * 将 ArrayBuffer 转换为 Base64
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
     * 将 Base64 转换为 ArrayBuffer
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
     * 将 ECDH CryptoKey 转换为 Base64 (支持公钥和私钥)
     */
    private static async cryptoKeyToBase64_ECDH(cryptoKey: CryptoKey, isPublic: boolean): Promise<string> {
        const format = isPublic ? 'spki' : 'pkcs8';
        const rawKey = await window.crypto.subtle.exportKey(format, cryptoKey);
        return this.arrayBufferToBase64(rawKey);
    }
    
    /**
     * 将 Base64 转换为 ECDH CryptoKey (支持公钥和私钥)
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
     * 生成 ECDH 密钥对
     * @returns 返回公钥和私钥（以 bytes 格式）
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
     * 生成共享密钥
     * @param publicKey_bytes - 对方的公钥（bytes 格式）
     * @param privateKey_bytes - 自己的私钥（bytes 格式）
     * @returns 共享密钥（bytes 格式）
     */
    static async generateSharedKey(publicKey_bytes: string, privateKey_bytes: string): Promise<string> {
        const public_Key = EthereumBytesToBase64(publicKey_bytes);
        const private_Key = EthereumBytesToBase64(privateKey_bytes);
        
        const publicKey = await this.base64ToCryptoKey_ECDH(public_Key, true);
        const privateKey = await this.base64ToCryptoKey_ECDH(private_Key, false);

        // 使用自己的私钥和对方的公钥生成共享密钥
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
     * 加密数据
     * @param data - 要加密的数据
     * @param shareKey_bytes - 共享密钥（bytes 格式）
     * @returns 加密后的 IV 和密文（bytes 格式）
     */
    static async encryptBase(data: string, shareKey_bytes: string): Promise<CryptionDataBytesType> {
        const Key = EthereumBytesToBase64(shareKey_bytes);
        const sharedKey = await this.base64ToCryptoKey(Key);

        // 生成随机 IV
        const iv_uint8 = window.crypto.getRandomValues(new Uint8Array(12));

        // 使用共享密钥加密数据
        const encodedData = new TextEncoder().encode(data);
        const encryptedData_array = await window.crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv_uint8,
            },
            sharedKey,
            encodedData
        );

        // 转换为 Base64
        const iv_base64 = this.arrayBufferToBase64(iv_uint8.buffer);
        const encrypted_base64 = this.arrayBufferToBase64(encryptedData_array);

        // 转换为 bytes
        const iv_bytes = Base64ToEthereumBytes(iv_base64);
        const encrypted_bytes = Base64ToEthereumBytes(encrypted_base64);

        // console.log('Encrypted iv_bytes:', iv_bytes);
        // console.log('Encrypted data_bytes:', encrypted_bytes);
        
        return { iv_bytes, encrypted_bytes };
    }

    /**
     * 解密数据
     * @param iv_bytes - 初始化向量（bytes 格式）
     * @param encrypted_bytes - 加密的数据（bytes 格式）
     * @param shareKey_bytes - 共享密钥（bytes 格式）
     * @returns 解密后的原始数据
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

