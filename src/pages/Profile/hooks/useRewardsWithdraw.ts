import { useCallback, useEffect, useState } from 'react';
import { useWriteCustormV3 } from '@/hooks/useWriteCustormV3';
import { useAllContractConfigs,CHAIN_CONFIG } from '@dapp/config/contractsConfig';
import type { RewardWithdrawMethod } from './useUserRewardsSummary';

interface WithdrawArgs {
    method: RewardWithdrawMethod;
    tokenAddress: string;
}

interface CurrentAction extends WithdrawArgs {}

export const useRewardsWithdraw = (userId: string | null) => {
    const { writeCustormV3, error, isLoading, isSuccessed } = useWriteCustormV3();
    const allConfigs = useAllContractConfigs();
    const [currentAction, setCurrentAction] = useState<CurrentAction | null>(null);

    const withdrawRewards = useCallback(async ({ method, tokenAddress }: WithdrawArgs) => {
        if (!tokenAddress) {
            throw new Error('Token address is required');
        }

        setCurrentAction({ method, tokenAddress });

        try {
            const hash = await writeCustormV3({
                contract: allConfigs.FundManager,
                functionName: method,
                tokenAddress: tokenAddress,
                args: [tokenAddress],
            });

            return hash;
        } catch (err) {
            // when error occurs, clear currentAction
            setCurrentAction(null);
            throw err;
        }
    }, [allConfigs.FundManager, writeCustormV3]);

    const pendingKey = currentAction ? `${currentAction.method}-${currentAction.tokenAddress.toLowerCase()}` : null;

    // when transaction confirmation succeeds, clear currentAction
    // note: withdraw interaction record is automatically added by useWriteCustormV3 via accountStore
    useEffect(() => {
        if (isSuccessed && currentAction) {
            setCurrentAction(null);
        }
    }, [isSuccessed, currentAction]);

    // when transaction fails, clear currentAction
    useEffect(() => {
        if (error) {
            setCurrentAction(null);
        }
    }, [error]);

    return {
        withdrawRewards,
        currentAction,
        pendingKey,
        error,
        isLoading: isLoading,
        isSuccessed,
    };
};
