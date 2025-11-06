"use client";

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Button, Card } from 'antd';
import { useReadContract } from '@dapp/hooks/readContracts/useReadContract';
import {
    ContractName,
    useAllContractConfigs,
    useSupportedTokens,
} from '@dapp/contractsConfig';
import { useReadAllowance } from '@/dapp/hooks/readContracts/token/useReadAllowance';
import { RequestEip712 } from '@/dapp/components/secret/requestEip712';
import { RequestSiwe } from '@/dapp/components/secret/requestSiwe';
import { PermitType } from '@/dapp/hooks/EIP712/types_ERC20secret';

const HooksTest = () => {

    const { address } = useAccount();
    const [result, setResult] = useState<any>(null);

    const { readContract } = useReadContract();
    const { readAllowance } = useReadAllowance();

    const supportedTokens = useSupportedTokens();
    const allConfigs = useAllContractConfigs();

    const testReadAllowance = async () => {
        if (!address) return;
        const result = await readAllowance(
            allConfigs.OfficialTokenSecret.address,
            address,
            allConfigs.FundManager.address,
            1000,
        )
        setResult(result);
    }
    // useEffect(() => {
    //     // 使用readContract
    //     const fetchData = async () => {
    //         if (!address) return;
    //         // const basicData = await readContract({
    //         // contractName: ContractName.TRUTH_BOX,
    //         //     functionName: 'getBasicData',
    //         //     args: [1],
    //         // });
    //         // console.log('test!!! basicData：【1】', basicData);

    //     };
    //     fetchData();
    // }, [address]);


    return (
        <div className="w-2xl flex flex-col items-center justify-center">
            <Card title="HooksTest">
                <div className="flex flex-col items-center justify-center">
                    <Button onClick={testReadAllowance}>Test readAllowance</Button>
                    {result && (
                        <div className="mt-4 p-4 bg-gray-500 rounded">
                            <h3>查询结果：</h3>
                            <p>授权额度: {result.allowanceAmount}</p>
                            <p>是否足够: {result.isEnough ? '✅ 是' : '❌ 否'}</p>
                        </div>
                    )}
                </div>
            </Card>
            <Card title="RequestEip712">
                <RequestEip712 requirements={
                    [
                        { 
                        label: PermitType.VIEW, 
                        spender: allConfigs.FundManager.address ,
                        amount: 0,
                        contractAddress: allConfigs.OfficialTokenSecret.address,
                    }]} />
            </Card>
            <Card title="RequestSiwe">
                <RequestSiwe />
            </Card>
        </div>
    );
};

export default HooksTest;

