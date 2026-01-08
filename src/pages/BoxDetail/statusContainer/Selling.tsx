'use client'
import React from 'react';
import { BuyButton, ViewFileButton, PublishButton } from '@BoxDetail/ButtonContainer';
import { useBoxDetailStore } from '../store/boxDetailStore';
import { Alert } from 'antd'; 
import { useBoxDetailContext } from '../contexts/BoxDetailContext';

interface Props {
    tokenId?: string, // Reserved for future use
}

const Selling: React.FC<Props> = ({ }) => {
    const store = useBoxDetailStore(state => state)
    const { box } = useBoxDetailContext()

    if (!box) {
        return <div>loading...</div>
    }

    return (
        <div className="flex flex-col items-start justify-center gap-4">
            {
                (!box.buyerId && Number(box.deadline) < Math.floor(Date.now() / 1000)) &&
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
