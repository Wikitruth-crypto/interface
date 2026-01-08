'use client'
import React from 'react';
import {
    PublishButton,
    PayConfiFeeButton,
    ViewFileButton
} from '@BoxDetail/ButtonContainer';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import { useBoxDetailStore } from '@BoxDetail/store/boxDetailStore';
import { Alert } from 'antd'; 

interface Props {
    tokenId?: string,
}

const InSecrecy: React.FC<Props> = ({  }) => {
    const store = useBoxDetailStore(state => state)
    const { roles } = store.userState
    const { box } = useBoxDetailContext()


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
