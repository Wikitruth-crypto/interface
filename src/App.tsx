import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Web3ContextProvider } from '@/contexts/web3Context';
import '@rainbow-me/rainbowkit/styles.css';
import DappHeader from '@/components/dappHeader';
import { useSecureAccount } from '@/hooks/useSecureAccount';
// import { QueryClientProvider } from '@tanstack/react-query'
// import { defaultQueryClient } from '@/config/queryClient';
import { useSetCurrentChainConfig } from '@/config/contractsConfig';
import Loader from '@/components/Loader';

import { startIpfsGatewayPolling } from '@/config/ipfsUrl/sync'

// The lazy loading of the pages components
const MarketplacePage = lazy(() => import('@/pages/Marketplace'));
const CreatePage = lazy(() => import('@/pages/Create'));
const StakingPage = lazy(() => import('@/pages/Staking'));
const DaoPage = lazy(() => import('@/pages/Dao'));
const TokenPage = lazy(() => import('@/pages/Token'));
const ProfilePage = lazy(() => import('@/pages/Profile'));
const BoxDetailPage = lazy(() => import('@/pages/BoxDetail'));


function DappRoutes() {
    useSecureAccount();
    useSetCurrentChainConfig();
    startIpfsGatewayPolling()

    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route index element={<MarketplacePage />} />
                <Route path="create" element={<CreatePage />} />
                <Route path="staking" element={<StakingPage />} />
                <Route path="dao" element={<DaoPage />} />
                <Route path="token" element={<TokenPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="boxDetail/:tokenId" element={<BoxDetailPage />} />
            </Routes>
        </Suspense>
    );
}

export default function Dapp() {
    return (
        // <QueryClientProvider client={defaultQueryClient}>
            <Web3ContextProvider>
                <DappHeader />
                <DappRoutes />
            </Web3ContextProvider>
        // </QueryClientProvider>
    );
}