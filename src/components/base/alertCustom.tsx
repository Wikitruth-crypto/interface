import React from 'react';
import { Alert, theme, type AlertProps } from 'antd';

const { useToken } = theme;

export interface AlertCustomProps extends AlertProps {
    enablePulse?: boolean;
}

/**
 * Custom Alert Component
 * It has a breathing animation effect, making it more noticeable
 * Uses box-shadow projection to implement breathing effect, simple and reliable
 */
const AlertCustom: React.FC<AlertCustomProps> = ({
    enablePulse = true,
    className,
    style,
    type,
    ...alertProps
}) => {
    const { token } = useToken();

    // Get the corresponding color based on the Alert type
    const getAlertColor = (alertType?: AlertProps['type']): string => {
        switch (alertType) {
            case 'success':
                return token.colorSuccess || '#52c41a';
            case 'error':
                return token.colorError || '#ff4d4f';
            case 'warning':
                // Warning color may be in token in Ant Design 5.x
                return (token as any).colorWarning || '#faad14';
            case 'info':
                return token.colorInfo || token.colorPrimary || '#1677ff';
            default:
                return token.colorPrimary || '#1677ff';
        }
    };

    const pulseColor = getAlertColor(type);

    // Convert color to rgba format, used for box-shadow transparency
    const colorToRgba = (color: string, alpha: number): string => {
        // If it is in rgba format, directly replace the alpha value
        if (color.startsWith('rgba')) {
            return color.replace(/[\d.]+(?=\))/, alpha.toString());
        }
        // If it is in rgb format, convert to rgba
        if (color.startsWith('rgb')) {
            return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
        }
        // If it is in hexadecimal format, convert to rgba
        if (color.startsWith('#')) {
            const hex = color.slice(1);
            const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2), 16);
            const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4), 16);
            const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        // Default return original color
        return color;
    };

    // Generate a unique className to avoid style conflicts
    const pulseClassName = enablePulse ? `alert-custom-pulse-${type || 'default'}` : '';

    // Generate animation styles
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
        // Margin is 10px
        <div className="m-3">
            <Alert
                {...alertProps}
                type={type}
                className={`${pulseClassName} ${className || ''}`}
                style={style}
            />
            {/* Define breathing projection animation */}
            {enablePulse && (
                <style>{pulseAnimationStyles}</style>
            )}
        </div>
    );
};

export default AlertCustom;
