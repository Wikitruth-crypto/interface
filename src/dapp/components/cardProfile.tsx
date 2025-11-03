import React from 'react';
import { cn } from '@/lib/utils';

// 导入基础组件
import BoxImage from './base/boxImage';
import BoxInfo, { BoxMetadata } from './base/boxInfo';
import FundsSection from './fundsSection';
import ClaimButton from './claimButton';

// 类型定义
export interface CardProfileData {
    tokenId: string | number;
    title: string;
    description: string;
    image?: string;
    status: string;
    country?: string;
    state?: string;
    eventDate?: string;
}

export interface TokenInfo {
    amount: string;
    formattedAmount: string;
    symbol: string;
    hasValidAmount: boolean;
}

export interface CardProfileFunds {
    type: string;
    officeToken?: TokenInfo;
    acceptedToken?: TokenInfo;
    hasClaimableFunds: boolean;
}

export interface CardProfileActions {
    onCardClick?: () => void;
    onSelect?: (tokenSymbol: string) => void;
    onDeselect?: (tokenSymbol: string) => void;
    onClaim?: () => void;
}

export interface CardProfileState {
    selectedTokenSymbol: string;
    canClaim: boolean;
    isClaimLoading: boolean;
    selectedCount: number;
    totalAmount: string;
    isClaimSuccess?: boolean;
    claimError?: string;
}

export interface CardProfileProps {
    data: CardProfileData;
    funds: CardProfileFunds;
    state: CardProfileState;
    actions: CardProfileActions;
    className?: string;
}


/**
 * CardProfile - 纯UI组件
 * 
 * 功能：
 * - 展示Box的基础信息（图片、标题、描述、元数据）
 * - 展示资金信息（Office Token、Accepted Token）
 * - 提供Claim操作界面
 * - 支持响应式布局
 * 
 * 设计原则：
 * - 纯UI组件，不包含业务逻辑
 * - 通过props接收所有数据和回调
 * - 专注于展示和用户交互
 */
const CardProfile: React.FC<CardProfileProps> = ({
    data,
    funds,
    state,
    actions,
    className
}) => {
    // 构建 BoxInfo 需要的元数据
    const boxMetadata: BoxMetadata = {
        tokenId: data.tokenId.toString(),
        status: data.status,
        country: data.country,
        state: data.state,
        eventDate: data.eventDate
    };

    return (
        <div className={cn(
            "bg-white/10 rounded-xl overflow-hidden shadow-sm",
            "border border-white/20 transition-all duration-300",
            "hover:shadow-md hover:border-primary hover:border-2",
            "mb-4 p-4 gap-4",
            // 响应式布局
            "flex flex-col md:flex-row lg:flex-row lg:items-stretch",
            className
        )}>
            {/* 左侧：Box 基础信息展示区 */}
            <div 
                className={cn(
                    "flex-1 min-w-0 cursor-pointer",
                    "flex flex-col sm:flex-row gap-4",
                    "p-2 rounded-lg transition-colors duration-200",
                    "hover:bg-gray-100/10"
                )}
                onClick={actions.onCardClick}
            >
                {/* Box 图片 */}
                <div className="flex-shrink-0 self-center sm:self-start">
                    <BoxImage
                        src={data.image || ''}
                        alt={`${data.title} #${data.tokenId}`}
                        status={data.status}
                        className={cn(
                            // 响应式图片尺寸
                            "w-32 sm:w-36 md:w-40 lg:w-44",
                            "h-32 sm:h-36 md:h-40 lg:h-44"
                        )}
                    />
                </div>

                {/* Box 信息 - 启用响应式 */}
                <BoxInfo
                    title={data.title}
                    description={data.description}
                    metadata={boxMetadata}
                    responsive={true}
                    className="flex-1"
                />
            </div>

            {/* 中间：资金展示区域 */}
            <div className={cn(
                "flex-shrink-0",
                "lg:w-56 xl:w-64",
                "border-t md:border-t-0 md:border-l border-gray-600",
                "pt-4 md:pt-0 md:pl-4"
            )}>
                <FundsSection
                    title={funds.type}
                    officeToken={funds.officeToken}
                    acceptedToken={funds.acceptedToken}
                    selectedValue={state.selectedTokenSymbol}
                    disabled={!funds.hasClaimableFunds}
                    onSelect={actions.onSelect}
                    onDeselect={actions.onDeselect}
                />
            </div>

            {/* 右侧：Claim 按钮区域 */}
            <div className={cn(
                "flex-shrink-0 flex items-center justify-center",
                // 响应式宽度
                "w-full md:w-32 lg:w-36 xl:w-40",
                "border-t md:border-t-0 md:border-l border-gray-600",
                "pt-4 md:pt-0 md:pl-4"
            )}>
                <ClaimButton
                    disabled={!state.canClaim}
                    isLoading={state.isClaimLoading}
                    selectedCount={state.selectedCount}
                    totalAmount={state.totalAmount}
                    tokenSymbol={state.selectedTokenSymbol}
                    onClick={actions.onClaim}
                    responsive={true}
                    className="w-full"
                    isSuccess={state.isClaimSuccess}
                    error={state.claimError}
                    showDetails={true}
                />
            </div>
        </div>
    );
};

export default CardProfile;