"use client"

import InputLabel from '@/components/inputLabel';
import { useLabelInput } from '@Create/hooks/Input/useLabelInput';
import { cn } from '@/lib/utils';

interface InputLabelCreateProps {
    className?: string;
}


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
        </div>
    );
};

export default InputLabelCreate;