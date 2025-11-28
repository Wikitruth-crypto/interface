import React from 'react';
import { FloatButton, theme } from 'antd';
import { CloseOutlined, LoginOutlined } from '@ant-design/icons';

const { useToken } = theme;

export interface FloatSignatureButtonProps {
    isActive?: boolean;
    onClick?: () => void;
    className?: string;
}

/**
 * 悬浮签名按钮组件
 * 附加呼吸动画效果（使用 box-shadow 投影）
 */
const FloatButtonV2: React.FC<FloatSignatureButtonProps> = ({
    isActive = true,
    onClick,
    className,
}) => {
    const { token } = useToken();

    const handleToggle = () => {
        onClick?.();
    };

    // 确定按钮图标
    const getButtonIcon = () => {
        if (!isActive) {
            return <CloseOutlined />;
        }
        return <LoginOutlined />;
    };

    // 将颜色转换为 rgba 格式，用于 box-shadow 透明度
    const colorToRgba = (color: string, alpha: number): string => {
        // 如果是 rgba 格式，直接替换 alpha 值
        if (color.startsWith('rgba')) {
            return color.replace(/[\d.]+(?=\))/, alpha.toString());
        }
        // 如果是 rgb 格式，转换为 rgba
        if (color.startsWith('rgb')) {
            return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
        }
        // 如果是十六进制格式，转换为 rgba
        if (color.startsWith('#')) {
            const hex = color.slice(1);
            const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2), 16);
            const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4), 16);
            const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        // 默认返回原色
        return color;
    };

    const pulseColor = token.colorPrimary || '#1677ff';
    const pulseClassName = isActive ? 'float-button-v2-pulse' : '';

    // 生成动画样式
    const pulseAnimationStyles = isActive ? `
        .float-button-v2-pulse {
            animation: float-button-v2-pulse-shadow 2s ease-in-out infinite;
        }
        @keyframes float-button-v2-pulse-shadow {
            0%, 100% {
                box-shadow: 0 0 0 0 ${colorToRgba(pulseColor, 0.6)}, 0 0 0 0 ${colorToRgba(pulseColor, 0.4)};
            }
            50% {
                box-shadow: 0 0 0 12px ${colorToRgba(pulseColor, 0)}, 0 0 0 8px ${colorToRgba(pulseColor, 0)};
            }
        }
    ` : '';

    return (
        <div>
            <FloatButton
                icon={getButtonIcon()}
                type="primary"
                onClick={handleToggle}
                className={`${pulseClassName} ${className || ''}`}
                style={{
                    top: '50%',
                }}
            />
            {/* 定义呼吸投影动画 */}
            {isActive && (
                <style>{pulseAnimationStyles}</style>
            )}
        </div>
    );
};

export default FloatButtonV2;
