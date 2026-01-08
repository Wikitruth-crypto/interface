import { create } from 'zustand';
import type { EIP712Permit, PermitType } from '@dapp/hooks/EIP712';
import type { SessionInfo } from '@dapp/hooks/SiweAuth/types';
import { useAccountStore } from './accountStore';
import { CHAIN_ID } from '@dapp/config/contractsConfig';

type PermitBySpender = Record<string, EIP712Permit>;
type PermitByContract = Record<string, Record<PermitType, PermitBySpender>>;

interface EphemeralSecretState {
  eip712Permits: Record<number, Record<string, PermitByContract>>;
  siweSessions: Record<number, Record<string, SessionInfo>>;
  truthBoxKeys: Record<number, Record<string, Record<string, string>>>;
  currentSession: SessionInfo;
}

interface EphemeralSecretActions {
  setEip712Permit: (
    permitType: PermitType,
    spender: string,
    contractAddress: string, // Added
    permit: EIP712Permit | null,
    chainId?: number,
    address?: string
  ) => void;
  getEip712Permit: (
    permitType: PermitType,
    spender: string,
    contractAddress: string, // Added
    chainId?: number,
    address?: string
  ) => EIP712Permit | null;
  getAccountPermits: (
    chainId?: number,
    address?: string
  ) => PermitByContract | undefined;
  clearEip712Permits: (chainId?: number, address?: string) => void;

  setSiweSession: (session: SessionInfo, chainId?: number, address?: string) => void;
  getSiweSession: (chainId?: number, address?: string) => SessionInfo | null;
  clearSiweSession: (chainId?: number, address?: string) => void;

  setPrivateKey_TruthBox: (
    boxId: string,
    privateKey: string,
    chainId?: number,
    address?: string
  ) => void;
  getPrivateKey_TruthBox: (
    boxId: string,
    chainId?: number,
    address?: string
  ) => string | null;
  clearPrivateKey_TruthBox: (
    boxId: string,
    chainId?: number,
    address?: string
  ) => void;

  clearAccountData: (address: string, chainId?: number) => void;
  clearAll: () => void;
}

type EphemeralSecretStore = EphemeralSecretState & EphemeralSecretActions;

const createEmptySession = (): SessionInfo => ({
  isLoggedIn: false,
  token: null,
  expiresAt: null,
  address: null,
});

const resolveContext = (chainId?: number, address?: string) => {
  const { currentAccount} = useAccountStore.getState();
  const resolvedChainId = chainId ?? CHAIN_ID ?? undefined;
  const resolvedAddress = address ?? currentAccount ?? undefined;

  if (resolvedChainId === undefined || !resolvedAddress) {
    return null;
  }

  return {
    chainId: resolvedChainId,
    address: resolvedAddress.toLowerCase(),
  };
};

const createPermitBucket = (): PermitByContract =>
  Object.create(null) as PermitByContract;

const createPrivateKeyBucket = (): Record<string, string> =>
  Object.create(null) as Record<string, string>;

const ensureNestedRecord = <T>(
  root: Record<number, Record<string, T>>,
  chainId: number,
  address: string,
  fallback: () => T
): { rootClone: Record<number, Record<string, T>>; entry: T } => {
  const rootClone = { ...root };
  const chainEntry = { ...(rootClone[chainId] ?? {}) };
  let value = chainEntry[address];

  if (!value) {
    value = fallback();
  } else if (Array.isArray(value) || typeof value !== 'object') {
    value = fallback();
  } else {
    value = { ...(value as object) } as T;
  }

  chainEntry[address] = value;
  rootClone[chainId] = chainEntry;

  return { rootClone, entry: value };
};

const cleanupNestedRecord = <T>(
  root: Record<number, Record<string, T>>,
  chainId: number,
  address: string,
  entry: T
) => {
  const chainEntry = root[chainId];
  if (!chainEntry) {
    return;
  }

  if (
    typeof entry === 'object' &&
    entry !== null &&
    Object.keys(entry as object).length === 0
  ) {
    delete chainEntry[address];
  } else {
    chainEntry[address] = entry;
  }

  if (Object.keys(chainEntry).length === 0) {
    delete root[chainId];
  } else {
    root[chainId] = chainEntry;
  }
};

