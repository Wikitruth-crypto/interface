"use client"

import InputLabel from '@/dapp/components/inputLabel';
import { useLabelInput } from '@dapp/pages/Create/hooks/Input/useLabelInput';
import { cn } from '@/lib/utils';

interface InputLabelCreateProps {
    className?: string;
}

/**
 * 标签输入组件 (重构版)
 * 使用 React Hook Form 进行验证
 */
const InputLabelCreate: React.FC<InputLabelCreateProps> = ({
    className
}) => {
    const { labels, handleLabelsChange } = useLabelInput();

    return (
        <div className={cn("w-full", className)}>
            <InputLabel
                value={labels}
                onChange={handleLabelsChange}
                maxLabels={10}
                maxLabelLength={20}
                placeholder="Enter labels separated by commas (e.g., fraud, corruption, insider trading)"
            />
            {/* Note: InputLabel 组件有自己的内部错误管理 */}
        </div>
    );
};

export default InputLabelCreate;