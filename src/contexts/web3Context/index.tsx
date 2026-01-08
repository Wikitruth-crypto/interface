"use client";

import type { ReactNode } from "react";
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { RainbowKitSapphireProvider } from "./useAccount/rainbowKitConfig";
import { WalletProvider } from "./useAccount/WalletContext";
import { wikitruthTheme } from "./rainbowKitTheme";
import './rainbowKitCustom.css';

export function Web3ContextProvider({ children }: { children: ReactNode }) {
  return (
    <RainbowKitSapphireProvider>
      <RainbowKitProvider theme={wikitruthTheme}>
        <WalletProvider>{children}</WalletProvider>
      </RainbowKitProvider>
    </RainbowKitSapphireProvider>
  );
}
