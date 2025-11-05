'use client';

import { lazy, Suspense } from 'react';
import { Button } from 'antd';

// 动态导入ConnectWallet组件
const ConnectButtonComponent = lazy(
    () => import('@/dapp/context/useAccount/connectButton').then(mod => ({ default: mod.ConnectButtonComponent }))
);

export const ConnectWallet = () => {
    return (
        <Suspense fallback={
            <Button type="primary" size="small">
                Connect
            </Button>
        }>
            <ConnectButtonComponent />
        </Suspense>
    );
};


