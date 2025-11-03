"use client";

import React from 'react';
import { Typography, Divider } from 'antd';
import { cn } from '@/lib/utils';
import PriceLabel from './base/priceLabel';
import ImageSwiper from './imageSwiper';
import { boxStatus } from '@/dapp/types/contracts/truthBox';
import { getSupportedTokens } from '@/dapp/contractsConfig/tokens';
import { SupportedChainId } from '@/dapp/contractsConfig/types';
import StatusLabel from './base/statusLabel';

// 获取默认支持的代币列表（用于非 DApp 页面的展示）
const DEFAULT_SUPPORTED_TOKENS = getSupportedTokens(SupportedChainId.SAPPHIRE_TESTNET);

interface TruthBoxCardProps {
    /** 卡片数据 */
    data: any;
    /** 点击事件回调 */
    onClick?: () => void;
    /** 自定义样式类名 */
    className?: string;
}

const TruthBoxCard: React.FC<TruthBoxCardProps> = ({
    data,
    onClick,
    className
}) => {
    const supportedTokens = DEFAULT_SUPPORTED_TOKENS;

    // 判断是否显示价格（Storing 和 Published 状态不显示价格）
    const shouldShowPrice = data.status !== boxStatus[0] && data.status !== boxStatus[6];

    return (
        <div
            className={cn(
                // 基础布局
                "flex flex-col items-center w-full bg-card",
                // 响应式最大宽度约束（让高度自适应）
                "md:max-w-[350px]",      // 平板及以上：最大宽度
                // 响应式外边距
                "mt-3 sm:mt-4 md:mt-5",
                "border border-border/50",
                // 圆角和阴影
                "rounded-xl md:rounded-2xl shadow-lg",
                // 悬停效果 - 使用主题色边框
                "hover:outline-2 hover:outline-primary",
                // 可点击样式
                onClick && "cursor-pointer",
                className
            )}
            onClick={onClick}
        >
            {/* 图片轮播区域 - 使用 aspectRatio 控制比例 */}
            <div className={cn(
                "w-full overflow-hidden",
                // "rounded-t-xl md:rounded-t-2xl"
            )}>
                <ImageSwiper
                    images={[data.boxImage, data.nftImage]}
                    altPrefix={`truthbox-${data.tokenId}`}
                    className="w-full"
                />
            </div>

            {/* 内容区域 - 高度自适应 */}
            <div className={cn(
                "w-full bg-card flex flex-col items-center",
                "rounded-b-xl md:rounded-b-2xl",
                // 响应式内边距
                "px-2 sm:px-3 md:px-4",
                // 响应式垂直内边距
                "py-2 sm:py-2.5 md:py-3"
            )}>
                {/* 标题 - 响应式字体大小 */}
                {/* <div className="w-full"> */}
                    <Typography.Paragraph
                        ellipsis={{ rows: 2 }}
                        className={cn(
                            "text-gray-300 font-light",
                            // 响应式字体大小：从小到大
                            "text-xs sm:text-sm md:text-md",
                            // 响应式行高
                            "leading-tight md:leading-normal"
                        )}
                    >
                        {data.title}
                    </Typography.Paragraph>
                {/* </div> */}

                {/* 信息行 - 国家和日期 */}
                <div className={cn(
                    "w-full flex justify-between items-center",
                    // 响应式上下边距
                    "mt-1 mb-1 sm:mt-1.5 sm:mb-1.5 md:mt-2 md:mb-2",
                    "min-h-[20px] sm:min-h-[22px] md:min-h-[24px]"
                )}>
                    {/* <div
                        className={cn(
                            "inline-block whitespace-nowrap overflow-hidden text-ellipsis align-middle",
                            // 响应式最大宽度：根据容器缩放
                            "max-w-[140px] sm:max-w-[160px] md:max-w-[180px]"
                        )}
                        title={`${data.country} ${data.state}`}
                    >
                        {data.country} {data.state}
                    </div>
                    <p className="flex flex-row whitespace-nowrap">
                        {data.eventDate}
                    </p> */}

                    <Typography.Paragraph
                        ellipsis={{ rows: 1 }}
                        className="text-gray-300 text-sm font-light max-w-[140px] sm:max-w-[160px] md:max-w-[180px]"
                    >
                        {data.country} {data.state}
                    </Typography.Paragraph>
                    <Typography.Paragraph ellipsis={{ rows: 1 }} className="text-gray-300 text-sm font-light">{data.eventDate}
                    </Typography.Paragraph>
                </div>

                {/* 分割线 - 响应式宽度 */}
                <Divider style={{ margin: '8px 0' }} />

                {/* 底部信息 - ID、价格、状态 */}
                <div className={cn(
                    "w-full flex justify-between items-center",
                    // 响应式上下边距
                    "mt-1 mb-0 sm:mt-1.5 sm:mb-0 md:mt-2 md:mb-0",
                    "min-h-[24px] sm:min-h-[26px] md:min-h-[28px]"
                )}>
                    {/* Token ID */}
                    <p className="text-white font-medium flex-shrink-0">
                        {data.tokenId}
                    </p>

                    {/* 状态和价格 */}
                    <div className={cn(
                        "flex items-center justify-end min-w-0",
                        // 响应式间距：确保组件间有适当间距
                        "gap-1 sm:gap-1.5 md:gap-2"
                    )}>
                        {/* 价格组件 */}
                        {shouldShowPrice && data.price !== undefined && (
                            <PriceLabel
                                price={data.price}
                                token={data.acceptToken}
                                tokens={supportedTokens}
                                variant="small"
                                responsive={true}
                                className="flex-shrink min-w-0"
                            />
                        )}

                        {/* 状态标签 */}
                        <StatusLabel 
                            status={data.status} 
                            size="sm"
                            responsive={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TruthBoxCard;


