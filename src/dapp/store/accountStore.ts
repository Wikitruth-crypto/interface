import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AccountRoleType } from '@/dapp/types/account';
import { FunctionNameType } from '@/dapp/types/contracts';

/**
 * ==================== 账户全局状态管理 ====================
 * 
 * 功能说明：
 * - 用于记录用户当前访问网站的全局数据
 * - 当关闭网站/浏览器/电脑时，这些数据会自动清空
 * - 支持多账户数据管理，每个账户的数据完全隔离
 * 
 * 安全设计：
 * 1. **访问控制**：通过 currentAccount 标识当前活跃账户，只能访问当前账户的数据
 * 2. **数据隔离**：不同账户、不同链的数据完全隔离，防止数据泄露
 * 3. **访问日志**：记录所有敏感数据访问行为，用于安全审计
 * 4. **自动清理**：会话过期自动清理，账户切换时隔离数据
 * 5. **链隔离**：不同链的签名和令牌独立存储，防止跨链数据泄露
 */

// ==================== 类型定义 ====================

/**
 * 登录/登出时间记录
 */
export interface LoginRecord {
    loginTime: number;
    logoutTime: number | null;
    chainId: number;
    sessionId: string; // 会话唯一标识
}



/**
 * 交易缓存（用于优化重复查询）
 */
