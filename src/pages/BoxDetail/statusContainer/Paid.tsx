'use client'
import React from 'react';
import {
    RequestRefundButton,
    CompleteButton,
    ViewFileButton,
} from '@BoxDetail/ButtonContainer';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import { Divider } from 'antd';

interface Props {
    tokenId?: string,
}

const Paid: React.FC<Props> = ({ }) => {
    const { box } = useBoxDetailContext()

    if (!box) {
        return <div>loading...</div>
    }

    return (
        <div className="flex flex-col items-start justify-center gap-4">
            
            <Divider />
            <RequestRefundButton />
            <CompleteButton />
            <ViewFileButton />
        </div>
    );
}

export default Paid;
