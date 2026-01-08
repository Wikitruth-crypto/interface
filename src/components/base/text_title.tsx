import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
    children: ReactNode;
    className?: string;
}

export default function TextTitle({ children, className }: Props) {
    return (
        <p className={cn("text-xs text-white/80 md:text-md lg:text-base", className)}>
            {children}
        </p>
    );
}


