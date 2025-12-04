import { useState, useEffect, useMemo } from 'react';
import { useSupportedTokens } from '@/dapp/contractsConfig';
import { TokenInfo, TokenPair } from '../types';

/**
 * Hook for managing token pairs
 * 管理代币对逻辑
 */
export const useTokenPairs = (tokens: TokenInfo[]) => {
    const supportedTokens = useSupportedTokens();
    const [selectedPairIndex, setSelectedPairIndex] = useState<number>(0);

    // 筛选出 ERC20 代币和对应的 Secret 代币对
    const tokenPairs: TokenPair[] = useMemo(() => {
        const pairs: TokenPair[] = [];
        
        // 获取所有代币（不包含 .S 结尾的），包括原生代币和 ERC20 代币
        const erc20Tokens = tokens.filter(token => !token.symbol.endsWith('.S'));
        
        erc20Tokens.forEach(erc20Token => {
            // 判断是否为原生代币（地址为零地址）
            const isNativeToken = erc20Token.address === '0x0000000000000000000000000000000000000000';
            
            // 判断是否为原生 ROSE/TEST -> wROSE.S
            const isNativeROSE = isNativeToken && (
                erc20Token.symbol.toUpperCase() === 'ROSE' || 
                erc20Token.symbol.toUpperCase() === 'TEST'
            );
            
            let secretSymbol: string;
            let secretToken: TokenInfo | null = null;
            let secretContractAddress: `0x${string}` | null = null;
            
            if (isNativeROSE) {
                // 原生 ROSE/TEST -> wROSE.S
                secretSymbol = 'wROSE.S';
                secretToken = tokens.find(t => t.symbol === secretSymbol) || null;
                
                // 从 supportedTokens 中查找 wROSE_Secret 合约地址
                const secretTokenConfig = supportedTokens.find(
                    t => t.symbol === secretSymbol && t.types === 'Secret'
                );
                secretContractAddress = secretTokenConfig 
                    ? (secretTokenConfig.address as `0x${string}`)
                    : null;
            } else {
                // 普通 ERC20 -> Secret Token
                secretSymbol = `${erc20Token.symbol}.S`;
                secretToken = tokens.find(t => t.symbol === secretSymbol) || null;
                
                // 从 supportedTokens 中查找 Secret 合约地址
                const secretTokenConfig = supportedTokens.find(
                    t => t.symbol === secretSymbol && t.types === 'Secret'
                );
                secretContractAddress = secretTokenConfig 
                    ? (secretTokenConfig.address as `0x${string}`)
                    : null;
            }
            
            pairs.push({
                erc20: erc20Token,
                secret: secretToken || null,
                secretContractAddress,
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
    };
};

