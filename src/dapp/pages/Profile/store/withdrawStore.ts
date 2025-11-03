import { create } from 'zustand';
import { ClaimMethodType, FundType } from '../types/cardProfile.types';

// 可选择项的注册信息
export interface SelectableItem {
    boxId: string;
    tokenSymbol: string;
    type: FundType;
    claimMethod: ClaimMethodType;
    amount: string;
    hasValidAmount: boolean; // amount > 0
}

// 提现数据
export interface WithdrawDataType {
    selectedClaimMethod: ClaimMethodType | null;
    selectedBoxes: string[] | null;
    selectedTokenSymbol: string | null;
    selectedType: FundType | null;
}


// Profile状态接口
interface WithdrawState {
    withdrawData: WithdrawDataType;
    // 全局注册表
    registeredItems: Map<string, SelectableItem>; // key: boxId-tokenSymbol
}

// Profile操作接口
interface WithdrawActions {
    updateWithdrawData: (updates: Partial<WithdrawDataType>) => void;
    resetWithdrawData: () => void;

    // Radio联动核心方法
    handleRadioSelect: (
        boxId: string,
        tokenSymbol: string,
        type: FundType,
        claimMethod: ClaimMethodType,
        amount: string
    ) => void;

    // 计算总金额
    totalAmount: () => number;

    handleRadioDeselect: (boxId: string) => void;

    isRadioSelected: (boxId: string, tokenSymbol: string) => boolean;

    canClaim: () => boolean;

    // 添加/移除特定boxId
    addBoxToSelection: (boxId: string) => void;
    removeBoxFromSelection: (boxId: string) => void;

    // 组件注册机制
    registerSelectableItem: (item: SelectableItem) => void;
    unregisterSelectableItem: (boxId: string, tokenSymbol: string) => void;

    // 获取所有匹配的项
    getMatchingItems: (tokenSymbol: string, type: FundType, claimMethod: ClaimMethodType) => SelectableItem[];

    // 重置所有状态
    resetAllState: () => void;
}

const initialWithdrawData: WithdrawDataType = {
    selectedClaimMethod: null,
    selectedBoxes: null,
    selectedTokenSymbol: null,
    selectedType: null,
};


