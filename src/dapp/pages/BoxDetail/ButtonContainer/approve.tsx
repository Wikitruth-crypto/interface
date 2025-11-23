'use client'
import React from 'react';
import { Typography } from 'antd';
import { Button } from 'antd';
import { cn } from '@/lib/utils';
import { useWrite_BoxDetail } from '@BoxDetail/hooks/useWriteBoxDetail';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { MAX_UINT256 } from '@/dapp/constants';
import { useButtonInteractionStore } from '@BoxDetail/store/buttonInteractionStore';

interface Props {
    onClick?: () => void;
    className?: string;
}

const ApproveButton: React.FC<Props> = ({ onClick, className }) => {
    const allConfigs = useAllContractConfigs();
    const { write_BoxDetail, error } = useWrite_BoxDetail();
    
    // 使用集中的按钮交互状态
    const { currentActionFunction, isPending } = useButtonInteractionStore();

    const handleApprove = async () => {
        onClick?.();
        await write_BoxDetail({
            contract: allConfigs.OfficialToken,
            functionName: 'approve',
            args: [allConfigs.FundManager.address, MAX_UINT256],
        });
    }

    // 计算按钮状态
    const isLoading = currentActionFunction === 'approve' && isPending;
    const isDisabled = currentActionFunction !== null && currentActionFunction !== 'approve';

    return (
        <div className={cn('w-full', className)}>
            <div className={'flex flex-col md:flex-row w-full items-center gap-2'}>
                <div className={'flex flex-col items-start gap-2'}>
                    <Button
                        color='primary'
                        variant='outlined'
                        onClick={handleApprove}
                        loading={isLoading}
                        disabled={isDisabled}
                    >
                        Approve
                    </Button>
                    {error?.message && <p className={'text-red-400 text-sm mt-2 font-mono'}>{error?.message}</p>}
                </div>

                <Typography.Paragraph className="text-muted-foreground text-sm">Before the transaction, please authorize.</Typography.Paragraph>
            </div>
        </div>
    );
};

export default React.memo(ApproveButton); 