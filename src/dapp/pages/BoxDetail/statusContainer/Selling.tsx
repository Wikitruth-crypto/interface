'use client'
import React from 'react';
import { BuyButton, ViewFileButton, PublishButton } from '@BoxDetail/ButtonContainer';
import { useBoxDetailStore } from '../store/boxDetailStore';
import { Alert } from 'antd'; 
import { useBoxContext } from '../contexts/BoxDetailContext';

interface Props {
    tokenId?: string, // 保留以备后用
}

const Selling: React.FC<Props> = ({ }) => {
    const store = useBoxDetailStore(state => state)
    const deadlineCheckState = store.deadlineCheckState
    const { box } = useBoxContext()

    if (!box) {
        return <div>loading...</div>
    }

    return (
        <div className="flex flex-col items-start justify-center gap-4">
            {
                (!box.buyerId && deadlineCheckState.isOverDeadline) &&
                <div className="mb-4">
                    <Alert
                        type="warning"
                        message="Warning"
                        description="No one bought, the transaction is over, please public this Truth Box"
                    />
                </div>
            }
            <BuyButton />
            <PublishButton />
            <ViewFileButton />
        </div>
    );
}

export default Selling;
