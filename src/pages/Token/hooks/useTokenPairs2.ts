import { useMemo } from 'react';
import { useSupportedTokens } from '@dapp/config/contractsConfig';
import { TokenInfo, TokenPair } from '../types';

export const useTokenPairs2 = () => {
    const supportedTokens = useSupportedTokens();
    
    // Filter out ERC20 and Secret type tokens
    const erc20Tokens = supportedTokens.filter(token => token.types === 'ERC20');
    const supportedSecretTokens = supportedTokens.filter(token => token.types === 'Secret');

    const tokenPairs: TokenPair[] = useMemo(() => {
        const pairs: TokenPair[] = [];

        supportedSecretTokens.forEach(secretToken => {
            // Special handling: wROSE.S needs to generate two pairs
            // 1. wROSE.S -> Native ROSE (isNativeROSE = true, for withdraw)
            // 2. wROSE.S -> wROSE ERC20 (isNativeROSE = false, for unwrap)
            if (secretToken.symbol === 'wROSE.S') {
                // Pair 1: wROSE.S -> Native ROSE
                const nativeROSEPair: TokenPair = {
                    erc20: {
                        address: '0x0000000000000000000000000000000000000000' as `0x${string}`,
                        symbol: 'TEST',
                        name: 'Sapphire Test Token',
                        decimals: 18,
                        balance: '0',
                    },
                    secret: {
                        address: secretToken.address,
                        symbol: secretToken.symbol,
                        name: secretToken.name,
                        decimals: secretToken.decimals || 18,
                        balance: '0',
                    },
                    isNativeROSE: true,
                };
                pairs.push(nativeROSEPair);

                // Pair 2: wROSE.S -> wROSE ERC20
                const wROSEToken = erc20Tokens.find(
                    erc20Token => erc20Token.symbol === 'wROSE'
                );
                if (wROSEToken) {
                    const wROSEPair: TokenPair = {
                        erc20: {
                            address: wROSEToken.address,
                            symbol: wROSEToken.symbol,
                            name: wROSEToken.name,
                            decimals: wROSEToken.decimals || 18,
                            balance: '0',
                        },
                        secret: {
                            address: secretToken.address,
                            symbol: secretToken.symbol,
                            name: secretToken.name,
                            decimals: secretToken.decimals || 18,
                            balance: '0',
                        },
                        isNativeROSE: false,
                    };
                    pairs.push(wROSEPair);
                }
            } else {
                // Other Secret token: find the corresponding ERC20 token through mappingAddress
                const erc20Token = erc20Tokens.find(
                    erc20Token => erc20Token.address.toLowerCase() === secretToken.mappingAddress?.toLowerCase()
                );

                if (erc20Token) {
                    const tokenPair: TokenPair = {
                        erc20: {
                            address: erc20Token.address,
                            symbol: erc20Token.symbol,
                            name: erc20Token.name,
                            decimals: erc20Token.decimals || 18,
                            balance: '0',
                        },
                        secret: {
                            address: secretToken.address,
                            symbol: secretToken.symbol,
                            name: secretToken.name,
                            decimals: secretToken.decimals || 18,
                            balance: '0',
                        },
                        isNativeROSE: false,
                    };
                    pairs.push(tokenPair);
                }
            }
        });

        return pairs;
    }, [supportedSecretTokens, erc20Tokens]);

    return {
        tokenPairs,
    };
};




