"use client";

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { 
    Button, 
    Card,
} from 'antd';
import { useReadContract } from '@dapp/hooks/readContracts/useReadContract';
import { useWriteCustormV2 } from '@/dapp/hooks/useWriteCustormV2';
import {
    ContractName,
    useAllContractConfigs,
    useSupportedTokens,
} from '@dapp/contractsConfig';
import { useReadAllowance } from '@/dapp/hooks/readContracts/token/useReadAllowance';
import { RequestEip712 } from '@/dapp/components/secret/requestEip712';
import { RequestSiwe } from '@/dapp/components/secret/requestSiwe';
import { PermitType } from '@/dapp/hooks/EIP712/types_ERC20secret';
import UserIdAlert from '@/dapp/components/userIdAlert';

const HooksTest = () => {

    const { address } = useAccount();
    const [result, setResult] = useState<any>(null);
    const { writeCustormV2 } = useWriteCustormV2();

    const { readContract } = useReadContract();
    const { readAllowance } = useReadAllowance();

    const supportedTokens = useSupportedTokens();
    const allConfigs = useAllContractConfigs();

    // 测试：读取代币授权
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

    // 测试：读取合约数据
    // useEffect(() => {
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

    // 测试：写入合约数据
    const [resultWriteSapphire, setResultWriteSapphire] = useState<any>(null);
    const testWriteSapphire = async () => {
        if (!address) return;
        const result = await writeCustormV2({
            contract: allConfigs.OfficialTokenSecret,
            functionName: 'approve',
            args: [allConfigs.FundManager.address, 6000000],
        });
        setResultWriteSapphire(result);
    }

    return (
        <div className="w-2xl flex flex-col items-center justify-center">
            <UserIdAlert />
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
                <RequestEip712 requirement={
                        { 
                        label: PermitType.VIEW, 
                        spender: allConfigs.FundManager.address ,
                        amount: 0,
                        contractAddress: allConfigs.OfficialTokenSecret.address,
                        }
                    } />
            </Card>
            <Card title="RequestSiwe">
                <RequestSiwe />
            </Card>
            <Card title="TestWriteSapphire">
                <Button onClick={testWriteSapphire}>Test writeSapphire</Button>
                {resultWriteSapphire && (
                    <div className="mt-4 p-4 bg-gray-500 rounded">
                        <h3>写入结果：</h3>
                        <p>交易哈希: {resultWriteSapphire}</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default HooksTest;