// 创建Profile Store
export const useWithdrawStore = create<WithdrawState & WithdrawActions>((set, get) => ({
    // 初始状态
    withdrawData: initialWithdrawData,
    registeredItems: new Map(),

    // 更新提现数据
    updateWithdrawData: (updates: Partial<WithdrawDataType>) => {
        set((state) => ({
            withdrawData: { ...state.withdrawData, ...updates },
        }));
    },

    // 重置提现数据
    resetWithdrawData: () => {
        set({
            withdrawData: initialWithdrawData,
        });
    },

    // 注册可选择项
    registerSelectableItem: (item: SelectableItem) => {
        set((state) => {
            const newRegisteredItems = new Map(state.registeredItems);
            const key = `${item.boxId}-${item.tokenSymbol}`;
            newRegisteredItems.set(key, item);

            console.log('📝 Registered item:', { key, item });

            return {
                registeredItems: newRegisteredItems
            };
        });
    },

    // 取消注册可选择项
    unregisterSelectableItem: (boxId: string, tokenSymbol: string) => {
        set((state) => {
            const newRegisteredItems = new Map(state.registeredItems);
            const key = `${boxId}-${tokenSymbol}`;
            newRegisteredItems.delete(key);

            console.log('🗑️ Unregistered item:', { key });

            return {
                registeredItems: newRegisteredItems
            };
        });
    },

    // 获取所有匹配的项
    getMatchingItems: (tokenSymbol: string, type: FundType, claimMethod: ClaimMethodType) => {
        const { registeredItems } = get();
        const matchingItems: SelectableItem[] = [];

        registeredItems.forEach((item) => {
            if (item.tokenSymbol === tokenSymbol &&
                item.type === type &&
                item.claimMethod === claimMethod &&
                item.hasValidAmount) {
                matchingItems.push(item);
            }
        });

        console.log('🔍 Found matching items:', { tokenSymbol, type, claimMethod, count: matchingItems.length });

        return matchingItems;
    },

    // Radio选择处理核心逻辑（增强版）
    handleRadioSelect: (boxId: string, tokenSymbol: string, type: FundType, claimMethod: ClaimMethodType, amount: string) => {
        const currentData = get().withdrawData;

        // 检查amount是否大于0，如果不是则不允许选择
        if (!amount || amount === '0' || parseFloat(amount) <= 0) {
            console.warn('Cannot select radio with zero or invalid amount:', amount);
            return;
        }

        // 如果点击的是已选中的tokenSymbol，则取消选择
        if (currentData.selectedTokenSymbol === tokenSymbol) {
            set({
                withdrawData: initialWithdrawData
            });
            console.log('🔄 All radios deselected');
            return;
        }

        // 新选择：获取所有匹配的项
        const matchingItems = get().getMatchingItems(tokenSymbol, type, claimMethod);
        const allMatchingBoxIds = matchingItems.map(item => item.boxId);

        // 设置新的选择参数
        set({
            withdrawData: {
                selectedClaimMethod: claimMethod,
                selectedTokenSymbol: tokenSymbol,
                selectedType: type,
                selectedBoxes: allMatchingBoxIds.length > 0 ? allMatchingBoxIds : [boxId],
            }
        });

        console.log('✅ Radio selection with auto-aggregation:', {
            boxId,
            tokenSymbol,
            type,
            claimMethod,
            totalMatches: allMatchingBoxIds.length,
            selectedBoxes: allMatchingBoxIds

        });
    },

    // 修复：计算当前被选中的注册项的资金总量
    totalAmount: () => {
        const { withdrawData, registeredItems } = get();
        const { selectedBoxes, selectedTokenSymbol } = withdrawData;
        
        // 如果没有选中任何项，返回0
        if (!selectedBoxes || selectedBoxes.length === 0 || !selectedTokenSymbol) {
            return 0;
        }
        
        let totalAmount = 0;
        
        // 遍历所有注册项，找到匹配的项并累加金额
        registeredItems.forEach((item) => {
            // 检查该项是否被选中（boxId在selectedBoxes中，且tokenSymbol匹配）
            if (selectedBoxes.includes(item.boxId) && 
                item.tokenSymbol === selectedTokenSymbol &&
                item.hasValidAmount) {
                
                const amount = parseFloat(item.amount);
                if (!isNaN(amount)) {
                    totalAmount += amount;
                }
            }
        });
        
        console.log('💰 Total amount calculated:', {
            selectedBoxes,
            selectedTokenSymbol,
            totalAmount,
            registeredItemsCount: registeredItems.size
        });
        
        return totalAmount;
    },

    // 取消Radio选择
    handleRadioDeselect: (boxId: string) => {
        // 删除boxId
        set((state) => {
            const currentBoxes = state.withdrawData.selectedBoxes || [];
            const updatedBoxes = currentBoxes.filter(id => id !== boxId);
            return {
                withdrawData: { ...state.withdrawData, selectedBoxes: updatedBoxes.length > 0 ? updatedBoxes : null }
            };
        });
    },

    // 检查特定Radio是否应该被选中
    isRadioSelected: (boxId: string, tokenSymbol: string) => {
        const { selectedTokenSymbol, selectedBoxes } = get().withdrawData;

        return selectedTokenSymbol === tokenSymbol &&
            selectedBoxes !== null &&
            selectedBoxes.includes(boxId);
    },

    // 判断是否可以提取
    canClaim: () => {
        const { selectedBoxes } = get().withdrawData;
        return selectedBoxes !== null && selectedBoxes.length > 0;
    },

    // 添加boxId到选择列表（用于联动）
    addBoxToSelection: (boxId: string) => {
        set((state) => {
            const currentBoxes = state.withdrawData.selectedBoxes || [];

            // 避免重复添加
            if (currentBoxes.includes(boxId)) {
                return state;
            }

            return {
                withdrawData: {
                    ...state.withdrawData,
                    selectedBoxes: [...currentBoxes, boxId]
                }
            };
        });
    },

    // 从选择列表移除boxId
    removeBoxFromSelection: (boxId: string) => {
        set((state) => {
            const currentBoxes = state.withdrawData.selectedBoxes || [];
            const updatedBoxes = currentBoxes.filter(id => id !== boxId);

            return {
                withdrawData: {
                    ...state.withdrawData,
                    selectedBoxes: updatedBoxes.length > 0 ? updatedBoxes : null
                }
            };
        });
    },

    // 重置所有状态
    resetAllState: () => {
        set({
            withdrawData: initialWithdrawData,
            registeredItems: new Map(), // 也清空注册表
        });
    },
}));

