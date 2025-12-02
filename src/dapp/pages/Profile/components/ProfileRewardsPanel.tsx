'use client';

import React from 'react';
import { Loader2, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserRewardsSummary } from '../hooks/useUserRewardsSummary';
import type { RewardWithdrawMethod } from '../hooks/useUserRewardsSummary';
import { useRewardsWithdraw } from '../hooks/useRewardsWithdraw';
import { useSiweAuth } from '@/dapp/hooks/SiweAuth/useSiweAuth';
import {Button, Empty} from 'antd';

interface ProfileRewardsPanelProps {
    userId: string | null;
    className?: string;
}

const ProfileRewardsPanel: React.FC<ProfileRewardsPanelProps> = ({ userId, className }) => {
    const { categories, isLoading, isFetching, error, refetch } = useUserRewardsSummary(userId);
    const { withdrawRewards, pendingKey, isPending, error: withdrawError } = useRewardsWithdraw(userId);
    const { login } = useSiweAuth();
    const handleWithdraw = async (method: RewardWithdrawMethod, tokenAddress: string) => {
        try {
            await withdrawRewards({ method, tokenAddress });
        } catch (err) {
            console.error('withdrawRewards failed', err);
        }
    };

    if (!userId) {
        return (
            <div className={cn('rounded-2xl border border-border bg-card/50 p-6', className)}>
                <Empty description="You need to login/bind to view the reward data" />
                <Button type="primary" onClick={() => login()}>Login</Button>
            </div>
        );
    }

    return (
        <div className={cn('space-y-4 rounded-2xl border border-border bg-card/40 p-6', className)}>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm font-semibold text-muted-foreground">Rewards Dashboard</p>
                </div>
                <button
                    type="button"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent/40 disabled:opacity-50"
                >
                    <RefreshCcw className="h-4 w-4" />
                    {isFetching ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {error && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                    Failed to load reward data: {error.message}
                </div>
            )}

            {withdrawError && (
                <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm text-amber-400">
                    Withdrawal failed: {withdrawError.message}
                </div>
            )}

            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div key={index} className="animate-pulse rounded-2xl border border-border/60 bg-background/30 p-4">
                            <div className="h-4 w-1/3 rounded bg-muted" />
                            <div className="mt-4 space-y-2">
                                <div className="h-3 w-full rounded bg-muted/70" />
                                <div className="h-3 w-5/6 rounded bg-muted/70" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : categories.length === 0 ? (
                <Empty description="No reward records to display" />
            ) : (
                <div className="space-y-6">
                    {categories.map((category) => (
                        <div key={category.category} className="rounded-2xl border border-border/80 bg-background/40 p-5">
                            <div className="flex flex-col gap-2 border-b border-border/60 pb-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground">{category.label}</p>
                                    <p className="text-base font-medium text-foreground">{category.description}</p>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Total {category.tokens.length} tokens
                                </div>
                            </div>
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                                {category.tokens.map((token) => {
                                    const actionKey = `${category.withdrawMethod}-${token.tokenAddress.toLowerCase()}`;
                                    const canClaim = token.raw.claimable > BigInt(0);
                                    const isButtonBusy = pendingKey === actionKey && isPending;

                                    return (
                                        <div key={`${category.category}-${token.tokenAddress}`} className="rounded-xl border border-border/70 bg-card/30 p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold">{token.tokenSymbol}</p>
                                                    <p className="text-xs text-muted-foreground">{token.tokenAddress}</p>
                                                </div>
                                                <div className="text-right text-xs text-muted-foreground">
                                                    {canClaim ? 'Claimable' : 'Not claimable'}
                                                </div>
                                            </div>
                                            <div className="mt-3 space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Total Rewards</span>
                                                    <span>{token.formattedEarned}</span>
                                                </div>
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>Withdrawn</span>
                                                    <span>{token.formattedWithdrawn}</span>
                                                </div>
                                                <div className="flex justify-between font-semibold">
                                                    <span>Claimable</span>
                                                    <span>{token.formattedClaimable}</span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                disabled={!canClaim || isPending}
                                                onClick={() => handleWithdraw(category.withdrawMethod, token.tokenAddress)}
                                                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition disabled:opacity-50"
                                            >
                                                {isButtonBusy ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Withdrawing...
                                                    </>
                                                ) : (
                                                    'Withdraw Rewards'
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfileRewardsPanel;
