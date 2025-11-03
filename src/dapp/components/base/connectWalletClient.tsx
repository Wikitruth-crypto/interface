'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export const ConnectWalletClient = () => {
    return (
        <ConnectButton
            label='Connect'
            showBalance={false}
            chainStatus="icon"
            accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'address',
            }}
        />
    );
}; 




