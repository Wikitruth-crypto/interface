


import { useState, useCallback } from 'react';

export const useNumberInput = (decimals: number = 3) => {

    const [value, setValue] = useState('');
    // 处理输入变更
    const handleNumberChange = useCallback((value: string | number | null | undefined) => {
        // 确保 value 是字符串类型
        let stringValue: string;
        if (value === null || value === undefined) {
            stringValue = '';
        } else if (typeof value === 'number') {
            stringValue = String(value);
        } else {
            stringValue = value;
        }

        // 允许清空输入框
        if (stringValue === '') {
            setValue('');
            return;
        }

        // 处理数字和小数点的正则
        const decimalRegex = new RegExp(`^\\d*\\.?\\d{0,${decimals}}$`);
        const leadingZeroRegex = /^0\d+/;  // 检测0开头后面跟数字的情况

        // 处理0开头的情况
        if (leadingZeroRegex.test(stringValue)) {
            stringValue = stringValue.replace(/^0+/, ''); // 去掉前导0
        }

        // 特殊处理"0."开头的情况
        if (stringValue.startsWith('0.') || stringValue === '0') {
            if (decimalRegex.test(stringValue)) {
                setValue(stringValue);
            }
            return;
        }

        // 验证其他数字格式
        if (decimalRegex.test(stringValue) && stringValue.charAt(0) !== '.') {
            setValue(stringValue);
        }
    }, [decimals]);

    return {
        value,
        handleNumberChange
    };
}; 