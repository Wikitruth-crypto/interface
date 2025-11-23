"use client";

import React from 'react';
import { Pagination } from 'antd';
import BaseButton from '@/dapp/components/base/baseButton';
import Loader from '@/dapp/components/Loader';
import { cn } from '@/lib/utils';

interface MarketplacePaginationProps {
  total: number;
  currentPage: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number, pageSize: number) => void;
  mode: 'loadMore' | 'paginator';
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  hasError?: boolean;
  className?: string;
}

/**
 * Marketplace 分页UI组件
 * 
 * 特点：
 * - 支持双模式：分页器和 Load More
 * - 根据模式自动切换UI
 */
export default function MarketplacePagination({
  total,
  currentPage,
  pageSize,
  pageSizeOptions = [8,16,32,64],
  onPageChange,
  mode,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  hasError = false,
  className,
}: MarketplacePaginationProps) {
  // 分页器模式：显示页码分页器
  if (mode === 'paginator') {
    return (
      <div className={cn("flex justify-center items-center py-4", className)}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          pageSizeOptions={pageSizeOptions}
          showSizeChanger
          showTotal={(total) => `Total: ${total}`}
        />
      </div>
    );
  }

  // Load More 模式：根据状态显示不同UI
  // 1. 加载失败：显示重试按钮
  if (hasError) {
    return (
      <div className={cn("flex justify-center items-center py-4", className)}>
        <BaseButton
          onClick={fetchNextPage}
          variant="outline"
          className="min-w-[120px]"
        >
          Retry
        </BaseButton>
      </div>
    );
  }

  // 2. 正在加载：显示加载指示器
  if (isFetchingNextPage) {
    return (
      <div className={cn("flex justify-center items-center py-4", className)}>
        <Loader />
      </div>
    );
  }

  // 3. 没有更多数据：显示结束提示
  if (!hasNextPage) {
    return (
      <div className={cn("flex justify-center items-center py-4 text-white/50 text-sm", className)}>
        No More
      </div>
    );
  }

  // 4. 正常情况下：不显示任何内容（由滚动自动触发）
  return null;
}

