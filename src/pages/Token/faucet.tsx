import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Alert, Row, Col,} from 'antd';
import { useAllContractConfigs } from '@dapp/config/contractsConfig';
import { OFFICIAL_TOKEN_CONFIG } from '@dapp/config/contractsConfig';
import { useAccount } from 'wagmi';
import { useWriteContract } from 'wagmi';
import { formatUnits , zeroAddress} from 'viem';
import { timeToDate } from '@dapp/utils/time';
import { useERC20 } from '@dapp/hooks/readContracts/useERC20';
import TextP from '@/components/base/text_p';

const { Title, Text } = Typography;

const Faucet: React.FC = () => {
    const { writeContract, status, isPending } = useWriteContract();
    const { balanceOf, mintDate } = useERC20();
    const { address } = useAccount();
    const allContracts = useAllContractConfigs();
    
    const [balance, setBalance] = useState<bigint>(BigInt(0));
    const [mint_data, setMint_data] = useState<number>(0);
    const [mint_viable, setMint_viable] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    
    const tokenContract = allContracts.OfficialToken;
    
    useEffect(() => {
        const fetchBalance = async () => {
            if (!address || address === zeroAddress) return;
            const balance = await balanceOf(tokenContract.address, address);
            setBalance(balance);
            const mint_data = await mintDate(tokenContract.address, address);
            setMint_data(mint_data);
            // Calculate if it can be minted
            const mint_viable = mint_data + 72*60*60 < Date.now()/1000;
            setMint_viable(mint_viable);
        }

        fetchBalance();
    }, [address, tokenContract.address]);

    useEffect(() => {
        if (status === 'success' || status === 'error') {
            setIsMinting(false);
            // After success, refresh balance and mintDate
            if (status === 'success' && address) {
                const refreshData = async () => {
                    const balance = await balanceOf(tokenContract.address, address);
                    setBalance(balance);
                    const mint_data = await mintDate(tokenContract.address, address);
                    setMint_data(mint_data);
                };
                refreshData();
            }
        }
    }, [status, address, tokenContract.address]);

    const handleMint = () => {
        if (!address) return;
        setIsMinting(true);
        writeContract({
            ...tokenContract,
            functionName: 'mint',
            args: [address],
        });
    };

    const isLoading = isPending || isMinting;
    const formattedBalance = balance ? formatUnits(balance, OFFICIAL_TOKEN_CONFIG.decimals) : '0';

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <Card>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Title */}
                    <div>
                        <Title level={2}>Test Token Faucet</Title>
                        <Space direction="vertical" size="small">
                            <Text strong>
                                {OFFICIAL_TOKEN_CONFIG.name} ({OFFICIAL_TOKEN_CONFIG.symbol})
                            </Text>
                            <Text type="secondary" copyable>
                                {tokenContract.address}
                            </Text>
                        </Space>
                    </div>

                    {/* Mint area */}
                    <Card size="small" title="Mint Tokens">
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Row justify="space-between" align="middle">
                                <Col>
                                    <Text strong>Your Balance: </Text>
                                    <Text>{formattedBalance} {OFFICIAL_TOKEN_CONFIG.symbol}</Text>
                                </Col>
                                <Col>
                                    <Button
                                        type="primary"
                                        onClick={handleMint}
                                        loading={isLoading}
                                        disabled={
                                            !address || 
                                            isLoading ||
                                            !mint_viable
                                        }
                                    >
                                        Mint
                                    </Button>
                                </Col>
                            </Row>
                            <Alert
                                type="info"
                                message={
                                    <Space direction="vertical" size="small">
                                        <Text>You can mint 1,000 tokens each time.</Text>
                                        <Text>
                                            You last minted on: {timeToDate(mint_data || 0)}
                                        </Text>
                                        <Text>
                                            You can mint again on: {timeToDate(mint_data + 72*60*60 || 0)}
                                        </Text>
                                    </Space>
                                }
                                showIcon
                            />
                        </Space>
                    </Card>
                </Space>
            </Card>

            <Card style={{ marginTop: '24px' }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Title level={3}>Oasis Official Faucet:</Title>
                    <TextP type="info">
                        <a href="https://faucet.testnet.oasis.io/?" target="_blank" rel="noopener noreferrer">https://faucet.testnet.oasis.io/?</a>
                    </TextP>
                    <TextP >
                        The symbol of the token is “TEST”, which can be used for payment of transaction fees in oasis sapphire (testnet), and can also be wrapped into WROSE.S tokens.
                    </TextP>
                </Space>
            </Card>
        </div>
    );
}

export default Faucet;
