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
 * Floating signature button component
 * Add breathing animation effect (using box-shadow projection)
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

    // Determine button icon
    const getButtonIcon = () => {
        if (!isActive) {
            return <CloseOutlined />;
        }
        return <LoginOutlined />;
    };

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

    const pulseColor = token.colorPrimary || '#1677ff';
    const pulseClassName = isActive ? 'float-button-v2-pulse' : '';

    // Generate animation styles
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
            {/* Define breathing projection animation */}
            {isActive && (
                <style>{pulseAnimationStyles}</style>
            )}
        </div>
    );
};

export default FloatButtonV2;
