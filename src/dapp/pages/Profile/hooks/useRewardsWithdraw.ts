import { useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWriteCustormV2 } from '@/dapp/hooks/useWriteCustormV2';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { CHAIN_CONFIG } from '@/dapp/contractsConfig';
import type { RewardWithdrawMethod } from './useUserRewardsSummary';

interface WithdrawArgs {
    method: RewardWithdrawMethod;
    tokenAddress: string;
}

interface CurrentAction extends WithdrawArgs {}

export const useRewardsWithdraw = (userId: string | null) => {
    const { writeCustormV2, error, isPending, isSuccessed } = useWriteCustormV2();
    const allConfigs = useAllContractConfigs();
    const queryClient = useQueryClient();
    const [currentAction, setCurrentAction] = useState<CurrentAction | null>(null);

    const rewardsQueryKey = useMemo(() => ['profile-user-rewards', CHAIN_CONFIG.network, CHAIN_CONFIG.layer, userId], [userId]);

    const withdrawRewards = useCallback(async ({ method, tokenAddress }: WithdrawArgs) => {
        if (!tokenAddress) {
            throw new Error('Token address is required');
        }

        setCurrentAction({ method, tokenAddress });

        try {
            await writeCustormV2({
                contract: allConfigs.FundManager,
                functionName: method,
                args: [tokenAddress],
            });

            await queryClient.invalidateQueries({ queryKey: rewardsQueryKey });
        } finally {
            setCurrentAction(null);
        }
    }, [allConfigs.FundManager, queryClient, rewardsQueryKey, writeCustormV2]);

    const pendingKey = currentAction ? `${currentAction.method}-${currentAction.tokenAddress.toLowerCase()}` : null;

    return {
        withdrawRewards,
        currentAction,
        pendingKey,
        error,
        isPending,
        isSuccessed,
    };
};
