import { useState } from "react";
import { DecryptionResult, DecryptionService } from "@dapp/services/cryption";
import { CryptionDataBytesType } from "@dapp/services/cryption";


export const useDecryption = () => {
    const [data, setData] = useState<string | null>(null);
    const [dataList, setDataList] = useState<string[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const decrypt = async (
        publicKey: string,
        privateKey: string,
        iv_bytes: string,
        encrypted_bytes: string,
    ): Promise<string | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await DecryptionService.decrypt(publicKey, privateKey, iv_bytes, encrypted_bytes);
            if (result.success && result.data) {
                setData(result.data);
                return result.data;
            } else {
                const errorMsg = result.error || 'Decryption failed';
                setError(errorMsg);
                console.error('Decryption error:', errorMsg);
                return null;
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown decryption error';
            setError(errorMsg);
            console.error('useDecryption error:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };


    const decryptList = async (
        publicKey: string,
        privateKey: string,
        cryptionDatas: CryptionDataBytesType[],
    ): Promise<string[] | null> => {
        setIsLoading(true);
        setError(null);

        try {

            const results = await DecryptionService.decryptList(publicKey, privateKey, cryptionDatas);

            if (results.success && results.data) {
                setDataList(results.data);
                return results.data;
            } else {
                const errorMsg = results.error || 'Decryption failed';
                setError(errorMsg);
                console.error('Decryption error:', errorMsg);
                return null;
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown decryption error';
            setError(errorMsg);
            console.error('useDecryption error:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { decrypt, decryptList, data, dataList, error, isLoading };
};