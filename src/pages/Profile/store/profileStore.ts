import { create } from 'zustand';
import { FilterState, BoxStatus } from '../types/profile.types';
import { ClaimMethodType, FundType } from '../types/cardProfile.types';

interface PageState {
    currentPage: number;
    pageSize: number;
    loadedItems: number[];
}

interface ScrollState {
    hasMoreItems: boolean;
    showPagination: boolean;
}

// Withdraw state interface
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

// Profile state interface
interface ProfileState {
    // userBoxesState: UserBoxesState;
    // Page state
    pageState: PageState;

    // Scroll state
    scrollState: ScrollState;

    // Filter state
    filterState: FilterState;

    // Batch size configuration
    batchSize: number;


}

// Profile actions interface
interface ProfileActions {
    // updateUserBoxesState: (updates: Partial<UserBoxesState>) => void;
    // Page state update
    setPageState: (updates: Partial<PageState>) => void;
    addLoadedItems: (tokenIds: number[]) => void;
    getNextIndex: () => number;
    resetPageState: () => void;

    // Scroll state update
    updateScrollState: (updates: Partial<ScrollState>) => void;

    // Filter state update
    setFilterState: (updates: Partial<FilterState>) => void;
    updateSelectedTab: (tab: FilterState['selectedTab']) => void;
    updateSelectedStatus: (status: BoxStatus | undefined) => void;
    updateOrderBy: (orderBy: string, orderDirection?: 'asc' | 'desc') => void;

    // Reset all state
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
// Default state
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

// Create Profile Store
export const useProfileStore = create<ProfileState & ProfileActions>((set, get) => ({
    // Initial state
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

    // Page state update function
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

            // Merge, deduplicate, sort
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

    // Get next starting index
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

    // Scroll state update function
    updateScrollState: (updates) => {
        set((state) => ({
            scrollState: { ...state.scrollState, ...updates },
        }));
    },


    // Filter state update function
    setFilterState: (updates) => {
        if (import.meta.env.DEV) {
            console.log('🏪 profileStore: setFilterState called', {
                updates,
                currentFilterState: get().filterState
            });
        }

        set((state) => {
            const newFilterState = { ...state.filterState, ...updates };
            if (import.meta.env.DEV) {
                console.log('🏪 profileStore: filterState updated', {
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
            // When switching tabs, reset page state
            return {
                filterState: { ...state.filterState, selectedTab: tab },
                pageState: { ...defaultPageState },
                scrollState: { ...defaultScrollState },
            };
        });
    },

    updateSelectedStatus: (status) => {
        set((state) => {
            // When switching status filter, reset page state
            return {
                filterState: { ...state.filterState, selectedStatus: status },
                pageState: { ...defaultPageState },
                scrollState: { ...defaultScrollState },
            };
        });
    },

    updateOrderBy: (orderBy, orderDirection = 'desc') => {
        set((state) => {
            // When switching sorting, reset page state
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


    // Reset all state
    resetAllState: () => {
        set({
            pageState: defaultPageState,
            scrollState: defaultScrollState,
            filterState: defaultFilterState,
        });
    },
}));

// Export types
export type { ProfileState, ProfileActions, PageState, ScrollState, FilterState };
