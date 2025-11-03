"use client";

import { cn } from "@/lib/utils";
import { Steps as AntSteps } from "antd";

export interface StepItem {
    title: string;
    description: React.ReactNode;
    status?: 'finish' | 'process' | 'wait' | 'error';
}

interface StepsProps {
    items: StepItem[];
    current?: number;
    direction?: 'horizontal' | 'vertical';
    className?: string;
}

/**
 * Steps 组件 - 基于 antd Steps 的步骤组件
 *
 * 支持水平和垂直方向，自动管理步骤状态
 *
 * @example
 * ```tsx
 * <Steps
 *   items={[
 *     { title: '第一步', description: '描述' },
 *     { title: '第二步', description: '描述' }
 *   ]}
 *   current={0}
 *   direction="vertical"
 * />
 * ```
 */
export function Steps({
    items,
    current = 0,
    direction = 'vertical',
    className
}: StepsProps) {
    // 转换 items 格式以适配 antd Steps
    const antdItems = items.map((item, index) => ({
        title: item.title,
        description: item.description,
        status: item.status || (
            index < current ? 'finish' :
            index === current ? 'process' :
            'wait'
        ) as 'finish' | 'process' | 'wait' | 'error'
    }));

    return (
        <div className={cn("w-full", className)}>
            <AntSteps
                items={antdItems}
                current={current}
                direction={direction}
                className="[&_.ant-steps-item-title]:text-white [&_.ant-steps-item-description]:text-white/70"
            />
        </div>
    );
}