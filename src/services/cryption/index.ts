
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

    // Utility Methods
    generateKeyPair: CryptoUtils.generateKeyPair.bind(CryptoUtils),
    generateSharedKey: CryptoUtils.generateSharedKey.bind(CryptoUtils),
    encryptBase: CryptoUtils.encryptBase.bind(CryptoUtils),
    decryptBase: CryptoUtils.decryptBase.bind(CryptoUtils),
    
    // Encryption Methods
    encrypt: EncryptionService.encrypt.bind(EncryptionService),
    encryptList: EncryptionService.encryptList.bind(EncryptionService),
    // Decryption Methods
    decrypt: DecryptionService.decrypt.bind(DecryptionService),
    decryptList: DecryptionService.decryptList.bind(DecryptionService),
};
