'use client'
import React from 'react';
import UriPassword from '@/dapp/components/uriPassword';
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

    // 从box中获取公开数据
    const publicData = box.privateKey;

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
