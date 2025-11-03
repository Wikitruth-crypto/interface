import { Outlet } from 'react-router-dom';
import { Web3ContextProvider } from "@/dapp/context";
import DappHeader from '@/components/dappHeader';

/**
 * DApp 布局
 * 使用 Outlet 渲染子路由
 */
export default function DappLayout() {
    return (
        <Web3ContextProvider>
            <DappHeader />
            <Outlet />
        </Web3ContextProvider>
    );
}

