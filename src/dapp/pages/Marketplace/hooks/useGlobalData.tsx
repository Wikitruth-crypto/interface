"use client"

import { useEffect, useMemo } from 'react';
import { GlobalStats } from '../types/marketplace.types';
import { useQueryStore } from '@/dapp/store_sapphire/useQueryStore';

/**
 * Marketplace全局数据获取Hook（重构版）
 *
 * 功能：
 * - 从新的状态管理系统（useQueryStore）读取全局数据
 * - 简化的架构，移除 React Query 和 The Graph 依赖
 * - 与新的状态管理系统集成
 *
 * 注意：
 * - 数据查询模块尚未开发，当前从 store 读取数据
 * - 等待数据查询模块完成后，数据将自动填充到 store
 */
export const useGlobalData = () => {
    // 从 store 获取全局状态数据
    const globalState = useQueryStore(state => state.globalState.data);

    // 转换数据格式（映射 store 字段名到 Marketplace 接口）
    const globalStats: GlobalStats | undefined = useMemo(() => {
        if (!globalState) return undefined;

        return {
            totalSupply: Number(globalState.totalSupply) || 0,
            totalStoring: Number(globalState.storingSupply) || 0,
            totalOnSale: Number(globalState.sellingSupply) + Number(globalState.auctioningSupply) || 0,
            totalSwaping: Number(globalState.paidSupply) + Number(globalState.refundingSupply) || 0,
            totalInSecrecy: Number(globalState.inSecrecySupply) || 0, // inSecrecySupply 对应 completed
            totalPublished: Number(globalState.publishedSupply) || 0,
            totalGTV: 0, // TODO: 需要单独计算或从其他地方获取
        };
    }, [globalState]);

    return {
        // 数据
        data: globalStats,
        globalStats,

        // 状态
        isLoading: false, // 从 store 读取，无需加载
        isError: false,
        error: null,

        // React Query 兼容性
        isSuccess: !!globalStats,
        isFetching: false,

        // refetch: () => {}, // 暂不支持手动刷新
    };
};