import React from 'react';
import { Card, Typography, Space, Alert, Row, Col } from 'antd';
import { LockOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

/**
 * Staking 页面
 * 
 * 占位页面，显示 Staking 功能即将推出的提示
 */
const Staking: React.FC = () => {
    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* 标题区域 */}
                <Card>
                    <Row gutter={[24, 24]} align="middle">
                        <Col xs={24} md={12}>
                            <Space direction="vertical" size="middle">
                                <div>
                                    <Title level={1} style={{ margin: 0, display: 'inline-block', marginRight: 8 }}>
                                        Truth
                                    </Title>
                                    <Title level={1} style={{ margin: 0, display: 'inline-block' }}>
                                        Market
                                    </Title>
                                </div>
                                <Paragraph style={{ fontSize: '16px', marginBottom: 0 }}>
                                    The truth will eventually be revealed,<br />
                                    and the criminals will eventually be judged!
                                </Paragraph>
                            </Space>
                        </Col>
                        <Col xs={24} md={12}>
                            <Alert
                                message={
                                    <Space direction="vertical" size="small">
                                        <Space>
                                            <LockOutlined />
                                            <Text strong>Staking Coming Soon</Text>
                                        </Space>
                                        <Text type="secondary">
                                            Staking will be in the subsequent development plan
                                        </Text>
                                        <Text type="secondary">Please wait!</Text>
                                    </Space>
                                }
                                type="info"
                                showIcon
                            />
                        </Col>
                    </Row>
                </Card>

                {/* 内容区域 */}
                <Card>
                    <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
                        <ClockCircleOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
                        <Title level={3}>Staking & Rewards</Title>
                        <Paragraph>
                            Token staking features are under development.
                            <br />
                            This will include staking pools, rewards distribution, and yield farming mechanisms.
                        </Paragraph>
                    </Space>
                </Card>
            </Space>
        </div>
    );
};

export default Staking;