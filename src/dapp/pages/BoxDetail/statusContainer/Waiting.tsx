'use client'
import React from 'react';
// import { useQueryStore } from '@/dapp/event_sapphire/useQueryStore';
// import { selectBox, } from '@/dapp/event_sapphire/selectors';
import { ViewFileButton } from '@BoxDetail/ButtonContainer';
import { useBoxDetailStore } from '../store/boxDetailStore';
// import AlertBox from '@dapp/components/base/alertBox'; // 已弃用
import { Alert } from 'antd'; // 直接使用antd的Alert组件
import { useCurrentBox } from '../hooks/useCurrentBox';

interface Props {
    tokenId?: string,
}

const Waiting: React.FC<Props> = ({ tokenId }) => {
    const store = useBoxDetailStore(state => state)
    const deadlineCheckState = store.deadlineCheckState
    // const tokenId = store.tokenId
    const { box } = useCurrentBox(tokenId)

    if (!box) {
        return <div>loading...</div>
    }

    return (
        <div className="flex flex-col items-start justify-center gap-4">
            {
                (!box.buyer && deadlineCheckState.isOverDeadline) &&
                <div className="mb-4">
                    <Alert
                        type="warning"
                        message="Warning"
                        description="No one bought, the transaction is over, please public this Truth Box"
                    />
                </div>
            }
            <ViewFileButton />
        </div>
    );
}

export default Waiting;
