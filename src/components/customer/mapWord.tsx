'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { MAP_1, MAP_2, MAP_3 } from './map';

interface MapWordProps {
    type?: 'map1' | 'map2' | 'map3';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    opacity?: number;
    animated?: boolean;
    blur?: boolean;
    className?: string;
}

const sizeClasses = {
    sm: 'text-xs leading-tight',
    md: 'text-sm leading-tight',
    lg: 'text-base leading-tight',
    xl: 'text-lg leading-tight',
};

export default function MapWord({
    type = 'map1',
    size = 'md',
    opacity = 0.5,
    animated = false,
    blur = false,
    className,
}: MapWordProps) {
    const mapLines = useMemo(() => {
        switch (type) {
            case 'map2':
                return MAP_2;
            case 'map3':
                return MAP_3;
            default:
                return MAP_1;
        }
    }, [type]);

    return (
        <div className={cn('relative w-full h-full overflow-hidden', className)}>
            <div
                className={cn(
                    'font-mono font-bold select-none whitespace-pre',
                    sizeClasses[size],
                    'text-primary',
                    animated && 'animate-pulse',
                    'transition-all duration-300 ease-in-out'
                )}
                style={{
                    opacity,
                    filter: blur ? 'blur(1px)' : 'none',
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-foreground))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animationDelay: animated ? '0.5s' : '0s',
                }}
            >
                {mapLines.map((line, lineIndex) => (
                    <div key={lineIndex} className="block">
                        {line}
                    </div>
                ))}
            </div>
        </div>
    );
}

