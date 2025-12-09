import React from 'react';
import { Button, Alert, Typography, Space} from 'antd';
import { CheckCircleOutlined, ReloadOutlined, LoadingOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

export interface WithdrawCardProps {
    disabled?: boolean;
    isLoading?: boolean;
    buttonText?: string;
    message?: string;
    formattedAmount: string;
    tokenSymbol?: string;
    submit?: () => void;
    cancel?: () => void;
    /** 自定义样式类名 */
    className?: string;
    isSuccess?: boolean;
    error?: string;
}

const WithdrawCard: React.FC<WithdrawCardProps> = ({
    disabled = false,
    isLoading = false,
    buttonText = 'Withdraw',
    message = '',
    formattedAmount,
    tokenSymbol = '',
    submit,
    cancel,
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

    // 确定 Alert 的类型和消息
    const getAlertType = (): 'success' | 'error' | 'info' | 'warning' => {
        if (isSuccess) return 'success';
        if (error) return 'error';
        if (isLoading) return 'info';
        return 'info';
    };

    const getAlertMessage = (): string => {
        if (isSuccess) return 'Successfully withdrawn!';
        if (error) return 'Withdrawal failed';
        if (isLoading) return 'Processing transaction...';
        return `Withdrawal: ${formattedAmount} ${tokenSymbol}`;
    };

    const getAlertIcon = () => {
        if (isSuccess) return <CheckCircleOutlined />;
        if (isLoading) return <LoadingOutlined spin />;
        return undefined;
    };

    return (
        <Alert
            type={getAlertType()}
            showIcon
            icon={getAlertIcon()}
            message={getAlertMessage()}
            description={
                <Space direction="horizontal" size="small" style={{ width: '100%'}}>
                <Space direction="vertical" size="small" >
                    {/* 消息文本 */}
                    {message && (
                        <Paragraph type="secondary" style={{ marginBottom: 0, fontSize: '12px' }}>
                            {message}
                        </Paragraph>
                    )}

                    {/* 错误详情 */}
                    {error && (
                        <Paragraph type="secondary" style={{ marginBottom: 0, fontSize: '12px' }}>
                            {error}
                        </Paragraph>
                    )}
                    </Space>

                    {/* 按钮区域 */}
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Button
                            {...buttonProps}
                            disabled={disabled || isSuccess}
                            onClick={submit}
                            loading={isLoading}
                            size="middle"
                            block
                        >
                            {getButtonText()}
                        </Button>
                        <Button
                            type="default"
                            disabled={disabled || isSuccess}
                            onClick={cancel}
                            size="middle"
                            block
                        >
                            Cancel
                        </Button>
                    </Space>
                </Space>
            }
            className={className}
        />
    );
};

export default WithdrawCard; 