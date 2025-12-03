import { useMemo, useState } from 'react';
import type { RewardCategorySummary } from './useUserRewardsSummary';

interface RewardsHookResult {
    categories: RewardCategorySummary[];
    hasClaimable: boolean;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
    enabled: boolean;
}

const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed + 1) * 10000;
    return x - Math.floor(x);
};

const rewardTokens = ['USDC', 'USDT', 'DAI', 'ETH', 'WTC', 'WTC.S', 'WROSE.S'];

const createCategory = (seed: number, label: string, withdrawMethod: 'withdrawMinterRewards' | 'withdrawHelperRewards'): RewardCategorySummary => {
    // 生成 0 到 rewardTokens.length（即 0-4）个代币
    const tokenCount = Math.floor(pseudoRandom(seed) * (rewardTokens.length + 1));
    const tokens = Array.from({ length: tokenCount }).map((_, idx) => {
        const amountRaw = BigInt(Math.floor(pseudoRandom(seed + idx) * 10000)) * BigInt(10 ** 15);
        return {
            tokenAddress: `0x${(seed + idx).toString(16).padStart(40, '0')}`,
            tokenSymbol: rewardTokens[(seed + idx) % rewardTokens.length],
            decimals: 18,
            formattedEarned: (Number(amountRaw) / 1e18).toFixed(4),
            formattedWithdrawn: (Number(amountRaw / BigInt(2)) / 1e18).toFixed(4),
            formattedClaimable: (Number(amountRaw / BigInt(3)) / 1e18).toFixed(4),
            raw: {
                earned: amountRaw,
                withdrawn: amountRaw / BigInt(2),
                claimable: amountRaw / BigInt(3),
            },
        };
    });

    return {
        category: label === 'Minter' ? 'Minter' : 'Helper',
        label,
        description: `Generated ${label} reward data`,
        withdrawMethod,
        tokens,
    };
};

export const useUserRewardsSummary = (_userId: string | null): RewardsHookResult => {
    const [nonce, setNonce] = useState(0);

    const categories = useMemo(() => {
        const base = nonce + (_userId ? parseInt(_userId, 10) || 0 : 0);
        return [
            createCategory(base + 1, 'Minter Rewards', 'withdrawMinterRewards'),
            createCategory(base + 17, 'Helper Rewards', 'withdrawHelperRewards'),
        ];
    }, [nonce, _userId]);

    return {
        categories,
        hasClaimable: categories.some((category) => category.tokens.some((token) => token.raw.claimable > BigInt(0))),
        isLoading: false,
        isFetching: false,
        isError: false,
        error: null,
        refetch: () => setNonce((value) => value + 1),
        enabled: true,
    };
};
