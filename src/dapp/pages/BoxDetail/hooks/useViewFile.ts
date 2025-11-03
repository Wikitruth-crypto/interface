import { useState } from "react"
// import { jsonToObjectService } from "@/dapp/services/metadata/jsonToObjectService"
// import { useMetadataStore } from "@/dapp/store/metadataStore"
// import { useBoxDetailStore } from "../store/nftDetailStore";
import { useDecrypt } from "./useDecrypt";
import { ViewFileRoleType } from "../types/stateType";

export type ViewFileResult = {
    fileCID: string;
    password: string;
};

const useViewFile = () => {

    const [data, setData] = useState<ViewFileResult | null>(null);

    // const tokenId = useBoxDetailStore(state => state.tokenId);
    // const { privateKeyUser } = usePrivateKeyUser(); // TODO 从合约中读取私钥
    
    const { decrypt } = useDecrypt();

    const viewFile = async (
        tokenId: string,
        role: ViewFileRoleType, 
        jsonFile: File | null, 
        privateKey: string | null
    ) => {

        try {
            if (!jsonFile && !privateKey) {
                throw new Error('Please upload the file or enter the private key!');
            }

            const result = await decrypt(publicKey, privateKey, encryptionData);

            setData(result);

            return {
                fileCID: result.fileCID,
                password: result.password,
            };

        } catch (error) {
            console.error(error);
            throw error;
        }
            
    }

    return { viewFile, data };
}

export default useViewFile;
