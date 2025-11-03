import { ReactNode } from "react";
// import useTheme from "@/hooks/useThemeColorClass";
import { cn } from "@/lib/utils";

interface TitleProps {
    children: ReactNode;
    size?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    color?: string;
    colorType?: "default" | "gradient";
    align?: "left" | "center" | "right";
    weight?: "normal" | "bold" | "semibold" | "extrabold";
    lineHeight?: "normal" | "tight" | "relaxed";
    tracking?: "normal" | "tight" | "relaxed";
    mt?: "none" | "small" | "medium" | "large";
    mb?: "none" | "small" | "medium" | "large";
    className?: string;
    /** 是否使用更保守的响应式尺寸 */
    conservative?: boolean;
}

export default function TitleText({ 
    children, 
    size = "h3", 
    color = "white",
    colorType = "default", 
    align = "center", 
    weight = "semibold",
    lineHeight = "normal",
    tracking = "normal",
    mt = "none",
    mb = "none",
    className = '',
    conservative = false
}: TitleProps) {

    // const { brandColor } = useBrandColorStore();
    // const { gradientColor, } = useTheme();
    
    // 渐变色配置
    // const brandText = brandColor === "green" ? "from-green-500 to-blue-300" : "from-purple-500 to-pink-300";

    // 标准尺寸映射（原有的）
    const standardSizeClasses = {
        h1: "text-4xl md:text-6xl lg:text-7xl",
        h2: "text-3xl md:text-5xl lg:text-6xl",
        h3: "text-2xl md:text-4xl lg:text-5xl",
        h4: "text-xl md:text-3xl lg:text-4xl",
        h5: "text-lg md:text-2xl lg:text-3xl",
        h6: "text-base md:text-xl lg:text-2xl"
    };

    // 保守尺寸映射（更平缓的响应式变化）
    const conservativeSizeClasses = {
        h1: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
        h2: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
        h3: "text-xl sm:text-2xl md:text-3xl lg:text-4xl",
        h4: "text-lg sm:text-xl md:text-2xl lg:text-3xl",
        h5: "text-base sm:text-lg md:text-xl lg:text-2xl",
        h6: "text-sm sm:text-base md:text-lg lg:text-xl"
    };

    // 选择使用哪种尺寸映射
    const sizeClasses = conservative ? conservativeSizeClasses : standardSizeClasses;

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

    // 颜色类名
    // const colorClasses = colorType === "gradient" 
    //     ? `bg-gradient-to-r ${gradientColor} bg-clip-text text-transparent`
    //     : `${color}`;

    // 间距类名
    let mtClasses = '';
        if (mt === "none") {
            mtClasses = '';
        } else if (mt === "small") {
            mtClasses = 'mt-2';
        } else if (mt === "medium") {
            mtClasses = 'mt-6';
        } else if (mt === "large") {
            mtClasses = 'mt-9';
        }

    let mbClasses = '';
    if (mb === "none") {
        mbClasses = '';
    } else if (mb === "small") {
        mbClasses = 'mb-2';
    } else if (mb === "medium") {
        mbClasses = 'mb-6';
    } else if (mb === "large") {
        mbClasses = 'mb-9';
    }

    // 组合所有类名 - 使用 cn 函数来合并
    const combinedClassName = cn(
        sizeClasses[size],
        alignClasses[align],
        weightClasses[weight],
        lineHeightClasses[lineHeight],
        trackingClasses[tracking],
        color,
        mtClasses,
        mbClasses,
        "font-mono",
        className // 确保外部传入的 className 最后应用
    );

    // 根据size动态渲染对应的HTML元素
    const Element = size;

    return (
        <Element className={combinedClassName}>
            {children}
        </Element>
    );
}