import React, { useMemo } from 'react';
import { Button, Alert, Card, Typography, Space, Row, Col, Statistic, Divider } from 'antd';
import { CheckCircleOutlined, ReloadOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
// import { formatAmount } from '../utils/formatAmount';

const { Text } = Typography;

export interface WithdrawCardProps {
    disabled?: boolean;
    isLoading?: boolean;
    buttonText?: string;
    message?: string;
    formattedAmount: string;
    tokenSymbol?: string;
    onClick?: () => void;
    /** 自定义样式类名 */
    className?: string;
    isSuccess?: boolean;
    error?: string;
}

/**
 * WithdrawCard - 提现卡片组件
 * 
 * 功能：
 * - 支持多种状态：正常、加载、成功、错误、禁用
 * - 显示金额
 * - 响应式设计：宽屏横向布局，移动端纵向布局
 * - 使用 Ant Design 组件构建
 * 
 * 设计原则：
 * - 纯UI组件，状态由外部管理
 * - 丰富的视觉反馈
 * - 清晰的状态指示
 * - 良好的可访问性
 */
const WithdrawCard: React.FC<WithdrawCardProps> = ({
    disabled = false,
    isLoading = false,
    buttonText = 'Withdraw',
    message = '',
    formattedAmount,
    tokenSymbol = '',
    onClick,
    className,
    isSuccess = false,
    error,
}) => {

    // 获取按钮文本
    const getButtonText = () => {
        if (isSuccess) return 'Withdrawn';
        if (isLoading) return 'Withdrawing...';
        if (error) return 'Retry';
        return buttonText;
    };

    // 获取按钮类型和图标
    const getButtonProps = () => {
        if (isSuccess) {
            return {
                type: 'default' as const,
                icon: <CheckCircleOutlined />,
                danger: false,
            };
        }
        if (error) {
            return {
                type: 'primary' as const,
                icon: <ReloadOutlined />,
                danger: true,
            };
        }
        return {
            type: 'primary' as const,
            icon: undefined,
            danger: false,
        };
    };

    const buttonProps = getButtonProps();

    // 状态消息
    const statusAlert = useMemo(() => {
        if (isSuccess) {
            return (
                <Alert
                    message="Successfully withdrawn!"
                    type="success"
                    showIcon
                    icon={<CheckCircleOutlined />}
                />
            );
        }
        if (error) {
            return (
                <Alert
                    message="Withdrawal failed"
                    description={error}
                    type="error"
                    showIcon
                />
            );
        }
        if (isLoading) {
            return (
                <Alert
                    message="Processing transaction..."
                    description="Please wait and don't close this page"
                    type="info"
                    showIcon
                    icon={<LoadingOutlined spin />}
                />
            );
        }
        return null;
    }, [isSuccess, error, disabled, isLoading]);

    return (
        <Card className={className}>
            <Row gutter={[16, 16]} align="middle">
                {/* 数据展示区域 */}
                <Col xs={24} md={16}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        {/* 金额显示 */}
                        {formattedAmount && (
                            <Statistic
                                title="Total Amount"
                                value={formattedAmount}
                                suffix={tokenSymbol}
                                valueStyle={{ 
                                    fontFamily: 'monospace',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                }}
                                prefix="💰"
                            />
                        )}

                        {message && (
                            <div>
                                <Text type="secondary">
                                    {message}
                                </Text>
                            </div>
                        )}

                        {/* 状态消息 */}
                        {statusAlert}
                    </Space>
                </Col>

                {/* 按钮区域 */}
                <Col xs={24} md={8}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                    }}>
                        <Button
                            {...buttonProps}
                            disabled={disabled || isSuccess}
                            onClick={onClick}
                            loading={isLoading}
                            size="large"
                            block
                            style={{
                                minWidth: '120px',
                            }}
                        >
                            {getButtonText()}
                        </Button>
                    </div>
                </Col>
            </Row>
        </Card>
    );
};

export default WithdrawCard; 