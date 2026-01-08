import { useState, useEffect, useMemo } from 'react';
import { useSupportedTokens, TokenMetadata } from '@dapp/config/contractsConfig';
import { TokenInfo, TokenPair } from '../types';

/**
 * Hook for managing token pairs
 * 
 */
export const useTokenPairs = (tokens: TokenInfo[]) => {
    const supportedTokens = useSupportedTokens();
    const [selectedPairIndex, setSelectedPairIndex] = useState<number>(0);

    // Filter out ERC20 tokens and corresponding Secret token pairs
    const tokenPairs: TokenPair[] = useMemo(() => {
        const pairs: TokenPair[] = [];
        
        // Get all tokens (excluding .S ending), including native tokens and ERC20 tokens
        const erc20Tokens = tokens.filter(token => !token.symbol.endsWith('.S'));

        const supportedSecretTokens = supportedTokens.filter(token => token.types === 'Secret');
        
        erc20Tokens.forEach(erc20Token => {
            // Check if it is a native token (address is zero address)
            const isNativeToken = erc20Token.address === '0x0000000000000000000000000000000000000000';
            
            // Check if it is a native wROSE/TEST -> wROSE.S
            const isNativeROSE = isNativeToken && (
                erc20Token.symbol.toUpperCase() === 'wROSE' || 
                erc20Token.symbol.toUpperCase() === 'TEST'
            );
            
            let secretSymbol: string;
            let secretTokenCurrent: TokenMetadata | null = null;
            let secretToken: TokenInfo | null = null;

            // For native wROSE, need to find the actual address of wROSE in supportedTokens
            let erc20TokenAddress = erc20Token.address;
            
            if (isNativeROSE) {
                // Find the actual address of wROSE in supportedTokens
                const wROSEMetadata = supportedTokens.find(t => t.symbol === 'wROSE' && t.types === 'ERC20');
                if (wROSEMetadata) {
                    erc20TokenAddress = wROSEMetadata.address as `0x${string}`;
                }
                // Native wROSE/TEST -> wROSE.S
                secretSymbol = 'wROSE.S';
                secretTokenCurrent = supportedSecretTokens.find(t => t.symbol === secretSymbol) || null;
            } else {
                // Ordinary ERC20 -> Secret Token
                secretSymbol = `${erc20Token.symbol}.S`;
                secretTokenCurrent = supportedSecretTokens.find(t => t.symbol === secretSymbol) || null;
            }

            if (secretTokenCurrent) {
                secretToken = {
                    address: secretTokenCurrent.address,
                    symbol: secretTokenCurrent.symbol,
                    name: secretTokenCurrent.name,
                    decimals: secretTokenCurrent.decimals,
                    balance: '0',
                };
            }

            // Use actual address to create erc20 TokenInfo (for native wROSE, use the address in supportedTokens)
            const erc20TokenInfo: TokenInfo = {
                ...erc20Token,
                address: erc20TokenAddress,
            };
            
            pairs.push({
                erc20: erc20TokenInfo,
                secret: secretToken || null,
                isNativeROSE,
            });
        });
        
        return pairs;
    }, [tokens, supportedTokens]);

    // When tokenPairs change, reset selectedPairIndex
    useEffect(() => {
        if (tokenPairs.length > 0 && selectedPairIndex >= tokenPairs.length) {
            setSelectedPairIndex(0);
        }
    }, [tokenPairs, selectedPairIndex]);

    // Current selected token pair
    const selectedPair: TokenPair | null = useMemo(() => {
        return tokenPairs[selectedPairIndex] || null;
    }, [tokenPairs, selectedPairIndex]);

    // Filter out token pairs with balance (for unwrap/withdraw)
    const pairsWithSecretBalance = useMemo(() => {
        return tokenPairs.filter(pair => 
            pair.secret && parseFloat(pair.secret.balance) > 0
        );
    }, [tokenPairs]);

    return {
        tokenPairs,
        selectedPair,
        selectedPairIndex,
        setSelectedPairIndex,
        pairsWithSecretBalance,
        supportedTokens, // Export supportedTokens for use by auxiliary functions
    };
};  

