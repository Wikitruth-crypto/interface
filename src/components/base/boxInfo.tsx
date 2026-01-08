import React, { useMemo } from 'react';
import { Space, Tag, Tooltip } from 'antd';
import { EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons';
import { cn } from '@/lib/utils';
import StatusLabel from '@/components/base/statusLabel';
import TextP from '@/components/base/text_p';
import TextTitle from '@/components/base/text_title';

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
    /** Whether to enable responsive design */
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

    // Responsive configuration
    const getResponsiveConfig = () => {
        if (!responsive) {
            return {
                titleMaxLength: titleMaxLength || 100,
                descriptionMaxLength: descriptionMaxLength || 250,
                titleSize: 'h4' as const,
                descriptionClamp: 'line-clamp-3'
            };
        }

        // Adjust configuration based on screen size
        return {
            titleMaxLength: {
                sm: titleMaxLength || 50,   // Small screen: shorter title
                md: titleMaxLength || 70,   // Medium screen: medium length  
                lg: titleMaxLength || 90    // Large screen: longer length
            },
            descriptionMaxLength: {
                sm: descriptionMaxLength || 100,  // Small screen: shorter description
                md: descriptionMaxLength || 180,  // Medium screen: medium length
                lg: descriptionMaxLength || 220   // Large screen: longer length
            },
            titleSize: {
                sm: 'h5' as const,    // Small screen: smaller title
                md: 'h5' as const,    // Medium screen: smaller title (to avoid too large)
                lg: 'h4' as const     // Large screen: standard title
            },
            descriptionClamp: {
                sm: 'line-clamp-2',   // Small screen: 2 lines
                md: 'line-clamp-3',   // Medium screen: 3 lines
                lg: 'line-clamp-4'    // Large screen: 4 lines
            }
        };
    };

    const config = getResponsiveConfig();

    const truncateText = (text: string, maxLength: number | { sm: number; md: number; lg: number }): string => {
        // Add empty value check
        if (!text || typeof text !== 'string') {
            return '';
        }
        
        if (typeof maxLength === 'number') {
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + '...';
        }
        
        // In responsive mode, use medium length as default value
        const length = maxLength.md;
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    };

    const formatDate = (dateString: string): string => {
        // Add empty value check
        if (!dateString || typeof dateString !== 'string') {
            return '';
        }
        
        try {
            const date = new Date(dateString);
            // Check if the date is valid
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

    // Get title level
    const getTitleLevel = useMemo(() => {
        if (!responsive) return 3;
        return 4;
    }, [responsive]);

    // Handle location information
    const locationText = useMemo(() => {
        return [metadata.country, metadata.state]
            .filter(Boolean)
            .join(', ');
    }, [metadata.country, metadata.state]);

    // Handle title display
    const displayTitle = useMemo(() => {
        return truncateText(title, config.titleMaxLength);
    }, [title, config.titleMaxLength]);

    // Handle description display
    const displayDescription = useMemo(() => {
        return truncateText(description, config.descriptionMaxLength);
    }, [description, config.descriptionMaxLength]);

    // Check if Tooltip needs to be displayed (when text is truncated)
    const showTitleTooltip = title && title.length > (typeof config.titleMaxLength === 'number' 
        ? config.titleMaxLength 
        : config.titleMaxLength?.md || 70);
    
    const showDescriptionTooltip = description && description.length > (typeof config.descriptionMaxLength === 'number' 
        ? config.descriptionMaxLength 
        : config.descriptionMaxLength?.md || 180);

    return (
        <div className={cn("flex-1 min-w-0", className)}>
            <Space direction="vertical" size={responsive ? ['small', 'middle'] : 'middle'} style={{ width: '100%' }}>
                {/* Title and description area */}
                <Space direction="vertical" size={responsive ? 'small' : 'middle'} style={{ width: '100%' }}>
                    {showTitleTooltip ? (
                        <Tooltip title={title} placement="topLeft">
                            <TextTitle 
                            >
                                {displayTitle}
                            </TextTitle>
                        </Tooltip>
                    ) : (
                        <TextTitle 
                        >
                            {displayTitle}
                        </TextTitle>
                    )}

                    {description && (
                        showDescriptionTooltip ? (
                            <Tooltip title={description} placement="topLeft">
                                <TextP size="xs" type="secondary" className="line-clamp-2">
                                    {displayDescription}
                                </TextP>
                            </Tooltip>
                        ) : (
                            <TextP size="xs" type="secondary" className="line-clamp-2">
                                {displayDescription}
                            </TextP>
                        )
                    )}
                </Space>

                {/* Metadata area */}
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

                    {/* Status */}
                    <StatusLabel
                        status={metadata.status}
                        size="sm"
                        responsive={responsive}
                    />

                    {/* Location information */}
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

                    {/* Event date */}
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