import React from 'react';
import { Typography } from 'antd';
import { cn } from '@/lib/utils';
import StatusLabel from '@/dapp/components/base/statusLabel';
import { BoxStatus } from '@/dapp/types/contracts/truthBox';

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
    /** 响应式尺寸变体 */
    size?: 'sm' | 'md' | 'lg';
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
    size = 'md'
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

    return (
        <div className={cn("flex-1 min-w-0 space-y-3", className)}>
            {/* 标题和描述区域 */}
            <div className={cn(
                "space-y-2",
                responsive && "space-y-1 sm:space-y-1.5 md:space-y-2" // 响应式间距
            )}>
                {responsive ? (
                    // 响应式模式：直接使用自定义 className
                    <Typography.Title level={4} className="text-gray-200 font-semibold text-left">{truncateText(title, config.titleMaxLength)}</Typography.Title>
                ) : (
                    // 非响应式模式：使用固定尺寸
                    <Typography.Title level={3} className="text-gray-200 font-semibold text-left">{truncateText(title, config.titleMaxLength)}</Typography.Title>
                )}

                <p
                    className={cn(
                        "text-gray-300 leading-relaxed break-words",
                        responsive ? [
                            // 响应式字体大小
                            "text-xs sm:text-sm md:text-sm lg:text-base",
                            // 响应式行数限制
                            "line-clamp-2 sm:line-clamp-3 md:line-clamp-3 lg:line-clamp-4"
                        ] : [
                            "text-sm line-clamp-3"
                        ]
                    )}
                    title={description}
                >
                    {truncateText(description, config.descriptionMaxLength)}
                </p>
            </div>

            {/* 元数据区域 */}
            <div className={cn(
                "flex flex-wrap items-center justify-start gap-3",
                responsive && "gap-2 sm:gap-2.5 md:gap-3", // 响应式间距
                responsive ? "text-xs sm:text-sm" : "text-sm" // 响应式字体大小
            )}>
                {/* Token ID */}
                <div className="flex items-center gap-1">
                    <span className={cn(
                        "font-semibold font-mono text-gray-400",
                        responsive ? "text-sm sm:text-base md:text-base" : "text-base"
                    )}>
                        #{metadata.tokenId}
                    </span>
                </div>

                {/* 状态 */}
                <StatusLabel
                    status={metadata.status as BoxStatus}
                    size="sm"
                    responsive={responsive}
                />

                {/* 位置信息 */}
                {(metadata.country || metadata.state) && (
                    <div className="flex items-center gap-1 text-gray-400">
                        <svg className={cn(
                            responsive ? "w-3 h-3 sm:w-3.5 sm:h-3.5" : "w-3 h-3"
                        )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className={cn(
                            responsive && "truncate max-w-[100px] sm:max-w-[120px] md:max-w-[140px] lg:max-w-[180px]"
                        )}>
                            {[metadata.country, metadata.state]
                                .filter(Boolean)
                                .join(', ')
                            }
                        </span>
                    </div>
                )}

                {/* 事件日期 */}
                {metadata.eventDate && (
                    <div className="flex items-center gap-1 text-gray-400">
                        <svg className={cn(
                            responsive ? "w-3 h-3 sm:w-3.5 sm:h-3.5" : "w-3 h-3"
                        )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                        </svg>
                        <span className="whitespace-nowrap">{formatDate(metadata.eventDate)}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BoxInfo; 