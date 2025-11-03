"use client"

import { useMemo } from 'react';
import { useQueryStore } from '@/dapp/store_sapphire/useQueryStore';
import { selectors } from '@/dapp/store_sapphire/selectors';
import { UserProfileData } from '../types/profile.types';

/**
 * useUserProfile - 获取用户 Profile 数据
 *
 * 重构说明：
 * - 移除 React Query 和 The Graph 依赖
 * - 直接从 useQueryStore 读取用户数据
 * - 使用 selectors.selectUser 获取完整的用户对象
 * - 保持与旧版本相同的接口（向后兼容）
 */
export const useUserProfile = (address: string | undefined) => {
    // 从 store 获取用户数据
    const user = useQueryStore(
        address ? selectors.selectUser(address.toLowerCase()) : () => undefined
    );

    // 计算增强的用户数据
    const data = useMemo((): UserProfileData | null => {
        if (!user) return null;

        // 计算所有Box ID列表（去重）
        const allBoxesSet = new Set<string>();
        user.ownedBoxes.forEach(box => allBoxesSet.add(box.tokenId));
        user.mintedBoxes.forEach(box => allBoxesSet.add(box.tokenId));
        user.soldBoxes.forEach(box => allBoxesSet.add(box.tokenId));
        user.boughtBoxes.forEach(box => allBoxesSet.add(box.tokenId));
        user.bidBoxes.forEach(box => allBoxesSet.add(box.tokenId));
        user.completedBoxes.forEach(box => allBoxesSet.add(box.tokenId));
        user.publishedBoxes.forEach(box => allBoxesSet.add(box.tokenId));

        const allBoxes = Array.from(allBoxesSet);

        // 计算统计信息
        const stats = {
            totalBoxes: allBoxes.length,
            ownedBoxes: user.ownedBoxes.length,
            mintedBoxes: user.mintedBoxes.length,
            soldBoxes: user.soldBoxes.length,
            boughtBoxes: user.boughtBoxes.length,
            bidBoxes: user.bidBoxes.length,
            completedBoxes: user.completedBoxes.length,
            publishedBoxes: user.publishedBoxes.length,
        };

        return {
            ...user,
            allBoxes,
            stats
        };
    }, [user]);

    // 返回 React Query 兼容的接口
    return {
        data,
        isLoading: false, // 从 store 读取，无需加载状态
        isError: false,
        error: null,
        isSuccess: !!data,
    };
};




