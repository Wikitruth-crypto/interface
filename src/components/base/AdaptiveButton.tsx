"use client";
// import { useBrandColorStore } from "@/store/storeBrandColor";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from 'antd';
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * This is an adaptive button component that automatically adjusts the button style based on screen size.
 */

interface AdaptiveButtonProps {
    children: ReactNode;
    icon: ReactNode;
    direction?: "left" | "right";
    variant?: "solid" | "outline" | "text";
    size?: "sm" | "default" | "lg" | "icon";
    disabled?: boolean;
    onClick?: () => void;
    loading?: boolean;
    className?: string;
    hideTextOnMobile?: boolean;
}

export default function AdaptiveButton({
    children,
    icon,
    direction = "left",
    variant = "solid",
    size = "default",
    disabled = false,
    onClick,
    loading = false,
    className,
    hideTextOnMobile = true,
}: AdaptiveButtonProps) {
    const isMobile = useIsMobile();

    const shouldShowText = !hideTextOnMobile || !isMobile;

    const getAntdSize = (): "large" | "middle" | "small" => {
        if (hideTextOnMobile && isMobile) {
            return "small";
        }
        switch (size) {
            case "sm":
                return "small";
            case "lg":
                return "large";
            case "icon":
                return "small";
            case "default":
            default:
                return "middle";
        }
    };

    const getButtonType = (): "primary" | "default" | "dashed" | "text" | "link" => {
        switch (variant) {
            case "solid":
                return "primary";
            case "outline":
                return "dashed";
            case "text":
                return "text";
            default:
                return "default";
        }
    };

    return (
        <Button
            type={getButtonType()}
            size={getAntdSize()}
            disabled={disabled || loading}
            onClick={onClick}
            loading={loading}
            className={cn(
                "inline-flex items-center gap-1 font-medium transition-all",
                shouldShowText ? "px-2" : "",
                className
            )}
        >

            {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (

                <>
                    {direction === "left" && icon}

                    {hideTextOnMobile ? (
                        shouldShowText && <span>{children}</span>
                    ) : (
                        <span className="hidden sm:inline">{children}</span>
                    )}

                    {direction === "right" && icon}
                </>
            )}
        </Button>
    );
}



