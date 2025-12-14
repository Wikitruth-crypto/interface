'use client'
import React from 'react';
// import UriPassword from '@/dapp/components/uriPassword';
import {
    CancelButton,
    RefuseButton,
    ViewFileButton,
    AgreementButton
} from '@BoxDetail/ButtonContainer';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';

interface Props {
    tokenId?: string,
}

const Refunding: React.FC<Props> = ({ }) => {
    const { box } = useBoxDetailContext()

    if (!box) {
        return <div>loading...</div>
    }

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
