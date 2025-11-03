// Profile页面类型定义

import { User, Box, BoxStatus } from '@/dapp/event_sapphire/types';

// 扩展Box数据接口，添加元数据字段
export interface BoxData extends Box {
    // 元数据字段（等待元数据处理模块开发）
    title?: string;
    description?: string;
    image?: string;
    boxImage?: string;
    country?: string;
    state?: string;
    eventDate?: string;
    typeOfCrime?: string;
    hasError?: boolean;
}

// 导出 BoxStatus 类型（从新架构）
export type { BoxStatus };

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

// 扩展用户Profile数据接口，基于新的 User 类型
export interface UserProfileData extends User {
    stats: UserStats;
    allBoxes: string[];
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