"use client"

import React from "react";
import TextSpan from "../base/textSpan";
import { cn } from "@/lib/utils";
import BoxContainer, { colorStyle } from "../base/boxContainer";

interface Data {
    icon: React.ReactNode;
    title: string;
    text: string;
    color?: colorStyle;
}

interface Props { 
    data: Data;
    className?: string; 
}

export default function AdvaceCard({ 
    data, 
    className 
}: Props) {
    const { icon, title, text} = data;

    // 如果有color，则使用color，否则使用green
    const colors: colorStyle = data.color || "green";

    return (
        <BoxContainer
            color={colors}
            className={cn(
            "flex p-4 flex-col w-full mix-w-[150px] max-w-[250px]",
            className
        )}>
            <div className={cn(
                "mb-4 mt-4 w-12 h-12",
                "flex items-center justify-center",
                `border-1 border-${colors}-500 rounded-md text-${colors}-500`,
                `bg-${colors}-500/10 `,
                "text-2xl"
            )}>
                {React.isValidElement(icon)
                    ? React.cloneElement(
                        icon as React.ReactElement<any>,
                        typeof icon.type === "string"
                            ? { className: cn("w-7 h-7", (icon.props as any).className), style: { fontSize: "1.75rem", ...(icon.props as any).style } }
                            : { className: cn("w-7 h-7", (icon.props as any).className) }
                    )
                    : icon}
            </div>
            <p className="font-mono text-sm md:text-base mb-2 text-gray-300">
                {title}
            </p>
            <p className="text-gray-400 text-xs md:text-sm">
                {text}
            </p>
        </BoxContainer>
    );
}


