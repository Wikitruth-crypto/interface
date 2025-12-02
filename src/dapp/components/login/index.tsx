'use client';

import React, { useMemo, useEffect, useRef } from 'react';
import { Dropdown, Space, Typography, MenuProps, Button } from 'antd';
import { UserOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ConnectButtonComponent } from '@/dapp/context/connectWallet/connectButton';
import { useSiweAuth } from '@/dapp/hooks/SiweAuth';
import { useGetMyUserId } from '@/dapp/hooks/readContracts2/useGetMyUserId';

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
    
    // 钱包连接状态
    const {isConnected } = useAccount();

    // SIWE 登录相关
    const { session, login, logout: siweLogout, validateSession, isLoading: isSiweLoading, error: siweError } = useSiweAuth();

    // UserId
    const userId = useGetMyUserId();

    // 检查 SIWE token 是否过期
    const isSiweExpired = useMemo(() => {
        if (!session.expiresAt) {
            return false;
        }
        return session.expiresAt.getTime() <= Date.now();
    }, [session.expiresAt]);

    const needsSiweLogin = !session.isLoggedIn || !session.token || isSiweExpired;

    // 验证会话
    useEffect(() => {
        if (session.isLoggedIn && !needsSiweLogin) {
            void validateSession();
        }
    }, [session.isLoggedIn, needsSiweLogin, validateSession]);

    // 处理 SIWE 登录
    const handleSiweLogin = async () => {
        try {
            await login();
        } catch (error) {
            console.error('SIWE login failed:', error);
        }
    };

    // 处理 SIWE 登出
    const handleSiweLogout = () => {
        siweLogout();
    };

    // 处理 Profile 导航
    const handleProfileClick = () => {
        navigate('/app/profile');
    };

    // 构建下拉菜单项（只在已连接钱包时显示）
    const menuItems: MenuProps['items'] = useMemo(() => {
        if (!isConnected) {
            return [];
        }

        const items: MenuProps['items'] = [];

        // SIWE 登录状态
        if (needsSiweLogin) {
            items.push({
                key: 'siwe-login',
                label: (
                    <Space direction="vertical" size={4} style={{ width: '100%', padding: '8px 0' }}>
                        <Text type="warning" style={{ fontSize: 12 }}>
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
                            {isSiweLoading ? 'Signing...' : 'Sign In with Ethereum'}
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
            // 已登录 SIWE
            items.push({
                key: 'siwe-status',
                label: (
                    <Space>
                        <Text type="success" style={{ fontSize: 12 }}>
                            ✓ Logged in
                        </Text>
                    </Space>
                ),
                disabled: true,
            });

            // 显示 UserId（如果存在）
            if (userId && userId.trim() !== '') {
                items.push({
                    key: 'user-id',
                    label: (
                        <Space>
                            <Text style={{ fontSize: 12 }}>
                                User ID: <Text strong style={{ fontFamily: 'monospace' }}>{userId}</Text>
                            </Text>
                        </Space>
                    ),
                    disabled: true,
                });
            }

            // Profile 链接（如果有 UserId）
            if (userId && userId.trim() !== '') {
                items.push({
                    key: 'profile',
                    label: (
                        <Space>
                            <ProfileOutlined />
                            <Text>Profile</Text>
                        </Space>
                    ),
                    onClick: handleProfileClick,
                });
            }

            items.push({
                type: 'divider',
            });

            // 登出按钮
            items.push({
                key: 'siwe-logout',
                label: (
                    <Space>
                        <LogoutOutlined />
                        <Text>Logout</Text>
                    </Space>
                ),
                onClick: handleSiweLogout,
            });
        }

        return items;
    }, [
        isConnected,
        needsSiweLogin,
        isSiweLoading,
        siweError,
        userId,
        handleSiweLogin,
        handleSiweLogout,
        handleProfileClick,
    ]);

    // 如果未连接，直接显示 ConnectButtonComponent
    if (!isConnected) {
        return (
            <div className={className}>
                <ConnectButtonComponent size={size} />
            </div>
        );
    }

    // 如果已连接，显示 ConnectButtonComponent 和额外的下拉菜单
    // ConnectButtonComponent 正常处理钱包功能（打开 AccountModal）
    // 下拉菜单提供 SIWE 和 Profile 相关功能
    return (
        <div ref={dropdownRef} className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <ConnectButtonComponent size={size} />
            {menuItems.length > 0 && (
                <Dropdown
                    menu={{ items: menuItems }}
                    trigger={['click']}
                    placement="bottomRight"
                    overlayStyle={{ minWidth: 280 }}
                    getPopupContainer={() => dropdownRef.current || document.body}
                >
                    <Button
                        type="text"
                        size={size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'middle'}
                        icon={<UserOutlined style={{ fontSize: 18 }}/>}
                        style={{ padding: '4px 8px' }}
                    />
                </Dropdown>
            )}
        </div>
    );
};

export default LoginDropdown;
