


import { useState, useCallback } from 'react';

export const useNumberInput = (decimals: number = 3) => {

    const [value, setValue] = useState('');
    // 处理输入变更
    const handleNumberChange = useCallback((value: string, ) => {
        // 允许清空输入框
        if (value === '') {
            setValue('');
            return;
        }

        // 处理数字和小数点的正则
        const decimalRegex = new RegExp(`^\\d*\\.?\\d{0,${decimals}}$`);
        const leadingZeroRegex = /^0\d+/;  // 检测0开头后面跟数字的情况

        // 处理0开头的情况
        if (leadingZeroRegex.test(value)) {
            value = value.replace(/^0+/, ''); // 去掉前导0
        }

        // 特殊处理"0."开头的情况
        if (value.startsWith('0.') || value === '0') {
            if (decimalRegex.test(value)) {
                setValue(value);
            }
            return;
        }

        // 验证其他数字格式
        if (decimalRegex.test(value) && value.charAt(0) !== '.') {
            setValue(value);
        }
    }, []);

    return {
        value,
        handleNumberChange
    };
}; 