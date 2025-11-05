"use client";

import React, { useEffect } from 'react';
import { useAccount } from 'wagmi';

import { useReadContract } from '@dapp/hooks/readContracts/useReadContract';
import { 
    ContractName,
    useAllContractConfigs,
    useSupportedTokens,
 } from '@dapp/contractsConfig';
import { useReadAllowance } from '@/dapp/hooks/readContracts/token/useReadAllowance';

const HooksTest = () => {

    const { address } = useAccount();

    const { readContract } = useReadContract();
    const { readAllowance } = useReadAllowance();

    const supportedTokens = useSupportedTokens();
    const allConfigs = useAllContractConfigs();

    useEffect(() => {
        // 使用readContract
        const fetchData = async () => {
            if (!address) return;
            // const basicData = await readContract({
            // contractName: ContractName.TRUTH_BOX,
            //     functionName: 'getBasicData',
            //     args: [1],
            // });
            // console.log('test!!! basicData：【1】', basicData);

            // secret token, 方便测试eip712签名
            const result = await readAllowance(
                allConfigs.OfficialTokenSecret.address,
                address,
                allConfigs.FundManager.address,
                1000,
            )
            console.log('test!!! readAllowance result：', result);
        };
        fetchData();
    }, [address]);

    
    return (
        <div>
            <h1>HooksTest</h1>
        </div>
    );
};

export default HooksTest;

