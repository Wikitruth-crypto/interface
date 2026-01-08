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

  // Column definition (used for sorting and filtering)
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
    data: [], // Data is passed by the parent component
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
        console.log(`🔄 useProfileTable: sorting changed`, {
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

    // Convenient filtering methods
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