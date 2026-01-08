import { formatUnits } from "viem";
/**
 * Format token amount
 * 
 * @param amount - Amount value, can be string, bigint or number
 * @param decimals - Token decimals, default 18
 * @param precision - Display decimal places, default 3
 * @param thousandSeparator - Whether to show thousand separator, default true (currently not implemented)
 * @returns Formatted amount string
 * 
 * @example
 * formatAmount(1000000000000000000n, 18) // "1.000"
 * formatAmount(1500000n, 18) // "1.50K"
 * formatAmount(2500000000n, 18) // "2.50M"
 */
export function formatAmount(
    amount: string | bigint | number, 
    decimals: number = 18, 
    precision: number = 3,
    // thousandSeparator: boolean = true,
): string {
    if (!amount || amount === '0' || amount === '0n') {
        return '0.000';
    }

    try {
        // If string is in BigInt format, convert to BigInt first
        const amountBigInt = typeof amount === 'string' && amount.includes('n') 
            ? BigInt(amount.replace('n', ''))
            : typeof amount === 'string' 
                ? BigInt(amount)
                : typeof amount === 'bigint'
                    ? amount
                    : BigInt(Math.floor(amount));

        // Use viem's formatUnits to format, converting base units to decimals
        const formatted = formatUnits(amountBigInt, decimals);
        const numValue = parseFloat(formatted);

        // Choose appropriate display format based on amount size
        if (numValue >= 1e6) {
            return `${(numValue / 1e6).toFixed(2)}M`;
        }
        if (numValue >= 1e3) {
            return `${(numValue / 1e3).toFixed(2)}K`;
        }

        // Use specified decimalLength instead of hardcoded 3
        return numValue.toFixed(precision);
    } catch (error) {
        console.error('Failed to format amount:', error);
        return '0.000';
    }
}