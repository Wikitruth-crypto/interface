import { Box, BoxStatus } from '@/dapp/store_sapphire/types';

// Marketplace筛选条件接口
export interface MarketplaceFilters {
  search?: string;
  country?: string;
  state?: string;
  status?: BoxStatus | 'Default';
  sort?: 'Default' | 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc' | 'id_asc' | 'id_desc';
  priceRange?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    start?: string;
    end?: string;
  };
  idRange?: {
    start?: number;
    end?: number;
  };
}

// Marketplace Box数据接口（使用新的 Box 类型）
export interface MarketplaceBoxData extends Box {
  // 元数据字段（从 tokenURI 或 boxInfoCID 解析得到）
  title?: string;
  description?: string;
  nftImage?: string;
  boxImage?: string;
  country?: string;
  state?: string;
  eventDate?: string;
  typeOfCrime?: string;

  // 扩展字段
  hasError?: boolean;
}

// Marketplace列表响应接口
export interface MarketplaceListResponse {
  items: MarketplaceBoxData[];
  nextCursor?: number;
  hasMore: boolean;
  totalCount?: number;
}

// Box查询参数接口
export interface MarketplaceQueryParams {
  startId: number;
  count: number;
  filters: MarketplaceFilters;
}

// 全局统计数据接口
export interface GlobalStats {
  totalSupply: number;
  totalStoring: number;
  totalOnSale: number;
  totalSwaping: number;
  totalInSecrecy: number;
  totalPublished: number;
  totalGTV: number;
}

// 错误处理接口
export interface MarketplaceError {
  message: string;
  code?: string;
  details?: any;
}

// 加载状态枚举
export enum LoadingStep {
  pending = 'pending',
  loading = 'loading',
  processing = 'processing',
  completed = 'completed',
  error = 'error'
}

// 分页模式
export type PaginationMode = 'loadMore' | 'paginator';

// 分页配置
export interface PaginationConfig {
  loadBatchSize: number;  // Load More 每次加载数量
  pageSize: number;       // 分页器每页数量
  mode: PaginationMode;
}

// 元数据加载配置
export interface MetadataLoaderConfig {
  batchSize: number;
  autoLoad: boolean;
}