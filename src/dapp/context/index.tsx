"use client";

import type { ReactNode } from "react";
import { WikiTruthAppKitProvider } from "./useAccount/appKit";
import { WalletProvider } from "./useAccount/WalletContext";


export function Web3ContextProvider({ children }: { children: ReactNode }) {
  return (

    <WikiTruthAppKitProvider>
      <WalletProvider>{children}</WalletProvider>
    </WikiTruthAppKitProvider>
  );
}
