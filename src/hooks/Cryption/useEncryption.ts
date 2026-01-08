import { useState } from "react";
import { CryptionDataBytesType, EncryptionService } from "@dapp/services/cryption";


export const useEncryption = () => {
    const [dataList, setDataList] = useState<CryptionDataBytesType[] | null>(null);
    const [data, setData] = useState<CryptionDataBytesType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const encrypt = async (
        publicKey: string,
        privateKey: string,
        data: string,
    ): Promise<CryptionDataBytesType | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await EncryptionService.encrypt(publicKey, privateKey, data);
            if (result.success && result.data) {
                setData(result.data);
                return result.data;
            } else {
                const errorMsg = result.error || 'Encryption failed';
                setError(errorMsg);
                console.error('Encryption error:', errorMsg);
                return null;
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown encryption error';
            setError(errorMsg);
            console.error('useEncryption error:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }


    const encryptList = async (
        publicKey: string,
        privateKey: string,
        datas: string[],
    ): Promise<CryptionDataBytesType[] | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const results = await EncryptionService.encryptList(
                publicKey,
                privateKey,
                datas
            );
            if (results.success && results.data) {
                setDataList(results.data);
                return results.data;
            } else {
                const errorMsg = results.error || 'Encryption failed';
                setError(errorMsg);
                console.error('Encryption error:', errorMsg);
                return null;
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown encryption error';
            setError(errorMsg);
            console.error('useEncryption error:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { encrypt, encryptList, data, dataList, error, isLoading };
};