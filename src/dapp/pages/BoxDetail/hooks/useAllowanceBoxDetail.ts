import { useReadAllowance } from '@/dapp/hooks/readContracts/token/useReadAllowance';
import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { useState } from 'react';

export const useAllowance_BoxDetail = () => {
    const [isEnough, setIsEnough] = useState(true);
    
    const { readAllowance } = useReadAllowance();
    const { address } = useWalletContext() || {};
    const allConfigs = useAllContractConfigs();

    const checkAllowance_BoxDetail = async (
        tokenAddress: `0x${string}`, 
        amount: number | string | bigint
    ) => {
        if (!address) return { isEnough: false, allowanceAmount: 0 };

        const owner = address;
        const spender = allConfigs.FundManager.address;

        const result = await readAllowance(tokenAddress, owner, spender, amount);
        setIsEnough(result.isEnough);

        return result;
    };

    return { isEnough, checkAllowance_BoxDetail };
}

