"use client";
// import { useBrandColorStore } from "@/store/storeBrandColor";
import { ReactNode } from "react";
import { FaSpinner } from "react-icons/fa";
import ButtonShadcn from "@/components/base/buttonShadcn";
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

export default function BaseButton2({
    children,
    icon,
    size = "default",
    variant = "default",
    disabled = false,
    onClick,
    loading = false,
    className,
}: ButtonProps) {

    return (
        <ButtonShadcn
            variant={variant}
            size={size}
            disabled={disabled || loading}
            onClick={loading || disabled ? undefined : onClick}
            className={cn(
                "inline-flex items-center gap-2 font-semibold transition-all duration-200",
                // getBrandStyles(),
                // getRadiusStyles(),
                loading && "cursor-wait",
                className
            )}
        >
            {loading ? (
                <>
                    {icon ? icon : <FaSpinner className="animate-spin" />}
                    wait...
                </>
            ) : (
                children
            )}
        </ButtonShadcn>
    );
}



