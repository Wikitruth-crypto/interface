import React from 'react';
import { Radio, Typography, Space, Empty, Alert } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { formatAmount } from '@dapp/utils/formatAmount';

const { Text, Title } = Typography;

export interface FundsData {
    amount: string;
    symbol: string;
    type?: string;
    decimals?: number;
    disabled?: boolean;
}

export interface FundsSectionProps {
    title?: string;
    funds: FundsData[];
    selectedValue: string;
    onSelect?: (tokenSymbol: string) => void;
    onDeselect?: (tokenSymbol: string) => void;
    className?: string;
}

const FundsSection: React.FC<FundsSectionProps> = ({
    title = "Your Funds",
    funds,
    selectedValue,
    onSelect,
    onDeselect,
    className
}) => {
    // 检查每个资金是否有有效金额
    const validFunds = funds.filter(fund => {
        if (fund.disabled) return false;
        if (!fund.amount || fund.amount === '0' || fund.amount === '0n') return false;
        try {
            const amountValue = typeof fund.amount === 'string' && fund.amount.includes('n')
                ? BigInt(fund.amount.replace('n', ''))
                : BigInt(fund.amount);
            return amountValue > BigInt(0);
        } catch {
            return false;
        }
    });

    // 检查是否有可用资金
    const hasAnyFunds = validFunds.length > 0;

    // 处理代币选择逻辑
    const handleChange = (e: any) => {
        const tokenSymbol = e.target.value;
        if (selectedValue === tokenSymbol) {
            // 取消选择
            onDeselect?.(tokenSymbol);
        } else {
            // 选择新的token
            onSelect?.(tokenSymbol);
        }
    };

    // 检查是否所有资金都被禁用
    const allDisabled = funds.length > 0 && validFunds.length === 0;

    // 无资金时的空状态显示
    if (allDisabled) {
        return (
            <div className={className}>
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <Space direction="vertical" size="small" align="center">
                            <Text type="secondary">💰</Text>
                            <Text type="secondary">No funds available</Text>
                        </Space>
                    }
                    style={{ padding: '16px 0' }}
                />
            </div>
        );
    }

    return (
        <div className={className}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {/* 标题区域 */}
                <Title level={5} style={{ margin: 0 }}>
                    {title}
                </Title>

                {/* 代币选择区域 */}
                {validFunds.length > 0 && (
                    <Radio.Group
                        value={selectedValue || undefined}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                    >
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            {validFunds.map((fund, index) => (
                                <Radio.Button
                                    key={`${fund.symbol}-${index}`}
                                    value={fund.symbol}
                                    disabled={fund.disabled}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        padding: '12px 16px',
                                        textAlign: 'left',
                                    }}
                                >
                                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                        <Text strong style={{ fontSize: 16, fontFamily: 'monospace' }}>
                                            {formatAmount(fund.amount, fund.decimals ?? 18)}
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {fund.symbol}
                                        </Text>
                                        {fund.type && (
                                            <Text type="secondary" style={{ fontSize: 11 }}>
                                                {fund.type}
                                            </Text>
                                        )}
                                    </Space>
                                </Radio.Button>
                            ))}
                        </Space>
                    </Radio.Group>
                )}

                {/* 选择状态提示 */}
                {selectedValue && hasAnyFunds && (
                    <Alert
                        message={
                            <Space>
                                <CheckCircleOutlined />
                                <Text strong>Selected: {selectedValue}</Text>
                            </Space>
                        }
                        description="Click to deselect or choose another token"
                        type="info"
                        showIcon
                        style={{ fontSize: 12 }}
                    />
                )}
            </Space>
        </div>
    );
};

export default FundsSection; 