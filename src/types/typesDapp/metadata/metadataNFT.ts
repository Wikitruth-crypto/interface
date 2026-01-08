import { ProjectDataType, projectDataStore,} from "./metadataBase";

export interface AttributeType {
    trait_type: string;
    value: string;
}

export interface MetadataType {
    name: string;
    description: string;
    tokenId: string;
    typeOfCrime: string;
    title: string;
    image: string;
    country: string;
    state: string;
    eventDate: string;
    attributes: AttributeType[];
}

export interface MetadataNFTType extends MetadataType, ProjectDataType {}

export const initialMetadataNFT: MetadataNFTType = {
    name: "Truth NFT",
    project: projectDataStore.project,
    website: projectDataStore.website,
    description: "WikiTruth is a decentralized platform for trading criminal evidence, driven by blockchain-based token economics—a Web3-native evolution of WikiLeaks.",
    image: "ipfs://",
    tokenId: "",
    typeOfCrime: "",
    title: "",
    country: "",
    state: "",
    eventDate: "",
    attributes: [
        {
            trait_type: "Version",
            value: "beta 1.7.8"
        }
    ]
};
