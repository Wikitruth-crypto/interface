import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
    children: React.ReactNode;
    className?: string;
}

export const ButtonContainer: React.FC<Props> = ({ children, className }) => {
    return (
        <div className={cn('flex flex-col md:flex-row w-full ',
            'p-2 items-center gap-2 ',
        'bg-background rounded-md md:rounded-xl', 
        className
        )}>
            {children}
        </div>
    );
};