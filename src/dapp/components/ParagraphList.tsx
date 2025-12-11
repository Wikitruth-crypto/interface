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
 * 简单的文本列表展示组件
 * 
 * 功能：
 * - 显示文本列表，每条一行，不换行（使用省略号）
 * - 每条都有复制按钮
 * - 如果是 CID 类型，复制时自动转换为 IPFS URL
 * - 如果是密码类型，默认隐藏密码
 */
const ParagraphList: React.FC<ParagraphListProps> = ({
    label,
    type,
    cidList = [],
    className,
}) => {
    /**
     * 复制文本到剪贴板
     * 如果是 CID 类型，复制时转换为 IPFS URL；其他类型直接复制原文本
     */
    const handleCopy = async (text: string, index: number) => {
        if (!text) {
            message.warning(`${label} ${index + 1} is empty`);
            return;
        }

        let copyText = text;

        // 如果是 CID 类型，复制时转换为 IPFS URL
        if (type === 'cid') {
            try {
                copyText = ipfsCidToUrl(text);
            } catch (error) {
                console.error('Failed to convert CID to URL:', error);
                // 如果转换失败，仍然复制原始 CID
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
     * 格式化显示文本
     * 如果是密码类型，默认隐藏密码
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
