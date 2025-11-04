import { create } from 'zustand';
import { EIP712Permit, PermitType } from '@/dapp/hooks/EIP712';
import { SessionInfo } from '@/dapp/hooks/SiweAuth';
import { useAccountStore } from './accountStore';

/**
 * ==================== 类型定义 ====================
 */

/**
 * enum PermitLabel { VIEW, TRANSFER, APPROVE }

    struct EIP712Permit {
        PermitLabel label;
        address owner;
        address spender;
        uint256 amount;
        uint256 deadline;
        SignatureRSV signature;
    }
 */

export type Eip712State = Partial<Record<PermitType, Record<string, EIP712Permit>>>;

export interface SecretAuditLog {
    timestamp: number;
    action: 'read' | 'write' | 'delete' | 'access_denied';
    resource: 'eip712' | 'siwe' | 'privateKey_TruthBox';
    details: string;
    address: string;
    chainId?: number;
}

export interface SecretState {
    eip712: Eip712State;
    siwe: SessionInfo;
    privateKey_TruthBox: Record<string, string>; // boxId -> privateKey
    auditLogs: SecretAuditLog[];
}

export interface SecretStoreState {
    secrets: Record<number, Record<string, SecretState>>;
    currentSession: SessionInfo;
    strictMode: boolean;
}

export interface SecretStoreMethods {
    _verifyAccess?: (operation: string, targetAddress?: string) => string | null;
    _getOrCreateSecretState: (address: string, chainId: number) => SecretState;
    _addAuditLog: (log: Omit<SecretAuditLog, 'timestamp'>) => void;

    setEip712Permit: (
        permitType: PermitType,
        spender: string,
        permit: EIP712Permit | null,
        chainId?: number,
        address?: string
    ) => void;
    getEip712Permit: (
        permitType: PermitType,
        spender: string,
        chainId?: number,
        address?: string
    ) => EIP712Permit | null;
    clearEip712Permits: (chainId?: number, address?: string) => void;
    setSiweSession: (
        session: SessionInfo,
        chainId?: number,
        address?: string
    ) => void;
    getSiweSession: (
        chainId?: number,
        address?: string
    ) => SessionInfo | null;
    clearSiweSession: (chainId?: number, address?: string) => void;
    setPrivateKey_TruthBox: (
        boxId: string, 
        privateKey: string,
        chainId?: number, 
        address?: string, 
    ) => void;
    getPrivateKey_TruthBox: (
        boxId: string,
        chainId?: number, 
        address?: string, 
    ) => string | null;
    clearPrivateKey_TruthBox: (
        boxId: string,
        chainId?: number, 
        address?: string, 
    ) => void;
    clearAccountSecrets: (address: string, chainId?: number) => void;
    clearAllSecrets: () => void;
    getAuditLogs: (address?: string, chainId?: number, limit?: number) => SecretAuditLog[];
    clearAuditLogs: (address?: string, chainId?: number) => void;
    setStrictMode: (strict: boolean) => void;
}

/**
 * ==================== 默认状态与工具 ====================
 */

const createDefaultSession = (): SessionInfo => ({
    isLoggedIn: false,
    token: null,
    expiresAt: null,
    address: null,
});

const createDefaultSecretState = (): SecretState => ({
    eip712: {},
    siwe: createDefaultSession(),
    privateKey_TruthBox: {},
    auditLogs: [],
});

const limitArraySize = <T>(arr: T[], maxSize: number): T[] => arr.slice(-maxSize);

const normalizeAddress = (address: string): string => address.toLowerCase();

