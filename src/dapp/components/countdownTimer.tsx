"use client"

import { useState, useEffect, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';

// 时间单位接口
interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

// 倒计时状态类型
type CountdownStatus = 'counting' | 'ended';

// 组件属性接口
export interface CountdownTimerProps {
    /** 目标时间戳（秒） */
    targetTime: number;
    /** 组件尺寸 */
    size?: 'sm' | 'md' | 'lg';
    /** 自定义样式类名 */
    className?: string;
    /** 是否显示状态文本 */
    showStatus?: boolean;
    /** 自定义状态文本 */
    customStatusText?: {
        counting?: string;
        ended?: string;
    };
    /** 倒计时结束回调 */
    onCountdownEnd?: () => void;
    /** 布局方向 */
    direction?: 'vertical' | 'horizontal';
    /** 是否响应式 */
    responsive?: boolean;
}

// 时间单位组件
interface TimeUnitProps {
    value: number;
    unit: string;
    size: 'sm' | 'md' | 'lg';
    responsive?: boolean;
}

const TimeUnit: React.FC<TimeUnitProps> = ({ 
    value, 
    unit, 
    size, 
    responsive = true 
}) => {
    // 根据尺寸获取样式配置
    const sizeConfig = useMemo(() => {
        const configs = {
            sm: {
                number: responsive 
                    ? 'text-xl sm:text-2xl lg:text-3xl' 
                    : 'text-2xl',
                unit: responsive 
                    ? 'text-sm sm:text-base' 
                    : 'text-base',
                padding: responsive 
                    ? 'px-2 py-1 sm:px-3 sm:py-2' 
                    : 'px-3 py-2',
                spacing: responsive 
                    ? 'ml-1 mr-1 sm:ml-1 sm:mr-2' 
                    : 'ml-1 mr-2'
            },
            md: {
                number: responsive 
                    ? 'text-2xl sm:text-3xl lg:text-4xl' 
                    : 'text-3xl',
                unit: responsive 
                    ? 'text-base sm:text-lg' 
                    : 'text-lg',
                padding: responsive 
                    ? 'px-3 py-2 sm:px-4 sm:py-3 lg:px-5 lg:py-4' 
                    : 'px-4 py-3',
                spacing: responsive 
                    ? 'ml-1 mr-2 sm:ml-2 sm:mr-3 lg:mr-3' 
                    : 'ml-2 mr-3'
            },
            lg: {

                number: responsive 
                    ? 'text-3xl sm:text-4xl lg:text-5xl' 
                    : 'text-4xl',
                unit: responsive 
                    ? 'text-lg sm:text-xl' 
                    : 'text-xl',
                padding: responsive 
                    ? 'px-4 py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-5' 
                    : 'px-5 py-4',
                spacing: responsive 
                    ? 'ml-2 mr-3 sm:ml-2 sm:mr-4 lg:mr-4' 
                    : 'ml-2 mr-4'
            }
        };
        return configs[size] || configs.md;
    }, [size, responsive]);

    return (
        <div className="flex items-baseline">
            <span 
                className={cn(
                    "font-medium text-foreground bg-secondary rounded-lg transition-all duration-200",
                    sizeConfig.number,
                    sizeConfig.padding
                )}
            >
                {value.toString().padStart(2, '0')}
            </span>
            <span 
                className={cn(
                    "text-muted-foreground font-normal",
                    sizeConfig.unit,
                    sizeConfig.spacing
                )}
            >
                {unit}
            </span>
        </div>
    );
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({
    targetTime,
    size = 'md',
    className,
    showStatus = true,
    customStatusText,
    onCountdownEnd,
    direction = 'vertical',
    responsive = true
}) => {
    // 计算剩余时间的函数
    const calculateTimeLeft = useCallback((): { timeLeft: TimeLeft; status: CountdownStatus } => {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const difference = targetTime - currentTimestamp;
        
        let timeLeft: TimeLeft = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (60 * 60 * 24)),
                hours: Math.floor((difference / (60 * 60)) % 24),
                minutes: Math.floor((difference / 60) % 60),
                seconds: Math.floor(difference % 60),
            };
            return { timeLeft, status: 'counting' };
        } else {
            return { timeLeft, status: 'ended' };
        }
    }, [targetTime]);

    // 状态管理
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => {
        const { timeLeft } = calculateTimeLeft();
        return timeLeft;
    });
    
    const [status, setStatus] = useState<CountdownStatus>(() => {
        const { status } = calculateTimeLeft();
        return status;
    });

    // 状态文本配置
    const statusText = useMemo(() => ({
        counting: customStatusText?.counting || 'Countdown',
        ended: customStatusText?.ended || 'Countdown has ended'
    }), [customStatusText]);

    // 尺寸样式配置
    const containerSizeConfig = useMemo(() => {
        const configs = {
            sm: {
                spacing: responsive 
                    ? 'space-y-2 sm:space-y-3' 
                    : 'space-y-3',
                statusText: responsive 
                    ? 'text-lg sm:text-xl' 
                    : 'text-xl',
                containerPadding: responsive 
                    ? 'p-3 sm:p-4' 
                    : 'p-4'
            },
            md: {
                spacing: responsive 
                    ? 'space-y-3 sm:space-y-4 lg:space-y-5' 
                    : 'space-y-4',
                statusText: responsive 
                    ? 'text-xl sm:text-2xl lg:text-3xl' 
                    : 'text-2xl',
                containerPadding: responsive 
                    ? 'p-4 sm:p-6 lg:p-8' 
                    : 'p-6'
            },
            lg: {
                spacing: responsive 
                    ? 'space-y-4 sm:space-y-6 lg:space-y-8' 
                    : 'space-y-6',
                statusText: responsive 
                    ? 'text-2xl sm:text-3xl lg:text-4xl' 
                    : 'text-3xl',
                containerPadding: responsive 
                    ? 'p-6 sm:p-8 lg:p-10' 
                    : 'p-8'
            }
        };
        return configs[size] || configs.md;
    }, [size, responsive]);

    // 定时器效果
    useEffect(() => {
        const timer = setInterval(() => {
            const { timeLeft: newTimeLeft, status: newStatus } = calculateTimeLeft();
            setTimeLeft(newTimeLeft);
            
            // 状态变化时触发回调
            if (status !== newStatus) {
                setStatus(newStatus);
                if (newStatus === 'ended' && onCountdownEnd) {
                    onCountdownEnd();
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetTime, calculateTimeLeft, status, onCountdownEnd]);

    // 时间单位数组
    const timeUnits = useMemo(() => [
        { value: timeLeft.days, unit: 'D', label: 'Days' },
        { value: timeLeft.hours, unit: 'H', label: 'Hours' },
        { value: timeLeft.minutes, unit: 'M', label: 'Minutes' },
        { value: timeLeft.seconds, unit: 'S', label: 'Seconds' }
    ], [timeLeft]);

    // 布局样式
    const layoutClasses = useMemo(() => {
        const base = "flex justify-center items-center";
        return direction === 'horizontal' 
            ? `${base} flex-row space-x-4 sm:space-x-6`
            : `${base} flex-col ${containerSizeConfig.spacing}`;
    }, [direction, containerSizeConfig.spacing]);

    // 时间显示区域样式
    const timeDisplayClasses = useMemo(() => {
        return direction === 'horizontal'
            ? "flex flex-row justify-center items-center space-x-1 sm:space-x-2"
            : "flex flex-row justify-center items-center space-x-1 sm:space-x-2";
    }, [direction]);

    return (
        <div 
            className={cn(
                "w-full bg-background rounded-lg",
                layoutClasses,
                containerSizeConfig.containerPadding,
                className
            )}
        >
            {/* 状态文本 */}
            {showStatus && (
                <p 
                    className={cn(
                        "text-center font-medium",
                        status === 'counting' ? 'text-foreground' : 'text-muted-foreground',
                        containerSizeConfig.statusText
                    )}
                >
                    {statusText[status]}
                </p>
            )}

            {/* 时间显示 */}
            <div className={timeDisplayClasses}>
                {timeUnits.map((unit, index) => (
                    <TimeUnit
                        key={unit.unit}
                        value={unit.value}
                        unit={unit.unit}
                        size={size}
                        responsive={responsive}
                    />
                ))}
            </div>
        </div>
    );
};

export default CountdownTimer;
