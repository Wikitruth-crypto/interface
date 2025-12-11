import React, { useMemo } from 'react';
import { Card, Row, Col, Skeleton } from 'antd';
import { cn } from '@/lib/utils';

export interface SkeletonProfileProps {
    className?: string;
    animate?: boolean;
}

/**
 * 资料卡片骨架屏组件
 * 参照 cardProfile.tsx 的结构和布局设计
 */
const SkeletonProfile: React.FC<SkeletonProfileProps> = ({
    className,
    animate = true
}) => {
    const shimmerClass = animate ? 'animate-pulse' : '';

    // 样式只创建一次，避免重复渲染
    const responsiveStyles = useMemo(() => (
        <style>{`
            .skeleton-profile-mobile {
                display: block;
            }
            .skeleton-profile-desktop {
                display: none;
            }
            @media (min-width: 768px) {
                .skeleton-profile-mobile {
                    display: none;
                }
                .skeleton-profile-desktop {
                    display: block;
                }
            }
        `}</style>
    ), []);

    return (
        <>
            {responsiveStyles}
            <Card
                className={className}
                style={{ marginBottom: 10 }}
                styles={{
                    body: { padding: '10px 13px' }
                }}
            >
                {/* 移动端布局 */}
                <div className="skeleton-profile-mobile">
                    <Row gutter={[12, 12]}>
                        {/* BoxInfo 区域 */}
                        <Col span={24}>
                            <div>
                                {/* 标题骨架 */}
                                <Skeleton
                                    active={animate}
                                    paragraph={{ rows: 0 }}
                                    title={{ width: '80%' }}
                                    style={{ marginBottom: 8 }}
                                />
                                {/* 描述骨架 */}
                                <Skeleton
                                    active={animate}
                                    paragraph={{ rows: 3, width: ['100%', '75%', '50%'] }}
                                    title={false}
                                    style={{ marginBottom: 8 }}
                                />
                                {/* 元数据骨架 */}
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className={cn(
                                        "h-6 bg-white/20 rounded-md",
                                        "w-16",
                                        shimmerClass
                                    )} />
                                    <div className={cn(
                                        "h-6 bg-white/20 rounded-md",
                                        "w-20",
                                        shimmerClass
                                    )} />
                                    <div className={cn(
                                        "h-6 bg-white/20 rounded-md",
                                        "w-24",
                                        shimmerClass
                                    )} />
                                    <div className={cn(
                                        "h-6 bg-white/20 rounded-md",
                                        "w-20",
                                        shimmerClass
                                    )} />
                                </div>
                            </div>
                        </Col>
                        {/* 图片和资金区域 */}
                        <Col span={24}>
                            <Row gutter={[12, 12]} align="middle">
                                {/* 图片骨架 */}
                                <Col span={9}>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <div className={cn(
                                            "bg-white/20 rounded",
                                            "w-[100px] h-[100px]",
                                            shimmerClass
                                        )} />
                                    </div>
                                </Col>
                                {/* FundsSection 骨架 */}
                                <Col span={15}>
                                    <div>
                                        {/* 标题骨架 */}
                                        <div className={cn(
                                            "h-5 bg-white/20 rounded mb-3",
                                            "w-32",
                                            shimmerClass
                                        )} />
                                        {/* 代币选项骨架 */}
                                        <div>
                                            <div className={cn(
                                                "p-[6px_10px] border border-white/20 rounded-lg mb-2",
                                                shimmerClass
                                            )}>
                                                <div className="flex items-center gap-2">
                                                    <div className={cn(
                                                        "w-4 h-4 bg-white/20 rounded-full shrink-0",
                                                        shimmerClass
                                                    )} />
                                                    <div className="flex-1">
                                                        <div className={cn(
                                                            "h-4 bg-white/20 rounded mb-1",
                                                            "w-20",
                                                            shimmerClass
                                                        )} />
                                                        <div className={cn(
                                                            "h-3 bg-white/20 rounded",
                                                            "w-12",
                                                            shimmerClass
                                                        )} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>

                {/* 平板端和电脑端布局 */}
                <div className="skeleton-profile-desktop">
                    <Row gutter={[12, 12]} align="middle">
                        {/* 左侧：图片和 BoxInfo */}
                        <Col md={16} lg={17} xl={18}>
                            <Row gutter={[12, 12]} align="top">
                                {/* 图片骨架 */}
                                <Col md={8} lg={7} xl={6}>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div className={cn(
                                            "bg-white/20 rounded",
                                            "w-[110px] h-[110px]",
                                            shimmerClass
                                        )} />
                                    </div>
                                </Col>
                                {/* BoxInfo 骨架 */}
                                <Col md={16} lg={17} xl={18}>
                                    <div>
                                        {/* 标题骨架 */}
                                        <Skeleton
                                            active={animate}
                                            paragraph={{ rows: 0 }}
                                            title={{ width: '75%' }}
                                            style={{ marginBottom: 8 }}
                                        />
                                        {/* 描述骨架 */}
                                        <Skeleton
                                            active={animate}
                                            paragraph={{ rows: 3, width: ['100%', '80%', '60%'] }}
                                            title={false}
                                            style={{ marginBottom: 8 }}
                                        />
                                        {/* 元数据骨架 */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className={cn(
                                                "h-6 bg-white/20 rounded-md",
                                                "w-16",
                                                shimmerClass
                                            )} />
                                            <div className={cn(
                                                "h-6 bg-white/20 rounded-md",
                                                "w-20",
                                                shimmerClass
                                            )} />
                                            <div className={cn(
                                                "h-6 bg-white/20 rounded-md",
                                                "w-24",
                                                shimmerClass
                                            )} />
                                            <div className={cn(
                                                "h-6 bg-white/20 rounded-md",
                                                "w-20",
                                                shimmerClass
                                            )} />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        {/* 右侧：FundsSection */}
                        <Col md={8} lg={7} xl={6}>
                            <div>
                                {/* 标题骨架 */}
                                <div className={cn(
                                    "h-5 bg-white/20 rounded mb-3",
                                    "w-32",
                                    shimmerClass
                                )} />
                                {/* 代币选项骨架 */}
                                <div>
                                    <div className={cn(
                                        "p-[6px_10px] border border-white/20 rounded-lg mb-2",
                                        shimmerClass
                                    )}>
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-4 h-4 bg-white/20 rounded-full shrink-0",
                                                shimmerClass
                                            )} />
                                            <div className="flex-1">
                                                <div className={cn(
                                                    "h-4 bg-white/20 rounded mb-1",
                                                    "w-20",
                                                    shimmerClass
                                                )} />
                                                <div className={cn(
                                                    "h-3 bg-white/20 rounded",
                                                    "w-12",
                                                    shimmerClass
                                                )} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "p-[6px_10px] border border-white/20 rounded-lg",
                                        shimmerClass
                                    )}>
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-4 h-4 bg-white/20 rounded-full shrink-0",
                                                shimmerClass
                                            )} />
                                            <div className="flex-1">
                                                <div className={cn(
                                                    "h-4 bg-white/20 rounded mb-1",
                                                    "w-16",
                                                    shimmerClass
                                                )} />
                                                <div className={cn(
                                                    "h-3 bg-white/20 rounded",
                                                    "w-10",
                                                    shimmerClass
                                                )} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Card>
        </>
    );
};

export default SkeletonProfile; 