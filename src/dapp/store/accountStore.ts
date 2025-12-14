import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { FunctionNameType} from '@/dapp/types/contracts';
import { CHAIN_ID } from '@/dapp/contractsConfig/current';

/**
 * 登录/登出时间记录
 */
export interface LoginRecord {
    loginTime: number;
    logoutTime: number | null;
    CHAIN_ID: number;
    sessionId: string; // 会话唯一标识
}


/**
 * 交易缓存（用于优化重复查询）
 */
export interface TransactionCache {
    [txHash: string]: {
        data: any;
        timestamp: number;
        CHAIN_ID: number;
    };
}

/**
 * 多签相关信息
 */
export interface MultiSigInfo {
    isMultiSig: boolean;
    threshold: number | null;
    owners: string[] | null;
    pendingTransactions: number;
}

/**
 * Box 交互记录
 * 记录用户在某个 Box 中完成的 write 类型交互
 */
export interface BoxInteractionRecord {
    boxId: string;
    functionWrote: FunctionNameType;
    timestamp: number;
    CHAIN_ID: number;
    txHash?: string; // 可选的交易哈希
}

/**
 * Box 交互记录映射（按 Box ID 分组）
 */
export interface BoxInteractionsMap {
    [boxId: string]: BoxInteractionRecord[];
}

/**
 * 代币授权信息
 * 记录代币在某个地址的授权额度
 */
export interface TokenAllowance {
    amount: string; // 授权额度（字符串格式，支持大数）
    lastUpdated: number; // 最后更新时间戳
}

/**
 * 单个账户在特定链上的完整状态
 * 注意：此状态是针对特定链的，因为外层结构是 accounts[CHAIN_ID][address]
 */
export interface AccountState {
    // === 基础信息 ===
    address: string; 
    userId: string;
    // === 会话管理 ===
    loginHistory: LoginRecord[]; // 登录历史
    currentSessionId: string | null; // 当前会话 ID
    
    // === 多签信息 ===
    multiSig: MultiSigInfo | null;
    
    // === Box 交互记录 ===
    boxInteractions: BoxInteractionsMap; // 记录在各个 Box 中的交互
    
    // === 交易缓存 ===
    txCache: TransactionCache;
    
    // === 元数据 ===
    createdAt: number;
    lastActiveAt: number;
}

/**
 * 全局 Store 状态
 */
export interface AccountStoreState {
    // 当前活跃账户（安全关键！）
    currentAccount: string | null;
    
    // 所有账户数据：accounts[CHAIN_ID][address] = AccountState
    // 这样的结构让链隔离更清晰，查询效率更高
    accounts: {
        [CHAIN_ID: number]: {
            [address: string]: AccountState;
        };
    };
    
    // 是否启用安全模式（严格访问控制）
    securityMode: 'strict' | 'normal';
}

/**
 * Store 操作方法
 */
export interface AccountStoreMethods {
    // === 内部方法（不要直接调用）===
    _checkAccess?: (operation: string) => string | null;
    
    // === 账户管理 ===
    setCurrentAccount: (address: string | null) => void;
    initAccount: (address: string) => void;
    removeAccount: (address: string) => void;
    setUserId: (userId: string) => void;
    
    // === 会话管理 ===
    startSession: (CHAIN_ID?: number) => void;
    endSession: () => void;
    getLoginHistory: (limit?: number) => LoginRecord[];
    
    // === 多签信息 ===
    setMultiSigInfo: (info: MultiSigInfo) => void;
    getMultiSigInfo: () => MultiSigInfo | null;
    
    // === Box 交互记录 ===
    addBoxInteraction: (boxId: string, functionWrote: FunctionNameType, txHash?: string) => void;
    getBoxInteractions: (boxId: string) => BoxInteractionRecord[];
    hasBoxInteraction: (boxId: string, functionWrote: FunctionNameType) => boolean;
    clearBoxInteractions: (boxId?: string) => void;
    
    // === 交易缓存 ===
    cacheTx: ( txHash: string, data: any) => void;
    getTxCache: (txHash: string) => any | null;
    clearTxCache: (CHAIN_ID?: number) => void;
    
    // === 安全模式 ===
    setSecurityMode: (mode: 'strict' | 'normal') => void;
    
