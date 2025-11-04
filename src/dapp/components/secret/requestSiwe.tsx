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
    title = '登录授权',
    hint = '需要完成一次 Sign-In with Ethereum 登录以继续操作。',
    buttonText = '连接并签名登录',
    expiredText = '登录已过期，需要重新签名。',
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
                        退出
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
                                重试
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
