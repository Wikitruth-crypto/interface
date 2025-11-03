'use client'
import React from 'react';
import {
    PublishButton,
    PayConfiFeeButton,
    ViewFileButton
} from '@BoxDetail/ButtonContainer';
import { useCurrentBox } from '../hooks/useCurrentBox';
import { useBoxDetailStore } from '@/dapp/pages/BoxDetail/store/boxDetailStore';
// import { useQueryStore } from '@/dapp/event_sapphire/useQueryStore';
// import { selectBox, } from '@/dapp/event_sapphire/selectors';
// import AlertBox from '@dapp/components/base/alertBox'; // 已弃用
import { Alert } from 'antd'; // 直接使用antd的Alert组件

interface Props {
    tokenId?: string,
}

const InSecrecy: React.FC<Props> = ({ tokenId }) => {
    const store = useBoxDetailStore(state => state)
    const { roles } = store.userState
    // const tokenId = store.tokenId
    const { box } = useCurrentBox(tokenId)


    if (!box) {
        return <div>loading...</div>
    }

    return (
        <div className="flex flex-col items-start justify-center gap-4">
            {(roles.includes('Buyer')) && 
                <div className="mb-4">
                    <Alert
                        type="info"
                        message="Info"
                        description="Each time the confidentiality period is extended, an additional confidentiality fee must be paid."
                    />
                </div>
            }

            <PayConfiFeeButton />
            <PublishButton />
            <ViewFileButton />
        </div>
    );
}

export default InSecrecy;
