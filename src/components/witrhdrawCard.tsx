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

    // Get button text
    const getButtonText = () => {
        if (isSuccess) return 'Withdrawn';
        if (isLoading) return 'Withdrawing...';
        if (error) return 'Retry';
        return buttonText;
    };

    // Get button type and icon
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

    // Determine Alert type and message
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
                    {message && (
                        <Paragraph type="secondary" style={{ marginBottom: 0, fontSize: '12px' }}>
                            {message}
                        </Paragraph>
                    )}

                    {error && (
                        <Paragraph type="secondary" style={{ marginBottom: 0, fontSize: '12px' }}>
                            {error}
                        </Paragraph>
                    )}
                    </Space>

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