const normalizeEip712State = (
    state: Partial<Record<PermitType, any>>
): Eip712State => {
    const normalized: Eip712State = {};
    if (!state || typeof state !== 'object') {
        return normalized;
    }

    Object.entries(state).forEach(([typeKey, value]) => {
        if (!value) {
            return;
        }

        const permitType = Number(typeKey) as PermitType;

        const assignPermit = (permit: EIP712Permit | null, fallbackSpender?: string) => {
            if (!permit) {
                return;
            }
            const spenderKey = (permit.spender || fallbackSpender || '').toLowerCase();
            if (!spenderKey) {
                return;
            }
            const existing = normalized[permitType] ?? {};
            normalized[permitType] = {
                ...existing,
                [spenderKey]: permit,
            };
        };

        if (typeof value === 'object' && !Array.isArray(value)) {
            if ('spender' in value && 'signature' in value) {
                assignPermit(value as EIP712Permit);
                return;
            }

            Object.entries(value as Record<string, EIP712Permit | null>).forEach(
                ([spenderKey, permitValue]) => {
                    if (permitValue && typeof permitValue === 'object') {
                        assignPermit(permitValue, spenderKey);
                    }
                }
            );
        }
    });

    return normalized;
};

/**
 * ==================== 会话存储与加密辅助 ====================
 */

const SECRET_STORAGE_KEY = 'wikitruth_secret_cache';
const SECRET_STORAGE_VERSION = 1;
const SECRET_TTL_MS = 5 * 60 * 1000; // TODO 测试时用5分钟，

type PersistedSessionInfo = Omit<SessionInfo, 'expiresAt'> & {
    expiresAt: string | null;
};

interface SerializableSecretState {
    eip712: Eip712State;
    siwe: PersistedSessionInfo;
    privateKey_TruthBox: Record<string, string>; 
    updatedAt: number;
}

interface PersistedSecretPayload {
    version: number;
    address: string;
    chainId: number;
    updatedAt: number;
    expiresAt: number;
    iv: string;
    data: string;
}

interface PersistedSecretContainer {
    version: number;
    records: Record<string, PersistedSecretPayload>;
}

const isBrowser = (): boolean =>
    typeof window !== 'undefined' &&
    typeof window.crypto !== 'undefined' &&
    typeof window.crypto.subtle !== 'undefined' &&
    typeof window.sessionStorage !== 'undefined';

let sessionCryptoKeyPromise: Promise<CryptoKey> | null = null;

const getSessionCryptoKey = async (): Promise<CryptoKey | null> => {
    if (!isBrowser()) {
        return null;
    }

    if (!sessionCryptoKeyPromise) {
        sessionCryptoKeyPromise = window.crypto.subtle.generateKey(
            {
                name: 'AES-GCM',
                length: 256,
            },
            true,
            ['encrypt', 'decrypt']
        );
    }

    return sessionCryptoKeyPromise;
};

const bufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i += 1) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

const base64ToBuffer = (value: string): ArrayBuffer => {
    const binary = window.atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
};

const toPersistedSiwe = (siwe: SessionInfo): PersistedSessionInfo => ({
    ...siwe,
    expiresAt: siwe.expiresAt ? siwe.expiresAt.toISOString() : null,
});

const fromPersistedSiwe = (siwe: PersistedSessionInfo): SessionInfo => ({
    ...siwe,
    expiresAt: siwe.expiresAt ? new Date(siwe.expiresAt) : null,
});

const serialiseSecretState = (state: SecretState): SerializableSecretState => ({
    eip712: normalizeEip712State(state.eip712),
    siwe: toPersistedSiwe(state.siwe),
    privateKey_TruthBox: state.privateKey_TruthBox,
    updatedAt: Date.now(),
});

const deserialiseSecretState = (payload: SerializableSecretState): SecretState => ({
    eip712: normalizeEip712State(payload.eip712),
    siwe: fromPersistedSiwe(payload.siwe),
    privateKey_TruthBox: payload.privateKey_TruthBox,
    auditLogs: [],
});

const loadPersistedContainer = (): PersistedSecretContainer => {
    if (!isBrowser()) {
        return {
            version: SECRET_STORAGE_VERSION,
            records: {},
        };
    }

    const raw = window.sessionStorage.getItem(SECRET_STORAGE_KEY);
    if (!raw) {
        return {
            version: SECRET_STORAGE_VERSION,
            records: {},
        };
    }

    try {
        const parsed = JSON.parse(raw) as PersistedSecretContainer;
        if (!parsed || parsed.version !== SECRET_STORAGE_VERSION || typeof parsed.records !== 'object') {
            return {
                version: SECRET_STORAGE_VERSION,
                records: {},
            };
        }
        return parsed;
    } catch (error) {
        console.warn('[SecretStore] Failed to parse persisted cache, clearing storage', error);
        window.sessionStorage.removeItem(SECRET_STORAGE_KEY);
        return {
            version: SECRET_STORAGE_VERSION,
            records: {},
        };
    }
};

