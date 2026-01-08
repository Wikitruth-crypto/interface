"use client";

import React from 'react';
import { Pagination } from 'antd';
import { cn } from '@/lib/utils';

interface MarketplacePaginationProps {
  total: number;
  currentPage: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number, pageSize: number) => void;
  className?: string;
}

/**
 * Marketplace pagination UI component
 * 
 * Features:
 * - Use Ant Design Pagination component
 * - Support page size selection
 */
export default function MarketplacePagination({
  total,
  currentPage,
  pageSize,
  pageSizeOptions = [20, 40, 60, 80],
  onPageChange,
  className,
}: MarketplacePaginationProps) {
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

