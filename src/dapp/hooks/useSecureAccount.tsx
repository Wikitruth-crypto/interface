import { useAccountStore } from '@/dapp/store/accountStore';
import { useAccount, useChainId } from 'wagmi';
import { useEffect } from 'react';

/**
 * 安全的账户 Hook
 * 
 * 功能：
 * - 自动处理账户切换和数据隔离
 * - 自动初始化新账户
 * - 自动管理会话生命周期
 * - 确保账户数据的安全访问
 * 
 * 使用场景：
 * 1. 在应用的顶层组件（如 App.tsx）中调用，自动管理全局账户状态
 * 2. 在需要访问当前账户信息的组件中使用
 * 
 * @example
 * ```tsx
 * // 在 App.tsx 中
 * function App() {
 *   useSecureAccount(); // 自动管理账户状态
 *   
 *   return <YourApp />;
 * }
 * 
 * // 在子组件中使用 Store
 * function MyComponent() {
 *   const chainId = useChainId();
 *   const { getEip712Permit, setEip712Permit } = useAccountStore();
 *   
 *   const permit = getEip712Permit(chainId, PermitType.VIEW);
 *   // ...
 * }
 * ```
 */
export const useSecureAccount = () => {
    const { address, isConnected, connector } = useAccount();
    const chainId = useChainId();
    
    const {
        currentAccount,
        setCurrentAccount,
        setCurrentChainId,
        initAccount,
        endSession,
        startSession,
    } = useAccountStore();

    // 监听链 ID 变化，自动同步到 Store
    useEffect(() => {
        if (chainId) {
            setCurrentChainId(chainId);
        }
    }, [chainId, setCurrentChainId]);

    // 监听账户变化
    useEffect(() => {
        if (isConnected && address) {
            // 如果账户发生变化
            if (currentAccount !== address) {
                console.log(`[Security] Account switching: ${currentAccount} -> ${address}`);
                
                // 结束旧账户的会话
                if (currentAccount) {
                    endSession();
                }
                
                // 初始化新账户
                initAccount(address, chainId, {
                    type: connector?.name?.toLowerCase() as any || 'other',
                    connector: connector?.id || 'unknown',
                    ensName: null,
                    ensAvatar: null,
                });
                
                // 开始新会话
                startSession(chainId);
                
                console.log(`[Security] Account initialized: ${address} on chain ${chainId}`);
            }
        } else {
            // 未连接时清除当前账户
            if (currentAccount) {
                console.log(`[Security] Disconnecting account: ${currentAccount}`);
                endSession();
                setCurrentAccount(null);
            }
        }
    }, [address, isConnected, chainId, currentAccount, connector, initAccount, startSession, endSession, setCurrentAccount]);

    return {
        address,
        isConnected,
        chainId,
    };
};

