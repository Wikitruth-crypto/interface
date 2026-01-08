import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { MarketplaceFilters, PaginationConfig } from '../types/marketplace.types';

const defaultFilters: MarketplaceFilters = {
  search: '',
  country: '',
  state: '',
  status: 'Default',
  sort: 'Default',
  priceRange: {
    min: undefined,
    max: undefined,
  },
  dateRange: {
    start: undefined,
    end: undefined,
  },
  idRange: {
    start: undefined,
    end: undefined,
  },
};

const defaultPaginationConfig: PaginationConfig = {
  mode: 'paginator',
  pageSize: 20,
  loadBatchSize: 4,
};

interface MarketplaceState {
  filters: MarketplaceFilters;
  paginationConfig: PaginationConfig;
}

interface MarketplaceActions {
  updateFilters: (newFilters: Partial<MarketplaceFilters>) => void;
  resetFilters: () => void;
  setSearch: (search: string) => void;
  setStatus: (status: MarketplaceFilters['status']) => void;
  setSort: (sort: MarketplaceFilters['sort']) => void;
  setCountry: (country: string) => void;
  setState: (state: string) => void;
  setPriceRange: (min?: number, max?: number) => void;
  setDateRange: (start?: string, end?: string) => void;
  setIdRange: (start?: number, end?: number) => void;
  // Pagination actions
  setPaginationMode: (mode: PaginationConfig['mode']) => void;
  setPageSize: (pageSize: number) => void;
  setLoadBatchSize: (loadBatchSize: number) => void;
}

type MarketplaceStoreType = MarketplaceState & MarketplaceActions;

export const useMarketplaceStore = create<MarketplaceStoreType>()(
  devtools(
    (set, get) => ({
      filters: defaultFilters,
      paginationConfig: defaultPaginationConfig,

      updateFilters: newFilters => {
        if (import.meta.env.DEV) {
          console.log('[MarketplaceStoreV2] update filters', {
            previous: get().filters,
            patch: newFilters,
            merged: { ...get().filters, ...newFilters },
          });
        }

        set(
          state => ({
            filters: { ...state.filters, ...newFilters },
          }),
          false,
          'updateFilters',
        );
      },

      resetFilters: () => {
        set({ filters: defaultFilters }, false, 'resetFilters');
      },

      setSearch: search => {
        if (import.meta.env.DEV) {
          console.log('[MarketplaceStoreV2] set search', { search });
        }
        set(
          state => ({
            filters: { ...state.filters, search },
          }),
          false,
          'setSearch',
        );
      },

      setStatus: status => {
        if (import.meta.env.DEV) {
          console.log('[MarketplaceStoreV2] set status', { status });
        }
        set(
          state => ({
            filters: { ...state.filters, status },
          }),
          false,
          'setStatus',
        );
      },

      setSort: sort => {
        if (import.meta.env.DEV) {
          console.log('[MarketplaceStoreV2] set sort', { sort });
        }
        set(
          state => ({
            filters: { ...state.filters, sort },
          }),
          false,
          'setSort',
        );
      },

      setCountry: country => {
        set(
          state => ({
            filters: { ...state.filters, country },
          }),
          false,
          'setCountry',
        );
      },

      setState: stateValue => {
        set(
          state => ({
            filters: { ...state.filters, state: stateValue },
          }),
          false,
          'setState',
        );
      },

      setPriceRange: (min, max) => {
        set(
          state => {
            // Check if the value really changes, to avoid unnecessary updates
            const currentMin = state.filters.priceRange?.min;
            const currentMax = state.filters.priceRange?.max;
            if (currentMin === min && currentMax === max) {
              return state;
            }
            
            return {
              filters: {
                ...state.filters,
                priceRange: { min, max },
              },
            };
          },
          false,
          'setPriceRange',
        );
      },

      setDateRange: (start, end) => {
        set(
          state => ({
            filters: {
              ...state.filters,
              dateRange: { start, end },
            },
          }),
          false,
          'setDateRange',
        );
      },

      setIdRange: (start, end) => {
        set(
          state => {
            // Check if the value really changes, to avoid unnecessary updates
            const currentStart = state.filters.idRange?.start;
            const currentEnd = state.filters.idRange?.end;
            if (currentStart === start && currentEnd === end) {
              return state;
            }
            
            return {
              filters: {
                ...state.filters,
                idRange: { start, end },
              },
            };
          },
          false,
          'setIdRange',
        );
      },

      setPaginationMode: mode => {
        set(
          state => ({
            paginationConfig: {
              ...state.paginationConfig,
              mode,
            },
          }),
          false,
          'setPaginationMode',
        );
      },

      setPageSize: pageSize => {
        set(
          state => ({
            paginationConfig: {
              ...state.paginationConfig,
              pageSize,
            },
          }),
          false,
          'setPageSize',
        );
      },

      setLoadBatchSize: loadBatchSize => {
        set(
          state => ({
            paginationConfig: {
              ...state.paginationConfig,
              loadBatchSize,
            },
          }),
          false,
          'setLoadBatchSize',
        );
      },
    }),
    {
      name: 'marketplace-store-v2',
    },
  ),
);

export type { MarketplaceStoreType };
