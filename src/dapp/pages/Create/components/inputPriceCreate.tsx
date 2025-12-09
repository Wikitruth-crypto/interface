import React from 'react';
import { usePriceInput } from '../hooks/Input/usePriceInput';
import { useSupportedTokens } from '@/dapp/contractsConfig';
import { cn } from '@/lib/utils';
import { InputNumber } from 'antd';
import { useCreateForm } from '../context/CreateFormContext';

interface InputPriceCreateProps {
    className?: string;
}


export const InputPriceCreate: React.FC<InputPriceCreateProps> = ({className}) => {
    const { inputValue, handlePriceChange, handleBlur, error } = usePriceInput();
    const supportedTokens = useSupportedTokens();
    const form = useCreateForm();
    const mintMethod = form.watch('mintMethod');
    
    // 判断 price 是否必填
    const isRequired = mintMethod === 'create';

    const handleInputChange = (value: string | number | null | undefined) => {
        let stringValue: string;
        if (value === null || value === undefined) {
            stringValue = '';
        } else if (typeof value === 'number') {
            stringValue = String(value);
        } else {
            stringValue = value;
        }
        handlePriceChange(stringValue);
    };

    return (
        <div className={cn("flex w-full lg:max-w-lg space-y-2", className)}>
            <div className="flex flex-col w-full gap-2">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">Price:</span>
                    {isRequired && <span className="text-xs text-error">*</span>}
                    {!isRequired && <span className="text-xs text-muted-foreground">(Optional for Publish)</span>}
                </div>
                <div className="flex items-center w-full">
                    <InputNumber
                        onChange={(value) => {
                            handleInputChange(value);
                        }}
                        onBlur={handleBlur}
                        value={inputValue ? (isNaN(Number(inputValue)) ? undefined : Number(inputValue)) : undefined}
                        controls={false}
                        min={0.001}
                        precision={3}
                        placeholder={
                            isRequired 
                                ? "Please enter the price (min: 0.001)" 
                                : "Optional - Leave empty for free"
                        }
                        suffix={<p className="ml-2">{supportedTokens[0].symbol}</p>}
                    />
                    {error && <p className="text-sm text-error font-light">{error}</p>}

                </div>
            </div>
        </div>
    );
};
