"use client"
import { useWriteCustormV2 } from "@/dapp/hooks/useWriteCustormV2";
import { useAllContractConfigs } from "@/dapp/contractsConfig";
import { useWithdrawStore } from "../store/withdrawStore";
import { useSupportedTokens } from "@/dapp/contractsConfig";

export const useWithdraw = () => {
    const supportedTokens = useSupportedTokens();
    const allConfigs = useAllContractConfigs();
    const { writeCustormV2, error, isPending, isSuccessed } = useWriteCustormV2();

    const withdraw = async () => {
        const withdrawData = useWithdrawStore.getState().withdrawData;
        const { selectedBoxes, selectedTokenSymbol, selectedTokenAddress, selectedClaimMethod } = withdrawData;

        try {
            if (!selectedTokenSymbol || !selectedClaimMethod) {
                throw new Error('Invalid withdraw data');
            }

            if ((selectedClaimMethod === 'withdrawOrderAmounts' || selectedClaimMethod === 'withdrawRefundAmounts') && (!selectedBoxes || selectedBoxes.length === 0)) {
                throw new Error('Please select at least one box');
            }

            const fallbackToken = supportedTokens.find(item => item.symbol === selectedTokenSymbol);
            const tokenAddress = selectedTokenAddress ?? fallbackToken?.address;
            if (!tokenAddress) {
                throw new Error('Invalid token');
            }

            let args: (string | bigint[])[] = [];

            if (selectedClaimMethod === 'withdrawOrderAmounts' || selectedClaimMethod === 'withdrawRefundAmounts') {
                const boxList = (selectedBoxes ?? []).map((boxId) => BigInt(boxId));
                args = [tokenAddress, boxList];
            } else {
                args = [tokenAddress];
            }
            console.log('args:', args);

            const hash = await writeCustormV2({
                contract: allConfigs.FundManager,
                functionName: selectedClaimMethod,
                args: args
            });
            return hash;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return {
        withdraw,
        error,
        isPending,
        isSuccessed
    }
}