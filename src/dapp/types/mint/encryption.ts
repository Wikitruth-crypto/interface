
// -----------------旧的加密数据结构，已废弃---------------------
// export interface EncryptionDataType {
//     fileCID_encryption: string;
//     fileCID_iv: string;
//     password_encryption: string;
//     password_iv: string;
// }

/**
 * 采用新的加密数据结构的原因是为了方便后续的扩展，比如zip文件会被分成多个分片进行加密，
 */
// 加密文件CID结构，因为zip文件会被分成多个分片进行加密，所以需要存储多个分片的CID
export interface EncryptionFileCIDType {
    fileCID_encryption: string;
    fileCID_iv: string;
}
// 加密密码结构，zip压缩时只会有一个密码，所以只需要存储一个密码的加密数据
export interface EncryptionPasswordType {
    password_encryption: string;
    password_iv: string;
}
// TODO 新增：zip分片元数据CID加密结构
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



// 密钥对结构
export interface KeyPairType_Mint {
    privateKey_minter: string;
    publicKey_minter: string;
}