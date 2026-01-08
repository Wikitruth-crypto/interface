

// Encrypted file CID structure. Since the zip file will be split into multiple chunks for encryption, the CIDs of multiple chunks need to be stored
export interface EncryptionFileCIDType {
    fileCID_encryption: string;
    fileCID_iv: string;
}
// Encrypted password structure. Only one password is used during zip compression, so only the encrypted data of one password needs to be stored
export interface EncryptionPasswordType {
    password_encryption: string;
    password_iv: string;
}
// Zip chunk metadata CID encryption structure
export interface EncryptionSlicesMetadataCIDType {
    slicesMetadataCID_encryption: string;
    slicesMetadataCID_iv: string;
}

export interface EncryptionDataType {
    encryptionSlicesMetadataCID: EncryptionSlicesMetadataCIDType;
    encryptionFileCID: EncryptionFileCIDType[];
    encryptionPasswords: EncryptionPasswordType;
    publicKey: string,
    // privateKey: string,
}

// Key pair structure
export interface KeyPairType_Mint {
    privateKey_minter: string;
    publicKey_minter: string;
}