const savePersistedContainer = (container: PersistedSecretContainer): void => {
    if (!isBrowser()) {
        return;
    }

    if (!Object.keys(container.records).length) {
        window.sessionStorage.removeItem(SECRET_STORAGE_KEY);
        return;
    }

    window.sessionStorage.setItem(SECRET_STORAGE_KEY, JSON.stringify(container));
};

const persistSecretStateEncrypted = (
    address: string,
    chainId: number,
    state: SecretState
): void => {
    if (!isBrowser()) {
        return;
    }

    const normalizedAddress = normalizeAddress(address);
    const payload = serialiseSecretState(state);

    const hasSession =
        Boolean(payload.siwe.token) &&
        Boolean(payload.siwe.address) &&
        Boolean(payload.siwe.isLoggedIn);

    const hasPermits = Object.values(payload.eip712).some(
        (permits) => permits && Object.keys(permits).length > 0
    );
    const hasPrivateKeys = Object.keys(payload.privateKey_TruthBox).length > 0;

    if (!hasSession && !hasPermits && !hasPrivateKeys) {
        const container = loadPersistedContainer();
        const key = `${chainId}:${normalizedAddress}`;
        if (container.records[key]) {
            delete container.records[key];
            savePersistedContainer(container);
        }
        return;
    }

    void (async () => {
        const cryptoKey = await getSessionCryptoKey();
        if (!cryptoKey) {
            return;
        }

        const encoder = new TextEncoder();
        const encoded = encoder.encode(JSON.stringify(payload));
        const iv = window.crypto.getRandomValues(new Uint8Array(12));

        try {
            const cipherBuffer = await window.crypto.subtle.encrypt(
                { name: 'AES-GCM', iv },
                cryptoKey,
                encoded
            );

            const now = Date.now();
            const expiresFromToken =
                payload.siwe.expiresAt && payload.siwe.expiresAt !== null
                    ? new Date(payload.siwe.expiresAt).getTime()
                    : now + SECRET_TTL_MS;
            const expiresAt = Math.min(now + SECRET_TTL_MS, expiresFromToken);

            const container = loadPersistedContainer();
            container.records[`${chainId}:${normalizedAddress}`] = {
                version: SECRET_STORAGE_VERSION,
                address: normalizedAddress,
                chainId,
                updatedAt: payload.updatedAt,
                expiresAt,
                iv: bufferToBase64(iv.buffer),
                data: bufferToBase64(cipherBuffer),
            };

            savePersistedContainer(container);
        } catch (error) {
            console.error('[SecretStore] Failed to persist secrets', error);
        }
    })();
};

const removePersistedState = (address: string, chainId: number): void => {
    if (!isBrowser()) {
        return;
    }

    const container = loadPersistedContainer();
    const key = `${chainId}:${normalizeAddress(address)}`;
    if (container.records[key]) {
        delete container.records[key];
        savePersistedContainer(container);
    }
};

const clearAllPersistedState = (): void => {
    if (!isBrowser()) {
        return;
    }
    window.sessionStorage.removeItem(SECRET_STORAGE_KEY);
};

/**
 * ==================== Store 实现 ====================
 */

type SecretStore = SecretStoreState & SecretStoreMethods;

