// 'use client';

// import { useContext, useEffect, useState, useCallback } from 'react';
// import { useAccount, useChainId } from 'wagmi';
// import { ContractContext } from '@/dapp/context/contractContext';
// import { useSimpleSecretStore } from '@/dapp/store/simpleSecretStore';

// /**
//  * Hook 用于从合约中读取私密数据
//  * 
//  * 功能说明：
//  * 1. 如果 privateKey 已存在（在 secretStore 中），则直接返回，不需要读取合约
//  * 2. 如果 privateKey 不存在，则进一步验证：
//  *    - 检查是否有 siweToken（优先使用参数传入的，否则从 secretStore 获取）
//  *    - 如果当前没有 siweToken，等待直到 siweToken 存在时再读取
//  *    - 如果已有 siweToken，立即读取合约获得 privateKey 并存储
//  * 
//  * @param boxId Box ID
//  * @param siweToken SIWE token（可选，如果提供则优先使用，否则从 secretStore 获取）
//  * @returns 返回 { privateKey: string | null, isLoading: boolean, error: Error | null }
//  * 
//  * @example
//  * ```tsx
//  * const { privateKey, isLoading, error } = useReadPrivateData_TruthBox('123');
//  * 
//  * if (isLoading) return <div>Loading...</div>;
//  * if (error) return <div>Error: {error.message}</div>;
//  * if (privateKey) return <div>Private Key: {privateKey}</div>;
//  * ```
//  */
// export const useReadPrivateData_TruthBox = (
//     boxId: string,
//     siweToken?: string
// ) => {
//     const { getPrivateData } = useContext(ContractContext);
//     const { address } = useAccount();
//     const currentChainId = useChainId();
    
//     // 从 secretStore 获取方法
//     const getPrivateKey_TruthBox = useSimpleSecretStore(
//         (state) => state.getPrivateKey_TruthBox
//     );
//     const setPrivateKey_TruthBox = useSimpleSecretStore(
//         (state) => state.setPrivateKey_TruthBox
//     );
//     const getSiweSession = useSimpleSecretStore((state) => state.getSiweSession);
    
//     // 订阅 secretStore 中的 SIWE session 变化（用于自动检测 token）
//     // 注意：这里直接访问 secrets 状态，而不是调用方法，以便能够响应式更新
//     const siweTokenFromStore = useSimpleSecretStore(
//         useCallback((state) => {
//             if (!address || currentChainId === null || currentChainId === undefined) {
//                 return null;
//             }
//             const session = state.getSiweSession(currentChainId, address);
//             return session?.token && session.isLoggedIn ? session.token : null;
//         }, [address, currentChainId])
//     );
    
//     // 状态管理
//     const [privateKey, setPrivateKey] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [error, setError] = useState<Error | null>(null);
    
//     /**
//      * 从合约读取私密数据
//      */
//     const fetchPrivateData = useCallback(
//         async (token: string) => {
//             if (!boxId || !token) {
//                 return null;
//             }
            
//             setIsLoading(true);
//             setError(null);
            
//             try {
//                 const result = await getPrivateData(boxId, token);
                
//                 if (result && typeof result === 'string' && result.length > 0) {
//                     // 存储到 secretStore
//                     setPrivateKey_TruthBox(boxId, result);
//                     setPrivateKey(result);
//                     console.log(`[useReadPrivateData] Private key fetched and stored for box ${boxId}`);
//                     return result;
//                 } else {
//                     throw new Error('Failed to fetch private data: empty result');
//                 }
//             } catch (err) {
//                 const errorMessage =
//                     err instanceof Error
//                         ? err.message
//                         : 'Unknown error occurred while fetching private data';
//                 console.error('[useReadPrivateData] Error fetching private data:', err);
//                 setError(new Error(errorMessage));
//                 return null;
//             } finally {
//                 setIsLoading(false);
//             }
//         },
//         [boxId, getPrivateData, setPrivateKey_TruthBox]
//     );
    
//     /**
//      * 获取 SIWE token（优先使用参数，否则从 secretStore 获取）
//      */
//     const getSiweToken = useCallback((): string | null => {
//         // 优先使用参数传入的 token
//         if (siweToken) {
//             return siweToken;
//         }
        
//         // 从 secretStore 获取
//         if (!address || currentChainId === null || currentChainId === undefined) {
//             return null;
//         }
        
//         const session = getSiweSession(currentChainId, address);
//         if (session?.token && session.isLoggedIn) {
//             return session.token;
//         }
        
//         return null;
//     }, [siweToken, address, currentChainId, getSiweSession]);
    
//     /**
//      * 初始化：检查是否已有 privateKey
//      */
//     useEffect(() => {
//         if (!boxId) {
//             setPrivateKey(null);
//             setIsLoading(false);
//             setError(null);
//             return;
//         }
        
//         // 检查 secretStore 中是否已有 privateKey
//         const cachedKey = getPrivateKey_TruthBox(boxId);
//         if (cachedKey) {
//             setPrivateKey(cachedKey);
//             setIsLoading(false);
//             setError(null);
//             console.log(`[useReadPrivateData] Private key found in cache for box ${boxId}`);
//             return;
//         }
        
//         // 如果没有缓存，检查是否有 siweToken
//         const token = getSiweToken();
//         if (token) {
//             // 有 token，立即读取
//             void fetchPrivateData(token);
//         } else {
//             // 没有 token，等待 token 出现
//             setIsLoading(true);
//             setError(null);
//             setPrivateKey(null);
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [boxId]);
    
//     /**
//      * 监听 SIWE token 变化：当 token 出现时自动读取
//      */
//     useEffect(() => {
//         // 如果已经有 privateKey，不需要再读取
//         if (privateKey || !boxId) {
//             return;
//         }
        
//         // 获取 token（优先使用参数，否则使用 store 中的）
//         const token = siweToken || siweTokenFromStore;
        
//         // 如果正在加载中且现在有 token 了，立即读取
//         if (isLoading && !error && token) {
//             void fetchPrivateData(token);
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [siweToken, siweTokenFromStore, privateKey, isLoading, error, boxId]);
    
//     /**
//      * 监听地址和链ID变化：切换账户或链时重置状态
//      */
//     useEffect(() => {
//         if (!boxId) {
//             return;
//         }
        
//         if (!address || currentChainId === null || currentChainId === undefined) {
//             setPrivateKey(null);
//             setIsLoading(false);
//             setError(null);
//             return;
//         }
        
//         // 重新检查是否有缓存
//         const cachedKey = getPrivateKey_TruthBox(boxId);
//         if (cachedKey) {
//             setPrivateKey(cachedKey);
//             setIsLoading(false);
//             setError(null);
//         } else {
//             setPrivateKey(null);
//             // 检查是否有 token，如果有则读取
//             const token = getSiweToken();
//             if (token) {
//                 void fetchPrivateData(token);
//             } else {
//                 setIsLoading(true);
//                 setError(null);
//             }
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [address, currentChainId]);
    
//     /**
//      * 手动刷新方法（可选，用于外部触发重新读取）
//      */
//     const refresh = useCallback(() => {
//         // 清除缓存
//         setPrivateKey(null);
//         setIsLoading(true);
//         setError(null);
        
//         // 重新读取
//         const token = getSiweToken();
//         if (token) {
//             void fetchPrivateData(token);
//         } else {
//             setError(new Error('SIWE token is required to fetch private data'));
//             setIsLoading(false);
//         }
//     }, [getSiweToken, fetchPrivateData]);
    
//     return {
//         privateKey,
//         isLoading,
//         error,
//         refresh, // 可选：手动刷新方法
//     };
// };
