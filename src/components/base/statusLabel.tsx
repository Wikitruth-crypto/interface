"use client"

import { cn } from "@/lib/utils";


export interface StatusLabelProps {
    status: string;
    className?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    responsive?: boolean;
}

export default function StatusLabel({
    status,
    className,
    disabled = false,
    size = 'md',
    responsive = true
}: StatusLabelProps) {
    const getStatusColorClass = () => {
        if (disabled) {
            return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }

        switch (status) {
            case 'Storing':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'Selling':
            case 'Auctioning':
                return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'Paid':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'Refunding':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'InSecrecy':
                return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'Published':
                return 'bg-lime-500/20 text-lime-400 border-lime-500/30';
            default:
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        }
    };

    const getSizeClass = () => {
        switch (size) {
            case 'sm':
                return 'text-xs px-1.5 py-0.5';
            case 'lg':
                return 'text-base px-2.5 py-1';
            default:
                return 'text-sm px-2 py-0.5';
        }
    };

    return (
        <div
            className={cn(
                'inline-flex items-center justify-center',
                'font-mono font-medium whitespace-nowrap',
                'rounded-md border',
                getStatusColorClass(),
                getSizeClass(),
                responsive && 'text-xs sm:text-sm',
                className
            )}
            title={status}
        >
            {status}
        </div>
    );
};




