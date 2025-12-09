"use client"

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import StatusStepFlow from './base/statusStepFlow';
import { BoxStatus,} from '@/dapp/types/contracts/truthBox';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// 组件接口
interface StatusStepProps {
    /** 当前激活的状态 */
    status: BoxStatus;
    /** 列表模式 */
    listedMode?: string;
    /** 自定义样式类名 */
    className?: string;
    /** 标签尺寸 */
    size?: 'sm' | 'md' | 'lg';
    /** 是否启用响应式 */
    responsive?: boolean;
    /** 是否显示背景 */
    showBackground?: boolean;
    /** 是否显示指示箭头 */
    showIndicator?: boolean;
    // 是否水平滚动
    enableHorizontalScroll?: boolean;
}

const StatusStep: React.FC<StatusStepProps> = ({ 
    status,
    listedMode,
    className,
    size = 'md',
    responsive = true,
    showBackground = true,
    showIndicator = true,
    enableHorizontalScroll = false
}) => {

    // 根据是否启用滚动返回不同的内层容器样式
    const getInnerContainerStyle = () => {
        if (enableHorizontalScroll) {
            return {
                overflowX: 'auto' as const,
                overflowY: 'hidden' as const,
                width: '100%'
            };
        }
        return {
            width: '100%',
            overflow: 'hidden' as const
        };
    };

    // 如果listedMode != 'Auctioning', 则等于'Selling'
    const getListedMode = () => {
        if (listedMode !== 'Auctioning') {
            return 'Selling';
        }
        return listedMode;
    };

    // 根据是否启用滚动决定内容容器样式
    const getContentStyle = () => {
        if (enableHorizontalScroll) {
            // 启用滚动时，使用flex居中，确保在大屏幕上居中显示
            return {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minWidth: 'fit-content',
                width: 'max-content'
            };
        }
        return {
            width: '100%',
            height: '100%'
        };
    };

    // const statusOptions: BoxStatus[] = [
    //     'Storing', 'Selling', 'Auctioning',
    //     'Paid', 'Refunding', 'InSecrecy', 'Published'
    // ];

    // 根据传入的status值，自动水平滚动至对应的位置（x轴）
    const scrollToStatus = (status: BoxStatus) => {
        // const statusIndex = statusOptions.indexOf(status);
        const statusElement = document.querySelector(`#status-step-flow-${status}`);
        if (statusElement) {
            statusElement.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
    };

    // 组件挂载时，自动滚动到对应状态
    useEffect(() => {
        if (enableHorizontalScroll) {
            scrollToStatus(status);
        }
    }, [enableHorizontalScroll, status]);


    return (
        <div 
            className={cn(
                "bg-background relative",
                className
            )}
            style={{ width: '100%', position: 'relative' }}
        >
            {/* 箭头指示器 - 固定在外层容器 */}
            {enableHorizontalScroll && showIndicator && (
                <>
                    {/* 左侧箭头指示器 */}
                    <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-background via-background/80 to-transparent z-10 flex items-center justify-start pl-1 pointer-events-none">
                        <ArrowLeft className="w-4 h-4 text-muted-foreground/60 animate-pulse" />
                    </div>
                    
                    {/* 右侧箭头指示器 */}
                    <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-background via-background/80 to-transparent z-10 flex items-center justify-end pr-1 pointer-events-none">
                        <ArrowRight className="w-4 h-4 text-muted-foreground/60 animate-pulse" />
                    </div>
                </>
            )}
            
            {/* 内层滚动容器 */}
            <div 
                className={cn(
                    enableHorizontalScroll && "status-step-flow-container" // 应用滚动条样式
                )}
                style={getInnerContainerStyle()}
            >
                <div style={getContentStyle()}>
                    <StatusStepFlow
                        status={status}
                        listedMode={getListedMode()}
                        size={size}
                        responsive={responsive}
                        showBackground={showBackground}
                        fixedSize={enableHorizontalScroll} // 启用滚动时使用固定尺寸
                    />
                </div>
            </div>
        </div>
    );
};

export default StatusStep;
