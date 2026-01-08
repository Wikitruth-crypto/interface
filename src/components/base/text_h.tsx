import { ReactNode } from "react";
// import useTheme from "@/hooks/useThemeColorClass";
import { cn } from "@/lib/utils";

interface TextHProps {
    children: ReactNode;
    size?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    align?: "left" | "center" | "right";
    weight?: "normal" | "bold" | "semibold" | "extrabold";
    lineHeight?: "normal" | "tight" | "relaxed";
    tracking?: "normal" | "tight" | "relaxed";
    mt?: "none" | "small" | "medium" | "large";
    mb?: "none" | "small" | "medium" | "large";
    className?: string;
    // Whether to use a more conservative responsive size
    conservative?: boolean;
}

export default function TextH({ 
    children, 
    size = "h3", 
    align = "center", 
    weight = "semibold",
    lineHeight = "normal",
    tracking = "normal",
    mt = "none",
    mb = "none",
    className = '',
    conservative = false
}: TextHProps) {

    // const { brandColor } = useBrandColorStore();
    // const { gradientColor, } = useTheme();

    // Standard size mapping (original)
    const standardSizeClasses = {
        h1: "text-4xl md:text-6xl lg:text-7xl",
        h2: "text-3xl md:text-5xl lg:text-6xl",
        h3: "text-2xl md:text-4xl lg:text-5xl",
        h4: "text-xl md:text-3xl lg:text-4xl",
        h5: "text-lg md:text-2xl lg:text-3xl",
        h6: "text-base md:text-xl lg:text-2xl"
    };

    // Conservative size mapping (more gradual responsive change)
    const conservativeSizeClasses = {
        h1: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
        h2: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
        h3: "text-xl sm:text-2xl md:text-3xl lg:text-4xl",
        h4: "text-lg sm:text-xl md:text-2xl lg:text-3xl",
        h5: "text-base sm:text-lg md:text-xl lg:text-2xl",
        h6: "text-sm sm:text-base md:text-lg lg:text-xl"
    };

    // Choose which size mapping to use
    const sizeClasses = conservative ? conservativeSizeClasses : standardSizeClasses;

    // Alignment method
    const alignClasses = {
        left: "text-left",
        center: "text-center",
        right: "text-right"
    };

    // Font weight
    const weightClasses = {
        normal: "font-normal",
        bold: "font-bold",
        semibold: "font-semibold",
        extrabold: "font-extrabold"
    };

    // Line height
    const lineHeightClasses = {
        normal: "leading-normal",
        tight: "leading-tight",
        relaxed: "leading-relaxed"
    };

    // Letter spacing
    const trackingClasses = {
        normal: "tracking-normal",
        tight: "tracking-tight",
        relaxed: "tracking-wide"
    };

    // Color class name
    // const colorClasses = colorType === "gradient" 
    //     ? `bg-gradient-to-r ${gradientColor} bg-clip-text text-transparent`
    //     : `${color}`;

    // Spacing class name
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

    // Combine all class names - use cn function to merge
    const combinedClassName = cn(
        sizeClasses[size],
        alignClasses[align],
        weightClasses[weight],
        lineHeightClasses[lineHeight],
        trackingClasses[tracking],
        mtClasses,
        mbClasses,
        "font-mono",
        className // Ensure the external passed className is applied last
    );

    // Dynamically render the corresponding HTML element based on size
    const Element = size;

    return (
        <Element className={combinedClassName}>
            {children}
        </Element>
    );
}