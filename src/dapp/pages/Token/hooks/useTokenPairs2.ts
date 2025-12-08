import { useMemo } from 'react';
import { useSupportedTokens } from '@/dapp/contractsConfig';
import { TokenInfo, TokenPair } from '../types';

export const useTokenPairs2 = () => {
    const supportedTokens = useSupportedTokens();
    
    // 筛选出 ERC20 和 Secret 类型的代币
    const erc20Tokens = supportedTokens.filter(token => token.types === 'ERC20');
    const supportedSecretTokens = supportedTokens.filter(token => token.types === 'Secret');

    const tokenPairs: TokenPair[] = useMemo(() => {
        const pairs: TokenPair[] = [];

        supportedSecretTokens.forEach(secretToken => {
            // 特殊处理：wROSE.S 需要生成两个配对
            // 1. wROSE.S -> 原生 ROSE (isNativeROSE = true, 用于 withdraw)
            // 2. wROSE.S -> wROSE ERC20 (isNativeROSE = false, 用于 unwrap)
            if (secretToken.symbol === 'wROSE.S') {
                // 配对1：wROSE.S -> 原生 ROSE
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

                // 配对2：wROSE.S -> wROSE ERC20
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
                // 其他 Secret token：通过 mappingAddress 查找对应的 ERC20 token
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




