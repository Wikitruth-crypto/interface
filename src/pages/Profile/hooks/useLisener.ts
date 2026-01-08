"use client"

import { useEffect, useRef } from 'react';
import { useProfileStore } from '../store/profileStore';
import { useWithdrawStore } from '../store/withdrawStore';

export const useLisener = () => {
    const { filterState } = useProfileStore();
    const { resetWithdrawData } = useWithdrawStore();
    
    // Use ref to track if it is the first load
    // const isFirstLoad = useRef(true);
    const previousTab = useRef(filterState.selectedTab);

    useEffect(() => {

        // Only reset when the tab actually changes
        if (previousTab.current !== filterState.selectedTab) {
            resetWithdrawData();
            previousTab.current = filterState.selectedTab;
        }
    }, [filterState.selectedTab, resetWithdrawData]);

};