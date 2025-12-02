import { Routes, Route } from 'react-router-dom';
import { Web3ContextProvider } from '@/dapp/context';
import DappHeader from '@/components/dappHeader';
import { useSecureAccount } from '../hooks/useSecureAccount';
import { QueryClientProvider } from '@tanstack/react-query'
import { defaultQueryClient } from '@/config/queryClient';
import { useSetCurrentChainConfig } from '@/dapp/contractsConfig';

// DApp 页面导入
import MarketplacePage from '@/dapp/pages/Marketplace';
import CreatePage from '@/dapp/pages/Create';
import StakingPage from '@/dapp/pages/Staking';
import DaoPage from '@/dapp/pages/Dao';
import TokenPage from '@/dapp/pages/Token';
import ProfilePage from '@/dapp/pages/Profile';
import BoxDetailPage from '@/dapp/pages/BoxDetail';
import TestsPage from '@/dapp/pages/Tests';

function DappRoutes() {
    // 初始化账户管理（使用更安全的 useSecureAccount）
    useSecureAccount();
    // 设置当前链配置
    useSetCurrentChainConfig();

    return (
        <Routes>
            <Route index element={<MarketplacePage />} />
            <Route path="create" element={<CreatePage />} />
            <Route path="staking" element={<StakingPage />} />
            <Route path="dao" element={<DaoPage />} />
            <Route path="token" element={<TokenPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="boxDetail/:tokenId" element={<BoxDetailPage />} />
            <Route path="tests" element={<TestsPage />} />
        </Routes>
    );
}

/**
 * DApp 组件 - 导出给 App.tsx 使用
 */
export default function Dapp() {
    return (
        <QueryClientProvider client={defaultQueryClient}>
            <Web3ContextProvider>
                <DappHeader />
                <DappRoutes />
            </Web3ContextProvider>
        </QueryClientProvider>
    );
}