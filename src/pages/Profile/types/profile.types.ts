// Profile page type definition

import { BoxStatus } from '@dapp/types/typesDapp/contracts/truthBox';

// Export BoxStatus type
export type { BoxStatus };

// Box data interface (based on Supabase data structure)
// Box participant
export interface BoxParticipant {
    id: string;
}

export interface BoxData {
    id: string;
    tokenId: string;
    price: string;
    deadline: string;
    status: BoxStatus;
    createTimestamp: string;
    boxInfoCID?: string;
    acceptedToken?: string;
    refundPermit?: boolean;
    listedMode?: 'Selling' | 'Auctioning';
    owner: BoxParticipant;
    minter: BoxParticipant;
    seller?: BoxParticipant;
    buyer?: BoxParticipant;
    completer?: BoxParticipant;
    publisher?: BoxParticipant;
    bidders: BoxParticipant[];
    title?: string;
    description?: string;
    nftImage?: string;
    image?: string;
    boxImage?: string;
    country?: string;
    state?: string;
    eventDate?: string;
    typeOfCrime?: string;
    hasError?: boolean;
}


// Box metadata interface
export interface BoxMetadata {
    title: string;
    description: string;
    image: string;
    attributes?: Array<{
        trait_type: string;
        value: string | number;
    }>;
}

export interface UserStats {
    totalBoxes: number;
    ownedBoxes: number;
    mintedBoxes: number;
    soldBoxes: number;
    boughtBoxes: number;
    bidBoxes: number;
    completedBoxes: number;
    publishedBoxes: number;
}

// User Profile data interface
export interface UserProfileData {
    id: string;
    address: string;
    stats: UserStats;
    allBoxes: string[];
    ownedBoxes: any[];
    mintedBoxes: any[];
    soldBoxes: any[];
    boughtBoxes: any[];
    bidBoxes: any[];
    completedBoxes: any[];
    publishedBoxes: any[];
}

export type SelectedTabType = 'all' | 'minted' |'owned' |  'sold' | 'bought' | 'bade' | 'completed' | 'published';

export interface FilterState {
    selectedTab: SelectedTabType;
    selectedStatus: BoxStatus | undefined;
    orderBy: string;
    orderDirection: 'asc' | 'desc';
}

// Box list query parameters interface - matching queryUserRelatedBoxes function
export interface BoxQueryParams {
    userId: string;
    userAddress: string;
    startId: number;
    count: number;
    status?: string;
    orderBy: string;
    orderDirection: 'asc' | 'desc';
    tab: FilterState['selectedTab'];
}

// Box list response interface
export interface BoxListResponse {
    items: BoxData[];
    nextCursor?: number;
    hasMore: boolean;
}

// Virtual list props interface
export interface BoxVirtualListProps {
    data: BoxData[];
    loading: boolean;
    onLoadMore: () => void;
    hasMore: boolean;
    loadingMore: boolean;
}

// Filter bar props interface
export interface FilterBarProps {
    filters: FilterState;
    onTabChange: (tab: FilterState['selectedTab']) => void;
    onStatusChange: (status: BoxStatus | undefined) => void;
    table: any; // TanStack Table instance
}

// User data bar props interface
export interface UserDataBarProps {
    data?: UserStats;
    loading: boolean;
}

// UI state interface
export interface ProfileUIState {
    viewMode: 'grid' | 'list';
    selectedItems: string[];
    showFilters: boolean;
    cardSize: 'small' | 'medium' | 'large';
}

// UI actions interface
export interface ProfileUIActions {
    setViewMode: (mode: 'grid' | 'list') => void;
    toggleSelection: (tokenId: string) => void;
    clearSelection: () => void;
    toggleFilters: () => void;
    setCardSize: (size: 'small' | 'medium' | 'large') => void;
}

// Error handling interface
export interface ProfileError {
    message: string;
    code?: string;
    details?: any;
}

// Loading state interface
export interface LoadingState {
    isLoading: boolean;
    loadingMessage?: string;
} 