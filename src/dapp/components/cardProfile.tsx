import React from 'react';
import { Card, Row, Col, Image } from 'antd';
import BoxInfo, { BoxMetadata } from './base/boxInfo';
import FundsSection, { FundsData } from './fundsSection';
import { ipfsCidToUrl } from '@/config/ipfsUrl/ipfsCidToUrl';

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
            style={{ marginBottom: 10 }}
            hoverable
            styles={{
                body: { padding: '12px 16px' }
            }}
        >
            <Row gutter={[12, 12]} align="middle">
                <Col xs={24} md={0}>
                    <div
                        onClick={actions.onCardClick}
                        style={{
                            cursor: actions.onCardClick ? 'pointer' : 'default',
                        }}
                    >
                        <BoxInfo
                            title={data.title}
                            description={data.description}
                            metadata={boxMetadata}
                            responsive={true}
                        />
                    </div>
                </Col>
                <Col xs={24} md={0}>
                    <Row gutter={[12, 12]} align="middle">
                        <Col xs={9}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    src={ipfsCidToUrl(data.boxImage || '')}
                                    alt={`${data.title} #${data.tokenId}`}
                                    width={100}
                                    height={100}
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        </Col>
                        <Col xs={15}>
                            <FundsSection
                                funds={funds}
                                selectedValue={actions.selectedTokenSymbol}
                                onSelect={actions.onSelect}
                                onDeselect={actions.onDeselect}
                            />
                        </Col>
                    </Row>
                </Col>

                {/* 平板端和电脑端：Box 基础信息展示区 */}
                <Col xs={0} md={16} lg={17} xl={18}>
                    <Row
                        onClick={actions.onCardClick}
                        style={{
                            cursor: actions.onCardClick ? 'pointer' : 'default',
                        }}
                        gutter={[12, 12]}
                        align="top"
                    >
                        <Col md={8} lg={7} xl={6}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Image
                                    src={ipfsCidToUrl(data.boxImage || '')}
                                    alt={`${data.title} #${data.tokenId}`}
                                    width={110}
                                    height={110}
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        </Col>

                        <Col md={16} lg={17} xl={18}>
                            <BoxInfo
                                title={data.title}
                                description={data.description}
                                metadata={boxMetadata}
                                responsive={true}
                            />
                        </Col>
                    </Row>
                </Col>

                <Col xs={0} md={8} lg={7} xl={6}>
                    <FundsSection
                        funds={funds}
                        selectedValue={actions.selectedTokenSymbol}
                        onSelect={actions.onSelect}
                        onDeselect={actions.onDeselect}
                    />
                </Col>
            </Row>
        </Card>
    );
};

export default CardProfile;