    // === 工具方法 ===
    clearCurrentAccount: () => void;
    clearAllAccounts: () => void;
}

// ==================== 默认值 ====================


const createDefaultAccountState = (address: string, CHAIN_ID: number): AccountState => ({
    address,
    userId: '',
    loginHistory: [],
    currentSessionId: null,
    multiSig: null,
    boxInteractions: {},
    txCache: {},
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
});

// ==================== 工具函数 ====================

/**
 * 生成唯一会话 ID
 */
const generateSessionId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

/**
 * 限制数组长度（用于日志和历史记录）
 */
const limitArraySize = <T>(arr: T[], maxSize: number): T[] => {
    return arr.slice(-maxSize);
};

// ==================== Store 实现 ====================

type AccountStore = AccountStoreState & AccountStoreMethods;

export const useAccountStore = create<AccountStore>()(
    devtools(
        (set, get) => ({
            // === 初始状态 ===
            currentAccount: null,
            CHAIN_ID: null,
            accounts: {},
            securityMode: 'strict',

            // === 安全访问控制辅助函数（内部使用）===
            _checkAccess: (operation: string): string | null => {
                const { currentAccount, securityMode } = get();
                
                if (!currentAccount) {
                    console.warn(`[Security] Access denied: No active account - Operation: ${operation}`);
                    
                    if (securityMode === 'strict') {
                        return null;
                    }
                }
                
                return currentAccount;
            },

            // === 账户管理 ===
            setCurrentAccount: (address) => {
                set({ currentAccount: address });
                
                // 更新最后活跃时间
                if (address) {
                    const { accounts } = get();
                    if (CHAIN_ID && accounts[CHAIN_ID]?.[address]) {
                        set({
                            accounts: {
                                ...accounts,
                                [CHAIN_ID]: {
                                    ...accounts[CHAIN_ID],
                                    [address]: {
                                        ...accounts[CHAIN_ID][address],
                                        lastActiveAt: Date.now(),
                                    },
                                },
                            },
                        });
                    }
                }
            },

            initAccount: (address) => {
                const { accounts } = get();
                
                if (!CHAIN_ID) return;
                // 确保该链的账户对象存在
                if (!accounts[CHAIN_ID]) {
                    accounts[CHAIN_ID] = {};
                }
                
                if (!accounts[CHAIN_ID][address]) {
                    // 新账户，创建默认状态
                    const newAccount = createDefaultAccountState(address, CHAIN_ID);
                    
                    set({
                        accounts: {
                            ...accounts,
                            [CHAIN_ID]: {
                                ...accounts[CHAIN_ID],
                                [address]: newAccount,
                            },
                        },
                        currentAccount: address,
                    });
                } else {
                    // 账户已存在，只更新活跃时间
                    set({
                        accounts: {
                            ...accounts,
                            [CHAIN_ID]: {
                                ...accounts[CHAIN_ID],
                                [address]: {
                                    ...accounts[CHAIN_ID][address],
                                    lastActiveAt: Date.now(),
                                },
                            },
                        },
                        currentAccount: address,
                    });
                }
            },

            removeAccount: (address) => {
                const { accounts, currentAccount } = get();
                
                if (!CHAIN_ID) return;
                
                const newChainAccounts = { ...accounts[CHAIN_ID] };
                delete newChainAccounts[address];
                
                set({
                    accounts: {
                        ...accounts,
                        [CHAIN_ID]: newChainAccounts,
                    },
                    currentAccount: currentAccount === address ? null : currentAccount,
                });
            },

            setUserId: (userId) => {
                const address = get()._checkAccess?.('setUserId');
                if (!address) return;
                
                const { accounts } = get();
                if (!CHAIN_ID) return;
                
                const account = accounts[CHAIN_ID]?.[address];
                if (!account) return;

                set({
                    accounts: {
                        ...accounts,
                        [CHAIN_ID]: {
                            ...accounts[CHAIN_ID],
                            [address]: {
                                ...account,
                                userId: userId,
                            },
                        },
                    },
                });
            },

            // === 会话管理 ===
            startSession: (chainId01) => {
                const chainId = chainId01 ?? CHAIN_ID;
                if (!chainId) return;
                const address = get()._checkAccess?.('startSession');
                if (!address) return;
                
                const { accounts } = get();
                const account = accounts[chainId]?.[address];
                if (!account) return;
                
                const sessionId = generateSessionId();
                
                const newRecord: LoginRecord = {
                    loginTime: Date.now(),
                    logoutTime: null,
                    CHAIN_ID: chainId,
                    sessionId,
                };
                
                set({
                    accounts: {
                        ...accounts,
                        [CHAIN_ID]: {
                            ...accounts[CHAIN_ID],
                            [address]: {
                                ...account,
                                currentSessionId: sessionId,
                                loginHistory: limitArraySize([...account.loginHistory, newRecord], 50),
                            },
                        },
                    },
                });

            },

            endSession: () => {
                const address = get()._checkAccess?.('endSession');
                if (!address) return;
                
                const { accounts } = get();
                if (!CHAIN_ID) return;
                
                const account = accounts[CHAIN_ID]?.[address];
                if (!account) return;
                
                if (account.currentSessionId) {
                    const updatedHistory = account.loginHistory.map((record: LoginRecord) =>
                        record.sessionId === account.currentSessionId && !record.logoutTime
                            ? { ...record, logoutTime: Date.now() }
                            : record
                    );
                    
                    set({
                        accounts: {
                            ...accounts,
                            [CHAIN_ID]: {
                                ...accounts[CHAIN_ID],
                                [address]: {
                                    ...account,
                                    currentSessionId: null,
                                    loginHistory: updatedHistory,
                                },
                            },
                        },
                    });
                    
                }
            },

            getLoginHistory: (limit = 10) => {
                const address = get()._checkAccess?.('getLoginHistory');
                if (!address) return [];
                
                const { accounts} = get();
                if (!CHAIN_ID) return [];
                
                const history = accounts[CHAIN_ID]?.[address]?.loginHistory || [];
                return history.slice(-limit);
            },

            // === 多签信息 ===
            setMultiSigInfo: (info) => {
                const address = get()._checkAccess?.('setMultiSigInfo');
                if (!address) return;
                
                const { accounts } = get();
                if (!CHAIN_ID) return;
                
                const account = accounts[CHAIN_ID]?.[address];
                if (!account) return;
                
                set({
                    accounts: {
                        ...accounts,
                        [CHAIN_ID]: {
                            ...accounts[CHAIN_ID],
                            [address]: {
                                ...account,
                                multiSig: info,
                            },
                        },
                    },
                });
            },

            getMultiSigInfo: () => {
                const address = get()._checkAccess?.('getMultiSigInfo');
                if (!address) return null;
                
                const { accounts } = get();
                if (!CHAIN_ID) return null;
                
                return accounts[CHAIN_ID]?.[address]?.multiSig || null;
            },

            // === Box 交互记录 ===
            addBoxInteraction: (boxId, functionWrote, txHash) => {
                const address = get()._checkAccess?.('addBoxInteraction');
                if (!address) return;
                
                // 如果没有传 chainId，使用当前 CHAIN_ID
                const targetChainId = CHAIN_ID;
                if (!targetChainId) {
                    console.warn('[AccountStore] No CHAIN_ID provided and no current CHAIN_ID set');
                    return;
                }
                
                const { accounts } = get();
                const account = accounts[targetChainId]?.[address];
                if (!account) return;
                
                const newRecord: BoxInteractionRecord = {
                    boxId,
                    functionWrote,
                    timestamp: Date.now(),
                    CHAIN_ID: targetChainId,
                    txHash,
                };
                
                const existingRecords = account.boxInteractions[boxId] || [];
                
                set({
                    accounts: {
                        ...accounts,
                        [targetChainId]: {
                            ...accounts[targetChainId],
                            [address]: {
                                ...account,
                                boxInteractions: {
                                    ...account.boxInteractions,
                                    [boxId]: [...existingRecords, newRecord],
                                },
                            },
                        },
                    },
                });
                
            },

            getBoxInteractions: (boxId) => {
                const address = get()._checkAccess?.('getBoxInteractions');
                if (!address) return [];
                
                const { accounts} = get();
                if (!CHAIN_ID) return [];
                
                const interactions = accounts[CHAIN_ID]?.[address]?.boxInteractions[boxId] || [];
                
                
                return interactions;
            },

            hasBoxInteraction: (boxId, functionWrote) => {
                const address = get()._checkAccess?.('hasBoxInteraction');
                if (!address) return false;
                
                const { accounts} = get();
                if (!CHAIN_ID) return false;
                
                const interactions = accounts[CHAIN_ID]?.[address]?.boxInteractions[boxId] || [];
                const hasInteraction = interactions.some((record: BoxInteractionRecord) => record.functionWrote === functionWrote);
                
                
                return hasInteraction;
            },

            clearBoxInteractions: (boxId) => {
                const address = get()._checkAccess?.('clearBoxInteractions');
                if (!address) return;
                
                const { accounts} = get();
                if (!CHAIN_ID) return;
                
                const account = accounts[CHAIN_ID]?.[address];
                if (!account) return;
                
                if (boxId) {
                    // 清除指定 Box 的交互记录
                    const newInteractions = { ...account.boxInteractions };
                    delete newInteractions[boxId];
                    
                    set({
                        accounts: {
                            ...accounts,
                            [CHAIN_ID]: {
                                ...accounts[CHAIN_ID],
                                [address]: {
                                    ...account,
                                    boxInteractions: newInteractions,
                                },
                            },
                        },
                    });
                } else {
                    // 清除所有 Box 的交互记录
                    set({
                        accounts: {
                            ...accounts,
                            [CHAIN_ID]: {
                                ...accounts[CHAIN_ID],
                                [address]: {
                                    ...account,
                                    boxInteractions: {},
                                },
                            },
                        },
                    });
                    
                }
            },

            // === 交易缓存 ===
            cacheTx: (txHash, data) => {
                if (!CHAIN_ID) return;
                const address = get()._checkAccess?.('cacheTx');
                if (!address) return;
                
                const { accounts } = get();
                const account = accounts[CHAIN_ID]?.[address];
                if (!account) return;
                
                set({
                    accounts: {
                        ...accounts,
                        [CHAIN_ID]: {
                            ...accounts[CHAIN_ID],
                            [address]: {
                                ...account,
                                txCache: {
                                    ...account.txCache,
                                    [txHash]: {
                                        data,
                                        timestamp: Date.now(),
                                        CHAIN_ID,
                                    },
                                },
                            },
                        },
                    },
                });
            },

            getTxCache: (txHash) => {
                const address = get()._checkAccess?.('getTxCache');
                if (!address) return null;
                
                const { accounts } = get();
                if (!CHAIN_ID) return null;
                
                const cached = accounts[CHAIN_ID]?.[address]?.txCache[txHash];
                
                // 检查缓存是否过期（5分钟）
                if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
                    return cached.data;
                }
                
                return null;
            },

            clearTxCache: (chainId01) => {
                const CHAIN_ID = chainId01;
                if (!CHAIN_ID) return;
                const address = get()._checkAccess?.('clearTxCache');
                if (!address) return;
                
                const targetChainId = CHAIN_ID ;
                if (!targetChainId) return;
                
                const { accounts } = get();
                const account = accounts[targetChainId]?.[address];
                if (!account) return;
                
                if (CHAIN_ID !== undefined) {
                    const filteredCache = Object.entries(account.txCache)
                        .filter(([_, value]: [string, any]) => value.CHAIN_ID !== CHAIN_ID)
                        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
                    
                    set({
                        accounts: {
                            ...accounts,
                            [targetChainId]: {
                                ...accounts[targetChainId],
                                [address]: {
                                    ...account,
                                    txCache: filteredCache,
                                },
                            },
                        },
                    });
                } else {
                    set({
                        accounts: {
                            ...accounts,
                            [targetChainId]: {
                                ...accounts[targetChainId],
                                [address]: {
                                    ...account,
                                    txCache: {},
                                },
                            },
                        },
                    });
                }
            },

            // === 安全模式 ===
            setSecurityMode: (mode) => {
                set({ securityMode: mode });
            },

            // === 工具方法 ===
            clearCurrentAccount: () => {
                const { currentAccount } = get();
                if (currentAccount) {
                    get().removeAccount(currentAccount);
                }
            },

            clearAllAccounts: () => {
                set({
                    accounts: {},
                    currentAccount: null,
                });
            },
        }),
        { name: 'AccountStore' }
    )
);

