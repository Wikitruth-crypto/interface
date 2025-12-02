
import React from 'react';
import { Card, Typography, Space, Alert, Row, Col } from 'antd';
import { TeamOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const DAO: React.FC = () => {
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
                                        Wiki
                                    </Title>
                                    <Title level={1} style={{ margin: 0, display: 'inline-block' }}>
                                        Truth
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
                                            <TeamOutlined />
                                            <Text strong>DAO Coming Soon</Text>
                                        </Space>
                                        <Text type="secondary">
                                            DAO will be in the subsequent development plan
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
                        <Title level={3}>DAO Governance</Title>
                        <Paragraph>
                            Decentralized Autonomous Organization features are under development.
                            <br />
                            This will include voting, proposals, and community governance mechanisms.
                        </Paragraph>
                    </Space>
                </Card>
            </Space>
        </div>
    );
};

export default DAO;