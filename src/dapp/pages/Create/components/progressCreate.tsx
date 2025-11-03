
import React from 'react';
// import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import ProgressBar from '@/dapp/components/base/progressBar';

// 创建通用的进度项组件
interface ProgressItemProps {
    title: string;
    isLoading: boolean | undefined;
    isComplete: boolean | undefined;
    progress?: number;
    error: string | null | undefined;
    showProgress: boolean;
    className?: string;
}

export const ProgressCreate: React.FC<ProgressItemProps> = ({ 
    title, 
    isLoading = false,
    isComplete = false, 
    progress = 0, 
    error = null, 
    showProgress ,
    className
}) => {


    return (
        <div className={cn("w-full space-y-2", className)}>
            <div className="flex items-center">
                <p className="text-sm text-gray-500">{title}</p>
                
                {/* 只有在有错误时才显示错误消息 */}
                {error && <p className={cn(
                    "text-sm font-medium text-red-400",
                    "px-1 leading-tight"
                )}>
                    {error}
                </p>}
            </div>
            
            {/* 进度条 */}
            {showProgress && (
                <div className="w-full">
                    <ProgressBar
                        // strokeColor="#faad14" 
                        progress={progress} 
                        size="md"
                        color={error ? "error" : isComplete ? "success" : isLoading ? "default" : "default"}
                    />
                </div>
            )}
        </div>
    );
};

export default ProgressCreate;