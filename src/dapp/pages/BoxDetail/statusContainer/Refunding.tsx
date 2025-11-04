'use client'
import React from 'react';
// import UriPassword from '@/dapp/components/uriPassword';
import {
    CancelButton,
    RefuseButton,
    ViewFileButton,
    AgreementButton
} from '@BoxDetail/ButtonContainer';
// import { useBoxDetailStore } from '../store/boxDetailStore';
import Line from '@/components/base/line';
import { useBoxContext } from '../contexts/BoxContext';

interface Props {
    tokenId?: string,
}

const Refunding: React.FC<Props> = ({ }) => {
    const { box } = useBoxContext()

    if (!box) {
        return <div>loading...</div>
    }

    // 从box中获取公开数据
    const publicData = box.privateKey;

    return (
        <div className="flex flex-col items-start justify-center gap-4">
            <AgreementButton />
            <RefuseButton />
            <CancelButton />
            <ViewFileButton />
        </div>
    );
}

export default Refunding;
