import { ipfsCidToUrl } from "@/config/ipfsUrl/ipfsCidToUrl";
import { useMetadataStore } from "./useMetadataStore";
import { MetadataBoxType } from "@dapp/types/typesDapp/metadata/metadataBox";

/**
 * Process NFT metadata, fetch data from IPFS and parse to store in Zustand
 * @param id Token ID
 * @param url Token URI/ipfs cid
 * @returns Processing result
 */
export const processBox = async (
    id: string, 
    url: string,
): Promise<MetadataBoxType | null> => {
    const store = useMetadataStore.getState();
    // console.log('processBox,id:', id);

    try {
        // Check if cached metadata already exists
        const cachedMetadata = store.boxesMetadata[id];
        if (cachedMetadata) {
            return cachedMetadata;
        }

        // Use new IPFS fetch service instead of direct fetch
        const metadataUrl = ipfsCidToUrl(url);
        const metadataResponse = await fetch(metadataUrl);
        const metadata = await metadataResponse.json();
        
        if (!metadata) {
            console.error(`Error processing truthBox metadata:`, metadata);
            store.addErrorListMetadata(id);
            return null;
        }

        // Convert IPFS CID to accessible URL
        const nftImageUrl = ipfsCidToUrl(metadata.nftImage);
        const boxImageUrl = ipfsCidToUrl(metadata.boxImage);

        // Build complete data structure conforming to MetadataBoxType
        const metadataBox: MetadataBoxType = {
            // Project base data
            project: metadata.project,
            website: metadata.website,
            // Box base info
            name: metadata.name,
            tokenId: id,
            typeOfCrime: metadata.typeOfCrime,
            label: metadata.label || [],
            title: metadata.title,
            nftImage: nftImageUrl,
            boxImage: boxImageUrl,
            country: metadata.country,
            state: metadata.state,
            description: metadata.description,
            eventDate: metadata.eventDate,
            createDate: metadata.createDate,
            timestamp: metadata.timestamp,
            mintMethod: metadata.mintMethod,
            // Encryption related data
            encryptionSlicesMetadataCID: metadata.encryptionSlicesMetadataCID || {
                slicesMetadataCID_encryption: "",
                slicesMetadataCID_iv: "",
            },
            encryptionFileCID: metadata.encryptionFileCID || [],
            encryptionPasswords: metadata.encryptionPasswords || {
                password_encryption: "",
                password_iv: "",
            },
            publicKey: metadata.publicKey || '',
            fileList: metadata.fileList || [],
            // password: metadata.password || '',
        };

        // Store data in zustand
        store.setMetadataBox(id, metadataBox);

        return metadataBox;
    } catch (error) {
        console.error(`Error processing truthBox metadata:`, error);
        store.addErrorListMetadata(id);
        return null;
    }
};

