import React, { useState } from 'react';
import { FloatButton, Space, theme } from 'antd';
import { SafetyCertificateOutlined, CloseOutlined, LoginOutlined } from '@ant-design/icons';
import RequestEip712 from '@/dapp/components/secret/requestEip712';
import RequestSiwe from '@/dapp/components/secret/requestSiwe';
import type { Eip712Requirement } from '@/dapp/components/secret/requestEip712';

const { useToken } = theme;

export interface FloatSignatureButtonProps {
    eip712Requirement?: Eip712Requirement;
    needSiwe?: boolean;
    chainId?: number;
    address?: `0x${string}`;
    eip712Title?: string;
    eip712Hint?: string;
    siweTitle?: string;
    /** SIWE 提示文字 */
    siweHint?: string;
    siweButtonText?: string;
    /** SIWE 过期提示文字 */
    siweExpiredText?: string;
    onEip712Complete?: () => void;
    onSiweComplete?: () => void;
    className?: string;
}

/**
 * 悬浮签名按钮组件
 * 
 * 功能：
 * - 在右侧中间位置显示悬浮按钮
 * - 点击按钮显示/隐藏签名组件（EIP712 和/或 SIWE）
 * - 签名组件固定在右侧显示
 * - 支持同时显示多个签名请求
 */
const FloatSignatureButton: React.FC<FloatSignatureButtonProps> = ({
    eip712Requirement,
    needSiwe = false,
    chainId,
    address,
    eip712Title,
    eip712Hint,
    siweTitle,
    siweHint,
    siweButtonText,
    siweExpiredText,
    onEip712Complete,
    onSiweComplete,
    className,
}) => {
    const { token } = useToken();
    const [open, setOpen] = useState(false);

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleEip712Complete = () => {
        onEip712Complete?.();
    };

    const handleSiweComplete = () => {
        onSiweComplete?.();
    };

    // 如果既没有 EIP712 requirement 也不需要 SIWE，不显示按钮
    const hasSignatureRequest = eip712Requirement || needSiwe;
    if (!hasSignatureRequest) {
        return null;
    }

    // 确定按钮图标
    const getButtonIcon = () => {
        if (open) {
            return <CloseOutlined />;
        }
        // 如果同时需要两种签名，显示登录图标；如果只需要 EIP712，显示证书图标
        if (needSiwe && eip712Requirement) {
            return <LoginOutlined />;
        }
        if (needSiwe) {
            return <LoginOutlined />;
        }
        return <SafetyCertificateOutlined />;
    };

    return (
        <>
            {/* 按钮容器，用于包裹 FloatButton 和呼吸圆圈 */}
            <div
                style={{
                    position: 'fixed',
                    right: 24,
                    bottom: '50%',
                    transform: 'translateY(50%)',
                    zIndex: 1000,
                    width: '56px',
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* 呼吸圆圈 - 外层大圈 */}
                {!open && (
                    <div
                        className="float-signature-ring-outer"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '80px',
                            height: '80px',
                            marginTop: '-40px',
                            marginLeft: '-40px',
                            borderRadius: '50%',
                            border: `2px solid ${token.colorPrimary}`,
                            opacity: 0.4,
                            pointerEvents: 'none',
                        }}
                    />
                )}
                {/* 呼吸圆圈 - 内层小圈 */}
                {!open && (
                    <div
                        className="float-signature-ring-inner"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '64px',
                            height: '64px',
                            marginTop: '-32px',
                            marginLeft: '-32px',
                            borderRadius: '50%',
                            border: `2px solid ${token.colorPrimary}`,
                            opacity: 0.3,
                            pointerEvents: 'none',
                        }}
                    />
                )}
                <FloatButton
                    icon={getButtonIcon()}
                    type="primary"
                    onClick={handleToggle}
                    className={className}
                    style={{
                        position: 'static',
                    }}
                />
            </div>
            {/* 定义呼吸动画 */}
            <style>{`
                @keyframes float-signature-pulse-outer {
                    0%, 100% {
                        opacity: 0.4;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.1;
                        transform: scale(1.15);
                    }
                }
                @keyframes float-signature-pulse-inner {
                    0%, 100% {
                        opacity: 0.3;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.05;
                        transform: scale(1.2);
                    }
                }
                .float-signature-ring-outer {
                    animation: float-signature-pulse-outer 2s ease-in-out infinite;
                }
                .float-signature-ring-inner {
                    animation: float-signature-pulse-inner 2s ease-in-out infinite;
                }
            `}</style>
            {open && (
                <div
                    style={{
                        position: 'fixed',
                        right: 80,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1000,
                        maxWidth: 400,
                        maxHeight: '80vh',
                        overflowY: 'auto',
                    }}
                >
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        {needSiwe && (
                            <RequestSiwe
                                title={siweTitle}
                                hint={siweHint}
                                buttonText={siweButtonText}
                                expiredText={siweExpiredText}
                                onComplete={handleSiweComplete}
                            />
                        )}
                        {eip712Requirement && (
                            <RequestEip712
                                requirement={eip712Requirement}
                                chainId={chainId}
                                address={address}
                                cardTitle={eip712Title}
                                cardHint={eip712Hint}
                                onComplete={handleEip712Complete}
                            />
                        )}
                    </Space>
                </div>
            )}
        </>
    );
};

export default FloatSignatureButton;