export const useSecretStore = create<SecretStore>((set, get) => ({
    secrets: {},
    currentSession: createDefaultSession(),
    strictMode: true,

    _verifyAccess: (operation: string, targetAddress?: string): string | null => {
        const { strictMode } = get();
        const currentAccount = useAccountStore.getState().currentAccount;
        const currentChainId = useAccountStore.getState().currentChainId;

        const address = targetAddress || currentAccount;

        if (!address) {
            console.warn(`[SecretStore] Access denied: no active account - ${operation}`);
            if (strictMode) {
                get()._addAuditLog({
                    action: 'access_denied',
                    resource: 'eip712',
                    details: `No active account for ${operation}`,
                    address: 'unknown',
                });
            }
            return null;
        }

        if (
            strictMode &&
            currentAccount &&
            normalizeAddress(address) !== normalizeAddress(currentAccount)
        ) {
            console.warn(
                `[SecretStore] Access denied: address mismatch. current=${currentAccount}, requested=${address}, op=${operation}`
            );
            get()._addAuditLog({
                action: 'access_denied',
                resource: 'eip712',
                details: `Address mismatch: ${address} vs ${currentAccount}`,
                address,
                chainId: currentChainId ?? undefined,
            });
            return null;
        }

        return address;
    },

    _getOrCreateSecretState: (address: string, chainId: number): SecretState => {
        const key = normalizeAddress(address);
        const existingState = get().secrets[chainId]?.[key];
        if (existingState) {
            return existingState;
        }

        const defaultState = createDefaultSecretState();
        set((state) => {
            const chainSecrets = { ...(state.secrets[chainId] ?? {}) };
            chainSecrets[key] = defaultState;
            return {
                ...state,
                secrets: {
                    ...state.secrets,
                    [chainId]: chainSecrets,
                },
            };
        });

        return defaultState;
    },

    _addAuditLog: (log) => {
        const currentAccount = useAccountStore.getState().currentAccount;
        const currentChainId = useAccountStore.getState().currentChainId;

        if (!currentAccount || !currentChainId) {
            return;
        }

        const key = normalizeAddress(currentAccount);

        set((state) => {
            const chainSecrets = state.secrets[currentChainId];
            const secretState = chainSecrets?.[key];
            if (!secretState) {
                return state;
            }

            const newLog: SecretAuditLog = {
                ...log,
                timestamp: Date.now(),
                address: log.address || currentAccount,
                chainId: log.chainId || currentChainId,
            };

            return {
                ...state,
                secrets: {
                    ...state.secrets,
                    [currentChainId]: {
                        ...chainSecrets,
                        [key]: {
                            ...secretState,
                            auditLogs: limitArraySize([...secretState.auditLogs, newLog], 50),
                        },
                    },
                },
            };
        });
    },

    setEip712Permit: (permitType, spender, permit, chainId, address) => {
        const currentChainId = chainId ?? useAccountStore.getState().currentChainId;
        const verifiedAddress = get()._verifyAccess?.('setEip712Permit', address);

        if (!verifiedAddress || !currentChainId) {
            console.warn('[SecretStore] Cannot set EIP712 permit: access denied or chainId missing');
            return;
        }

        if (!spender) {
            console.warn('[SecretStore] Cannot set EIP712 permit: missing spender');
            return;
        }

        const normalizedSpender = spender.toLowerCase();
        const key = normalizeAddress(verifiedAddress);
        const baseState = get()._getOrCreateSecretState(verifiedAddress, currentChainId);
        const nextEip712 = { ...baseState.eip712 };
        const currentMap = nextEip712[permitType] ?? {};

        let auditAction: SecretAuditLog['action'] = 'write';
        let auditDetails = `Set permit ${permitType} for ${normalizedSpender}`;

        if (permit) {
            nextEip712[permitType] = {
                ...currentMap,
                [normalizedSpender]: permit,
            };
        } else {
            if (!currentMap[normalizedSpender]) {
                return;
            }
            const updatedMap = { ...currentMap };
            delete updatedMap[normalizedSpender];
            if (Object.keys(updatedMap).length > 0) {
                nextEip712[permitType] = updatedMap;
            } else {
                delete nextEip712[permitType];
            }
            auditAction = 'delete';
            auditDetails = `Clear permit ${permitType} for ${normalizedSpender}`;
        }

        const updatedState: SecretState = {
            ...baseState,
            eip712: nextEip712,
        };

        const stateWithLogs: SecretState = {
            ...updatedState,
            auditLogs: baseState.auditLogs,
        };

        set((state) => {
            const chainSecrets = { ...(state.secrets[currentChainId] ?? {}) };
            chainSecrets[key] = {
                ...stateWithLogs,
            };
            return {
                ...state,
                secrets: {
                    ...state.secrets,
                    [currentChainId]: chainSecrets,
                },
            };
        });

        persistSecretStateEncrypted(verifiedAddress, currentChainId, stateWithLogs);

        get()._addAuditLog({
            action: auditAction,
            resource: 'eip712',
            details: auditDetails,
            address: verifiedAddress,
            chainId: currentChainId,
        });
    },

    getEip712Permit: (permitType, spender, chainId, address) => {
        const currentChainId = chainId ?? useAccountStore.getState().currentChainId;
        const verifiedAddress = get()._verifyAccess?.('getEip712Permit', address);

        if (!verifiedAddress || !currentChainId) {
            console.warn('[SecretStore] Cannot get EIP712 permit: access denied or chainId missing');
            return null;
        }

        if (!spender) {
            console.warn('[SecretStore] Cannot get EIP712 permit: missing spender');
            return null;
        }

        const normalizedSpender = spender.toLowerCase();
        const key = normalizeAddress(verifiedAddress);
        const secretState = get().secrets[currentChainId]?.[key];
        const permit = secretState?.eip712[permitType]?.[normalizedSpender] ?? null;

        if (permit) {
            get()._addAuditLog({
                action: 'read',
                resource: 'eip712',
                details: `Read permit ${permitType} for ${normalizedSpender}`,
                address: verifiedAddress,
                chainId: currentChainId,
            });
        }

        return permit;
    },

    clearEip712Permits: (chainId, address) => {
        const currentChainId = chainId ?? useAccountStore.getState().currentChainId;
        const verifiedAddress = get()._verifyAccess?.('clearEip712Permits', address);

        if (!verifiedAddress || !currentChainId) {
            console.warn('[SecretStore] Cannot clear permits: access denied or chainId missing');
            return;
        }

        const key = normalizeAddress(verifiedAddress);
        const secretState = get().secrets[currentChainId]?.[key];
        if (!secretState) {
            return;
        }

        const updatedState: SecretState = {
            ...secretState,
            eip712: {},
        };

        set((state) => {
            const chainSecrets = { ...(state.secrets[currentChainId] ?? {}) };
            chainSecrets[key] = updatedState;
            return {
                ...state,
                secrets: {
                    ...state.secrets,
                    [currentChainId]: chainSecrets,
                },
            };
        });

        persistSecretStateEncrypted(verifiedAddress, currentChainId, updatedState);

        get()._addAuditLog({
            action: 'delete',
            resource: 'eip712',
            details: 'Clear all permits',
            address: verifiedAddress,
            chainId: currentChainId,
        });
    },

    setSiweSession: (session, chainId, address) => {
        const currentChainId = chainId ?? useAccountStore.getState().currentChainId;
        const verifiedAddress = get()._verifyAccess?.('setSiweSession', address);

        if (!verifiedAddress || !currentChainId) {
            console.warn('[SecretStore] Cannot set SIWE session: access denied or chainId missing');
            return;
        }

        const key = normalizeAddress(verifiedAddress);
        const baseState = get()._getOrCreateSecretState(verifiedAddress, currentChainId);
        const updatedState: SecretState = {
            ...baseState,
            siwe: session,
        };

        const currentAccount = useAccountStore.getState().currentAccount;
        const currentChain = useAccountStore.getState().currentChainId;
        const shouldUpdateCurrent =
            currentAccount &&
            currentChain !== undefined &&
            currentChain === currentChainId &&
            normalizeAddress(currentAccount) === key;

        set((state) => {
            const chainSecrets = { ...(state.secrets[currentChainId] ?? {}) };
            chainSecrets[key] = {
                ...updatedState,
                auditLogs: baseState.auditLogs,
            };
            return {
                ...state,
                secrets: {
                    ...state.secrets,
                    [currentChainId]: chainSecrets,
                },
                currentSession: shouldUpdateCurrent
                    ? session
                    : state.currentSession,
            };
        });

        persistSecretStateEncrypted(verifiedAddress, currentChainId, {
            ...updatedState,
            auditLogs: baseState.auditLogs,
        });

        get()._addAuditLog({
            action: 'write',
            resource: 'siwe',
            details: 'Set SIWE session',
            address: verifiedAddress,
            chainId: currentChainId,
        });
    },

    getSiweSession: (chainId, address) => {
        const currentChainId = chainId ?? useAccountStore.getState().currentChainId;
        const verifiedAddress = get()._verifyAccess?.('getSiweSession', address);

        if (!verifiedAddress || !currentChainId) {
            console.warn('[SecretStore] Cannot get SIWE session: access denied or chainId missing');
            return null;
        }

        const key = normalizeAddress(verifiedAddress);
        const secretState = get().secrets[currentChainId]?.[key];
        if (!secretState) {
            return null;
        }

        if (secretState.siwe.token) {
            get()._addAuditLog({
                action: 'read',
                resource: 'siwe',
                details: 'Read SIWE session',
                address: verifiedAddress,
                chainId: currentChainId,
            });
        }

        return secretState.siwe;
    },

    setPrivateKey_TruthBox: (boxId: string, privateKey: string, chainId?: number, address?: string) => {
        const currentChainId = chainId ?? useAccountStore.getState().currentChainId;
        const verifiedAddress = get()._verifyAccess?.('setPrivateKey', address);

        if (!verifiedAddress || !currentChainId) {
            console.warn('[SecretStore] Cannot set private key: access denied or chainId missing');
            return;
        }

        if (!boxId || !privateKey) {
            console.warn('[SecretStore] Cannot set private key: missing boxId or privateKey');
            return;
        }

        const normalizedBoxId = boxId.toString();
        const baseState = get()._getOrCreateSecretState(verifiedAddress, currentChainId);

        const updatedState: SecretState = {
            ...baseState,
            privateKey_TruthBox: {
                ...baseState.privateKey_TruthBox,
                [normalizedBoxId]: privateKey,
            },
        };

        const key = normalizeAddress(verifiedAddress);

        set((state) => {
            const chainSecrets = { ...(state.secrets[currentChainId] ?? {}) };
            chainSecrets[key] = {
                ...updatedState,
                auditLogs: baseState.auditLogs,
            };
            return {
                ...state,
                secrets: {
                    ...state.secrets,
                    [currentChainId]: chainSecrets,
                },
            };
        });

        persistSecretStateEncrypted(verifiedAddress, currentChainId, {
            ...updatedState,
            auditLogs: baseState.auditLogs,
        });

        get()._addAuditLog({
            action: 'write',
            resource: 'privateKey_TruthBox',
            details: `Set private key for box ${normalizedBoxId}`,
            address: verifiedAddress,
            chainId: currentChainId,
        });
    },

    getPrivateKey_TruthBox: (boxId: string, chainId?: number, address?: string) => {
        const currentChainId = chainId ?? useAccountStore.getState().currentChainId;
        const verifiedAddress = get()._verifyAccess?.('getPrivateKey', address);

        if (!verifiedAddress || !currentChainId) {
            console.warn('[SecretStore] Cannot get private key: access denied or chainId missing');
            return null;
        }

        if (!boxId) {
            return null;
        }

        const normalizedBoxId = boxId.toString();

        const key = normalizeAddress(verifiedAddress);
        const secretState = get().secrets[currentChainId]?.[key];
        const privateKey = secretState?.privateKey_TruthBox?.[normalizedBoxId];

        if (privateKey) {
            get()._addAuditLog({
                action: 'read',
                resource: 'privateKey_TruthBox',
                details: `Read private key for box ${normalizedBoxId}`,
                address: verifiedAddress,
                chainId: currentChainId,
            });
        }

        return privateKey ?? null;
    },

    clearPrivateKey_TruthBox: (boxId: string, chainId?: number, address?: string) => {
        const currentChainId = chainId ?? useAccountStore.getState().currentChainId;
        const verifiedAddress = get()._verifyAccess?.('clearPrivateKey', address);

        if (!verifiedAddress || !currentChainId) {
            console.warn('[SecretStore] Cannot clear private key: access denied or chainId missing');
            return;
        }

        if (!boxId) {
            console.warn('[SecretStore] Cannot clear private key: missing boxId');
            return;
        }

        const normalizedBoxId = boxId.toString();

        const key = normalizeAddress(verifiedAddress);
        const secretState = get().secrets[currentChainId]?.[key];
        if (!secretState || !secretState.privateKey_TruthBox?.[normalizedBoxId]) {
            return;
        }

        const updatedMap = { ...secretState.privateKey_TruthBox };
        delete updatedMap[normalizedBoxId];

        const updatedState: SecretState = {
            ...secretState,
            privateKey_TruthBox: updatedMap,
        };

        set((state) => {
            const chainSecrets = { ...(state.secrets[currentChainId] ?? {}) };
            chainSecrets[key] = updatedState;
            return {
                ...state,
                secrets: {
                    ...state.secrets,
                    [currentChainId]: chainSecrets,
                },
            };
        });

        persistSecretStateEncrypted(verifiedAddress, currentChainId, updatedState);

        get()._addAuditLog({
            action: 'delete',
            resource: 'privateKey_TruthBox',
            details: `Clear private key for box ${normalizedBoxId}`,
            address: verifiedAddress,
            chainId: currentChainId,
        });
    },

    clearSiweSession: (chainId, address) => {
        const currentChainId = chainId ?? useAccountStore.getState().currentChainId;
        const verifiedAddress = get()._verifyAccess?.('clearSiweSession', address);

        if (!verifiedAddress || !currentChainId) {
            console.warn('[SecretStore] Cannot clear SIWE session: access denied or chainId missing');
            return;
        }

        const key = normalizeAddress(verifiedAddress);
        const secretState = get().secrets[currentChainId]?.[key];
        if (!secretState) {
            return;
        }

        const clearedSession = createDefaultSession();
        const updatedState: SecretState = {
            ...secretState,
            siwe: clearedSession,
        };

        const currentAccount = useAccountStore.getState().currentAccount;
        const currentChain = useAccountStore.getState().currentChainId;
        const shouldUpdateCurrent =
            currentAccount &&
            currentChain !== undefined &&
            currentChain === currentChainId &&
            normalizeAddress(currentAccount) === key;

        set((state) => {
            const chainSecrets = { ...(state.secrets[currentChainId] ?? {}) };
            chainSecrets[key] = updatedState;
            return {
                ...state,
                secrets: {
                    ...state.secrets,
                    [currentChainId]: chainSecrets,
                },
                currentSession: shouldUpdateCurrent ? clearedSession : state.currentSession,
            };
        });

        persistSecretStateEncrypted(verifiedAddress, currentChainId, updatedState);

        get()._addAuditLog({
            action: 'delete',
            resource: 'siwe',
            details: 'Clear SIWE session',
            address: verifiedAddress,
            chainId: currentChainId,
        });
    },

    clearAccountSecrets: (address, chainId) => {
        if (!address) {
            console.warn('[SecretStore] Cannot clear secrets: address missing');
            return;
        }

        const normalizedAddress = normalizeAddress(address);
        const targetChainId = chainId ?? null;

        set((state) => {
            const newSecrets: Record<number, Record<string, SecretState>> = {};
            let removedCurrentSession = false;

            const currentAccount = useAccountStore.getState().currentAccount;
            const currentChainId = useAccountStore.getState().currentChainId;
            const isCurrentAccount =
                currentAccount && normalizeAddress(currentAccount) === normalizedAddress;

            Object.entries(state.secrets).forEach(([chainKey, records]) => {
                const cid = Number(chainKey);
                if (targetChainId !== null && cid !== targetChainId) {
                    newSecrets[cid] = records;
                    return;
                }

                const chainRecords = { ...records };
                if (chainRecords[normalizedAddress]) {
                    delete chainRecords[normalizedAddress];
                    removePersistedState(address, cid);
                    if (isCurrentAccount && currentChainId === cid) {
                        removedCurrentSession = true;
                    }
                }

                if (Object.keys(chainRecords).length) {
                    newSecrets[cid] = chainRecords;
                }
            });

            return {
                ...state,
                secrets: newSecrets,
                currentSession: removedCurrentSession ? createDefaultSession() : state.currentSession,
            };
        });
    },

    clearAllSecrets: () => {
        set(() => ({
            secrets: {},
            currentSession: createDefaultSession(),
            strictMode: true,
        }));
        clearAllPersistedState();
        console.warn('[SecretStore] All secrets cleared (dangerous operation)');
    },

    getAuditLogs: (address, chainId, limit = 20) => {
        const currentChainId = chainId ?? useAccountStore.getState().currentChainId;
        const verifiedAddress = address || useAccountStore.getState().currentAccount;

        if (!verifiedAddress || currentChainId === undefined || currentChainId === null) {
            return [];
        }

        const key = normalizeAddress(verifiedAddress);
        const secretState = get().secrets[currentChainId]?.[key];
        return secretState ? secretState.auditLogs.slice(-limit) : [];
    },

    clearAuditLogs: (address, chainId) => {
        const currentChainId = chainId ?? useAccountStore.getState().currentChainId;
        const verifiedAddress = address || useAccountStore.getState().currentAccount;

        if (!verifiedAddress || currentChainId === undefined || currentChainId === null) {
            return;
        }

        const key = normalizeAddress(verifiedAddress);
        const secretState = get().secrets[currentChainId]?.[key];
        if (!secretState) {
            return;
        }

        set((state) => {
            const chainSecrets = { ...(state.secrets[currentChainId] ?? {}) };
            chainSecrets[key] = {
                ...secretState,
                auditLogs: [],
            };
            return {
                ...state,
                secrets: {
                    ...state.secrets,
                    [currentChainId]: chainSecrets,
                },
            };
        });
    },

    setStrictMode: (strict) => {
        set((state) => ({
            ...state,
            strictMode: strict,
        }));
        console.log(`[SecretStore] Strict mode ${strict ? 'enabled' : 'disabled'}`);
    },
}));

