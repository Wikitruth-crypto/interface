'use client';

import React, { useMemo, useRef } from 'react';
import { Dropdown, Space, Typography, MenuProps, Button } from 'antd';
import { UserOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@dapp/contexts/web3Context/connectButton';
import { useSiweAuth } from '@dapp/hooks/SiweAuth';
import { useGetMyUserId } from '@dapp/hooks/readContracts2/useGetMyUserId';
import AlertCustom from '@/components/base/alertCustom';

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
    const { login, logout: siweLogout, isValidateSession, isLoading: isSiweLoading, error: siweError } = useSiweAuth();

    // UserId
    const userId = useGetMyUserId();

    // Use responsive isValidateSession to determine if login is needed
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
        navigate('/profile');
    };

    // Build dropdown menu items (only displayed when the wallet is connected)
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
                        <p className="text-warning font-bold text-xs md:text-sm">
                            Not logged in
                        </p>
                        <p className="text-muted-foreground text-xs md:text-sm">
                            Sign in to access your profile
                        </p>
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
                // label: (
                //     <Space>
                //         <Text type="success" strong style={{ fontSize: 12 }}>
                //             ✓ Logged in
                //         </Text>
                //     </Space>
                // ),
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
                        <LogoutOutlined style={{ color: 'var(--color-attention)' }}/>
                        <p className="text-attention font-bold text-xs md:text-sm">Logout</p>
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
                <ConnectButton />
            </div>
        );
    }

    // If the wallet is connected, display ConnectButtonComponent and additional dropdown menu
    // ConnectButtonComponent handles wallet functionality (opens AccountModal)
    // Dropdown menu provides SIWE and Profile related functionality
    return (
        <div ref={dropdownRef} className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, position: 'relative' }}>
            <ConnectButton showBalance={false} accountStatus="address"/>
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
                            <div style={{ margin: '-15px' }}>
                                <AlertCustom
                                    type="warning"
                                    message="Unlogged"
                                    showIcon={false}
                                    enablePulse={true}
                                    style={{
                                        padding: '5px 8px',
                                        fontSize: '12px',
                                        lineHeight: '1.5',
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
