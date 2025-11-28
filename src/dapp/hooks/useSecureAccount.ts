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
 */
export const useSecureAccount = () => {
    const { address, isConnected, connector } = useAccount();
    const chainId = useChainId();
    
    const {
        currentAccount,
        setCurrentAccount,
        initAccount,
        endSession,
        startSession,
    } = useAccountStore();

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
                initAccount(address);
                
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

