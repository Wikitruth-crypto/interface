import {
    EncryptionSlicesMetadataCIDType,
    EncryptionFileCIDType,
    EncryptionPasswordType,
} from '@dapp/types/typesDapp/metadata/encryption';

export interface TimeType {
    createDate: string;
    timestamp: string | number;
}

export interface CompressFilesOutput {
    zipFile: Blob | null;
    fileName: string;
    password: string;
    fileChunks: Blob[];
    slicesMetadata: Blob | null;
}

export interface UploadFilesOutput {
    slicesMetadataCID: string;
    fileCidList: string[];
}

export interface EncryptDataOutput {
    encryptionSlicesMetadataCID: EncryptionSlicesMetadataCIDType;
    encryptionFileCID: EncryptionFileCIDType[];
    encryptionPasswords: EncryptionPasswordType;
    keyPair: {
        privateKey_minter: string;
        publicKey_minter: string;
    };
}

export interface UploadBoxImageOutput {
    boxImageCid: string;
}

export interface CreateNFTImageOutput {
    nftImage: File | null;
    currentTime: TimeType;
}

export interface UploadNFTImageOutput {
    nftImageCid: string;
}

// export interface CreateMetadataOutput {
//     metadataBoxFile: File | null;
//     metadataNFTFile: File | null;
// }

// export interface UploadMetadataOutput {
//     metadataBoxCid: string;
//     metadataNFTCid: string;
// }

export interface MetadataBoxOutput {
    metadataBoxFile: File | null;
    metadataBoxCid: string;
}

export interface MetadataNFTOutput {
    metadataNFTFile: File | null;
    metadataNFTCid: string;
}

export interface MintOutput {
    transactionHash: string;
    tokenId?: string;
}

export interface UploadResultDataOutput {
    resultDataCid: string;
}

export interface AllStepOutputs
    extends CompressFilesOutput,
    UploadFilesOutput,
    EncryptDataOutput,
    UploadBoxImageOutput,
    CreateNFTImageOutput,
    UploadNFTImageOutput,
    MetadataBoxOutput,
    MetadataNFTOutput,
    MintOutput,
    UploadResultDataOutput { }

export const createInitialAllStepOutputs = (): AllStepOutputs => ({
    zipFile: null,
    fileName: '',
    password: '',
    fileChunks: [],
    slicesMetadata: null,
    slicesMetadataCID: '',
    fileCidList: [],
    encryptionSlicesMetadataCID: {
        slicesMetadataCID_encryption: '',
        slicesMetadataCID_iv: '',
    },
    encryptionFileCID: [],
    encryptionPasswords: {
        password_encryption: '',
        password_iv: '',
    },
    keyPair: {
        privateKey_minter: '',
        publicKey_minter: '',
    },
    boxImageCid: '',
    nftImage: null,
    nftImageCid: '',
    currentTime: {
        createDate: '',
        timestamp: 0,
    },
    metadataBoxFile: null,
    metadataBoxCid: '',
    metadataNFTFile: null,
    metadataNFTCid: '',
    transactionHash: '',
    tokenId: '',
    resultDataCid: '',
});