/**
 * ==================== 持久化恢复 ====================
 */

const restorePersistedSecrets = (): void => {
    if (!isBrowser()) {
        return;
    }

    void (async () => {
        const container = loadPersistedContainer();
        const cryptoKey = await getSessionCryptoKey();
        if (!cryptoKey) {
            return;
        }

        const decoder = new TextDecoder();
        const now = Date.now();
        const updatedRecords: Record<string, PersistedSecretPayload> = {};
        const restored: Record<number, Record<string, SecretState>> = {};

        let mutated = false;

        for (const [recordKey, record] of Object.entries(container.records)) {
            if (record.expiresAt <= now) {
                mutated = true;
                continue;
            }

            try {
                const decrypted = await window.crypto.subtle.decrypt(
                    {
                        name: 'AES-GCM',
                        iv: new Uint8Array(base64ToBuffer(record.iv)),
                    },
                    cryptoKey,
                    base64ToBuffer(record.data)
                );

                const decoded = decoder.decode(decrypted);
                const payload = JSON.parse(decoded) as SerializableSecretState;
                const chainRecords = restored[record.chainId] ?? {};
                chainRecords[record.address] = deserialiseSecretState(payload);
                restored[record.chainId] = chainRecords;
                updatedRecords[recordKey] = record;
                mutated = true;
            } catch (error) {
                console.warn('[SecretStore] Failed to decrypt persisted record, dropping', error);
                mutated = true;
            }
        }

        if (!mutated) {
            return;
        }

        savePersistedContainer({
            version: SECRET_STORAGE_VERSION,
            records: updatedRecords,
        });

        useSecretStore.setState((state) => {
            const mergedSecrets = { ...state.secrets };
            Object.entries(restored).forEach(([chainKey, records]) => {
                const chainId = Number(chainKey);
                mergedSecrets[chainId] = {
                    ...(mergedSecrets[chainId] ?? {}),
                    ...records,
                };
            });

            const currentAccount = useAccountStore.getState().currentAccount;
            const currentChainId = useAccountStore.getState().currentChainId;

            let nextSession = state.currentSession;
            if (currentAccount && currentChainId !== undefined && currentChainId !== null) {
                const normalized = normalizeAddress(currentAccount);
                const existing = mergedSecrets[currentChainId]?.[normalized];
                if (existing?.siwe) {
                    nextSession = existing.siwe;
                }
            }

            return {
                ...state,
                secrets: mergedSecrets,
                currentSession: nextSession,
            };
        });
    })();
};

if (typeof window !== 'undefined') {
    restorePersistedSecrets();
}
