"use client"

import { useEffect, useRef } from 'react';
import { useProfileStore } from '../store/profileStore';
import { useWithdrawStore } from '../store/withdrawStore';

export const useLisener = () => {
    const { filterState } = useProfileStore();
    const { resetWithdrawData } = useWithdrawStore();
    
    // 使用ref来跟踪是否是首次加载
    // const isFirstLoad = useRef(true);
    const previousTab = useRef(filterState.selectedTab);

    useEffect(() => {

        // 只有当tab实际发生变化时才重置
        if (previousTab.current !== filterState.selectedTab) {
            resetWithdrawData();
            previousTab.current = filterState.selectedTab;
        }
    }, [filterState.selectedTab, resetWithdrawData]);

};