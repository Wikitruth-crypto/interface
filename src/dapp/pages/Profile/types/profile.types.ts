// Profile页面类型定义

import { BoxStatus } from '@/dapp/types/contracts/truthBox';

// 导出 BoxStatus 类型
export type { BoxStatus };

// Box数据接口（基于 Supabase 数据结构）
export interface BoxData {
    // 基础字段
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
    
    // 用户关系字段
    owner: string;
    minter: string;
    seller?: string;
    buyer?: string;
    completer?: string;
    publisher?: string;
    bidders: string[];
    
    // 元数据字段（从 Supabase metadata_boxes 表获取）
    title?: string;
    description?: string;
    nftImage?: string;
    boxImage?: string;
    country?: string;
    state?: string;
    eventDate?: string;
    typeOfCrime?: string;
    hasError?: boolean;
}

// Box元数据接口
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

// 用户Profile数据接口
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

export type SelectedTabType = 'all' | 'owned' | 'minted' | 'sold' | 'bought' | 'bade' | 'completed' | 'published';

export interface FilterState {
    selectedTab: SelectedTabType;
    selectedStatus: BoxStatus | undefined;
    orderBy: string;
    orderDirection: 'asc' | 'desc';
}

// Box列表查询参数接口 - 匹配queryUserRelatedBoxes函数
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

// Box列表响应接口
export interface BoxListResponse {
    items: BoxData[];
    nextCursor?: number;
    hasMore: boolean;
}

// 虚拟列表Props接口
export interface BoxVirtualListProps {
    data: BoxData[];
    loading: boolean;
    onLoadMore: () => void;
    hasMore: boolean;
    loadingMore: boolean;
}

// 筛选栏Props接口
export interface FilterBarProps {
    filters: FilterState;
    onTabChange: (tab: FilterState['selectedTab']) => void;
    onStatusChange: (status: BoxStatus | undefined) => void;
    table: any; // TanStack Table实例
}

// 用户数据栏Props接口
export interface UserDataBarProps {
    data?: UserStats;
    loading: boolean;
}

// UI状态接口
export interface ProfileUIState {
    viewMode: 'grid' | 'list';
    selectedItems: string[];
    showFilters: boolean;
    cardSize: 'small' | 'medium' | 'large';
}

// UI操作接口
export interface ProfileUIActions {
    setViewMode: (mode: 'grid' | 'list') => void;
    toggleSelection: (tokenId: string) => void;
    clearSelection: () => void;
    toggleFilters: () => void;
    setCardSize: (size: 'small' | 'medium' | 'large') => void;
}

// 错误处理接口
export interface ProfileError {
    message: string;
    code?: string;
    details?: any;
}

// 加载状态接口
export interface LoadingState {
    isLoading: boolean;
    loadingMessage?: string;
} 