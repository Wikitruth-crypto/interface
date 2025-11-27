'use client'

import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import UriPassword from '@/dapp/components/uriPassword';
import { timeToDate } from '@dapp/utils/time';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';

interface Props {
    tokenId?: string,
}

const Published: React.FC<Props> = ({ }) => {
    const { box } = useBoxDetailContext()

    const [date, setDate] = useState<string | null>(null);

    useEffect(() => {
        if (box?.deadline) {
            const result = timeToDate(Number(box.deadline))
            setDate(result)
        }
    }, [box?.deadline]);

    if (!box) {
        return <div>loading...</div>
    }

    // 从box中获取公开数据
    const privateKey = box.privateKey;

    return (
        <div className="flex w-full flex-col items-start justify-center gap-4">
            <div className="flex flex-row items-center justify-start gap-2">
                <Typography.Paragraph className="text-muted-foreground text-sm">Public Date:</Typography.Paragraph>
                <Typography.Paragraph className="text-primary text-sm">{date}</Typography.Paragraph>
            </div>
            <Typography.Paragraph className="text-muted-foreground text-sm">
                You can use the link to download the file. If the password is empty,
                <br />
                it means that a password is not required.
            </Typography.Paragraph>
        </div>
    );
}

export default Published;