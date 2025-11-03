"use client"

import { useState, useMemo } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getSortedRowModel, 
  ColumnDef 
} from '@tanstack/react-table';
import { FilterState, BoxData } from '../types/profile.types';
import { useProfileStore } from '../store/profileStore';

export const useProfileTable = () => {
  const { setFilterState } = useProfileStore();

  const [filters, setFilters] = useState<FilterState>({
    selectedTab: 'all',
    selectedStatus: undefined,
    orderBy: 'tokenId',
    orderDirection: 'desc'
  });

  // 列定义（用于排序和筛选）
  const columns = useMemo<ColumnDef<BoxData>[]>(() => [
    {
      id: 'tokenId',
      accessorKey: 'tokenId',
      header: 'Token ID',
    },
    {
      id: 'price',
      accessorKey: 'price',
      header: 'Price',
    },
    {
      id: 'deadline',
      accessorKey: 'deadline',
      header: 'Deadline',
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
    }
  ], []);

  const table = useReactTable({
    data: [], // 数据由父组件传入
    columns,
    state: {
      sorting: [{ 
        id: filters.orderBy, 
        desc: filters.orderDirection === 'desc' 
      }],
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater([]) : updater;
      if (newSorting[0]) {
        console.log(`🔄 useProfileTable: 排序变更`, {
          field: newSorting[0].id,
          direction: newSorting[0].desc ? 'desc' : 'asc'
        });
        
        setFilters(prev => ({
          ...prev,
          orderBy: newSorting[0].id,
          orderDirection: newSorting[0].desc ? 'desc' : 'asc'
        }));
        setFilterState({
          orderBy: newSorting[0].id,
          orderDirection: newSorting[0].desc ? 'desc' : 'asc'
        });
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return { 
    table, 
    filters, 
    setFilters,

    // 便捷的筛选方法
    updateTab: (tab: FilterState['selectedTab']) => {
      
      setFilters(prev => ({ ...prev, selectedTab: tab }));
      setFilterState({
        selectedTab: tab
      });
      
    },
    
    updateStatus: (status: FilterState['selectedStatus']) => {
      setFilters(prev => ({ ...prev, selectedStatus: status }));
      setFilterState({
        selectedStatus: status
      });
    },
    
    updateSorting: (orderBy: string, orderDirection: 'asc' | 'desc') => {
      setFilters(prev => ({ ...prev, orderBy, orderDirection }));
      setFilterState({
        orderBy,
        orderDirection
      });
    },
    
    resetFilters: () => {
      setFilters({
        selectedTab: 'all',
        selectedStatus: undefined,
        orderBy: 'tokenId',
        orderDirection: 'desc'
      });
    }
  };
}; 