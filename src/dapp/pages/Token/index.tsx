import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Input, Space, Typography, Divider, Alert, Row, Col } from 'antd';
import { useSupportedTokens, useAllContractConfigs } from '@/dapp/contractsConfig';
import { OFFICIAL_TOKEN_CONFIG } from '@/dapp/contractsConfig/tokens';
import { Address_0 } from '@/dapp/constants';
import { useAccount } from 'wagmi';
import { useWriteContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { timeToDate } from '@dapp/utils/time';
import { useERC20 } from '@/dapp/hooks/readContracts/useERC20';

const { Title, Text } = Typography;

type ActiveButton = 'mint' | 'burn' | 'transfer' | null;

const Token: React.FC = () => {
    const { writeContract, status, isPending } = useWriteContract();
    const { balanceOf, mintDate } = useERC20();
    const { address } = useAccount();
    const [activeButton, setActiveButton] = useState<ActiveButton>(null);
    const [transferAmount, setTransferAmount] = useState<string>('');
    const [transferAddress, setTransferAddress] = useState<string>('');
    const [burnAmount, setBurnAmount] = useState<string>('');
    const allContracts = useAllContractConfigs();
    const supportedTokens = useSupportedTokens();

    const [balance, setBalance] = useState<number>(0);
    const [mint_data, setMint_data] = useState<number>(0);
    
    const tokenContract = allContracts.OfficialToken;
    useEffect(() => {
        const fetchBalance = async () => {
            if (!address && address !== Address_0) return;
            const balance = await balanceOf(tokenContract.address, address);
            setBalance(balance);
            const mint_data = await mintDate(tokenContract.address, address);
            setMint_data(mint_data);
        }

        fetchBalance();
    }, [address]);

    // 获取代币信息
    const tokenInfo = useMemo(() => {
        return supportedTokens.find(token => token.address.toLowerCase() === tokenContract.address.toLowerCase()) || {
            name: OFFICIAL_TOKEN_CONFIG.name,
            symbol: OFFICIAL_TOKEN_CONFIG.symbol,
            decimals: OFFICIAL_TOKEN_CONFIG.decimals,
            address: tokenContract.address,
        };
    }, [supportedTokens, tokenContract]);

    useEffect(() => {
        if (status === 'success' || status === 'error') {
            setActiveButton(null);
            // 成功后清空输入
            if (status === 'success') {
                setTransferAmount('');
                setTransferAddress('');
                setBurnAmount('');
            }
        }
    }, [status]);

    const handleTransferAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 只允许输入数字和小数点
        const numberRegex = /^\d*\.?\d*$/;
        if (value === '' || numberRegex.test(value)) {
            setTransferAmount(value);
        }
    };

    const handleTransferAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTransferAddress(e.target.value);
    };

    const handleAll = () => {
        if (balance) {
            const formattedBalance = formatUnits(BigInt(balance), tokenInfo.decimals);
            setBurnAmount(formattedBalance);
        }
    };

    const handleBurnAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 只允许输入数字和小数点
        const numberRegex = /^\d*\.?\d*$/;
        if (value === '' || numberRegex.test(value)) {
            setBurnAmount(value);
        }
    };

    const handleMint = () => {
        if (!address) return;
        setActiveButton('mint');
        writeContract({
            ...tokenContract,
            functionName: 'mint',
            args: [address],
        });
    };

    const handleTransfer = () => {
        if (!transferAmount || !transferAddress || !address) return;
        
        try {
            const amount = parseUnits(transferAmount, tokenInfo.decimals);
            setActiveButton('transfer');
            writeContract({
                ...tokenContract,
                functionName: 'transfer',
                args: [transferAddress as `0x${string}`, amount],
            });
        } catch (error) {
            console.error('Transfer error:', error);
        }
    };

    const handleBurn = () => {
        if (!burnAmount) return;
        
        try {
            const amount = parseUnits(burnAmount, tokenInfo.decimals);
            setActiveButton('burn');
            writeContract({
                ...tokenContract,
                functionName: 'burn',
                args: [amount],
            });
        } catch (error) {
            console.error('Burn error:', error);
        }
    };

    const isLoading = isPending || activeButton !== null;
    const formattedBalance = balance ? formatUnits(BigInt(balance), tokenInfo.decimals) : '0';

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <Card>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* 代币信息 */}
                    <div>
                        <Title level={2}>Test Token</Title>
                        <Space direction="vertical" size="small">
                            <Text strong>
                                {tokenInfo.name} ({tokenInfo.symbol})
                            </Text>
                            <Text type="secondary" copyable>
                                {tokenContract.address}
                            </Text>
                        </Space>
                    </div>

                    <Divider />

                    {/* Mint 区域 */}
                    <Card size="small" title="Mint Tokens">
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Row justify="space-between" align="middle">
                                <Col>
                                    <Text strong>Your Balance: </Text>
                                    <Text>{formattedBalance} {tokenInfo.symbol}</Text>
                                </Col>
                                <Col>
                                    <Button
                                        type="primary"
                                        onClick={handleMint}
                                        loading={isLoading && activeButton === 'mint'}
                                        disabled={!address || isLoading}
                                    >
                                        Mint
                                    </Button>
                                </Col>
                            </Row>
                            <Alert
                                type="info"
                                message={
                                    <Space direction="vertical" size="small">
                                        <Text>You can mint 1,000,000 tokens each time.</Text>
                                        <Text>
                                            You last minted on: {timeToDate(mint_data || 0)}
                                        </Text>
                                        <Text>Each minting requires an interval of 72 hours.</Text>
                                    </Space>
                                }
                                showIcon
                            />
                        </Space>
                    </Card>

                    {/* Transfer 区域 */}
                    <Card size="small" title="Transfer Tokens">
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Input
                                placeholder="Amount"
                                value={transferAmount}
                                onChange={handleTransferAmount}
                                addonAfter={tokenInfo.symbol}
                                disabled={isLoading || !address}
                            />
                            <Input
                                placeholder="Recipient Address"
                                value={transferAddress}
                                onChange={handleTransferAddress}
                                disabled={isLoading || !address}
                            />
                            <Button
                                type="primary"
                                onClick={handleTransfer}
                                loading={isLoading && activeButton === 'transfer'}
                                disabled={!address || !transferAmount || !transferAddress || isLoading}
                                block
                            >
                                Transfer
                            </Button>
                        </Space>
                    </Card>

                    {/* Burn 区域 */}
                    <Card size="small" title="Burn Tokens">
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Space.Compact style={{ width: '100%' }}>
                                <Input
                                    placeholder="Amount"
                                    value={burnAmount}
                                    onChange={handleBurnAmount}
                                    addonAfter={tokenInfo.symbol}
                                    disabled={isLoading || !address}
                                    style={{ flex: 1 }}
                                />
                                <Button
                                    onClick={handleAll}
                                    disabled={!address || !balance || isLoading}
                                >
                                    All
                                </Button>
                                <Button
                                    type="primary"
                                    danger
                                    onClick={handleBurn}
                                    loading={isLoading && activeButton === 'burn'}
                                    disabled={!address || !burnAmount || isLoading}
                                >
                                    Burn
                                </Button>
                            </Space.Compact>
                        </Space>
                    </Card>
                </Space>
            </Card>
        </div>
    );
};

export default Token;