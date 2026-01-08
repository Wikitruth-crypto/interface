import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { FunctionNameType,FunctionNameType_FundManager} from '@dapp/types/typesDapp/contracts';
import { CHAIN_ID } from '@dapp/config/contractsConfig/current';


export interface LoginRecord {
    loginTime: number;
    logoutTime: number | null;
    CHAIN_ID: number;
    sessionId: string; 
}

export interface TransactionCache {
    [txHash: string]: {
        data: any;
        timestamp: number;
        CHAIN_ID: number;
    };
}

export interface MultiSigInfo {
    isMultiSig: boolean;
    threshold: number | null;
    owners: string[] | null;
    pendingTransactions: number;
}

export interface BoxInteractionRecord {
    boxId: string;
    functionWrote: FunctionNameType;
    timestamp: number;
    CHAIN_ID: number;
    txHash?: string; 
}

export interface BoxInteractionsMap {
    [boxId: string]: BoxInteractionRecord[];
}

export interface UserWithdrawRecord {
    functionWrote: FunctionNameType_FundManager;
    tokenAddress: string;
    timestamp: number;
    CHAIN_ID: number;
    txHash?: string;
}

export interface TokenAllowance {
    amount: string; 
    lastUpdated: number; 
}

export interface AccountState {
    address: string; 
    userId: string;
    loginHistory: LoginRecord[]; 
    currentSessionId: string | null; 
    
    multiSig: MultiSigInfo | null;
    boxInteractions: BoxInteractionsMap; 
    withdrawInteractions: UserWithdrawRecord[];
    txCache: TransactionCache;
    createdAt: number;
    lastActiveAt: number;
}

export interface AccountStoreState {
    currentAccount: string | null;

    accounts: {
        [CHAIN_ID: number]: {
            [address: string]: AccountState;
        };
    };
    
    // is enable security mode (strict access control)
    securityMode: 'strict' | 'normal';
}

export interface AccountStoreMethods {
    // === internal method (do not call directly) ===
    _checkAccess?: (operation: string) => string | null;
    
    // === account management ===
    setCurrentAccount: (address: string | null) => void;
    initAccount: (address: string) => void;
    removeAccount: (address: string) => void;
    setUserId: (userId: string) => void;
    
    // === session management ===
    startSession: (CHAIN_ID?: number) => void;
    endSession: () => void;
    getLoginHistory: (limit?: number) => LoginRecord[];
    
    // === multi-sig information ===
    setMultiSigInfo: (info: MultiSigInfo) => void;
    getMultiSigInfo: () => MultiSigInfo | null;
    
    // === Box interaction record ===
    addBoxInteraction: (boxId: string, functionWrote: FunctionNameType, txHash?: string) => void;
    getBoxInteractions: (boxId: string) => BoxInteractionRecord[];
    hasBoxInteraction: (boxId: string, functionWrote: FunctionNameType) => boolean;
    clearBoxInteractions: (boxId?: string) => void;

    // === User rewards withdraw record ===
    addWithdrawInteraction: (functionWrote: FunctionNameType_FundManager, tokenAddress: string, txHash?: string) => void;
    getWithdrawInteractions: (functionWrote: FunctionNameType_FundManager) => UserWithdrawRecord[];
    hasWithdrawInteraction: (functionWrote: FunctionNameType_FundManager, tokenAddress: string) => boolean;
    clearWithdrawInteractions: (functionWrote: FunctionNameType_FundManager) => void;
    
    // === transaction cache ===
    cacheTx: ( txHash: string, data: any) => void;
    getTxCache: (txHash: string) => any | null;
    clearTxCache: (CHAIN_ID?: number) => void;
    
    // === security mode ===
    setSecurityMode: (mode: 'strict' | 'normal') => void;
    
    // === utility methods ===
    clearCurrentAccount: () => void;
    clearAllAccounts: () => void;
}

// ==================== default value ====================

const createDefaultAccountState = (address: string, CHAIN_ID: number): AccountState => ({
    address,
    userId: '',
    loginHistory: [],
    currentSessionId: null,
    multiSig: null,
    boxInteractions: {},
    withdrawInteractions: [],
    txCache: {},
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
});

// ==================== utility functions ====================

/**
 * generate unique session ID
 */
const generateSessionId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

/**
 * limit array size (for logging and history)
 */
const limitArraySize = <T>(arr: T[], maxSize: number): T[] => {
    return arr.slice(-maxSize);
};

