import React, { useMemo } from 'react';
import { Typography, Space, Tag, Tooltip } from 'antd';
import { EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons';
import { cn } from '@/lib/utils';
import StatusLabel from '@/dapp/components/base/statusLabel';

export interface BoxMetadata {
    tokenId: string;
    status: string;
    country?: string;
    state?: string;
    eventDate?: string;
}

export interface BoxInfoProps {
    title?: string;
    description?: string;
    metadata: BoxMetadata;
    onClick?: () => void;
    className?: string;
    titleMaxLength?: number;
    descriptionMaxLength?: number;
    /** 是否启用响应式设计 */
    responsive?: boolean;
}

const BoxInfo: React.FC<BoxInfoProps> = ({
    title = '',
    description = '',
    metadata,
    onClick,
    className,
    titleMaxLength,
    descriptionMaxLength,
    responsive = true,
}) => {

    // 响应式配置
    const getResponsiveConfig = () => {
        if (!responsive) {
            return {
                titleMaxLength: titleMaxLength || 100,
                descriptionMaxLength: descriptionMaxLength || 250,
                titleSize: 'h4' as const,
                descriptionClamp: 'line-clamp-3'
            };
        }

        // 根据屏幕尺寸调整配置
        return {
            titleMaxLength: {
                sm: titleMaxLength || 50,   // 小屏：标题更短
                md: titleMaxLength || 70,   // 中屏：中等长度  
                lg: titleMaxLength || 90    // 大屏：较长长度
            },
            descriptionMaxLength: {
                sm: descriptionMaxLength || 100,  // 小屏：描述更短
                md: descriptionMaxLength || 180,  // 中屏：中等长度
                lg: descriptionMaxLength || 220   // 大屏：较长长度
            },
            titleSize: {
                sm: 'h5' as const,    // 小屏：较小标题
                md: 'h5' as const,    // 中屏：较小标题（避免过大）
                lg: 'h4' as const     // 大屏：标准标题
            },
            descriptionClamp: {
                sm: 'line-clamp-2',   // 小屏：2行
                md: 'line-clamp-3',   // 中屏：3行
                lg: 'line-clamp-4'    // 大屏：4行
            }
        };
    };

    const config = getResponsiveConfig();

    const truncateText = (text: string, maxLength: number | { sm: number; md: number; lg: number }): string => {
        // 添加空值检查
        if (!text || typeof text !== 'string') {
            return '';
        }
        
        if (typeof maxLength === 'number') {
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + '...';
        }
        
        // 响应式模式下，使用中等长度作为默认值
        const length = maxLength.md;
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    };

    const formatDate = (dateString: string): string => {
        // 添加空值检查
        if (!dateString || typeof dateString !== 'string') {
            return '';
        }
        
        try {
            const date = new Date(dateString);
            // 检查日期是否有效
            if (isNaN(date.getTime())) {
                return '';
            }
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return '';
        }
    };

    // 获取标题级别
    const getTitleLevel = useMemo(() => {
        if (!responsive) return 3;
        return 4;
    }, [responsive]);

    // 处理位置信息
    const locationText = useMemo(() => {
        return [metadata.country, metadata.state]
            .filter(Boolean)
            .join(', ');
    }, [metadata.country, metadata.state]);

    // 处理标题显示
    const displayTitle = useMemo(() => {
        return truncateText(title, config.titleMaxLength);
    }, [title, config.titleMaxLength]);

    // 处理描述显示
    const displayDescription = useMemo(() => {
        return truncateText(description, config.descriptionMaxLength);
    }, [description, config.descriptionMaxLength]);

    // 检查是否需要显示 Tooltip（文本被截断时）
    const showTitleTooltip = title && title.length > (typeof config.titleMaxLength === 'number' 
        ? config.titleMaxLength 
        : config.titleMaxLength?.md || 70);
    
    const showDescriptionTooltip = description && description.length > (typeof config.descriptionMaxLength === 'number' 
        ? config.descriptionMaxLength 
        : config.descriptionMaxLength?.md || 180);

    return (
        <div className={cn("flex-1 min-w-0", className)}>
            <Space direction="vertical" size={responsive ? ['small', 'middle'] : 'middle'} style={{ width: '100%' }}>
                {/* 标题和描述区域 */}
                <Space direction="vertical" size={responsive ? 'small' : 'middle'} style={{ width: '100%' }}>
                    {showTitleTooltip ? (
                        <Tooltip title={title} placement="topLeft">
                            <Typography.Title 
                                level={getTitleLevel as any}
                                style={{ 
                                    margin: 0,
                                    cursor: 'help',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {displayTitle}
                            </Typography.Title>
                        </Tooltip>
                    ) : (
                        <Typography.Title 
                            level={getTitleLevel as any}
                            style={{ 
                                margin: 0,
                                wordBreak: 'break-word',
                            }}
                        >
                            {displayTitle}
                        </Typography.Title>
                    )}

                    {description && (
                        showDescriptionTooltip ? (
                            <Tooltip title={description} placement="topLeft">
                                <Typography.Paragraph
                                    type="secondary"
                                    style={{
                                        margin: 0,
                                        cursor: 'help',
                                        wordBreak: 'break-word',
                                    }}
                                    ellipsis={{
                                        rows: responsive ? 3 : 3,
                                        expandable: false,
                                        symbol: '',
                                    }}
                                >
                                    {displayDescription}
                                </Typography.Paragraph>
                            </Tooltip>
                        ) : (
                            <Typography.Paragraph
                                type="secondary"
                                style={{
                                    margin: 0,
                                    wordBreak: 'break-word',
                                }}
                                ellipsis={{
                                    rows: responsive ? 3 : 3,
                                    expandable: false,
                                    symbol: '',
                                }}
                            >
                                {displayDescription}
                            </Typography.Paragraph>
                        )
                    )}
                </Space>

                {/* 元数据区域 */}
                <Space 
                    wrap 
                    size={responsive ? ['small', 'middle'] : 'middle'}
                    style={{ 
                        width: '100%',
                    }}
                >
                    {/* Token ID */}
                    <Tag
                        style={{
                            fontFamily: 'monospace',
                            fontSize: responsive ? undefined : 13,
                        }}
                        className={cn(
                            responsive && "text-xs sm:text-sm"
                        )}
                    >
                        ID: {metadata.tokenId}
                    </Tag>

                    {/* 状态 */}
                    <StatusLabel
                        status={metadata.status}
                        size="sm"
                        responsive={responsive}
                    />

                    {/* 位置信息 */}
                    {locationText && (
                        <Tooltip title={locationText}>
                            <Tag
                                icon={<EnvironmentOutlined />}
                                style={{
                                    fontSize: responsive ? undefined : 12,
                                }}
                                className={cn(
                                    responsive && "text-xs sm:text-sm"
                                )}
                            >
                                <span 
                                    style={{
                                        maxWidth: responsive ? undefined : 140,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        display: 'inline-block',
                                    }}
                                    className={cn(
                                        responsive && "max-w-[100px] sm:max-w-[120px] md:max-w-[140px]"
                                    )}
                                >
                                    {locationText}
                                </span>
                            </Tag>
                        </Tooltip>
                    )}

                    {/* 事件日期 */}
                    {metadata.eventDate && formatDate(metadata.eventDate) && (
                        <Tag
                            icon={<CalendarOutlined />}
                            style={{
                                fontSize: responsive ? undefined : 12,
                            }}
                            className={cn(
                                responsive && "text-xs sm:text-sm"
                            )}
                        >
                            {formatDate(metadata.eventDate)}
                        </Tag>
                    )}
                </Space>
            </Space>
        </div>
    );
};

export default BoxInfo; 