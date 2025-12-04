import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Space, Typography, Select, Alert } from 'antd';
import { formatBalance } from '@dapp/utils/formatBalance';
import { TokenPair } from '../types';
import TokenWrapModal from './TokenWrapModal';

const { Text } = Typography;
const { Option } = Select;

export interface TokenWrapFormProps {
    tokenPairs: TokenPair[];
    selectedPairIndex?: number;
    onPairChange?: (index: number) => void;
    isLoading: boolean;
    wrapStatus?: 'idle' | 'error' | 'loading' | 'success';
    approveStatus?: 'idle' | 'error' | 'loading' | 'success';
    wrapLoading?: boolean;
    approveLoading?: boolean;
}

/**
 * Component for Wrap operation form (with allowance check)
 * Wrap 操作表单（包含授权检查）
 */
const TokenWrapForm: React.FC<TokenWrapFormProps> = ({
    tokenPairs,
    selectedPairIndex = 0,
    onPairChange,
    isLoading,
    wrapStatus = 'idle',
    approveStatus = 'idle',
    wrapLoading = false,
    approveLoading = false,
}) => {
    const [wrapAmount, setWrapAmount] = useState<string>('');
    const [modalOpen, setModalOpen] = useState(false);

    const selectedPair = tokenPairs[selectedPairIndex] || tokenPairs[0];

    const handleAmountInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 只允许输入数字和小数点
        const numberRegex = /^\d*\.?\d*$/;
        if (value === '' || numberRegex.test(value)) {
            setWrapAmount(value);
        }
    }, []);

    const handleWrapAll = useCallback(() => {
        if (selectedPair?.erc20 && selectedPair.erc20.balance) {
            setWrapAmount(formatBalance(selectedPair.erc20.balance));
        }
    }, [selectedPair]);

    const handleWrapClick = useCallback(() => {
        if (!wrapAmount || !selectedPair || !selectedPair.secretContractAddress) return;
        setModalOpen(true);
    }, [wrapAmount, selectedPair]);

    // Wrap 成功后关闭弹窗并清空输入
    useEffect(() => {
        if (wrapStatus === 'success' && modalOpen) {
            setTimeout(() => {
                setModalOpen(false);
                setWrapAmount('');
            }, 2000); // 2秒后关闭弹窗
        }
    }, [wrapStatus, modalOpen]);

    if (!selectedPair) {
        return <Alert type="info" message="Please select a token pair" showIcon />;
    }

    return (
        <>
            <Space direction="vertical" size="middle">
                {tokenPairs.length > 1 && (
                    <Select
                        value={selectedPairIndex}
                        onChange={onPairChange}
                        style={{ width: '100%' }}
                        disabled={isLoading}
                    >
                        {tokenPairs.map((pair, index) => (
                            <Option key={index} value={index}>
                                {pair.erc20.symbol} ↔ {pair.secret?.symbol || `${pair.erc20.symbol}.S`}
                            </Option>
                        ))}
                    </Select>
                )}
                <Input
                    placeholder="Amount"
                    value={wrapAmount}
                    onChange={handleAmountInput}
                    addonAfter={selectedPair?.erc20.symbol || ''}
                    disabled={isLoading || !selectedPair}
                />
                <Space.Compact style={{ width: '100%' }}>
                    <Button
                        onClick={handleWrapAll}
                        disabled={!selectedPair?.erc20.balance || isLoading || !selectedPair}
                    >
                        All
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleWrapClick}
                        loading={isLoading}
                        disabled={
                            !wrapAmount ||
                            isLoading ||
                            !selectedPair ||
                            !selectedPair.secretContractAddress
                        }
                        block
                    >
                        Wrap to {selectedPair?.secret?.symbol || 'Secret Token'}
                    </Button>
                </Space.Compact>
                {selectedPair?.erc20 && (
                    <Text type="secondary">
                        Balance: {formatBalance(selectedPair.erc20.balance)} {selectedPair.erc20.symbol}
                    </Text>
                )}
            </Space>
            <TokenWrapModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                tokenPair={selectedPair}
                amount={wrapAmount}
                wrapLoading={wrapLoading}
                approveLoading={approveLoading}
                wrapStatus={wrapStatus}
                approveStatus={approveStatus}
            />
        </>
    );
};

export default TokenWrapForm;

