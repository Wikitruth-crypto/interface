import { projectDataStore, ProjectDataType, } from "./metadataBase";
import { EncryptionDataType } from "./encryption";


export type MintMethodType = 'create' | 'createAndPublish';

export interface BoxInfoType {
    name: string;
    tokenId: string;
    typeOfCrime: string;
    label: string[];
    title: string;
    nftImage: string;
    boxImage:string;
    country: string;
    state: string;
    description: string;
    eventDate: string;
    createDate: string;
    timestamp: number;
    mintMethod: MintMethodType;
}

export interface FileInfoType {
    fileList: string[]; // Store file CIDs of multiple chunks
}

export interface MetadataBoxType extends BoxInfoType, ProjectDataType, FileInfoType, EncryptionDataType {}

export const initialMetadataBox: MetadataBoxType = {
    project: projectDataStore.project,
    website: projectDataStore.website,
    name: "Truth Box",
    tokenId: "",
    typeOfCrime: "",
    label: [],
    title: "",
    nftImage: "ipfs://",
    boxImage: "ipfs://",
    country: "",
    state: "",
    description: "",
    eventDate: "",
    createDate: "",
    timestamp: 0,
    mintMethod: "create",
    encryptionSlicesMetadataCID: {
        slicesMetadataCID_encryption: "",
        slicesMetadataCID_iv: "",
    },
    encryptionFileCID: [],
    encryptionPasswords: {
        password_encryption: "",
        password_iv: "",
    },
    publicKey: "",
    fileList: [],
};