export const useSimpleSecretStore = create<EphemeralSecretStore>((set, get) => ({
  eip712Permits: {},
  siweSessions: {},
  truthBoxKeys: {},
  currentSession: createEmptySession(),

  setEip712Permit: (
    permitType, 
    spender, 
    contractAddress,
    permit, 
    chainId, 
    address
  ) => {
    const context = resolveContext(chainId, address);
    if (!context || !contractAddress) {
      return;
    }

    const normalizedSpender = spender.toLowerCase();
    const normalizedContract = contractAddress.toLowerCase();

    set((state) => {
      const { rootClone: chainClone, entry: accountEntry } = ensureNestedRecord<
        PermitByContract
      >(state.eip712Permits, context.chainId, context.address, createPermitBucket);

      const contractEntry = { ...(accountEntry[normalizedContract] ?? {}) };
      const typeEntry = { ...(contractEntry[permitType] ?? {}) };

      if (permit) {
        typeEntry[normalizedSpender] = permit;
      } else {
        delete typeEntry[normalizedSpender];
      }

      if (Object.keys(typeEntry).length > 0) {
        contractEntry[permitType] = typeEntry;
      } else {
        delete contractEntry[permitType];
      }

      if (Object.keys(contractEntry).length > 0) {
        accountEntry[normalizedContract] = contractEntry;
      } else {
        delete accountEntry[normalizedContract];
      }

      cleanupNestedRecord(chainClone, context.chainId, context.address, accountEntry);

      return {
        eip712Permits: chainClone,
      };
    });
  },

  getEip712Permit: (
    permitType, 
    spender, 
    contractAddress,
    chainId, 
    address
  ) => {
    const context = resolveContext(chainId, address);
    if (!context || !contractAddress) {
      return null;
    }

    const normalizedContract = contractAddress.toLowerCase();
    const normalizedSpender = spender.toLowerCase();

    const chainEntry = get().eip712Permits[context.chainId];
    const accountEntry = chainEntry?.[context.address];
    const contractEntry = accountEntry?.[normalizedContract];
    const typeEntry = contractEntry?.[permitType];
    return typeEntry?.[normalizedSpender] ?? null;
  },

  getAccountPermits: (chainId, address) => {
    const context = resolveContext(chainId, address);
    if (!context) {
      return undefined;
    }
    // Return permits for all contracts, maintaining backward compatibility
    // Note: Return type has changed, now includes contractAddress level
    return get().eip712Permits[context.chainId]?.[context.address];
  },

  clearEip712Permits: (chainId, address) => {
    const context = resolveContext(chainId, address);
    if (!context) {
      return;
    }

    set((state) => {
      const chainClone = { ...state.eip712Permits };
      const chainEntry = state.eip712Permits[context.chainId];
      if (!chainEntry) {
        return state;
      }

      const updatedChain = { ...chainEntry };
      delete updatedChain[context.address];

      if (Object.keys(updatedChain).length === 0) {
        delete chainClone[context.chainId];
      } else {
        chainClone[context.chainId] = updatedChain;
      }

      return {
        eip712Permits: chainClone,
      };
    });
  },

  setSiweSession: (session, chainId, address) => {
    const context = resolveContext(chainId, address);
    if (!context) {
      return;
    }

    const normalizedSession: SessionInfo = {
      ...session,
      address: session.address ?? (address as `0x${string}` | null) ?? null,
    };

    set((state) => {
      const sessionsClone = { ...state.siweSessions };
      const chainEntry = { ...(sessionsClone[context.chainId] ?? {}) };
      chainEntry[context.address] = normalizedSession;
      sessionsClone[context.chainId] = chainEntry;

      const { currentAccount} = useAccountStore.getState();
      const shouldUpdateCurrent =
        currentAccount &&
        CHAIN_ID !== null &&
        CHAIN_ID !== undefined &&
        CHAIN_ID === context.chainId &&
        currentAccount.toLowerCase() === context.address;

      return {
        siweSessions: sessionsClone,
        currentSession: shouldUpdateCurrent ? normalizedSession : state.currentSession,
      };
    });
  },

  getSiweSession: (chainId, address) => {
    const context = resolveContext(chainId, address);
    if (!context) {
      return null;
    }

    return (
      get().siweSessions[context.chainId]?.[context.address] ?? null
    );
  },

  clearSiweSession: (chainId, address) => {
    const context = resolveContext(chainId, address);
    if (!context) {
      return;
    }

    set((state) => {
      const sessionsClone = { ...state.siweSessions };
      const chainEntry = state.siweSessions[context.chainId];
      if (!chainEntry) {
        return state;
      }

      const updatedChain = { ...chainEntry };
      delete updatedChain[context.address];

      if (Object.keys(updatedChain).length === 0) {
        delete sessionsClone[context.chainId];
      } else {
        sessionsClone[context.chainId] = updatedChain;
      }

      const { currentAccount } = useAccountStore.getState();
      const isCurrent =
        currentAccount &&
        CHAIN_ID !== null &&
        CHAIN_ID !== undefined &&
        CHAIN_ID === context.chainId &&
        currentAccount.toLowerCase() === context.address;

      return {
        siweSessions: sessionsClone,
        currentSession: isCurrent ? createEmptySession() : state.currentSession,
      };
    });
  },

  setPrivateKey_TruthBox: (boxId, privateKey, chainId, address) => {
    const context = resolveContext(chainId, address);
    if (!context || !boxId) {
      return;
    }

    set((state) => {
      const { rootClone: chainClone, entry: accountEntry } = ensureNestedRecord<
        Record<string, string>
      >(state.truthBoxKeys, context.chainId, context.address, createPrivateKeyBucket);

      accountEntry[boxId] = privateKey;

      cleanupNestedRecord(chainClone, context.chainId, context.address, accountEntry);

      return {
        truthBoxKeys: chainClone,
      };
    });
  },

  getPrivateKey_TruthBox: (boxId, chainId, address) => {
    const context = resolveContext(chainId, address);
    if (!context || !boxId) {
      return null;
    }

    return (
      get().truthBoxKeys[context.chainId]?.[context.address]?.[boxId] ?? null
    );
  },

  clearPrivateKey_TruthBox: (boxId, chainId, address) => {
    const context = resolveContext(chainId, address);
    if (!context || !boxId) {
      return;
    }

    set((state) => {
      const chainClone = { ...state.truthBoxKeys };
      const chainEntry = state.truthBoxKeys[context.chainId];
      if (!chainEntry) {
        return state;
      }

      const updatedChain = { ...chainEntry };
      const accountEntry = { ...(updatedChain[context.address] ?? {}) };
      delete accountEntry[boxId];

      if (Object.keys(accountEntry).length === 0) {
        delete updatedChain[context.address];
      } else {
        updatedChain[context.address] = accountEntry;
      }

      if (Object.keys(updatedChain).length === 0) {
        delete chainClone[context.chainId];
      } else {
        chainClone[context.chainId] = updatedChain;
      }

      return {
        truthBoxKeys: chainClone,
      };
    });
  },

  clearAccountData: (address, chainId) => {
    const context = resolveContext(chainId, address);
    if (!context) {
      return;
    }

    set((state) => {
      const eip712Clone = { ...state.eip712Permits };
      const siweClone = { ...state.siweSessions };
      const truthBoxClone = { ...state.truthBoxKeys };

      const eip712Chain = eip712Clone[context.chainId];
      if (eip712Chain) {
        const updated = { ...eip712Chain };
        delete updated[context.address];
        if (Object.keys(updated).length === 0) {
          delete eip712Clone[context.chainId];
        } else {
          eip712Clone[context.chainId] = updated;
        }
      }

      const siweChain = siweClone[context.chainId];
      if (siweChain) {
        const updated = { ...siweChain };
        delete updated[context.address];
        if (Object.keys(updated).length === 0) {
          delete siweClone[context.chainId];
        } else {
          siweClone[context.chainId] = updated;
        }
      }

      const truthChain = truthBoxClone[context.chainId];
      if (truthChain) {
        const updated = { ...truthChain };
        delete updated[context.address];
        if (Object.keys(updated).length === 0) {
          delete truthBoxClone[context.chainId];
        } else {
          truthBoxClone[context.chainId] = updated;
        }
      }

      const { currentAccount} = useAccountStore.getState();
      const shouldResetSession =
        currentAccount &&
        CHAIN_ID !== null &&
        CHAIN_ID !== undefined &&
        CHAIN_ID === context.chainId &&
        currentAccount.toLowerCase() === context.address;

      return {
        eip712Permits: eip712Clone,
        siweSessions: siweClone,
        truthBoxKeys: truthBoxClone,
        currentSession: shouldResetSession ? createEmptySession() : state.currentSession,
      };
    });
  },

  clearAll: () =>
    set({
      eip712Permits: {},
      siweSessions: {},
      truthBoxKeys: {},
      currentSession: createEmptySession(),
    }),
}));

export type { EphemeralSecretStore };
