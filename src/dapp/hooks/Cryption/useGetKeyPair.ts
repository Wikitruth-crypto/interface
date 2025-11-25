import { useState } from "react";
import { CryptoUtils } from "@/dapp/services/cryption";


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

