'use client';

import React from 'react';
import { RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserRewardsSummary } from '../hooks/useUserRewardsSummary';
import type { RewardWithdrawMethod } from '../hooks/useUserRewardsSummary';
import { useRewardsWithdraw } from '../hooks/useRewardsWithdraw';
import { useSiweAuth } from '@dapp/hooks/SiweAuth/useSiweAuth';
import { useAccountStore } from '@dapp/store/accountStore';
import { Button, Card, Empty, Space, Typography, Tag, Statistic, Spin, Alert, message } from 'antd';
import TextP from '@/components/base/text_p';
import TextTitle from '@/components/base/text_title';

const { Text } = Typography;

interface ProfileRewardsPanelProps {
    userId: string | null;
    className?: string;
}

const ProfileRewardsPanel: React.FC<ProfileRewardsPanelProps> = ({ userId, className }) => {
    const { categories, isLoading, isFetching, error, refetch } = useUserRewardsSummary(userId);
    const { withdrawRewards, pendingKey, isLoading: isWithdrawLoading, error: withdrawError, isSuccessed } = useRewardsWithdraw(userId);
    const { login } = useSiweAuth();
    // use global store to check withdraw interaction records
    const hasWithdrawInteraction = useAccountStore(state => state.hasWithdrawInteraction);

    // listen to transaction confirmation success, delay refresh data (wait for backend synchronization)
    React.useEffect(() => {
        if (isSuccessed) {
            // delay a bit, wait for backend data synchronization
            const timer = setTimeout(() => {
                refetch();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isSuccessed, refetch]);

    const handleWithdraw = async (method: RewardWithdrawMethod, tokenAddress: string) => {
        try {
            await withdrawRewards({ method, tokenAddress });
            message.success('Withdrawal transaction submitted, waiting for confirmation...');
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
                    <TextTitle>
                        Rewards Dashboard
                    </TextTitle>
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
                                                <TextTitle className="mb-1!">
                                                    {category.label}
                                                </TextTitle>
                                                <TextP size="sm" type="secondary">
                                                    {category.description}
                                                </TextP>
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
                                            // check if there's a withdraw interaction record in global store
                                            const hasInteraction = hasWithdrawInteraction(category.withdrawMethod, token.tokenAddress);
                                            // hybrid logic: disable if no claimable OR button is busy OR (has interaction AND data not synced yet)
                                            // if claimable is 0 after data refresh, button will be disabled by !canClaim, no need for interaction check
                                            const shouldDisableByInteraction = hasInteraction && canClaim;
                                            const isButtonDisabled = !canClaim || isButtonBusy || shouldDisableByInteraction;

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
                                                                    disabled={isButtonDisabled}
                                                                    loading={isButtonBusy}
                                                                    onClick={() => handleWithdraw(category.withdrawMethod, token.tokenAddress)}
                                                                >
                                                                    {isButtonBusy ? 'Withdrawing...' : shouldDisableByInteraction ? 'Success' : 'Withdraw'}
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
