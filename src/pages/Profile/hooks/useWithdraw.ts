// import { useState } from "react";
import { useWriteCustormV3 } from "@/hooks/useWriteCustormV3";
import { useAllContractConfigs } from "@dapp/config/contractsConfig";
import { useWithdrawStore } from "../store/withdrawStore";
import { useSupportedTokens } from "@dapp/config/contractsConfig";

export const useWithdraw = () => {
    const supportedTokens = useSupportedTokens();
    const allConfigs = useAllContractConfigs();
    const { writeCustormV3, error, isLoading, isSuccessed,} = useWriteCustormV3();


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

            const boxList = (selectedBoxes ?? []).map((boxId) => BigInt(boxId));
            args = [tokenAddress, boxList];

            const hash = await writeCustormV3({
                contract: allConfigs.FundManager,
                functionName: selectedClaimMethod,
                tokenAddress: tokenAddress,
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
        isLoading,
        isSuccessed
    }
}