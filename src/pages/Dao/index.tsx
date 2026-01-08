
import React from 'react';
import { Card, Space, Alert, Row, Col } from 'antd';
import { TeamOutlined, ClockCircleOutlined } from '@ant-design/icons';
import TextP from '@/components/base/text_p';
import TextH from '@/components/base/text_h';
import TextBrand from '@/components/base/text_brand';

const DAO: React.FC = () => {
    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card>
                    <Row gutter={[24, 24]} align="middle">
                        <Col xs={24} md={12}>
                            <Space direction="vertical" size="middle">
                                <div>
                                    <TextBrand />
                                </div>
                                <TextP>
                                    The truth will eventually be revealed,<br />
                                    and the criminals will eventually be judged!
                                </TextP>
                            </Space>
                        </Col>
                        <Col xs={24} md={12}>
                            <Alert
                                message={
                                    <Space direction="vertical" size="small">
                                        <Space>
                                            <TeamOutlined />
                                            <TextP className="text-white/80">DAO Coming Soon</TextP>
                                        </Space>
                                        <TextP>
                                            DAO will be in the subsequent development plan
                                        </TextP>
                                        <TextP>Please wait!</TextP>
                                    </Space>
                                }
                                type="info"
                                showIcon
                            />
                        </Col>
                    </Row>
                </Card>

                <Card>
                    <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
                        <ClockCircleOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
                        <TextH size="h3">DAO Governance</TextH>
                        <TextP>
                            Decentralized Autonomous Organization features are under development.
                            <br />
                            This will include voting, proposals, and community governance mechanisms.
                        </TextP>
                    </Space>
                </Card>
            </Space>
        </div>
    );
};

export default DAO;