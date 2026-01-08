import { useState } from "react";
import { CryptoUtils } from "@dapp/services/cryption";


export const useGetKeyPair = () => {
    const [keyPair, setKeyPair] = useState<{
        publicKey_bytes: string;
        privateKey_bytes: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Generate key pair
     * 
     * @returns Generated key pair, return null if failed
     */
    const generateKeyPair = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Call Service layer to generate key pair
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

