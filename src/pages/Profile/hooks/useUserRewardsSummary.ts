import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { CHAIN_CONFIG } from '@dapp/config/contractsConfig';
import { useSupportedTokens } from '@dapp/config/contractsConfig';
import type { TokenMetadata } from '@dapp/config/contractsConfig';
import {
    query_UserRewardsData,
    query_UserWithdrawsData,
    type UserRewardData,
    type UserWithdrawData,
} from '@dapp/services/supabase/userData';

type RewardCategory = 'Minter' | 'Helper';
export type RewardWithdrawMethod = 'withdrawMinterRewards' | 'withdrawHelperRewards';

export interface RewardTokenSummary {
    tokenAddress: string;
    tokenSymbol: string;
    decimals: number;
    formattedEarned: string;
    formattedWithdrawn: string;
    formattedClaimable: string;
    raw: {
        earned: bigint;
        withdrawn: bigint;
        claimable: bigint;
    };
}

export interface RewardCategorySummary {
    category: RewardCategory;
    label: string;
    description: string;
    withdrawMethod: RewardWithdrawMethod;
    tokens: RewardTokenSummary[];
}

interface RewardsQueryResult {
    rewards: UserRewardData[];
    withdraws: UserWithdrawData[];
}

const DEFAULT_SUMMARY: RewardCategorySummary[] = [];

const categoryMeta: Record<RewardCategory, { label: string; description: string; withdrawMethod: RewardWithdrawMethod }> = {
    Minter: {
        label: 'The Minter Rewards',
        description: 'The cumulative rewards from minting boxes, which can be withdrawn through withdrawMinterRewards.',
        withdrawMethod: 'withdrawMinterRewards',
    },
    Helper: {
        label: 'The Helper Rewards',
        description: 'The rewards obtained by sellers/completers, which can be withdrawn through withdrawHelperRewards.',
        withdrawMethod: 'withdrawHelperRewards',
    },
};

const toBigInt = (value?: string | null): bigint => {
    if (!value) return BigInt(0);
    try {
        return BigInt(value);
    } catch {
        return BigInt(0);
    }
};

const formatAmount = (amount: bigint, decimals: number): string => {
    if (amount === BigInt(0)) return '0';
    try {
        const formatted = formatUnits(amount, decimals);
        const [integer, fractional = '0'] = formatted.split('.');
        const trimmedFraction = fractional.replace(/0+$/, '').slice(0, 4);
        return trimmedFraction ? `${integer}.${trimmedFraction}` : integer;
    } catch {
        return amount.toString();
    }
};

const buildTokenMap = (tokens: TokenMetadata[]) => {
    const map = new Map<string, TokenMetadata>();
    tokens.forEach((token) => {
        map.set(token.address.toLowerCase(), token);
    });
    return map;
};

const normalizeTokenKey = (token?: string | null) => (token ? token.toLowerCase() : '');

const fallbackSymbol = (address: string) => {
    if (!address) return 'UNKNOWN';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const useUserRewardsSummary = (userId: string | null) => {
    const supportedTokens = useSupportedTokens();
    const tokenMap = useMemo(() => buildTokenMap(supportedTokens), [supportedTokens]);

    const enabled = Boolean(userId);

    const rewardsQuery = useQuery<RewardsQueryResult>({
        queryKey: ['profile-user-rewards', CHAIN_CONFIG.network, CHAIN_CONFIG.layer, userId],
        queryFn: async () => {
            if (!userId) {
                return { rewards: [], withdraws: [] };
            }

            const [rewardRes, withdrawRes] = await Promise.all([
                query_UserRewardsData(userId),
                query_UserWithdrawsData(userId),
            ]);

            if (rewardRes.error) {
                throw rewardRes.error;
            }
            if (withdrawRes.error) {
                throw withdrawRes.error;
            }

            return {
                rewards: rewardRes.userRewardsData ?? [],
                withdraws: withdrawRes.userWithdrawsData ?? [],
            };
        },
        enabled,
        staleTime: 60 * 1000,
    });

    const summary = useMemo<RewardCategorySummary[]>(() => {
        if (!enabled || !rewardsQuery.data) {
            return DEFAULT_SUMMARY;
        }

        const rewardTotals: Record<RewardCategory, Map<string, bigint>> = {
            Minter: new Map(),
            Helper: new Map(),
        };
        const withdrawTotals: Record<RewardCategory, Map<string, bigint>> = {
            Minter: new Map(),
            Helper: new Map(),
        };

        rewardsQuery.data.rewards.forEach((reward) => {
            const category: RewardCategory = reward.rewardType === 'Minter' ? 'Minter' : 'Helper';
            const tokenKey = normalizeTokenKey(reward.token);
            const amount = toBigInt(reward.amount);
            const bucket = rewardTotals[category];
            bucket.set(tokenKey, (bucket.get(tokenKey) ?? BigInt(0)) + amount);
        });

        rewardsQuery.data.withdraws.forEach((withdraw) => {
            const category: RewardCategory = withdraw.withdrawType === 'Minter' ? 'Minter' : 'Helper';
            const tokenKey = normalizeTokenKey(withdraw.token);
            const amount = toBigInt(withdraw.amount);
            const bucket = withdrawTotals[category];
            bucket.set(tokenKey, (bucket.get(tokenKey) ?? BigInt(0)) + amount);
        });

        const result: RewardCategorySummary[] = (['Minter', 'Helper'] as RewardCategory[])
            .map((category) => {
                const tokens: RewardTokenSummary[] = Array.from(rewardTotals[category].entries()).map(([tokenKey, totalEarned]) => {
                    const withdrawn = withdrawTotals[category].get(tokenKey) ?? BigInt(0);
                    const claimableRaw = totalEarned - withdrawn;
                    const safeClaimable = claimableRaw > BigInt(0) ? claimableRaw : BigInt(0);
                    const tokenMeta = tokenMap.get(tokenKey);
                    const decimals = tokenMeta?.decimals ?? 18;
                    const symbol = tokenMeta?.symbol ?? fallbackSymbol(tokenKey);

                    return {
                        tokenAddress: tokenKey,
                        tokenSymbol: symbol,
                        decimals,
                        formattedEarned: formatAmount(totalEarned, decimals),
                        formattedWithdrawn: formatAmount(withdrawn, decimals),
                        formattedClaimable: formatAmount(safeClaimable, decimals),
                        raw: {
                            earned: totalEarned,
                            withdrawn,
                            claimable: safeClaimable,
                        },
                    };
                });

                if (tokens.length === 0) {
                    return null;
                }

                return {
                    category,
                    label: categoryMeta[category].label,
                    description: categoryMeta[category].description,
                    withdrawMethod: categoryMeta[category].withdrawMethod,
                    tokens,
                } satisfies RewardCategorySummary;
            })
            .filter((item): item is RewardCategorySummary => Boolean(item));

        return result;
    }, [enabled, rewardsQuery.data, tokenMap]);

    const hasClaimable = useMemo(
        () => summary.some((category) => category.tokens.some((token) => token.raw.claimable > BigInt(0))),
        [summary]
    );

    return {
        categories: summary,
        hasClaimable,
        isLoading: rewardsQuery.isLoading,
        isFetching: rewardsQuery.isFetching,
        isError: rewardsQuery.isError,
        error: rewardsQuery.error,
        refetch: rewardsQuery.refetch,
        enabled,
    };
};
