"use client";

import type { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { config } from "./useAccount/wagmi";
import { WalletProvider } from "./useAccount/WalletContext";
import ClientOnly from "./clientOnly";

export function Web3ContextProvider({ children }: { children: ReactNode }) {
  return (
    <ClientOnly>
      <WagmiProvider config={config}>
        <WalletProvider>{children}</WalletProvider>
      </WagmiProvider>
    </ClientOnly>
  );
}
