import { useEffect } from 'react';
import { Button, Typography, Alert, Space } from 'antd';
import { useSiweAuth } from '@dapp/hooks/SiweAuth';

const { Paragraph } = Typography;

export interface RequestSiweProps {
    title?: string;
    hint?: string;
    buttonText?: string;
    expiredText?: string;
    onComplete?: () => void;
    className?: string;
}

export const RequestSiwe: React.FC<RequestSiweProps> = ({
    className,
    title = 'Login Authorization',
    hint = 'You need to complete a Sign-In with Ethereum login to continue the operation.',
    buttonText = 'Connect and Sign Login',
    expiredText = 'Login has expired, you need to sign again.',
    onComplete,
}) => {
    const { session, login, logout, isValidateSession, isLoading, error, reset } = useSiweAuth();

    // When the session becomes valid, trigger the completion callback
    useEffect(() => {
        if (isValidateSession) {
            onComplete?.();
        }
    }, [isValidateSession, onComplete]);

    // If the session is valid, do not display the component
    if (isValidateSession) {
        return null;
    }

    return (
        <Alert
            type="warning"
            showIcon
            message={title}
            description={
                <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: 8 }}>
                    <Paragraph type="secondary" style={{ marginBottom: 0, fontSize: 13 }}>
                        {hint}
                    </Paragraph>

                    {session.isLoggedIn && session.expiresAt && session.expiresAt.getTime() <= Date.now() && (
                        <Alert type="warning" showIcon message={expiredText} />
                    )}

                    {error && (
                        <Alert
                            type="error"
                            showIcon
                            message="Login failed"
                            description={error.message}
                            action={
                                <Button type="link" size="small" onClick={reset}>
                                    Retry
                                </Button>
                            }
                        />
                    )}

                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Button type="primary" loading={isLoading} onClick={() => login()} block>
                            {buttonText}
                        </Button>
                        {session.isLoggedIn && (
                            <Button type="link" onClick={logout} size="small" style={{ padding: 0 }}>
                                Logout
                            </Button>
                        )}
                    </Space>
                </Space>
            }
            className={className}
            style={{ maxWidth: 400 }}
        />
    );
};

export default RequestSiwe;
