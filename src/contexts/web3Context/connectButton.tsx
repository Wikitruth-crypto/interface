'use client';

import React, { useEffect, useRef } from 'react';
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';

type ConnectButtonProps = React.ComponentProps<typeof RainbowConnectButton>;

/**
 * Custom ConnectButton component
 * Wrap Rainbow Kit's ConnectButton, add custom styles
 * 
 * Supports all native props of Rainbow Kit ConnectButton
 * Automatically replace network name with abbreviation: Oasis Sapphire -> main, Oasis Sapphire Testnet -> test
 */
export function ConnectButton(props: ConnectButtonProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Replace network name with abbreviation and modify address display to last 3 digits
        const replaceContent = () => {
            if (!wrapperRef.current) return;

            // Get all text node helper function
            const getAllTextNodes = (node: Node): Node[] => {
                const textNodes: Node[] = [];
                const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
                let textNode;
                while (textNode = walker.nextNode()) {
                    textNodes.push(textNode);
                }
                return textNodes;
            };

            // 1. Replace network name with abbreviation
            getAllTextNodes(wrapperRef.current).forEach((textNode) => {
                const text = textNode.textContent || '';
                const trimmed = text.trim();
                
                // Check and replace network name (prioritize Testnet)
                if (trimmed.includes('Testnet') && trimmed !== 'TEST') {
                    textNode.textContent = 'TEST';
                } else if (trimmed.includes('Oasis Sapphire') && trimmed !== 'TEST' && trimmed !== 'MAIN') {
                    // Mainnet (does not include Testnet)
                    textNode.textContent = 'MAIN';
                }
            });

            // 2. Modify address display to last 3 digits (change from last 4 digits to last 3 digits)
            getAllTextNodes(wrapperRef.current).forEach((textNode) => {
                const text = textNode.textContent || '';
                // Match address format: 0x...XXXX (last 4 digits) -> 0x...XXX (last 3 digits)
                // Also match 0xXXXX...YYYY format
                const addressPattern = /0x([a-fA-F0-9]{0,4})\.\.\.([a-fA-F0-9]{4})/;
                const match = text.match(addressPattern);
                if (match) {
                    const lastFour = match[2];
                    const lastThree = lastFour.slice(-3);
                    const newText = text.replace(match[0], `0x...${lastThree}`);
                    if (text !== newText) {
                        textNode.textContent = newText;
                    }
                }
            });
        };

        // Initial replacement - multiple attempts to ensure DOM is loaded
        const tryReplace = () => {
            replaceContent();
        };

        // Immediately execute
        tryReplace();
        
        // Delay execution, ensure Rainbow Kit is fully rendered
        const timeout1 = setTimeout(tryReplace, 100);
        const timeout2 = setTimeout(tryReplace, 300);
        const timeout3 = setTimeout(tryReplace, 500);

        // Use MutationObserver to listen for DOM changes
        const observer = new MutationObserver(() => {
            setTimeout(replaceContent, 0);
        });

        if (wrapperRef.current) {
            observer.observe(wrapperRef.current, {
                childList: true,
                subtree: true,
                characterData: true,
            });
        }

        return () => {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
            clearTimeout(timeout3);
            observer.disconnect();
        };
    }, []);

    return (
        <div ref={wrapperRef} className="wikitruth-connect-button-wrapper">
            <RainbowConnectButton {...props} />
        </div>
    );
}

