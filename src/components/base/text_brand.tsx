
import { PROJECT_NAME } from "@/project";
import { cn } from "@/lib/utils";


interface TextBrandProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

export default function TextBrand({ size = "md", className }: TextBrandProps) {
    const sizeClasses = {
        sm: "text-sm md:text-base lg:text-lg",
        md: "text-base md:text-lg lg:text-xl",
        lg: "text-lg md:text-xl lg:text-2xl",
    };

    return (

    <h5 className={cn("font-brand", sizeClasses[size], className)}>
        {PROJECT_NAME.full}
    </h5>

    );
}


