'use client'
import React from 'react';
import { useQueryStore } from '@/dapp/event_sapphire/useQueryStore';
import UriPassword from '@/dapp/components/uriPassword';
import {
    RequestRefundButton,
    CompleteButton,
    ViewFileButton,
} from '@BoxDetail/ButtonContainer';
import { useCurrentBox } from '../hooks/useCurrentBox';
// import { useBoxDetailStore } from '../store/boxDetailStore';
import Line from '@/components/base/line';

interface Props {
    tokenId?: string,
}

const Paid: React.FC<Props> = ({ tokenId }) => {
    // const store = useBoxDetailStore(state => state)
    // const tokenId = store.tokenId
    const { box } = useCurrentBox(tokenId)

    if (!box) {
        return <div>loading...</div>
    }

    // 从box中获取公开数据
    const publicData = box.privateKey;

    return (
        <div className="flex flex-col items-start justify-center gap-4">
            
            <Line weight={1} />
            <RequestRefundButton />
            <CompleteButton />
            <ViewFileButton />

            {/* <div className='w-full'>
                <UriPassword
                    fileCid={publicData?.fileCID || ''}
                    password={publicData?.password || ''}
                />
            </div> */}
        </div>
    );
}

export default Paid;
