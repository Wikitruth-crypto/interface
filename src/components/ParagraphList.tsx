"use client"

import React from 'react';
import { Typography, Card, Space } from 'antd';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { ipfsCidToUrl } from '@/config/ipfsUrl/ipfsCidToUrl';

const { Text, Paragraph } = Typography;

export interface ParagraphListProps {
    label: string;
    type: 'text' | 'password' | 'cid' | 'url';
    cidList: string[];
    className?: string;
}

/**
 * Simple text list display component
 * 
 * Function:
 * - Display text list, each line, no wrap (using ellipsis)
 * - Each line has a copy button
 * - If it is CID type, automatically convert to IPFS URL when copying
 * - If it is password type, default hide password
 */
const ParagraphList: React.FC<ParagraphListProps> = ({
    label,
    type,
    cidList = [],
    className,
}) => {
    /**
     * Copy text to clipboard
     * If it is CID type, convert to IPFS URL when copying; other types directly copy the original text
     */
    const handleCopy = async (text: string, index: number) => {
        if (!text) {
            message.warning(`${label} ${index + 1} is empty`);
            return;
        }

        let copyText = text;

        // If it is CID type, convert to IPFS URL when copying
        if (type === 'cid') {
            try {
                copyText = ipfsCidToUrl(text);
            } catch (error) {
                console.error('Failed to convert CID to URL:', error);
                // If conversion fails, still copy the original CID
            }
        }

        try {
            await navigator.clipboard.writeText(copyText);
            message.success(`${label} ${index + 1} copied!`);
        } catch (error) {
            console.error('Failed to copy:', error);
            message.error('Failed to copy');
        }
    };

    /**
     * Format display text
     * If it is password type, default hide password
     */
    const formatDisplayText = (text: string): string => {
        if (type === 'password' && text) {
            return '•'.repeat(Math.min(text.length, 12));
        }
        return text;
    };

    if (cidList.length === 0) {
        return null;
    }

    return (
        <div className={className}>
            <Card >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text strong style={{ fontFamily: 'monospace', fontSize: 13 }}>{label}:</Text>
                {cidList.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            width: '100%',
                        }}
                    >
                        <Paragraph
                            copyable={{
                                text: item,
                                icon: [<CopyOutlined key="copy" />, <CheckOutlined key="check" />],
                                tooltips: ['Copy', 'Copied!'],
                            }}
                            ellipsis={{ tooltip: item }}
                            style={{
                                flex: 1,
                                fontFamily: type === 'cid' || type === 'password' ? 'monospace' : undefined,
                                fontSize: 13,
                            }}
                        >
                            {formatDisplayText(item)}
                        </Paragraph>
                        {/* <Button
                            type="text"
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() => handleCopy(item, index)}
                            disabled={!item}
                        /> */}
                    </div>
                ))}
            </Space>
            </Card>
        </div>
    );
};

export default ParagraphList;
