'use client'
import React from 'react';
import { Typography } from 'antd';
import { Button } from 'antd';
import { cn } from '@/lib/utils';
import { useWriteCustormV2 } from '@/dapp/hooks/useWritCustormV2';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { MAX_UINT256 } from '@/dapp/constants';
import { useButtonInteractionStore } from '@/dapp/store/buttonInteractionStore';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';

interface Props {
    onClick?: () => void;
    className?: string;
}

const ApproveButton: React.FC<Props> = ({ onClick, className }) => {
    const allConfigs = useAllContractConfigs();
    const { boxId } = useBoxDetailContext();
    const { writeCustormV2, error } = useWriteCustormV2(boxId);
    
    // 使用集中的按钮交互状态
    const { functionWriting} = useButtonInteractionStore();

    const handleApprove = async () => {
        onClick?.();
        await writeCustormV2({
            contract: allConfigs.OfficialToken,
            functionName: 'approve',
            args: [allConfigs.FundManager.address, MAX_UINT256],
        });
    }

    // 计算按钮状态
    const isLoading = functionWriting === 'approve';
    const isDisabled = functionWriting !== null;

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