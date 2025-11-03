/**
 * 加密解密 Hooks 模块
 * 
 * 职责：为 React 组件提供加密解密功能的 Hook 封装
 * 
 * 特点：
 * - 基于 Service 层实现（不重复业务逻辑）
 * - 管理 React 状态（data, error, isLoading）
 * - 提供符合 React Hooks 规范的 API
 * 
 * 架构：
 * ```
 * Hooks 层 (useEncryption, useDecryption, useGetKeyPair)
 *    ↓ 调用
 * Service 层 (EncryptionService, DecryptionService, CryptoUtils)
 *    ↓ 调用
 * 工具层 (bytes_base64, Web Crypto API)
 * ```
 * 
 * 使用场景：
 * - ✅ 在 React 组件中使用（推荐）
 * - ✅ 需要状态管理（data, error, isLoading）
 * - ❌ 在非 React 环境中使用（请使用 Service 层）
 * 
 * 使用示例：
 * ```typescript
 * import { useEncryption, useDecryption, useGetKeyPair } from '@/dapp/hooks/Cryption';
 * 
 * function MyComponent() {
 *   const { generateKeyPair, keyPair } = useGetKeyPair();
 *   const { encryption, data: encryptedData } = useEncryption();
 *   const { decryption, data: decryptedData } = useDecryption();
 *   
 *   const handleEncrypt = async () => {
 *     const keys = await generateKeyPair();
 *     if (keys) {
 *       await encryption(keys.publicKey_bytes, keys.privateKey_bytes, 'fileCid', 'password');
 *     }
 *   };
 *   
 *   return <button onClick={handleEncrypt}>加密</button>;
 * }
 * ```
 */

export { useEncryption } from './useEncryption';
export { useDecryption } from './useDecryption';
export { useGetKeyPair } from './useGetKeyPair';

