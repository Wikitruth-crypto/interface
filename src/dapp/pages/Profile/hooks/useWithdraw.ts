"use client"
import { FundType } from "../types/cardProfile.types";
import { useWriteCustorm } from "@/dapp/hooks/useWritCustorm";
import { useAllContractConfigs } from "@/dapp/contractsConfig";
import { useWithdrawStore } from "../store/withdrawStore";
import { useSupportedTokens } from "@/dapp/contractsConfig";

export const useWithdraw = () => {
    const supportedTokens = useSupportedTokens();
    const allConfigs = useAllContractConfigs();
    const { write, error, isPending, isSuccessed } = useWriteCustorm();

    const withdraw = async () => {
        const withdrawData = useWithdrawStore.getState().withdrawData;
        const { selectedBoxes, selectedTokenSymbol, selectedType, selectedClaimMethod } = withdrawData;

        try {
            if (!selectedBoxes || !selectedTokenSymbol || !selectedType || !selectedClaimMethod) {
                throw new Error('Invalid withdraw data');
            }

            const token = supportedTokens.find(item => item.symbol === selectedTokenSymbol);
            if (!token) {
                throw new Error('Invalid token');
            }
            const tokenAddress = token.address;

            let args = [selectedBoxes, tokenAddress];

            if (selectedClaimMethod === 'withdrawOrderAmounts') {
                args = [selectedBoxes, tokenAddress, selectedType as FundType];
            }
            console.log('args:', args);

            const hash = await write({
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