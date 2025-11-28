import React from 'react';
import { Alert, theme, type AlertProps } from 'antd';

const { useToken } = theme;

export interface AlertCustomProps extends AlertProps {
    /** 是否启用呼吸动画效果，默认为 true */
    enablePulse?: boolean;
}

/**
 * 自定义 Alert 组件
 * 带有呼吸动画效果，提醒更加显眼
 * 使用 box-shadow 投影实现呼吸效果，简单可靠
 */
const AlertCustom: React.FC<AlertCustomProps> = ({
    enablePulse = true,
    className,
    style,
    type,
    ...alertProps
}) => {
    const { token } = useToken();

    // 根据 Alert 的 type 获取对应的颜色
    const getAlertColor = (alertType?: AlertProps['type']): string => {
        switch (alertType) {
            case 'success':
                return token.colorSuccess || '#52c41a';
            case 'error':
                return token.colorError || '#ff4d4f';
            case 'warning':
                // Ant Design 5.x 中 warning 颜色可能在 token 中
                return (token as any).colorWarning || '#faad14';
            case 'info':
                return token.colorInfo || token.colorPrimary || '#1677ff';
            default:
                return token.colorPrimary || '#1677ff';
        }
    };

    const pulseColor = getAlertColor(type);

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

    // 生成唯一的 className，避免样式冲突
    const pulseClassName = enablePulse ? `alert-custom-pulse-${type || 'default'}` : '';

    // 生成动画样式
    const pulseAnimationStyles = enablePulse ? `
        .${pulseClassName} {
            animation: alert-custom-pulse-shadow-${type || 'default'} 2s ease-in-out infinite;
        }
        @keyframes alert-custom-pulse-shadow-${type || 'default'} {
            0%, 100% {
                box-shadow: 0 0 0 0 ${colorToRgba(pulseColor, 0.6)}, 0 0 0 0 ${colorToRgba(pulseColor, 0.4)};
            }
            50% {
                box-shadow: 0 0 0 12px ${colorToRgba(pulseColor, 0)}, 0 0 0 8px ${colorToRgba(pulseColor, 0)};
            }
        }
    ` : '';

    return (
        // 外边距为 10px
        <div className="m-3">
            <Alert
                {...alertProps}
                type={type}
                className={`${pulseClassName} ${className || ''}`}
                style={style}
            />
            {/* 定义呼吸投影动画 */}
            {enablePulse && (
                <style>{pulseAnimationStyles}</style>
            )}
        </div>
    );
};

export default AlertCustom;
