import { create } from 'zustand';
import { ClaimMethodType, FundType } from '../types/cardProfile.types';

export interface SelectableItem {
    boxId: string;
    tokenSymbol: string;
    tokenAddress?: string;
    tokenDecimals?: number;
    type: FundType;
    claimMethod: ClaimMethodType;
    amount: string;
    hasValidAmount: boolean;
}

export interface WithdrawDataType {
    selectedClaimMethod: ClaimMethodType | null;
    selectedBoxes: string[] | null;
    selectedTokenSymbol: string | null;
    selectedTokenAddress: string | null;
    selectedTokenDecimals: number | null;
    selectedType: FundType | null;
}

interface WithdrawState {
    withdrawData: WithdrawDataType;
    registeredItems: Map<string, SelectableItem>;
}

interface WithdrawActions {
    updateWithdrawData: (updates: Partial<WithdrawDataType>) => void;
    resetWithdrawData: () => void;
    handleRadioSelect: (
        boxId: string,
        tokenSymbol: string,
        type: FundType,
        claimMethod: ClaimMethodType,
        amount: string
    ) => void;
    handleRadioDeselect: (boxId: string) => void;
    isRadioSelected: (boxId: string, tokenSymbol: string) => boolean;
    canClaim: () => boolean;
    totalAmount: () => bigint;
    addBoxToSelection: (boxId: string) => void;
    removeBoxFromSelection: (boxId: string) => void;
    registerSelectableItem: (item: SelectableItem) => void;
    unregisterSelectableItem: (boxId: string, tokenSymbol: string) => void;
    getMatchingItems: (tokenSymbol: string, type: FundType, claimMethod: ClaimMethodType) => SelectableItem[];
    resetAllState: () => void;
}

const initialWithdrawData: WithdrawDataType = {
    selectedClaimMethod: null,
    selectedBoxes: null,
    selectedTokenSymbol: null,
    selectedTokenAddress: null,
    selectedTokenDecimals: null,
    selectedType: null,
};

const normalizeBoxId = (boxId: string | number) => String(boxId);

