import React from 'react';
import { Statistic } from 'antd';
import { cn } from '@/lib/utils';
import TextP from '@/components/base/text_p';

export interface DataType {
    label: string;
    value: number;
    suffix?: string;
}

interface Props {
    data: DataType;
    variant?: "default" | "outline" | "card"; 
    size?: "sm" | "default" | "lg";
    className?: string;
    minWidth?: string;
}

export default function DataLabel({
    data,
    variant = "default",
    size = "default",
    className,
    minWidth
}: Props) {

    const getSizeStyles = () => {
        switch (size) {
            case "sm":
                return {
                    padding: "8px",
                    titleFontSize: 12,
                    valueFontSize: 18,
                    minWidth: minWidth || "120px"
                };
            case "lg":
                return {
                    padding: "24px",
                    titleFontSize: 16,
                    valueFontSize: 32,
                    minWidth: minWidth || "180px"
                };
            default:
                return {
                    padding: "16px",
                    titleFontSize: 14,
                    valueFontSize: 24,
                    minWidth: minWidth || "150px"
                };
        }
    };

    // Get variant styles
    const getVariantClasses = () => {
        switch (variant) {
            case "outline":
                return "border border-border rounded-lg hover:border-primary/50 hover:bg-accent/30";
            case "card":
                return "bg-card border border-border rounded-lg shadow-sm hover:shadow-md";
            default:
                return "rounded-lg hover:bg-accent/20";
        }
    };

    const sizeStyles = getSizeStyles();

    return (
        <div
            className={cn(
                "transition-all duration-200",
                getVariantClasses(),
                className
            )}
            style={{
                padding: `${sizeStyles.padding}`,
                minWidth: sizeStyles.minWidth
            }}
        >
            <TextP>
                {data.label}
            </TextP>
            <Statistic
                value={data.value}
                suffix={data.suffix}
                valueStyle={{ fontSize: sizeStyles.valueFontSize }}
                style={{ fontWeight: 'bold' }}
            />
        </div>
    );
};



