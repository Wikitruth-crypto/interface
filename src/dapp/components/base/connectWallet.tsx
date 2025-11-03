'use client';

import { lazy, Suspense } from 'react';
import { Button } from 'antd';

// 动态导入ConnectWallet组件
const ConnectWalletClient = lazy(
    () => import('./connectWalletClient').then(mod => ({ default: mod.ConnectWalletClient }))
);

export const ConnectWallet = () => {
    return (
        <Suspense fallback={
            <Button type="primary" size="small">
                Connect
            </Button>
        }>
            <ConnectWalletClient />
        </Suspense>
    );
};


