import { create } from 'zustand';
import { FilterState, BoxStatus } from '../types/profile.types';
import { ClaimMethodType, FundType } from '../types/cardProfile.types';

// 分页状态接口
interface PageState {
    currentPage: number;
    pageSize: number;
    loadedItems: number[];
}

// 滚动状态接口
interface ScrollState {
    hasMoreItems: boolean;
    showPagination: boolean;
}

// 提现状态接口
export interface WithdrawStateType {
    claimMethod: ClaimMethodType | null;
    boxId: string[] | null;
    tokenSymbol: string | null;
    type: FundType | null;
}

// interface UserBoxesState {
//     allBoxes: string[];
//     ownedBoxes: string[];
//     mintedBoxes: string[];
//     soldBoxes: string[];
//     boughtBoxes: string[];
//     badeBoxes: string[];
//     completedBoxes: string[];
//     publishedBoxes: string[];
// }

// Profile状态接口
interface ProfileState {
    // userBoxesState: UserBoxesState;
    // 分页状态
    pageState: PageState;

    // 滚动状态
    scrollState: ScrollState;

    // 筛选状态
    filterState: FilterState;

    // 批量大小配置
    batchSize: number;


}

// Profile操作接口
interface ProfileActions {
    // updateUserBoxesState: (updates: Partial<UserBoxesState>) => void;
    // 分页状态更新
    setPageState: (updates: Partial<PageState>) => void;
    addLoadedItems: (tokenIds: number[]) => void;
    getNextIndex: () => number;
    resetPageState: () => void;

    // 滚动状态更新
    updateScrollState: (updates: Partial<ScrollState>) => void;

    // 筛选状态更新
    setFilterState: (updates: Partial<FilterState>) => void;
    updateSelectedTab: (tab: FilterState['selectedTab']) => void;
    updateSelectedStatus: (status: BoxStatus | undefined) => void;
    updateOrderBy: (orderBy: string, orderDirection?: 'asc' | 'desc') => void;

    // 重置所有状态
    resetAllState: () => void;
}

// const defaultUserState: UserBoxesState = {
//     allBoxes: [],
//     ownedBoxes: [],
//     mintedBoxes: [],
//     soldBoxes: [],
//     boughtBoxes: [],
//     badeBoxes: [],
//     completedBoxes: [],
//     publishedBoxes: [],
// };
// 默认状态
const defaultPageState: PageState = {
    currentPage: 1,
    pageSize: 10,
    loadedItems: [],
};

const defaultScrollState: ScrollState = {
    hasMoreItems: true,
    showPagination: false,
};

const defaultFilterState: FilterState = {
    selectedTab: 'all',
    selectedStatus: undefined,
    orderBy: 'tokenId',
    orderDirection: 'desc',
};

// 创建Profile Store
export const useProfileStore = create<ProfileState & ProfileActions>((set, get) => ({
    // 初始状态
    // userBoxesState: defaultUserState,
    pageState: defaultPageState,
    scrollState: defaultScrollState,
    filterState: defaultFilterState,
    batchSize: 4,

    // updateUserBoxesState: (updates) => {
    //     set((state) => ({
    //         userBoxesState: { ...state.userBoxesState, ...updates },
    //     }));
    // },

    // 分页状态更新函数
    setPageState: (updates) => {
        set((state) => ({
            pageState: { ...state.pageState, ...updates },
        }));
    },

    addLoadedItems: (tokenIds) => {
        set((state) => {
            const existingItems = new Set(state.pageState.loadedItems);
            const newItems = tokenIds.filter(id => !existingItems.has(id));

            if (newItems.length === 0) return state;

            // 合并、去重、排序
            const merged = Array.from(new Set([...state.pageState.loadedItems, ...newItems]));
            merged.sort((a, b) => a - b);

            return {
                pageState: {
                    ...state.pageState,
                    loadedItems: merged,
                },
            };
        });
    },

    // 获取下一个起始的index，
    getNextIndex: () => {
        const { pageState } = get();
        if (pageState.loadedItems.length === 0) return 0;
        return pageState.loadedItems.length;
    },

    resetPageState: () => {
        set(() => ({
            pageState: defaultPageState,
        }));
    },

    // 滚动状态更新函数
    updateScrollState: (updates) => {
        set((state) => ({
            scrollState: { ...state.scrollState, ...updates },
        }));
    },


    // 筛选状态更新函数
    setFilterState: (updates) => {
        if (import.meta.env.DEV) {
            console.log('🏪 profileStore: setFilterState调用', {
                updates,
                currentFilterState: get().filterState
            });
        }

        set((state) => {
            const newFilterState = { ...state.filterState, ...updates };
            if (import.meta.env.DEV) {
                console.log('🏪 profileStore: filterState已更新', {
                    old: state.filterState,
                    new: newFilterState
                });
            }

            return {
                filterState: newFilterState,
            };
        });
    },

    updateSelectedTab: (tab) => {
        set((state) => {
            // 切换标签时重置分页状态
            return {
                filterState: { ...state.filterState, selectedTab: tab },
                pageState: { ...defaultPageState },
                scrollState: { ...defaultScrollState },
            };
        });
    },

    updateSelectedStatus: (status) => {
        set((state) => {
            // 切换状态筛选时重置分页状态
            return {
                filterState: { ...state.filterState, selectedStatus: status },
                pageState: { ...defaultPageState },
                scrollState: { ...defaultScrollState },
            };
        });
    },

    updateOrderBy: (orderBy, orderDirection = 'desc') => {
        set((state) => {
            // 切换排序时重置分页状态
            return {
                filterState: {
                    ...state.filterState,
                    orderBy,
                    orderDirection
                },
                pageState: { ...defaultPageState },
                scrollState: { ...defaultScrollState },
            };
        });
    },


    // 重置所有状态
    resetAllState: () => {
        set({
            pageState: defaultPageState,
            scrollState: defaultScrollState,
            filterState: defaultFilterState,
        });
    },
}));

// 导出类型
export type { ProfileState, ProfileActions, PageState, ScrollState, FilterState };
