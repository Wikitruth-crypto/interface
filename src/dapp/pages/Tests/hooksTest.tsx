"use client";

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';
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
import { useReadAllowance } from '@/dapp/hooks/readContracts2/token/useReadAllowance';
import { RequestEip712 } from '@/dapp/components/secret/requestEip712';
import { RequestSiwe } from '@/dapp/components/secret/requestSiwe';
import { PermitType } from '@/dapp/hooks/EIP712/types_ERC20secret';
import UserIdAlert from '@/dapp/components/userIdAlert';
import { useReadBalance } from '@/dapp/hooks/readContracts2/token/useReadBalance';

const HooksTest = () => {

    const { address } = useAccount();
    const [result, setResult] = useState<any>(null);
    const { writeCustormV2 } = useWriteCustormV2();

    const { readContract } = useReadContract();
    const { readAllowance } = useReadAllowance();
    const { readBalance } = useReadBalance();

    const supportedTokens = useSupportedTokens();
    const allConfigs = useAllContractConfigs();

    // 测试：读取代币授�?
    const testRead = async () => {
        if (!address) return;
        // const result = await readAllowance(
        //     allConfigs.OfficialTokenSecret.address,
        //     address,
        //     allConfigs.FundManager.address,
        //     1000,
        // )
        const result = await readBalance(
            allConfigs.OfficialTokenSecret.address,
            address,
        )
        setResult(result);
    }

    // 测试：读取合约数�?
    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (!address) return;
    //         // const basicData = await readContract({
    //         // contractName: ContractName.TRUTH_BOX,
    //         //     functionName: 'getBasicData',
    //         //     args: [1],
    //         // });
    //         // console.log('test!!! basicData：�?�?, basicData);

    //     };
    //     fetchData();
    // }, [address]);

    // 测试：写入合约数�?
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
                    <Button onClick={testRead}>Test readAllowance</Button>
                    {result && (
                        <div className="mt-4 p-4 bg-gray-500 rounded">
                            <h3>查询结果</h3>
                            <p>余额: {formatUnits(result.balance, supportedTokens.find(token => token.address === allConfigs.OfficialTokenSecret.address)?.decimals ?? 18)}</p>
                        </div>
                    )}
                </div>
            </Card>
            <Card title="RequestEip712">
                <RequestEip712 requirement={
                        { 
                        label: PermitType.VIEW, 
                        spender: allConfigs.FundManager.address ,
                        amount: BigInt(0),
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
                        <h3>写入结果</h3>
                        <p>交易哈希: {resultWriteSapphire}</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default HooksTest;


