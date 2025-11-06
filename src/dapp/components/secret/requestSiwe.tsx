import { useMemo, useEffect } from 'react';
import { Card, Button, Typography, Alert, Space } from 'antd';
import { useSiweAuth } from '@/dapp/hooks/SiweAuth';

const { Paragraph } = Typography;

export interface RequestSiweProps {
    className?: string;
    title?: string;
    hint?: string;
    buttonText?: string;
    expiredText?: string;
    onComplete?: () => void;
}

export const RequestSiwe: React.FC<RequestSiweProps> = ({
    className,
    title = 'Login Authorization',
    hint = 'You need to complete a Sign-In with Ethereum login to continue the operation.',
    buttonText = 'Connect and Sign Login',
    expiredText = 'Login has expired, you need to sign again.',
    onComplete,
}) => {
    const { session, login, logout, validateSession, isLoading, error, reset } = useSiweAuth();

    const isExpired = useMemo(() => {
        if (!session.expiresAt) {
            return false;
        }
        return session.expiresAt.getTime() <= Date.now();
    }, [session.expiresAt]);

    const needsLogin = !session.isLoggedIn || !session.token || isExpired;

    useEffect(() => {
        if (!needsLogin) {
            onComplete?.();
        }
    }, [needsLogin, onComplete]);

    useEffect(() => {
        if (session.isLoggedIn) {
            void validateSession();
        }
    }, [session.isLoggedIn, validateSession]);

    if (!needsLogin) {
        return null;
    }

    return (
        <Card
            className={className}
            title={title}
            extra={
                session.isLoggedIn && (
                    <Button type="link" onClick={logout} size="small">
                        Logout
                    </Button>
                )
            }
        >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                    {hint}
                </Paragraph>

                {session.isLoggedIn && isExpired && (
                    <Alert type="warning" showIcon message={expiredText} />
                )}

                {error && (
                    <Alert
                        type="error"
                        showIcon
                        message="登录失败"
                        description={error.message}
                        action={
                            <Button type="link" size="small" onClick={reset}>
                                Retry
                            </Button>
                        }
                    />
                )}

                <Button type="primary" loading={isLoading} onClick={() => login()} block>
                    {buttonText}
                </Button>
            </Space>
        </Card>
    );
};

export default RequestSiwe;
