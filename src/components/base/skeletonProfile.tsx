import React, { useMemo } from 'react';
import { Card, Row, Col, Skeleton } from 'antd';
import { cn } from '@/lib/utils';

export interface SkeletonProfileProps {
    className?: string;
    animate?: boolean;
}

/**
 * SkeletonProfile - Skeleton profile component
 * Referring to the structure and layout design of cardProfile.tsx
 */
const SkeletonProfile: React.FC<SkeletonProfileProps> = ({
    className,
    animate = true
}) => {
    const shimmerClass = animate ? 'animate-pulse' : '';

    // Create styles only once, avoid repeated rendering
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
                {/* Mobile layout */}
                <div className="skeleton-profile-mobile">
                    <Row gutter={[12, 12]}>
                        {/* BoxInfo area */}
                        <Col span={24}>
                            <div>
                                {/* Title skeleton */}
                                <Skeleton
                                    active={animate}
                                    paragraph={{ rows: 0 }}
                                    title={{ width: '80%' }}
                                    style={{ marginBottom: 8 }}
                                />
                                {/* Description skeleton */}
                                <Skeleton
                                    active={animate}
                                    paragraph={{ rows: 3, width: ['100%', '75%', '50%'] }}
                                    title={false}
                                    style={{ marginBottom: 8 }}
                                />
                                {/* Metadata skeleton */}
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
                        {/* Image and funds area */}
                        <Col span={24}>
                            <Row gutter={[12, 12]} align="middle">
                                {/* Image skeleton */}
                                <Col span={9}>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <div className={cn(
                                            "bg-white/20 rounded",
                                            "w-[100px] h-[100px]",
                                            shimmerClass
                                        )} />
                                    </div>
                                </Col>
                                {/* FundsSection skeleton */}
                                <Col span={15}>
                                    <div>
                                        {/* Title skeleton */}
                                        <div className={cn(
                                            "h-5 bg-white/20 rounded mb-3",
                                            "w-32",
                                            shimmerClass
                                        )} />
                                        {/* Token option skeleton */}
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

                {/* Tablet and desktop layout */}
                <div className="skeleton-profile-desktop">
                    <Row gutter={[12, 12]} align="middle">
                        {/* Left: Image and BoxInfo */}
                        <Col md={16} lg={17} xl={18}>
                            <Row gutter={[12, 12]} align="top">
                                {/* Image skeleton */}
                                <Col md={8} lg={7} xl={6}>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div className={cn(
                                            "bg-white/20 rounded",
                                            "w-[110px] h-[110px]",
                                            shimmerClass
                                        )} />
                                    </div>
                                </Col>
                                {/* BoxInfo skeleton */}
                                <Col md={16} lg={17} xl={18}>
                                    <div>
                                        {/* Title skeleton */}
                                        <Skeleton
                                            active={animate}
                                            paragraph={{ rows: 0 }}
                                            title={{ width: '75%' }}
                                            style={{ marginBottom: 8 }}
                                        />
                                        {/* Description skeleton */}
                                        <Skeleton
                                            active={animate}
                                            paragraph={{ rows: 3, width: ['100%', '80%', '60%'] }}
                                            title={false}
                                            style={{ marginBottom: 8 }}
                                        />
                                        {/* Metadata skeleton */}
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
                        {/* Right: FundsSection */}
                        <Col md={8} lg={7} xl={6}>
                            <div>
                                {/* Title skeleton */}
                                <div className={cn(
                                    "h-5 bg-white/20 rounded mb-3",
                                    "w-32",
                                    shimmerClass
                                )} />
                                {/* Token option skeleton */}
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