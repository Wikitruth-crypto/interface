"use client";
// import { useBrandColorStore } from "@/store/storeBrandColor";
import { ReactNode } from "react";
import { Button } from 'antd';
import { cn } from "@/lib/utils";

interface ButtonProps {
    children: ReactNode;
    icon?: ReactNode;
    size?: 'large' | 'small' | 'medium' | 'default';
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    disabled?: boolean;
    onClick?: () => void;
    loading?: boolean;
    className?: string;
}

export default function BaseButton({
    children,
    icon,
    size = "default",
    variant = "default",
    disabled = false,
    onClick,
    loading = false,
    className,
}: ButtonProps) {

    // Handle size mapping to antd Button size
    const getAntdSize = (): "large" | "middle" | "small" => {
        switch (size) {
            case "large":
                return "large";
            case "small":
                return "small";
            case "medium":
            case "default":
            default:
                return "middle";
        }
    };

    // Handle variant mapping to antd Button type
    const getButtonType = (): "primary" | "default" | "dashed" | "text" | "link" => {
        switch (variant) {
            case "default":
                return "primary";
            case "outline":
                return "dashed";
            case "ghost":
                return "text";
            case "secondary":
                return "default";
            case "destructive":
                return "primary";
            case "link":
                return "link";
            default:
                return "default";
        }
    };

    const isDangerous = variant === "destructive";

    return (
        <Button
            type={getButtonType()}
            size={getAntdSize()}
            disabled={disabled || loading}
            onClick={loading || disabled ? undefined : onClick}
            danger={isDangerous}
            loading={loading}
            className={cn(
                "inline-flex items-center gap-2 font-semibold transition-all duration-200",
                className
            )}
        >
            {icon && !loading && (
                <span className="flex-shrink-0">
                    {icon}
                </span>
            )}
            <span className="truncate">
                {children}
            </span>
        </Button>
    );
}



