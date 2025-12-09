'use client';

import React, { useMemo, useRef } from 'react';
import { Dropdown, Space, Typography, MenuProps, Button } from 'antd';
import { UserOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ConnectButtonComponent } from '@/dapp/context/connectWallet/connectButton';
import { useSiweAuth } from '@/dapp/hooks/SiweAuth';
import { useGetMyUserId } from '@/dapp/hooks/readContracts2/useGetMyUserId';
import AlertCustom from '@/dapp/components/base/alertCustom';

const { Text } = Typography;

export interface LoginDropdownProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const LoginDropdown: React.FC<LoginDropdownProps> = ({
    className,
    size = 'sm',
}) => {
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // Wallet connection status
    const {isConnected } = useAccount();

    // SIWE login related
    const { session, login, logout: siweLogout, isValidateSession, isLoading: isSiweLoading, error: siweError } = useSiweAuth();

    // UserId
    const userId = useGetMyUserId();

    // 使用响应式的 isValidateSession 来判断是否需要登录
    const needsSiweLogin = !isValidateSession;

    // Handle SIWE login
    const handleSiweLogin = async () => {
        try {
            await login();
        } catch (error) {
            console.error('SIWE login failed:', error);
        }
    };

    // Handle SIWE logout
    const handleSiweLogout = () => {
        siweLogout();
    };

    // Handle Profile navigation
    const handleProfileClick = () => {
        navigate('/app/profile');
    };

    // 构建下拉菜单项（只在已连接钱包时显示）
    const menuItems: MenuProps['items'] = useMemo(() => {
        if (!isConnected) {
            return [];
        }

        const items: MenuProps['items'] = [];

        // SIWE login status
        if (needsSiweLogin) {
            items.push({
                key: 'siwe-login',
                label: (
                    <Space direction="vertical" size={4} style={{ width: '100%', padding: '8px 0' }}>
                        <Text type="warning" strong style={{ fontSize: 12 }}>
                            Not logged in
                        </Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            Sign in to access your profile
                        </Text>
                    </Space>
                ),
                disabled: true,
            });
            
            items.push({
                key: 'siwe-login-button',
                label: (
                    <div style={{ padding: '4px 0' }}>
                        <Button
                            type="primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSiweLogin();
                            }}
                            disabled={isSiweLoading}
                            style={{
                                width: '100%',
                            }}
                        >
                            {isSiweLoading ? 'Signing...' : 'Sign In with SIWE'}
                        </Button>
                        {siweError && (
                            <Text type="danger" style={{ fontSize: 11, display: 'block', marginTop: 4 }}>
                                {siweError.message}
                            </Text>
                        )}
                    </div>
                ),
                disabled: true,
            });
        } else {
            // SIWE logged in
            items.push({
                key: 'siwe-status',
                label: (
                    <Space>
                        <Text type="success" strong style={{ fontSize: 12 }}>
                            ✓ Logged in
                        </Text>
                    </Space>
                ),
                disabled: true,
            });

            // Display UserId (if it exists)
            if (userId && userId.trim() !== '') {
                items.push({
                    key: 'user-id',
                    label: (
                        <Space>
                            <Text strong >
                                User ID: <Text type="success" strong style={{ fontFamily: 'monospace', fontSize: 14 }}>{userId}</Text>
                            </Text>
                        </Space>
                    ),
                    disabled: true,
                });
            }

            // Profile link (if there is UserId)
            if (userId && userId.trim() !== '') {
                items.push({
                    key: 'profile',
                    label: (
                        <Space>
                            <ProfileOutlined />
                            <Text strong>Profile</Text>
                        </Space>
                    ),
                    onClick: handleProfileClick,
                });
            }

            items.push({
                type: 'divider',
            });

            items.push({
                key: 'siwe-logout',
                label: (
                    <Space>
                        <LogoutOutlined style={{ color: 'var(--color-warning)' }}/>
                        <Text type="warning" strong>Logout</Text>
                    </Space>
                ),
                onClick: handleSiweLogout,
            });
        }

        return items;
    }, [
        isConnected,
        isValidateSession,
        isSiweLoading,
        siweError,
        userId,
        handleSiweLogin,
        handleSiweLogout,
        handleProfileClick,
    ]);

    // If the wallet is not connected, display ConnectButtonComponent
    if (!isConnected) {
        return (
            <div className={className}>
                <ConnectButtonComponent size={size} />
            </div>
        );
    }

    // If the wallet is connected, display ConnectButtonComponent and additional dropdown menu
    // ConnectButtonComponent handles wallet functionality (opens AccountModal)
    // Dropdown menu provides SIWE and Profile related functionality
    return (
        <div ref={dropdownRef} className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, position: 'relative' }}>
            <ConnectButtonComponent 
                size={size} 
                style={{ 
                    // border: '1px solid var(--color-primary)', 
                    borderRadius: 10 
                }} />
            {menuItems.length > 0 && (
                <div style={{ position: 'relative' }}>
                    <Dropdown
                        menu={{ items: menuItems }}
                        trigger={['click']}
                        placement="bottomRight"
                        overlayStyle={{ minWidth: 150, border: '1px solid primary', borderRadius: 10 }}
                        getPopupContainer={() => dropdownRef.current || document.body}
                    >
                        <Button
                            type="text"
                            size={size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'middle'}
                            icon={needsSiweLogin ? <UserOutlined style={{ fontSize: 22 }}/> : <UserOutlined style={{ fontSize: 22, color: 'var(--color-primary)' }}/>}
                            // style={{ padding: '4px 8px' }}
                        />
                    </Dropdown>
                    {/* If the wallet is connected but not logged in or the session is invalid, display a floating prompt */}
                    {isConnected && needsSiweLogin && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                marginTop: '4px',
                                zIndex: 1000,
                                width: 'max-content',
                                maxWidth: '160px',
                            }}
                        >
                            <div style={{ margin: '-12px' }}>
                                <AlertCustom
                                    type="warning"
                                    message="Unlogged"
                                    showIcon={false}
                                    enablePulse={true}
                                    style={{
                                        padding: '4px 7px',
                                        fontSize: '12px',
                                        lineHeight: '1.2',
                                        margin: 0,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LoginDropdown;
