"use client"

import React, { useState, useMemo } from 'react';
import { Card, Typography, Button, Space, Divider, Input } from 'antd';
import { CopyOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { ipfsCidToUrl } from '@/config/ipfsUrl/ipfsCidToUrl';

const { Text } = Typography;

export interface UriPasswordProps {
    fileCidList?: string[];
    slicesMetadataCID?: string;
    password?: string;
    className?: string;
    showPassword?: boolean;
    hidePasswordByDefault?: boolean;
}

/**
 * URI 和密码显示组件
 * 
 * 功能：
 * - 显示文件 CID 列表和对应的 URL
 * - 显示切片元数据 CID
 * - 显示密码（支持显示/隐藏切换）
 * - 所有字段都支持一键复制
 * - 使用 Ant Design 组件构建
 */
const UriPassword: React.FC<UriPasswordProps> = ({
    fileCidList = [],
    slicesMetadataCID = '',
    password = '',
    className,
    showPassword = true,
    hidePasswordByDefault = true,
}) => {
    const [showPasswordText, setShowPasswordText] = useState(!hidePasswordByDefault);

    // 生成文件 URI 列表
    const fileUriList = useMemo(() => {
        return fileCidList.map(cid => {
            try {
                return ipfsCidToUrl(cid);
            } catch (error) {
                console.error('Failed to convert CID to URL:', error);
                return '';
            }
        });
    }, [fileCidList]);

    // 生成切片元数据 URI
    const slicesMetadataUri = useMemo(() => {
        if (!slicesMetadataCID) return '';
        try {
            return ipfsCidToUrl(slicesMetadataCID);
        } catch (error) {
            console.error('Failed to convert slices metadata CID to URL:', error);
            return '';
        }
    }, [slicesMetadataCID]);

    /**
     * 复制文本到剪贴板
     */
    const handleCopy = async (text: string, label: string) => {
        if (!text) {
            message.warning(`${label} is empty`);
            return;
        }
        try {
            await navigator.clipboard.writeText(text);
            message.success(`${label} copied!`);
        } catch (error) {
            console.error('Failed to copy:', error);
            message.error('Failed to copy');
        }
    };

    /**
     * 格式化密码显示（隐藏状态）
     */
    const formatPasswordDisplay = (pwd: string): string => {
        if (!showPasswordText && pwd) {
            return '•'.repeat(Math.min(pwd.length, 12));
        }
        return pwd;
    };

    return (
        <div className={className}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {/* 文件 CID 列表 */}
                {fileCidList.length > 0 && (
                    <>
                        {fileCidList.map((cid, index) => (
                            <Card key={index} size="small" style={{ width: '100%' }}>
                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                                        <Text strong style={{ fontFamily: 'monospace', fontSize: 13 }}>
                                            File {fileCidList.length > 1 ? `${index + 1} ` : ''}CID:
                                        </Text>
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<CopyOutlined />}
                                            onClick={() => handleCopy(cid, `File ${index + 1} CID`)}
                                            disabled={!cid}
                                        >
                                            Copy
                                        </Button>
                                    </div>
                                    <Input.TextArea
                                        value={cid}
                                        readOnly
                                        autoSize={{ minRows: 1, maxRows: 3 }}
                                        style={{
                                            fontFamily: 'monospace',
                                            fontSize: 12,
                                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                        }}
                                    />

                                    {fileUriList[index] && (
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 8 }}>
                                                <Text strong style={{ fontFamily: 'monospace', fontSize: 13 }}>
                                                    File {fileCidList.length > 1 ? `${index + 1} ` : ''}URL:
                                                </Text>
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={<CopyOutlined />}
                                                    onClick={() => handleCopy(fileUriList[index], `File ${index + 1} URL`)}
                                                >
                                                    Copy
                                                </Button>
                                            </div>
                                            <Input.TextArea
                                                value={fileUriList[index]}
                                                readOnly
                                                autoSize={{ minRows: 1, maxRows: 3 }}
                                                style={{
                                                    fontFamily: 'monospace',
                                                    fontSize: 12,
                                                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                                    wordBreak: 'break-all',
                                                }}
                                            />
                                        </>
                                    )}
                                </Space>
                            </Card>
                        ))}
                    </>
                )}

                {/* 切片元数据 CID */}
                {slicesMetadataCID && (
                    <>
                        {fileCidList.length > 0 && <Divider style={{ margin: '12px 0' }} />}
                        <Card size="small" style={{ width: '100%' }}>
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                                    <Text strong style={{ fontFamily: 'monospace', fontSize: 13 }}>
                                        Slices Metadata CID:
                                    </Text>
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<CopyOutlined />}
                                        onClick={() => handleCopy(slicesMetadataCID, 'Slices Metadata CID')}
                                    >
                                        Copy
                                    </Button>
                                </div>
                                <Input.TextArea
                                    value={slicesMetadataCID}
                                    readOnly
                                    autoSize={{ minRows: 1, maxRows: 3 }}
                                    style={{
                                        fontFamily: 'monospace',
                                        fontSize: 12,
                                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                    }}
                                />

                                {slicesMetadataUri && (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 8 }}>
                                            <Text strong style={{ fontFamily: 'monospace', fontSize: 13 }}>
                                                Slices Metadata URL:
                                            </Text>
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={<CopyOutlined />}
                                                onClick={() => handleCopy(slicesMetadataUri, 'Slices Metadata URL')}
                                            >
                                                Copy
                                            </Button>
                                        </div>
                                        <Input.TextArea
                                            value={slicesMetadataUri}
                                            readOnly
                                            autoSize={{ minRows: 1, maxRows: 3 }}
                                            style={{
                                                fontFamily: 'monospace',
                                                fontSize: 12,
                                                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                                wordBreak: 'break-all',
                                            }}
                                        />
                                    </>
                                )}
                            </Space>
                        </Card>
                    </>
                )}

                {/* 密码 */}
                {showPassword && (
                    <>
                        {(fileCidList.length > 0 || slicesMetadataCID) && <Divider style={{ margin: '12px 0' }} />}
                        <Card size="small" style={{ width: '100%' }}>
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                                    <Text strong style={{ fontFamily: 'monospace', fontSize: 13 }}>
                                        Password:
                                    </Text>
                                    <Space>
                                        {hidePasswordByDefault && (
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={showPasswordText ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                                onClick={() => setShowPasswordText(!showPasswordText)}
                                            >
                                                {showPasswordText ? 'Hide' : 'Show'}
                                            </Button>
                                        )}
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<CopyOutlined />}
                                            onClick={() => handleCopy(password, 'Password')}
                                            disabled={!password}
                                        >
                                            Copy
                                        </Button>
                                    </Space>
                                </div>
                                <Input.TextArea
                                    value={formatPasswordDisplay(password)}
                                    readOnly
                                    autoSize={{ minRows: 1, maxRows: 2 }}
                                    style={{
                                        fontFamily: 'monospace',
                                        fontSize: 12,
                                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                    }}
                                />
                                {!password && (
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Password is empty (not required)
                                    </Text>
                                )}
                            </Space>
                        </Card>
                    </>
                )}
            </Space>
        </div>
    );
};

export default UriPassword;
