

/**
 * 创建一个美观的渐变边框的盒子容器，用于展示内容
 * 使用伪元素实现真正的渐变边框效果
 * 支持多种颜色和渐变方向，可自定义透明度
 */

import { cn } from "@/lib/utils";

export type colorStyle = "red" | "orange" | "yellow" | "green" | "blue" | "cyan" | "purple" | "pink"| "white" | "black";
type gradientDirection = "to-r" | "to-l" | "to-t" | "to-b" | "to-tr" | "to-tl" | "to-br" | "to-bl";

interface opacityStyle {
    start: number;
    middle: number;
    end: number;
}

interface BoxGradientBorderProps {
    children: React.ReactNode;
    className?: string;
    className2?: string;
    // 透明度调整
    opacity?: opacityStyle;
    color?: colorStyle;
    // radius?: "none" | "sm" | "md" | "lg" | "full";
    direction?: gradientDirection;
    borderWidth?: "1px" | "2px" | "3px" | "4px";
}

export default function BoxGradientBorder({ 
    children, 
    className, 
    className2,
    opacity = {start: 0.5, middle: 0.5, end: 0.5},
    color = "purple",
    // radius = "md",
    direction = "to-r",
    borderWidth = "2px",
}: BoxGradientBorderProps) {

    // 圆角样式映射
    // const radiusMap = {
    //     none: "rounded-none",
    //     sm: "rounded-sm",
    //     md: "rounded-md",
    //     lg: "rounded-lg",
    //     full: "rounded-full",
    // };

    // 渐变色彩映射 - 使用RGB值（不含透明度）
    const gradientColors = {
        red: ["rgb(248, 113, 113)", "rgb(252, 165, 165)", "rgb(239, 68, 68)"],
        orange: ["rgb(251, 146, 60)", "rgb(253, 186, 116)", "rgb(249, 115, 22)"],
        yellow: ["rgb(250, 204, 21)", "rgb(253, 224, 71)", "rgb(202, 138, 4)"],
        green: ["rgb(74, 222, 128)", "rgb(134, 239, 172)", "rgb(34, 197, 94)"],
        blue: ["rgb(96, 165, 250)", "rgb(147, 197, 253)", "rgb(59, 130, 246)"],
        cyan: ["rgb(34, 211, 238)", "rgb(103, 232, 249)", "rgb(6, 182, 212)"],
        purple: ["rgb(168, 85, 247)", "rgb(196, 181, 253)", "rgb(147, 51, 234)"],
        pink: ["rgb(236, 72, 153)", "rgb(244, 114, 182)", "rgb(219, 39, 119)"],
        white: ["rgb(255, 255, 255)", "rgb(229, 231, 235)", "rgb(255, 255, 255)"],
        black: ["rgb(75, 85, 99)", "rgb(107, 114, 128)", "rgb(55, 65, 81)"]
    };

    // 获取样式类
    // const radiusClass = radiusMap[radius];
    const colors = gradientColors[color];

    // 构建渐变CSS - 支持透明度
    const getGradientCSS = () => {
        const directionMap = {
            "to-r": "to right",
            "to-l": "to left", 
            "to-t": "to top",
            "to-b": "to bottom",
            "to-tr": "to top right",
            "to-tl": "to top left",
            "to-br": "to bottom right",
            "to-bl": "to bottom left"
        };
        
        // 将RGB值转换为RGBA，应用透明度
        const rgbaColors = [
            colors[0].replace('rgb', 'rgba').replace(')', `, ${opacity.start})`),
            colors[1].replace('rgb', 'rgba').replace(')', `, ${opacity.middle})`),
            colors[2].replace('rgb', 'rgba').replace(')', `, ${opacity.end})`)
        ];
        
        return `linear-gradient(${directionMap[direction]}, ${rgbaColors[0]}, ${rgbaColors[1]}, ${rgbaColors[2]})`;
    };

    return (
        <div 
            className={cn(
                "relative",
                // radiusClass,
                className
            )}
            style={{
                padding: borderWidth,
                background: getGradientCSS()
            }}
        >
            <div className={cn(
                "w-full h-full rounded-[inherit] bg-black",
            )}>

            {/* 内容容器 */}
            <div className={cn(
                "w-full h-full rounded-[inherit] bg-background",
                className2
            )}>
                {children}
            </div>
            </div>

        </div>
    )
}