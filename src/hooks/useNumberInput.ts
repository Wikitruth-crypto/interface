


import { useState, useCallback } from 'react';

export const useNumberInput = (decimals: number = 3) => {

    const [value, setValue] = useState('');
    // Handle input changes
    const handleNumberChange = useCallback((value: string | number | null | undefined) => {
        // Ensure value is a string type
        let stringValue: string;
        if (value === null || value === undefined) {
            stringValue = '';
        } else if (typeof value === 'number') {
            stringValue = String(value);
        } else {
            stringValue = value;
        }

        // Allow clearing the input box
        if (stringValue === '') {
            setValue('');
            return;
        }

        // Handle regular expressions for numbers and decimal points
        const decimalRegex = new RegExp(`^\\d*\\.?\\d{0,${decimals}}$`);
        const leadingZeroRegex = /^0\d+/;  // Detect cases where 0 is followed by a number

        // Handle cases where 0 is at the beginning
        if (leadingZeroRegex.test(stringValue)) {
            stringValue = stringValue.replace(/^0+/, ''); // Remove leading 0
        }

        // Special handling for cases where "0." is at the beginning
        if (stringValue.startsWith('0.') || stringValue === '0') {
            if (decimalRegex.test(stringValue)) {
                setValue(stringValue);
            }
            return;
        }

        // Verify other number formats
        if (decimalRegex.test(stringValue) && stringValue.charAt(0) !== '.') {
            setValue(stringValue);
        }
    }, [decimals]);

    return {
        value,
        handleNumberChange
    };
}; 