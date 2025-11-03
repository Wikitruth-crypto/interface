"use client"

import React from 'react';
import { Container } from '@/components/Container';
import MarketplaceList from '../components/MarketplaceList';
// import GlobalDataMarket from '../components/globalDataMarket';
import Filter from '../components/filter';
/**
 * Marketplace测试组件
 * 
 * 用于验证新的数据层架构是否正常工作：
 * - 测试 useMarketplaceBoxes hook
 * - 测试 useMarketplaceStoreV2 状态管理
 * - 测试筛选条件变化
 * - 测试分页加载
 */
const Marketplace: React.FC = () => {

    return (
        <Container className="p-6">
            {/* <GlobalDataMarket /> */}
            <Filter />
            <MarketplaceList
                showDebug={true}
            />
        </Container>
    );
};

export default Marketplace; 