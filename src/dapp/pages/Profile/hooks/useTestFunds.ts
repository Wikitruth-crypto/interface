import { useMemo } from 'react';
import type { BoxData } from '../types/profile.types';
import type { ClaimableFund, ClaimMethodType, FundType, TokenData } from '../types/cardProfile.types';

export interface UseFundsParams {
    box: BoxData;
    userId?: string | null;
}

export interface UseFundsReturn {
    funds: ClaimableFund;
    isLoading: boolean;
    hasClaimableFunds: boolean;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed + 1) * 10000;
    return x - Math.floor(x);
};

const createToken = (seed: number, symbol: string, decimals = 18): TokenData => {
    const rand = pseudoRandom(seed);
    const raw = BigInt(Math.floor(rand * 5000)) * BigInt(10 ** (decimals - 3)) * BigInt(1000);
    return {
        amount: raw.toString(),
        formattedAmount: (Number(raw) / 10 ** decimals).toFixed(4),
        symbol,
        decimals,
        hasValidAmount: raw > BigInt(0),
    };
};

export const useFunds = ({ box }: UseFundsParams): UseFundsReturn => {
    const result = useMemo(() => {
        const baseSeed = Number(box.tokenId ?? box.id ?? '0');
        const isRefund = pseudoRandom(baseSeed) > 0.5;
        const type: FundType = isRefund ? 'Refund' : 'Order';
        const claimMethod: ClaimMethodType = isRefund ? 'withdrawRefundAmounts' : 'withdrawOrderAmounts';
        const tokenCount = clamp(Math.floor(pseudoRandom(baseSeed + 2) * 3), 1, 2);

        const possibleSymbols = ['USDC', 'USDT', 'DAI'];
        const tokens: TokenData[] = Array.from({ length: tokenCount }).map((_, idx) => {
            const symbol = possibleSymbols[(idx + baseSeed) % possibleSymbols.length];
            return createToken(baseSeed + idx * 17, symbol);
        });

        return {
            funds: {
                boxId: box.id,
                type,
                claimMethod,
                tokens,
            },
            hasClaimableFunds: tokens.some((token) => token.hasValidAmount),
        };
    }, [box.id, box.tokenId]);

    return {
        funds: result.funds,
        isLoading: false,
        hasClaimableFunds: result.hasClaimableFunds,
    };
};
