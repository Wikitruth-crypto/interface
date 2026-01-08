"use client"

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import StatusStepFlow from './base/statusStepFlow';
import { BoxStatus,} from '@dapp/types/typesDapp/contracts/truthBox';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface StatusStepProps {
    status: BoxStatus;
    listedMode?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    responsive?: boolean;
    showBackground?: boolean;
    showIndicator?: boolean;
    enableHorizontalScroll?: boolean;
}

const StatusStep: React.FC<StatusStepProps> = ({ 
    status,
    listedMode,
    className,
    size = 'md',
    responsive = true,
    showBackground = true,
    showIndicator = true,
    enableHorizontalScroll = false
}) => {

    // Return different inner container styles based on whether scrolling is enabled
    const getInnerContainerStyle = () => {
        if (enableHorizontalScroll) {
            return {
                overflowX: 'auto' as const,
                overflowY: 'hidden' as const,
                width: '100%'
            };
        }
        return {
            width: '100%',
            overflow: 'hidden' as const
        };
    };

    // If listedMode != 'Auctioning', then equals 'Selling'
    const getListedMode = () => {
        if (listedMode !== 'Auctioning') {
            return 'Selling';
        }
        return listedMode;
    };

    // Determine content container style based on whether scrolling is enabled
    const getContentStyle = () => {
        if (enableHorizontalScroll) {
            // When scrolling is enabled, use flex center, ensure center display on large screens
            return {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minWidth: 'fit-content',
                width: 'max-content'
            };
        }
        return {
            width: '100%',
            height: '100%'
        };
    };

    // const statusOptions: BoxStatus[] = [
    //     'Storing', 'Selling', 'Auctioning',
    //     'Paid', 'Refunding', 'InSecrecy', 'Published'
    // ];

    // Automatically scroll to the corresponding position (x-axis) based on the status value passed in
    const scrollToStatus = (status: BoxStatus) => {
        // const statusIndex = statusOptions.indexOf(status);
        const statusElement = document.querySelector(`#status-step-flow-${status}`);
        if (statusElement) {
            statusElement.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
    };

    // When the component is mounted, automatically scroll to the corresponding status
    useEffect(() => {
        if (enableHorizontalScroll) {
            scrollToStatus(status);
        }
    }, [enableHorizontalScroll, status]);


    return (
        <div 
            className={cn(
                "bg-background relative",
                className
            )}
            style={{ width: '100%', position: 'relative' }}
        >
            {/* Arrow indicator - fixed outside container */}
            {enableHorizontalScroll && showIndicator && (
                <>
                    {/* Left arrow indicator */}
                    <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-background via-background/80 to-transparent z-10 flex items-center justify-start pl-1 pointer-events-none">
                        <ArrowLeft className="w-4 h-4 text-muted-foreground/60 animate-pulse" />
                    </div>
                    
                    {/* Right arrow indicator */}
                    <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-background via-background/80 to-transparent z-10 flex items-center justify-end pr-1 pointer-events-none">
                        <ArrowRight className="w-4 h-4 text-muted-foreground/60 animate-pulse" />
                    </div>
                </>
            )}
            
            {/* Inner scroll container */}
            <div 
                className={cn(
                    enableHorizontalScroll && "status-step-flow-container" // Apply scroll bar style
                )}
                style={getInnerContainerStyle()}
            >
                <div style={getContentStyle()}>
                    <StatusStepFlow
                        status={status}
                        listedMode={getListedMode()}
                        size={size}
                        responsive={responsive}
                        showBackground={showBackground}
                        fixedSize={enableHorizontalScroll} // Use fixed size when scrolling is enabled
                    />
                </div>
            </div>
        </div>
    );
};

export default StatusStep;
