'use client';

import React from 'react';
import { RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserRewardsSummary } from '../hooks/useTestUserRewards';
import type { RewardWithdrawMethod } from '../hooks/useUserRewardsSummary';
import { useRewardsWithdraw } from '../hooks/useRewardsWithdraw';
import { useSiweAuth } from '@/dapp/hooks/SiweAuth/useSiweAuth';
import { Button, Card, Empty, Space, Typography, Tag, Statistic, Spin, Alert, message } from 'antd';

const { Title, Text } = Typography;

interface ProfileRewardsPanelProps {
    userId: string | null;
    className?: string;
}

const ProfileRewardsPanel: React.FC<ProfileRewardsPanelProps> = ({ userId, className }) => {
    const { categories, isLoading, isFetching, error, refetch } = useUserRewardsSummary(userId);
    const { withdrawRewards, pendingKey, isLoading: isWithdrawLoading, error: withdrawError } = useRewardsWithdraw(userId);
    const { login } = useSiweAuth();

    const handleWithdraw = async (method: RewardWithdrawMethod, tokenAddress: string) => {
        try {
            await withdrawRewards({ method, tokenAddress });
            message.success('Withdrawal request submitted successfully');
        } catch (err) {
            console.error('withdrawRewards failed', err);
            message.error('Withdrawal failed. Please try again.');
        }
    };

    if (!userId) {
        return (
            <Card className={cn('rounded-2xl', className)}>
                <Empty
                    description="You need to login/bind to view the reward data"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                    <Button type="primary" onClick={() => login()}>
                        Login
                    </Button>
                </Empty>
            </Card>
        );
    }

    return (
        <Card
            className={cn('rounded-2xl', className)}
            styles={{
                body: { padding: '24px' }
            }}
        >
            <Space direction="vertical" size="large" className="w-full">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Title level={4} className="mb-0!">
                        Rewards Dashboard
                    </Title>
                    <Button
                        icon={<RefreshCcw className="h-4 w-4" />}
                        onClick={() => refetch()}
                        loading={isFetching}
                        size="middle"
                    >
                        Refresh
                    </Button>
                </div>

                {/* Error Messages */}
                {error && (
                    <Alert
                        message="Failed to load reward data"
                        description={error.message}
                        type="error"
                        showIcon
                        closable
                    />
                )}

                {withdrawError && (
                    <Alert
                        message="Withdrawal failed"
                        description={withdrawError.message}
                        type="warning"
                        showIcon
                        closable
                    />
                )}

                {/* Content */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Spin size="large" />
                    </div>
                ) : categories.length === 0 ? (
                    <Empty description="No reward records to display" />
                ) : (
                    <Space direction="vertical" size="large" className="w-full">
                        {categories.map((category) => {
                            return (
                                <Card
                                    key={category.withdrawMethod}
                                    title={
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Title level={5} className="mb-1!">
                                                    {category.label}
                                                </Title>
                                                <Text type="secondary" className="text-sm">
                                                    {category.description}
                                                </Text>
                                            </div>
                                            <Tag color="blue">
                                                Total {category.tokens.length} tokens
                                            </Tag>
                                        </div>
                                    }
                                    className="rounded-xl"
                                    styles={{
                                        body: { padding: '20px' }
                                    }}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {category.tokens.map((token) => {
                                            const actionKey = `${category.withdrawMethod}-${token.tokenAddress.toLowerCase()}`;
                                            const canClaim = token.raw.claimable > BigInt(0);
                                            const isButtonBusy = pendingKey === actionKey && isWithdrawLoading;

                                            return (
                                                <Card
                                                    key={`${category.category}-${token.tokenAddress}`}
                                                    size="small"
                                                    className="rounded-lg"
                                                    styles={{
                                                        body: { padding: '16px' }
                                                    }}
                                                >
                                                    <Space direction="vertical" size="middle" className="w-full">

                                                        {/* First Row: Total Rewards & Withdrawn */}
                                                        <div className="flex flex-col sm:flex-row gap-4">
                                                            <div className="flex-1 min-w-0">
                                                                <Tag color="yellow" style={{ fontSize: '14px' }}>{token.tokenSymbol}</Tag>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <Statistic
                                                                    title={<Text type="secondary">Total Rewards</Text>}
                                                                    value={token.formattedEarned}
                                                                    precision={3}
                                                                    valueStyle={{ fontSize: '16px', fontWeight: 500 }}
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <Statistic
                                                                    title={<Text type="secondary">Withdrawn</Text>}
                                                                    value={token.formattedWithdrawn}
                                                                    precision={3}
                                                                    valueStyle={{ fontSize: '16px' }}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Second Row: Claimable & Withdraw Button */}
                                                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                                                            <div className="flex-1 min-w-0">
                                                                <Statistic
                                                                    title={<Text strong>Claimable</Text>}
                                                                    value={token.formattedClaimable}
                                                                    precision={3}
                                                                    valueStyle={{
                                                                        fontSize: '18px',
                                                                        fontWeight: 600,
                                                                        color: canClaim ? '#52c41a' : undefined
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0 sm:max-w-[200px]">
                                                                <Button
                                                                    type="primary"
                                                                    block
                                                                    size="large"
                                                                    disabled={!canClaim || isWithdrawLoading}
                                                                    loading={isButtonBusy}
                                                                    onClick={() => handleWithdraw(category.withdrawMethod, token.tokenAddress)}
                                                                >
                                                                    {isButtonBusy ? 'Withdrawing...' : 'Withdraw'}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </Space>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </Card>
                            );
                        })}
                    </Space>
                )}
            </Space>
        </Card>
    );
};

export default ProfileRewardsPanel;
