import React from 'react';
import { usePriceInput } from '../hooks/Input/usePriceInput';
import { useSupportedTokens } from '@/dapp/contractsConfig';
import { cn } from '@/lib/utils';
import { InputNumber } from 'antd';
import { useCreateForm } from '../context/CreateFormContext';

interface InputPriceCreateProps {
    className?: string;
}

/**
 * 价格输入组件 (重构版 v2)
 * 使用 React Hook Form 进行验证
 * 
 * 关键修复：
 * - 统一的验证逻辑，无冲突
 * - 更好的 UI 反馈
 * - 正确绑定 onBlur 事件
 * - 根据 mintMethod 动态显示是否必填
 */
export const InputPriceCreate: React.FC<InputPriceCreateProps> = ({className}) => {
    const { inputValue, handlePriceChange, handleBlur, error } = usePriceInput();
    const supportedTokens = useSupportedTokens();
    const form = useCreateForm();
    const mintMethod = form.watch('mintMethod');
    
    // 判断 price 是否必填
    const isRequired = mintMethod === 'create';

    return (
        <div className={cn("flex w-full lg:max-w-md space-y-2", className)}>
            <div className="flex flex-col w-full gap-2">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">Price:</span>
                    {isRequired && <span className="text-xs text-error">*</span>}
                    {!isRequired && <span className="text-xs text-muted-foreground">(Optional for Publish)</span>}
                </div>
                <div className="flex items-center w-full">
                    <InputNumber
                        onChange={(value) => handlePriceChange(value || '')}
                        onBlur={handleBlur} // ✅ 绑定失焦事件
                        value={inputValue}
                        controls={false}
                        min="0.001"
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
