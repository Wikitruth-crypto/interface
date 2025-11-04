import { useState } from "react"
// import { jsonToObjectService } from "@/dapp/services/metadata/jsonToObjectService"
// import { useMetadataStore } from "@/dapp/store/metadataStore"
// import { useBoxDetailStore } from "../store/nftDetailStore";
import { useDecryption } from "@/dapp/hooks/Cryption/useDecryption";
import { MetadataBoxType } from "@/dapp/types/contracts/metadataBox";

export type ViewFileResult = {
    fileCIDList: string[];
    password: string;
    slicesMetadataCID: string;
};

const useViewFileTruthBox = () => {

    const [data, setData] = useState<ViewFileResult | null>(null);

    const { decryptList, decrypt } = useDecryption();

    const viewFileTruthBox = async (
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

    return { viewFileTruthBox, data };
}

export default useViewFileTruthBox;
