import React from 'react';
import { Card, Space, Alert, Row, Col } from 'antd';
import { LockOutlined, ClockCircleOutlined } from '@ant-design/icons';
import TextP from '@/components/base/text_p';
import TextH from '@/components/base/text_h';
import TextBrand from '@/components/base/text_brand';


const Staking: React.FC = () => {
    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card>
                    <Row gutter={[24, 24]} align="middle">
                        <Col xs={24} md={12}>
                            <Space direction="vertical" size="middle">
                                <TextBrand />
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
                                            <LockOutlined />
                                            <TextP className="text-white/80">Staking Coming Soon</TextP>
                                        </Space>
                                        <TextP>
                                            Staking will be in the subsequent development plan
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
                        <TextH size="h3">Staking & Rewards</TextH>
                        <TextP>
                            Token staking features are under development.
                            <br />
                            This will include staking pools, rewards distribution, and yield farming mechanisms.
                        </TextP>
                    </Space>
                </Card>
            </Space>
        </div>
    );
};

export default Staking;