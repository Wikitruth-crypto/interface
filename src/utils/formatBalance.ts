/**
 * Format balance display to specified decimal places
 * Data is already a formatted string, only need to handle decimal places
 * 
 * @param balance - Balance string (already formatted)
 * @param decimalPlaces - Decimal places, default 3
 * @returns Formatted balance string
 * 
 * @example
 * formatBalance('123.456789') // "123.457"
 * formatBalance('0.1', 2) // "0.10"
 */
export const formatBalance = (balance: string, decimalPlaces: number = 3): string => {
    try {
        const num = parseFloat(balance);
        if (isNaN(num)) return balance;
        return num.toFixed(decimalPlaces);
    } catch (error) {
        return balance;
    }
};

