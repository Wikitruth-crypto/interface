import { useAllowance } from '@/dapp/hooks/ERC20/useAllowance';
import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { useState } from 'react';



export const useAllowance_BoxDetail = () => {
    const [isEnough, setIsEnough] = useState(false);
    
    const { checkAllowance } = useAllowance();
    const { address } = useWalletContext() || {};
    const allConfigs = useAllContractConfigs();

    const checkAllowance_BoxDetail = async (
        tokenAddress: string, 
        amount: number | string | bigint
    ) => {
        if (!address) return;
        const owner = address ;
        const spender = allConfigs.FundManager.address;

        const result = await checkAllowance(tokenAddress, owner, spender, amount);
        setIsEnough(result.isEnough);

        return result;
    }

    return { isEnough, checkAllowance_BoxDetail };
}