// ==================== Store implementation ====================

type AccountStore = AccountStoreState & AccountStoreMethods;

export const useAccountStore = create<AccountStore>()(
    devtools(
        (set, get) => ({
            // === initial state ===
            currentAccount: null,
            CHAIN_ID: null,
            accounts: {},
            securityMode: 'strict',

            // === security access control helper function (internal use) ===
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

            // === account management ===
            setCurrentAccount: (address) => {
                set({ currentAccount: address });
                
                // update last active time
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
                // ensure the account object exists for this chain
                if (!accounts[CHAIN_ID]) {
                    accounts[CHAIN_ID] = {};
                }
                
                if (!accounts[CHAIN_ID][address]) {
                    // new account, create default state
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
                    // account already exists, only update last active time
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

            // === session management ===
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

            // === multi-sig information ===
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

            // === Box interaction record ===
            addBoxInteraction: (boxId, functionWrote, txHash) => {
                const address = get()._checkAccess?.('addBoxInteraction');
                if (!address) return;
                
                // if no chainId is provided, use current CHAIN_ID
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
                    // clear interactions record for specified Box
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
                    // clear all Box interactions record
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

            // === User rewards withdraw record ===
            addWithdrawInteraction: (functionWrote, tokenAddress, txHash) => {
                const address = get()._checkAccess?.('addWithdrawInteraction');
                if (!address) return;
                
                const targetChainId = CHAIN_ID;
                if (!targetChainId) {
                    console.warn('[AccountStore] No CHAIN_ID provided and no current CHAIN_ID set');
                    return;
                }
                
                const { accounts } = get();
                const account = accounts[targetChainId]?.[address];
                if (!account) return;
                
                const newRecord: UserWithdrawRecord = {
                    functionWrote,
                    tokenAddress,
                    timestamp: Date.now(),
                    CHAIN_ID: targetChainId,
                    txHash,
                };
                
                set({
                    accounts: {
                        ...accounts,
                        [targetChainId]: {
                            ...accounts[targetChainId],
                            [address]: {
                                ...account,
                                withdrawInteractions: [...account.withdrawInteractions, newRecord],
                            },
                        },
                    },
                });
            },

            getWithdrawInteractions: (functionWrote) => {
                const address = get()._checkAccess?.('getWithdrawInteractions');
                if (!address) return [];

                const { accounts } = get();
                if (!CHAIN_ID) return [];

                const interactions = accounts[CHAIN_ID]?.[address]?.withdrawInteractions || [];
                return interactions.filter((record: UserWithdrawRecord) => record.functionWrote === functionWrote);
            },
            
            hasWithdrawInteraction: (functionWrote, tokenAddress) => {
                const address = get()._checkAccess?.('hasWithdrawInteraction');
                if (!address) return false;
                
                const { accounts } = get();
                if (!CHAIN_ID) return false;
                
                const interactions = accounts[CHAIN_ID]?.[address]?.withdrawInteractions || [];
                
                // Check if there's a matching record with same functionWrote and tokenAddress
                const hasInteraction = interactions.some((record: UserWithdrawRecord) => {
                    const functionMatch = record.functionWrote === functionWrote;
                    const tokenMatch = record.tokenAddress.toLowerCase() === tokenAddress.toLowerCase();
                    
                    return functionMatch && tokenMatch;
                });
                
                return hasInteraction;
            },
            
            clearWithdrawInteractions: (functionWrote) => {
                const address = get()._checkAccess?.('clearWithdrawInteractions');
                if (!address) return;
                
                const { accounts } = get();
                if (!CHAIN_ID) return;
                
                const account = accounts[CHAIN_ID]?.[address];
                if (!account) return;
                
                // Filter out records with the specified functionWrote
                const filteredInteractions = account.withdrawInteractions.filter(
                    (record: UserWithdrawRecord) => record.functionWrote !== functionWrote
                );
                
                set({
                    accounts: {
                        ...accounts,
                        [CHAIN_ID]: {
                            ...accounts[CHAIN_ID],
                            [address]: {
                                ...account,
                                withdrawInteractions: filteredInteractions,
                            },
                        },
                    },
                });
            },

            // === transaction cache ===
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
                
                // check if cache is expired (5 minutes)
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

            // === security mode ===
            setSecurityMode: (mode) => {
                set({ securityMode: mode });
            },

            // === utility methods ===
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

