
"use client";
// import React, {
//     ReactNode,
// useEffect, 
// useState 
// } from "react";
import {
    RainbowKitProvider,
    darkTheme
} from "@rainbow-me/rainbowkit";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    // State,
    WagmiProvider,
} from "wagmi";
import { config } from "./useAccount/wagmi"
import '@rainbow-me/rainbowkit/styles.css';
import { WalletProvider } from "./useAccount/WalletContext";
import ClientOnly from "./clientOnly"; // 确保在页面加载时只渲染一次


export function Web3ContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClientOnly>
            <WagmiProvider config={config}>
                <RainbowKitProvider
                    modalSize="compact"
                    locale="en-US"
                    theme={darkTheme({
                        accentColor: 'var(--primary)',
                        accentColorForeground: 'white',
                        borderRadius: 'medium',
                        fontStack: 'system',
                        overlayBlur: 'small',
                    })}
                    showRecentTransactions={true}
                >
                    <WalletProvider>
                        {children}
                    </WalletProvider>
                </RainbowKitProvider>
            </WagmiProvider>
        </ClientOnly>
    );
}