export const useWithdrawStore = create<WithdrawState & WithdrawActions>((set, get) => ({
    withdrawData: initialWithdrawData,
    registeredItems: new Map(),

    updateWithdrawData: (updates) => {
        set((state) => ({
            withdrawData: { ...state.withdrawData, ...updates },
        }));
    },

    resetWithdrawData: () => {
        set({ withdrawData: initialWithdrawData });
    },

    registerSelectableItem: (item) => {
        set((state) => {
            const newRegisteredItems = new Map(state.registeredItems);
            const key = `${normalizeBoxId(item.boxId)}-${item.tokenSymbol}`;
            newRegisteredItems.set(key, { ...item, boxId: normalizeBoxId(item.boxId) });
            return { registeredItems: newRegisteredItems };
        });
    },

    unregisterSelectableItem: (boxId, tokenSymbol) => {
        set((state) => {
            const newRegisteredItems = new Map(state.registeredItems);
            const key = `${normalizeBoxId(boxId)}-${tokenSymbol}`;
            newRegisteredItems.delete(key);
            return { registeredItems: newRegisteredItems };
        });
    },

    getMatchingItems: (tokenSymbol, type, claimMethod) => {
        const { registeredItems } = get();
        const matchingItems: SelectableItem[] = [];

        registeredItems.forEach((item) => {
            if (
                item.tokenSymbol === tokenSymbol &&
                item.type === type &&
                item.claimMethod === claimMethod &&
                item.hasValidAmount
            ) {
                matchingItems.push(item);
            }
        });

        return matchingItems;
    },

    handleRadioSelect: (boxId, tokenSymbol, type, claimMethod, amount) => {
        const normalizedBoxId = normalizeBoxId(boxId);
        const currentData = get().withdrawData;

        if (!amount || amount === '0' || parseFloat(amount) <= 0) {
            return;
        }

        const isSameToken =
            currentData.selectedTokenSymbol === tokenSymbol &&
            currentData.selectedClaimMethod === claimMethod &&
            currentData.selectedType === type;

        // If the current selection is the same Token, same type/method, just add the box back to the selected list
        if (isSameToken) {
            const currentBoxes = currentData.selectedBoxes ?? [];
            if (currentBoxes.includes(normalizedBoxId)) {
                // Already in selected list, no need to process (actual "cancel" is in handleRadioDeselect)
                return;
            }

            set({
                withdrawData: {
                    ...currentData,
                    selectedBoxes: [...currentBoxes, normalizedBoxId],
                },
            });
            return;
        }

        // Selected a new Token / Claim combination, select all matching items according to the original strategy
        const matchingItems = get().getMatchingItems(tokenSymbol, type, claimMethod);
        const fallbackKey = `${normalizedBoxId}-${tokenSymbol}`;
        const fallbackItem = get().registeredItems.get(fallbackKey);
        const referenceItem = matchingItems[0] ?? fallbackItem;
        const allMatchingBoxIds = matchingItems.map((item) => normalizeBoxId(item.boxId));
        const selectedBoxes = allMatchingBoxIds.length > 0 ? allMatchingBoxIds : [normalizedBoxId];

        set({
            withdrawData: {
                selectedClaimMethod: claimMethod,
                selectedTokenSymbol: tokenSymbol,
                selectedTokenAddress: referenceItem?.tokenAddress ?? null,
                selectedTokenDecimals: referenceItem?.tokenDecimals ?? null,
                selectedType: type,
                selectedBoxes,
            },
        });
    },

    handleRadioDeselect: (boxId) => {
        const normalizedBoxId = normalizeBoxId(boxId);
        set((state) => {
            const currentBoxes = state.withdrawData.selectedBoxes || [];
            const updatedBoxes = currentBoxes.filter((id) => id !== normalizedBoxId);

            if (updatedBoxes.length === 0) {
                return { withdrawData: initialWithdrawData };
            }

            return {
                withdrawData: {
                    ...state.withdrawData,
                    selectedBoxes: updatedBoxes,
                },
            };
        });
    },

    isRadioSelected: (boxId, tokenSymbol) => {
        const { selectedTokenSymbol, selectedBoxes } = get().withdrawData;
        const normalizedBoxId = normalizeBoxId(boxId);
        return (
            selectedTokenSymbol === tokenSymbol &&
            Array.isArray(selectedBoxes) &&
            selectedBoxes.includes(normalizedBoxId)
        );
    },

    canClaim: () => {
        const { selectedBoxes } = get().withdrawData;
        return Array.isArray(selectedBoxes) && selectedBoxes.length > 0;
    },

    totalAmount: () => {
        const { withdrawData, registeredItems } = get();
        const { selectedBoxes, selectedTokenSymbol } = withdrawData;

        if (!selectedBoxes || selectedBoxes.length === 0 || !selectedTokenSymbol) {
            return BigInt(0);
        }

        let totalAmount = BigInt(0);
        registeredItems.forEach((item) => {
            if (
                selectedBoxes.includes(item.boxId) &&
                item.tokenSymbol === selectedTokenSymbol &&
                item.hasValidAmount
            ) {
                try {
                    totalAmount += BigInt(item.amount || '0');
                } catch (err) {
                    console.warn('Failed to parse amount for withdraw total', err);
                }
            }
        });

        return totalAmount;
    },

    addBoxToSelection: (boxId) => {
        const normalizedBoxId = normalizeBoxId(boxId);
        set((state) => {
            const currentBoxes = state.withdrawData.selectedBoxes || [];
            if (currentBoxes.includes(normalizedBoxId)) {
                return state;
            }

            return {
                withdrawData: {
                    ...state.withdrawData,
                    selectedBoxes: [...currentBoxes, normalizedBoxId],
                },
            };
        });
    },

    removeBoxFromSelection: (boxId) => {
        const normalizedBoxId = normalizeBoxId(boxId);
        set((state) => {
            const currentBoxes = state.withdrawData.selectedBoxes || [];
            const updatedBoxes = currentBoxes.filter((id) => id !== normalizedBoxId);

            if (updatedBoxes.length === 0) {
                return { withdrawData: initialWithdrawData };
            }

            return {
                withdrawData: {
                    ...state.withdrawData,
                    selectedBoxes: updatedBoxes,
                },
            };
        });
    },

    resetAllState: () => {
        set({
            withdrawData: initialWithdrawData,
            registeredItems: new Map(),
        });
    },
}));
