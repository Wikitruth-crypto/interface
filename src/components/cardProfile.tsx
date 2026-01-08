import React, { useMemo } from 'react';
import { Card, Row, Col, Image } from 'antd';
import BoxInfo, { BoxMetadata } from '@dapp/components/base/boxInfo';
import FundsSection, { FundsData } from './fundsSection';
import { ipfsCidToUrl } from '@/config/ipfsUrl/ipfsCidToUrl';

// Type Definitions
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
    // Metadata needed for constructing BoxInfo
    const boxMetadata: BoxMetadata = {
        tokenId: data.tokenId.toString(),
        status: data.status,
        country: data.country,
        state: data.state,
        eventDate: data.eventDate
    };

    // Create styles once to avoid re-rendering
    const responsiveStyles = useMemo(() => (
        <style>{`
            .card-profile-mobile {
                display: block;
            }
            .card-profile-desktop {
                display: none;
            }
            @media (min-width: 768px) {
                .card-profile-mobile {
                    display: none;
                }
                .card-profile-desktop {
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
                hoverable
                styles={{
                    body: { padding: '12px 16px' }
                }}
            >
                {/* Mobile Layout */}
                <div className="card-profile-mobile">
                    <Row gutter={[12, 12]}>
                        <Col span={24}>
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
                        <Col span={24}>
                            <Row gutter={[12, 12]} align="middle">
                                <Col span={9}>
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
                                <Col span={15}>
                                    <FundsSection
                                        funds={funds}
                                        selectedValue={actions.selectedTokenSymbol}
                                        onSelect={actions.onSelect}
                                        onDeselect={actions.onDeselect}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>

                {/* Tablet and Desktop Layout */}
                <div className="card-profile-desktop">
                    <Row gutter={[12, 12]} align="middle">
                        <Col md={16} lg={17} xl={18}>
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

                        <Col md={8} lg={7} xl={6}>
                            <FundsSection
                                funds={funds}
                                selectedValue={actions.selectedTokenSymbol}
                                onSelect={actions.onSelect}
                                onDeselect={actions.onDeselect}
                            />
                        </Col>
                    </Row>
                </div>
            </Card>
        </>
    );
};

export default CardProfile;