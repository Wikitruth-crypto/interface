import { useState, useEffect, useMemo } from 'react';
import { useSupportedTokens, TokenMetadata } from '@/dapp/contractsConfig';
import { TokenInfo, TokenPair } from '../types';

/**
 * Hook for managing token pairs
 * 
 */
export const useTokenPairs = (tokens: TokenInfo[]) => {
    const supportedTokens = useSupportedTokens();
    const [selectedPairIndex, setSelectedPairIndex] = useState<number>(0);

    // 筛选出 ERC20 代币和对应的 Secret 代币对
    const tokenPairs: TokenPair[] = useMemo(() => {
        const pairs: TokenPair[] = [];
        
        // 获取所有代币（不包含 .S 结尾的），包括原生代币和 ERC20 代币
        const erc20Tokens = tokens.filter(token => !token.symbol.endsWith('.S'));

        const supportedSecretTokens = supportedTokens.filter(token => token.types === 'Secret');
        
        erc20Tokens.forEach(erc20Token => {
            // 判断是否为原生代币（地址为零地址）
            const isNativeToken = erc20Token.address === '0x0000000000000000000000000000000000000000';
            
            // 判断是否为原生 wROSE/TEST -> wROSE.S
            const isNativeROSE = isNativeToken && (
                erc20Token.symbol.toUpperCase() === 'wROSE' || 
                erc20Token.symbol.toUpperCase() === 'TEST'
            );
            
            let secretSymbol: string;
            let secretTokenCurrent: TokenMetadata | null = null;
            let secretToken: TokenInfo | null = null;

            // 对于原生 wROSE，需要找到 supportedTokens 中 wROSE 的实际地址
            let erc20TokenAddress = erc20Token.address;
            
            if (isNativeROSE) {
                // 查找 supportedTokens 中 wROSE 的实际地址
                const wROSEMetadata = supportedTokens.find(t => t.symbol === 'wROSE' && t.types === 'ERC20');
                if (wROSEMetadata) {
                    erc20TokenAddress = wROSEMetadata.address as `0x${string}`;
                }
                // 原生 wROSE/TEST -> wROSE.S
                secretSymbol = 'wROSE.S';
                secretTokenCurrent = supportedSecretTokens.find(t => t.symbol === secretSymbol) || null;
            } else {
                // 普通 ERC20 -> Secret Token
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

            // 使用实际地址创建 erc20 TokenInfo（对于原生 wROSE，使用 supportedTokens 中的地址）
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

    // 当 tokenPairs 变化时，重置 selectedPairIndex
    useEffect(() => {
        if (tokenPairs.length > 0 && selectedPairIndex >= tokenPairs.length) {
            setSelectedPairIndex(0);
        }
    }, [tokenPairs, selectedPairIndex]);

    // 当前选中的代币对
    const selectedPair: TokenPair | null = useMemo(() => {
        return tokenPairs[selectedPairIndex] || null;
    }, [tokenPairs, selectedPairIndex]);

    // 筛选有余额的 Secret 代币对（用于 unwrap/withdraw）
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
        supportedTokens, // 导出 supportedTokens 供辅助函数使用
    };
};

