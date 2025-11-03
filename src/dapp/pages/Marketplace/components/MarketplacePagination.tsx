"use client";

import React from 'react';
import { Pagination } from 'antd';
import BaseButton from '@/dapp/components/base/baseButton';

interface MarketplacePaginationProps {
  /** 总数据量 */
  total: number;
  /** 当前页码 */
  currentPage: number;
  /** 每页数量 */
  pageSize: number;
  /** 页面大小选项 */
  pageSizeOptions?: number[];
  /** 页面和大小变化回调 */
  onPageChange: (page: number, pageSize: number) => void;
  /** 分页模式 */
  mode: 'loadMore' | 'paginator';
  /** 是否还有下一页 */
  hasNextPage: boolean;
  /** 加载下一页 */
  fetchNextPage: () => void;
  /** 是否正在加载 */
  isFetchingNextPage: boolean;
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
}: MarketplacePaginationProps) {
  // 分页器模式：显示页码分页器
  if (mode === 'paginator') {
    return (
      <div className="flex justify-center items-center py-4">
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

  // Load More 模式：显示加载更多按钮
  return (
    <div className="flex justify-center items-center py-4">
      <BaseButton
        onClick={fetchNextPage}
        disabled={!hasNextPage || isFetchingNextPage}
        loading={isFetchingNextPage}
        variant="outline"
        className="min-w-[120px]"
      >
        {isFetchingNextPage
          ? 'Loading...'
          : hasNextPage
            ? 'Load More'
            : 'No More'}
      </BaseButton>
    </div>
  );
}

