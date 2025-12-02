import React from 'react';
import { Card, Row, Col } from 'antd';

// 导入基础组件
import BoxImage from './base/boxImage';
import BoxInfo, { BoxMetadata } from './base/boxInfo';
import FundsSection, { FundsData } from './fundsSection';

// 类型定义
export interface CardProfileData {
    tokenId: string | number;
    title: string;
    description: string;
    boxImage?: string;
    status: string;
    country?: string;
    state?: string;
    eventDate?: string;
}

export interface CardProfileActions {
    selectedTokenSymbol: string;
    onCardClick?: () => void;
    onSelect?: (tokenSymbol: string) => void;
    onDeselect?: (tokenSymbol: string) => void;
}

export interface CardProfileProps {
    data: CardProfileData;
    funds: FundsData[];
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
 * - 支持响应式布局：宽屏横向布局，移动端纵向布局
 * 
 * 设计原则：
 * - 纯UI组件，不包含业务逻辑
 * - 通过props接收所有数据和回调
 * - 专注于展示和用户交互
 * - 使用 Ant Design 组件构建
 */
const CardProfile: React.FC<CardProfileProps> = ({
    data,
    funds,
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
        <Card
            className={className}
            style={{ marginBottom: 16 }}
            hoverable
        >
            <Row gutter={[16, 16]} align="middle">
                {/* 左侧：Box 基础信息展示区 */}
                <Col xs={24} md={16}>
                    <Row
                        onClick={actions.onCardClick}
                        style={{
                            cursor: actions.onCardClick ? 'pointer' : 'default',
                        }}
                        gutter={[16, 16]}
                        align="top"
                    >
                        {/* Box 图片 */}
                        <Col xs={24} sm={8} style={{ display: 'flex', justifyContent: 'center' }}>
                            <BoxImage
                                src={data.boxImage || ''}
                                alt={`${data.title} #${data.tokenId}`}
                            />
                        </Col>

                        {/* Box 信息 */}
                        <Col xs={24} sm={16}>
                            <BoxInfo
                                title={data.title}
                                description={data.description}
                                metadata={boxMetadata}
                                responsive={true}
                            />
                        </Col>
                    </Row>
                </Col>

                {/* 右侧：资金展示区域 */}
                <Col xs={24} md={8}>
                    <div
                        style={{
                            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                            borderLeft: 'none',
                            paddingTop: 16,
                            paddingLeft: 0,
                        }}
                        className="md:border-t-0 md:border-l md:pl-4 md:pt-0"
                    >
                        <FundsSection
                            funds={funds}
                            selectedValue={actions.selectedTokenSymbol}
                            onSelect={actions.onSelect}
                            onDeselect={actions.onDeselect}
                        />
                    </div>
                </Col>
            </Row>
        </Card>
    );
};

export default CardProfile;