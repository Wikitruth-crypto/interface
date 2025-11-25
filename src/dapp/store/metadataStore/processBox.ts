import { ipfsCidToUrl } from "@/config/ipfsUrl/ipfsCidToUrl";
import { useMetadataStore } from "./useMetadataStore";
import { MetadataBoxType } from "@/dapp/types/metadata/metadataBox";

/**
 * 处理NFT元数据，从IPFS获取数据并解析存储到Zustand
 * @param id 代币ID
 * @param url 代币URI/ipfs cid
 * @returns 处理结果
 */
export const processBox = async (
    id: string, 
    url: string,
): Promise<MetadataBoxType | null> => {
    const store = useMetadataStore.getState();
    // console.log('processBox,id:', id);

    try {
        // 检查是否已经存在缓存的元数据
        const cachedMetadata = store.boxesMetadata[id];
        if (cachedMetadata) {
            return cachedMetadata;
        }

        // 使用新的IPFS获取服务替代直接fetch
        const metadataUrl = ipfsCidToUrl(url);
        const metadataResponse = await fetch(metadataUrl);
        const metadata = await metadataResponse.json();
        
        if (!metadata) {
            console.error(`Error processing truthBox metadata:`, metadata);
            store.addErrorListMetadata(id);
            return null;
        }

        // 转换IPFS CID为可访问的URL
        const nftImageUrl = ipfsCidToUrl(metadata.nftImage);
        const boxImageUrl = ipfsCidToUrl(metadata.boxImage);

        // 构建符合MetadataBoxType的完整数据结构
        const metadataBox: MetadataBoxType = {
            // 项目基础数据
            project: metadata.project,
            website: metadata.website,
            // Box基础信息
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
            // 加密相关数据
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

        // 将数据存储到zustand中
        store.setMetadataBox(id, metadataBox);

        return metadataBox;
    } catch (error) {
        console.error(`Error processing truthBox metadata:`, error);
        store.addErrorListMetadata(id);
        return null;
    }
};

