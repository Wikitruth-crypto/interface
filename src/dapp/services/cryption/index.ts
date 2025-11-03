
import { CryptoUtils} from './cryptoUtils';
import { EncryptionService } from './encryption';
import { DecryptionService } from './decryption';

export { CryptoUtils } from './cryptoUtils';
export type { KeyType, CryptionDataBytesType } from './cryptoUtils';
export { EncryptionService } from './encryption';
export { DecryptionService } from './decryption';
export { Base64ToEthereumBytes, EthereumBytesToBase64 } from './bytes_base64';

export type { EncryptionResult, EncryptionResultList } from './encryption';
export type { DecryptionResult, DecryptionResultList } from './decryption';

export const CryptionService = {

    // 工具方法
    generateKeyPair: CryptoUtils.generateKeyPair.bind(CryptoUtils),
    generateSharedKey: CryptoUtils.generateSharedKey.bind(CryptoUtils),
    encryptBase: CryptoUtils.encryptBase.bind(CryptoUtils),
    decryptBase: CryptoUtils.decryptBase.bind(CryptoUtils),
    
    // 加密方法
    encrypt: EncryptionService.encrypt.bind(EncryptionService),
    encryptList: EncryptionService.encryptList.bind(EncryptionService),
    // 解密方法
    decrypt: DecryptionService.decrypt.bind(DecryptionService),
    decryptList: DecryptionService.decryptList.bind(DecryptionService),
};