export interface TransactionCache {
    [txHash: string]: {
        data: any;
        timestamp: number;
        chainId: number;
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
    functionName: FunctionNameType;
    timestamp: number;
    chainId: number;
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
 * 代币授权映射
 * 结构：tokenAllowances[tokenAddress][spender] = TokenAllowance
 */
export interface TokenAllowancesMap {
    [tokenAddress: string]: {
        [spender: string]: TokenAllowance;
    };
}

/**
 * 单个账户在特定链上的完整状态
 * 注意：此状态是针对特定链的，因为外层结构是 accounts[chainId][address]
 */
export interface AccountState {
    // === 基础信息 ===
    address: string; 
    chainId: number; // 这个应该移除。
    
    // === 会话管理 ===
    loginHistory: LoginRecord[]; // 登录历史
    currentSessionId: string | null; // 当前会话 ID
    
    // === 余额快照（原生代币 + ERC20 代币）===
    balance: {
        native: string; // 原生代币余额
        tokens: Record<string, string>; // ERC20 代币余额
        lastUpdated: number;
    };

    // === 账户的代币信息 === 
    /**
     * 代币授权额度
     * 结构：tokenAllowances[tokenAddress][spender] = TokenAllowance
     * 用于缓存代币授权额度，避免重复查询合约
     */
    tokenAllowances: TokenAllowancesMap;
    
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
    
    // 当前链 ID（避免重复传参）
    currentChainId: number | null;
    
    // 所有账户数据：accounts[chainId][address] = AccountState
    // 这样的结构让链隔离更清晰，查询效率更高
    accounts: {
        [chainId: number]: {
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
    
    // === 链管理 ===
    setCurrentChainId: (chainId: number) => void;
    getCurrentChainId: () => number | null;
    
    // === 账户管理 ===
    setCurrentAccount: (address: string | null) => void;
    initAccount: (address: string, chainId?: number) => void;
    removeAccount: (address: string) => void;
    
    // === 会话管理 ===
    startSession: (chainId: number) => void;
    endSession: () => void;
    getLoginHistory: (limit?: number) => LoginRecord[];
    
    // === 多签信息 ===
    setMultiSigInfo: (info: MultiSigInfo) => void;
    getMultiSigInfo: () => MultiSigInfo | null;
    
    // === 余额管理 ===
    updateBalance: (native: string, tokens?: Record<string, string>, chainId?: number) => void;
    getBalance: (chainId?: number) => { native: string; tokens: Record<string, string>; lastUpdated: number } | null;
    
    // === 代币授权管理 ===
    /**
     * 更新代币授权额度
     * @param tokenAddress 代币合约地址
     * @param spender 被授权者地址（通常是合约地址）
     * @param amount 授权额度
     * @param chainId 链ID（可选，使用当前链）
     */
    updateTokenAllowance: (
        tokenAddress: string,
        spender: string,
        amount: string,
        chainId?: number
    ) => void;
    
    /**
     * 获取代币授权额度
     * @param tokenAddress 代币合约地址
     * @param spender 被授权者地址
     * @param chainId 链ID（可选，使用当前链）
     * @returns TokenAllowance 或 null
     */
    getTokenAllowance: (
        tokenAddress: string,
        spender: string,
        chainId?: number
    ) => TokenAllowance | null;
    
    /**
     * 清除指定代币的所有授权缓存
     * @param tokenAddress 代币合约地址（可选，不提供则清除所有）
     * @param chainId 链ID（可选，使用当前链）
     */
    clearTokenAllowances: (tokenAddress?: string, chainId?: number) => void;
    
    // === Box 交互记录 ===
    addBoxInteraction: (boxId: string, functionName: FunctionNameType, txHash?: string, chainId?: number) => void;
    getBoxInteractions: (boxId: string) => BoxInteractionRecord[];
    hasBoxInteraction: (boxId: string, functionName: FunctionNameType) => boolean;
    clearBoxInteractions: (boxId?: string) => void;
    
    // === 交易缓存 ===
    cacheTx: ( txHash: string, data: any, chainId?: number,) => void;
    getTxCache: (txHash: string) => any | null;
    clearTxCache: (chainId?: number) => void;
    
    // === 钱包信息 ===
    // updateWalletInfo: (wallet: Partial<WalletInfo>) => void;
    
    // === 安全模式 ===
    setSecurityMode: (mode: 'strict' | 'normal') => void;
    
    // === 工具方法 ===
    clearCurrentAccount: () => void;
    clearAllAccounts: () => void;
}

// ==================== 默认值 ====================


const createDefaultAccountState = (address: string, chainId: number): AccountState => ({
    address,
    chainId,
    loginHistory: [],
    currentSessionId: null,
    balance: {
        native: '0',
        tokens: {},
        lastUpdated: Date.now(),
    },
    tokenAllowances: {},
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
            currentChainId: null,
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

            // === 链管理 ===
            setCurrentChainId: (chainId) => {
                set({ currentChainId: chainId });
            },

            getCurrentChainId: () => {
                return get().currentChainId;
            },

            // === 账户管理 ===
            setCurrentAccount: (address) => {
                set({ currentAccount: address });
                
                // 更新最后活跃时间
                if (address) {
                    const { accounts, currentChainId } = get();
                    if (currentChainId && accounts[currentChainId]?.[address]) {
                        set({
                            accounts: {
                                ...accounts,
                                [currentChainId]: {
                                    ...accounts[currentChainId],
                                    [address]: {
                                        ...accounts[currentChainId][address],
                                        lastActiveAt: Date.now(),
                                    },
                                },
                            },
                        });
                    }
                }
            },

            initAccount: (address, chainId01) => {
                const { accounts } = get();
                
                const chainId = chainId01 ?? get().currentChainId;
                if (!chainId) return;
                // 确保该链的账户对象存在
                if (!accounts[chainId]) {
                    accounts[chainId] = {};
                }
                
                if (!accounts[chainId][address]) {
                    // 新账户，创建默认状态
                    const newAccount = createDefaultAccountState(address, chainId);
                    
                    set({
                        accounts: {
                            ...accounts,
                            [chainId]: {
                                ...accounts[chainId],
                                [address]: newAccount,
                            },
                        },
                        currentAccount: address,
                        currentChainId: chainId,
                    });
                } else {
                    // 账户已存在，只更新活跃时间
                    set({
                        accounts: {
                            ...accounts,
                            [chainId]: {
                                ...accounts[chainId],
                                [address]: {
                                    ...accounts[chainId][address],
                                    lastActiveAt: Date.now(),
                                },
                            },
                        },
                        currentAccount: address,
                        currentChainId: chainId,
                    });
                }
            },

            removeAccount: (address) => {
                const { accounts, currentAccount, currentChainId } = get();
                
                if (!currentChainId) return;
                
                const newChainAccounts = { ...accounts[currentChainId] };
                delete newChainAccounts[address];
                
                set({
                    accounts: {
                        ...accounts,
                        [currentChainId]: newChainAccounts,
                    },
                    currentAccount: currentAccount === address ? null : currentAccount,
                });
            },

            // === 会话管理 ===
            startSession: (chainId) => {
                const address = get()._checkAccess?.('startSession');
                if (!address) return;
                
                const { accounts } = get();
                const account = accounts[chainId]?.[address];
                if (!account) return;
                
                const sessionId = generateSessionId();
                
                const newRecord: LoginRecord = {
                    loginTime: Date.now(),
                    logoutTime: null,
                    chainId,
                    sessionId,
                };
                
                set({
                    accounts: {
                        ...accounts,
                        [chainId]: {
                            ...accounts[chainId],
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
                
                const { accounts, currentChainId } = get();
                if (!currentChainId) return;
                
                const account = accounts[currentChainId]?.[address];
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
                            [currentChainId]: {
                                ...accounts[currentChainId],
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
                
                const { accounts, currentChainId } = get();
                if (!currentChainId) return [];
                
                const history = accounts[currentChainId]?.[address]?.loginHistory || [];
                return history.slice(-limit);
            },

            // === 余额管理 ===
            updateBalance: (native, tokens = {}, chainId01) => {
                const address = get()._checkAccess?.('updateBalance');
                if (!address) return;
                
                const chainId = chainId01 ?? get().currentChainId;
                if (!chainId) return;
                const { accounts } = get();
                const account = accounts[chainId]?.[address];
                if (!account) return;
                
                set({
                    accounts: {
                        ...accounts,
                        [chainId]: {
                            ...accounts[chainId],
                            [address]: {
                                ...account,
                                balance: {
                                    native,
                                    tokens,
                                    lastUpdated: Date.now(),
                                },
                            },
                        },
                    },
                });
            },

            getBalance: (chainId01) => {
                const chainId = chainId01 ?? get().currentChainId;
                if (!chainId) return;
                const address = get()._checkAccess?.('getBalance');
                if (!address) return null;
                
                const balance = get().accounts[chainId]?.[address]?.balance || null;
                return balance;
            },

            // === 代币授权管理 ===
            updateTokenAllowance: (tokenAddress, spender, amount, chainId01) => {
                const address = get()._checkAccess?.('updateTokenAllowance');
                if (!address) return;
                
                const chainId = chainId01 ?? get().currentChainId;
                if (!chainId) return;
                
                const { accounts } = get();
                const account = accounts[chainId]?.[address];
                if (!account) return;
                
                // 规范化地址（小写）
                const normalizedTokenAddress = tokenAddress.toLowerCase();
                const normalizedSpender = spender.toLowerCase();
                
                // 确保 tokenAllowances 结构存在
                const currentAllowances = account.tokenAllowances || {};
                const tokenAllowances = currentAllowances[normalizedTokenAddress] || {};
                
                set({
                    accounts: {
                        ...accounts,
                        [chainId]: {
                            ...accounts[chainId],
                            [address]: {
                                ...account,
                                tokenAllowances: {
                                    ...currentAllowances,
                                    [normalizedTokenAddress]: {
                                        ...tokenAllowances,
                                        [normalizedSpender]: {
                                            amount,
                                            lastUpdated: Date.now(),
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                
                
                console.log(
                    `[AccountStore] Token allowance updated: ${tokenAddress} -> ${spender} = ${amount}`
                );
            },

            getTokenAllowance: (tokenAddress, spender, chainId01) => {
                const chainId = chainId01 ?? get().currentChainId;
                if (!chainId) return null;
                
                const address = get()._checkAccess?.('getTokenAllowance');
                if (!address) return null;
                
                // 规范化地址（小写）
                const normalizedTokenAddress = tokenAddress.toLowerCase();
                const normalizedSpender = spender.toLowerCase();
                
                const allowance =
                    get().accounts[chainId]?.[address]?.tokenAllowances?.[normalizedTokenAddress]?.[
                        normalizedSpender
                    ] || null;

                return allowance;
            },

            clearTokenAllowances: (tokenAddress, chainId01) => {
                const address = get()._checkAccess?.('clearTokenAllowances');
                if (!address) return;
                
                const chainId = chainId01 ?? get().currentChainId;
                if (!chainId) return;
                
                const { accounts } = get();
                const account = accounts[chainId]?.[address];
                if (!account) return;
                
                if (tokenAddress) {
                    // 清除指定代币的所有授权
                    const normalizedTokenAddress = tokenAddress.toLowerCase();
                    const currentAllowances = { ...account.tokenAllowances };
                    delete currentAllowances[normalizedTokenAddress];
                    
                    set({
                        accounts: {
                            ...accounts,
                            [chainId]: {
                                ...accounts[chainId],
                                [address]: {
                                    ...account,
                                    tokenAllowances: currentAllowances,
                                },
                            },
                        },
                    });
                    
                } else {
                    // 清除所有代币授权
                    set({
                        accounts: {
                            ...accounts,
                            [chainId]: {
                                ...accounts[chainId],
                                [address]: {
                                    ...account,
                                    tokenAllowances: {},
                                },
                            },
                        },
                    });
                    
                }
            },

            // === 多签信息 ===
            setMultiSigInfo: (info) => {
                const address = get()._checkAccess?.('setMultiSigInfo');
                if (!address) return;
                
                const { accounts, currentChainId } = get();
                if (!currentChainId) return;
                
                const account = accounts[currentChainId]?.[address];
                if (!account) return;
                
                set({
                    accounts: {
                        ...accounts,
                        [currentChainId]: {
                            ...accounts[currentChainId],
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
                
                const { accounts, currentChainId } = get();
                if (!currentChainId) return null;
                
                return accounts[currentChainId]?.[address]?.multiSig || null;
            },

            // === Box 交互记录 ===
            addBoxInteraction: (boxId, functionName, txHash, chainId) => {
                const address = get()._checkAccess?.('addBoxInteraction');
                if (!address) return;
                
                // 如果没有传 chainId，使用当前 chainId
                const targetChainId = chainId ?? get().currentChainId;
                if (!targetChainId) {
                    console.warn('[AccountStore] No chainId provided and no current chainId set');
                    return;
                }
                
                const { accounts } = get();
                const account = accounts[targetChainId]?.[address];
                if (!account) return;
                
                const newRecord: BoxInteractionRecord = {
                    boxId,
                    functionName,
                    timestamp: Date.now(),
                    chainId: targetChainId,
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
                
                
                console.log(`[AccountStore] Box interaction recorded: ${functionName} on Box ${boxId}`);
            },

            getBoxInteractions: (boxId) => {
                const address = get()._checkAccess?.('getBoxInteractions');
                if (!address) return [];
                
                const { accounts, currentChainId } = get();
                if (!currentChainId) return [];
                
                const interactions = accounts[currentChainId]?.[address]?.boxInteractions[boxId] || [];
                
                
                return interactions;
            },

            hasBoxInteraction: (boxId, functionName) => {
                const address = get()._checkAccess?.('hasBoxInteraction');
                if (!address) return false;
                
                const { accounts, currentChainId } = get();
                if (!currentChainId) return false;
                
                const interactions = accounts[currentChainId]?.[address]?.boxInteractions[boxId] || [];
                const hasInteraction = interactions.some((record: BoxInteractionRecord) => record.functionName === functionName);
                
                
                return hasInteraction;
            },

            clearBoxInteractions: (boxId) => {
                const address = get()._checkAccess?.('clearBoxInteractions');
                if (!address) return;
                
                const { accounts, currentChainId } = get();
                if (!currentChainId) return;
                
                const account = accounts[currentChainId]?.[address];
                if (!account) return;
                
                if (boxId) {
                    // 清除指定 Box 的交互记录
                    const newInteractions = { ...account.boxInteractions };
                    delete newInteractions[boxId];
                    
                    set({
                        accounts: {
                            ...accounts,
                            [currentChainId]: {
                                ...accounts[currentChainId],
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
                            [currentChainId]: {
                                ...accounts[currentChainId],
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
            cacheTx: (txHash, data, chainId01) => {
                const chainId = chainId01 ?? get().currentChainId;
                if (!chainId) return;
                const address = get()._checkAccess?.('cacheTx');
                if (!address) return;
                
                const { accounts } = get();
                const account = accounts[chainId]?.[address];
                if (!account) return;
                
                set({
                    accounts: {
                        ...accounts,
                        [chainId]: {
                            ...accounts[chainId],
                            [address]: {
                                ...account,
                                txCache: {
                                    ...account.txCache,
                                    [txHash]: {
                                        data,
                                        timestamp: Date.now(),
                                        chainId,
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
                
                const { accounts, currentChainId } = get();
                if (!currentChainId) return null;
                
                const cached = accounts[currentChainId]?.[address]?.txCache[txHash];
                
                // 检查缓存是否过期（5分钟）
                if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
                    return cached.data;
                }
                
                return null;
            },

            clearTxCache: (chainId01) => {
                const chainId = chainId01 ?? get().currentChainId;
                if (!chainId) return;
                const address = get()._checkAccess?.('clearTxCache');
                if (!address) return;
                
                const targetChainId = chainId ?? get().currentChainId;
                if (!targetChainId) return;
                
                const { accounts } = get();
                const account = accounts[targetChainId]?.[address];
                if (!account) return;
                
                if (chainId !== undefined) {
                    const filteredCache = Object.entries(account.txCache)
                        .filter(([_, value]: [string, any]) => value.chainId !== chainId)
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

            // === 钱包信息 ===
            // updateWalletInfo: (wallet) => {
            //     const address = get()._checkAccess?.('updateWalletInfo');
            //     if (!address) return;
                
            //     const { accounts, currentChainId } = get();
            //     if (!currentChainId) return;
                
            //     const account = accounts[currentChainId]?.[address];
            //     if (!account) return;
                
            //     set({
            //         accounts: {
            //             ...accounts,
            //             [currentChainId]: {
            //                 ...accounts[currentChainId],
            //                 [address]: {
            //                     ...account,
            //                     wallet: {
            //                         ...account.wallet!,
            //                         ...wallet,
            //                     },
            //                 },
            //             },
            //         },
            //     });
            // },

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

