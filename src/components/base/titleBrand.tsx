import { ReactNode } from "react";
// import useTheme from "@/hooks/useThemeColorClass";

interface TitleProps {
    children: ReactNode;
    size?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    align?: "left" | "center" | "right";
    lineHeight?: "normal" | "tight" | "relaxed";
    tracking?: "normal" | "tight" | "relaxed";
    mt?: "none" | "small" | "medium" | "large";
    mb?: "none" | "small" | "medium" | "large";
}

export default function TitleBrand({ 
    children, 
    size = "h1", 
    align = "center", 
    lineHeight = "normal",
    tracking = "normal",
    mt = "none",
    mb = "none"
}: TitleProps) {

    // const { brandColor } = useBrandColorStore();
    // const { gradientColor, } = useTheme();
    
    // 尺寸映射
    const sizeClasses = {
        h1: "text-4xl md:text-6xl lg:text-7xl",
        h2: "text-3xl md:text-5xl lg:text-6xl",
        h3: "text-2xl md:text-4xl lg:text-5xl",
        h4: "text-xl md:text-3xl lg:text-4xl",
        h5: "text-lg md:text-2xl lg:text-3xl",
        h6: "text-base md:text-xl lg:text-2xl"
    };

    // 对齐方式
    const alignClasses = {
        left: "text-left",
        center: "text-center",
        right: "text-right"
    };

    // 字重
    const weightClasses = {
        normal: "font-normal",
        bold: "font-bold",
        semibold: "font-semibold",
        extrabold: "font-extrabold"
    };

    // 行高
    const lineHeightClasses = {
        normal: "leading-normal",
        tight: "leading-tight",
        relaxed: "leading-relaxed"
    };

    // 字间距
    const trackingClasses = {
        normal: "tracking-normal",
        tight: "tracking-tight",
        relaxed: "tracking-wide"
    };

    // 间距类名
    const mtClasses = {
        none: "",
        small: "mt-2",
        medium: "mt-4",
        large: "mt-6"
    };

    const mbClasses = {
        none: "",
        small: "mb-2",
        medium: "mb-4",
        large: "mb-6"
    };

    // 颜色类名
    // const colorClasses = colorType === "gradient" 
    //     ? `bg-gradient-to-r ${gradientColor} bg-clip-text text-transparent`
    //     : "text-current";

    // 组合所有类名
    const className = `
        ${sizeClasses[size]}
        ${alignClasses[align]}
        ${lineHeightClasses[lineHeight]}
        ${trackingClasses[tracking]}
        text-primary
        ${mtClasses[mt]}
        ${mbClasses[mb]}
        font-logo

    `.trim().replace(/\s+/g, ' ');

    // 根据size动态渲染对应的HTML元素
    const Element = size;

    return (
        <Element className={className}>
            {children}
        </Element>
    );
}