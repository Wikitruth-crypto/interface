import React from 'react';
import { useSiweAuth } from '@dapp/hooks/SiweAuth';

/**
 * SIWE 登录按钮组件属性
 */
export interface SiweLoginButtonProps {
    /** 按钮文本（登录状态） */
    loginText?: string;
    /** 按钮文本（登出状态） */
    logoutText?: string;
    /** 加载中文本 */
    loadingText?: string;
    /** 按钮样式类名 */
    className?: string;
    /** 登录成功回调 */
    onLoginSuccess?: (token: string) => void;
    /** 登出回调 */
    onLogout?: () => void;
    /** 显示用户地址 */
    showAddress?: boolean;
}

/**
 * SIWE 登录按钮组件
 * 
 * 提供一键式 SIWE 登录功能
 * 
 * @example
 * ```tsx
 * <SiweLoginButton
 *   onLoginSuccess={(token) => {
 *     console.log('登录成功:', token);
 *   }}
 *   showAddress={true}
 * />
 * ```
 */
export const SiweLoginButton: React.FC<SiweLoginButtonProps> = ({
    loginText = '使用钱包登录',
    logoutText = '登出',
    loadingText = '登录中...',
    className,
    onLoginSuccess,
    onLogout,
    showAddress = false
}) => {
    const {
        login,
        logout,
        session,
        isLoading,
        error
    } = useSiweAuth();

    const handleLogin = async () => {
        const result = await login();
        if (result && onLoginSuccess) {
            onLoginSuccess(result.token);
        }
    };

    const handleLogout = () => {
        logout();
        onLogout?.();
    };

    // 已登录状态
    if (session.isLoggedIn) {
        return (
            <div className={`inline-flex flex-col gap-2 ${className || ''}`}>
                {showAddress && session.address && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {session.address.slice(0, 6)}...{session.address.slice(-4)}
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 
                             transition-colors font-medium"
                >
                    {logoutText}
                </button>
            </div>
        );
    }

    // 未登录状态
    return (
        <div className={`inline-flex flex-col gap-2 ${className || ''}`}>
            <button
                onClick={handleLogin}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors font-medium"
            >
                {isLoading ? loadingText : loginText}
            </button>
            
            {error && (
                <div className="text-sm text-red-600 dark:text-red-400">
                    {error.message}
                </div>
            )}
        </div>
    );
};

