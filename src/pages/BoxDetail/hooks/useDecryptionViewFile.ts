import { useState } from "react"
import { useDecryption } from "@dapp/hooks/Cryption/useDecryption";
import { MetadataBoxType } from "@dapp/types/typesDapp/metadata/metadataBox";

export type ViewFileResult = {
    fileCIDList: string[];
    password: string;
    slicesMetadataCID: string;
};

const useDecryptionViewFile = () => {

    const [data, setData] = useState<ViewFileResult | null>(null);

    const { decryptList, decrypt } = useDecryption();

    const decryptionViewFile = async (
        privateKey: string,
        metadataBox: MetadataBoxType
    ): Promise<ViewFileResult> => {

        try {
            
            if (
                !metadataBox.publicKey || 
                !metadataBox.encryptionFileCID || 
                !metadataBox.encryptionPasswords ||
                !metadataBox.encryptionSlicesMetadataCID
            ) {
                // console.log("metadataBox.publicKey:", metadataBox.publicKey);
                // console.log("metadataBox.encryptionFileCID:", metadataBox.encryptionFileCID);
                // console.log("metadataBox.encryptionPasswords:", metadataBox.encryptionPasswords);
                // console.log("metadataBox.encryptionSlicesMetadataCID:", metadataBox.encryptionSlicesMetadataCID);
                throw new Error('Metadata box is required!');
            }

            const encryptionFileCIDList = metadataBox.encryptionFileCID.map((item) => {
                return {
                    iv_bytes: item.fileCID_iv,
                    encrypted_bytes: item.fileCID_encryption,
                };
            });

            const fileCIDList = await decryptList(
                metadataBox.publicKey, 
                privateKey, 
                encryptionFileCIDList
            );
            const slicesMetadataCID = await decrypt(
                metadataBox.publicKey, 
                privateKey, 
                metadataBox.encryptionSlicesMetadataCID.slicesMetadataCID_iv, 
                metadataBox.encryptionSlicesMetadataCID.slicesMetadataCID_encryption
            );
            const password = await decrypt(
                metadataBox.publicKey, 
                privateKey, 
                metadataBox.encryptionPasswords.password_iv, 
                metadataBox.encryptionPasswords.password_encryption
            );

            const result : ViewFileResult = {
                fileCIDList: fileCIDList || [],
                password: password || '',
                slicesMetadataCID: slicesMetadataCID || '',
            };

            setData(result);

            return result;

        } catch (error) {
            console.error(error);
            throw error;
        }
            
    }

    return { decryptionViewFile, data };
}

export default useDecryptionViewFile;
