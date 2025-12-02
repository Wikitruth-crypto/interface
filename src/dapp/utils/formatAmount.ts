import { formatUnits } from "viem";
/**
 * 格式化代币金额
 * 
 * @param amount - 金额值，可以是 string、bigint 或 number
 * @param decimals - 代币精度，默认 18
 * @param decimalLength - 显示的小数位数，默认 3
 * @param thousandSeparator - 是否显示千位分隔符，默认 true（当前未实现）
 * @returns 格式化后的金额字符串
 * 
 * @example
 * formatAmount(1000000000000000000n, 18) // "1.000"
 * formatAmount(1500000n, 18) // "1.50K"
 * formatAmount(2500000000n, 18) // "2.50M"
 */
export function formatAmount(
    amount: string | bigint | number, 
    decimals: number = 18, 
    decimalLength: number = 3,
    // thousandSeparator: boolean = true,
): string {
    if (!amount || amount === '0' || amount === '0n') {
        return '0.000';
    }

    try {
        // 如果是 BigInt 格式的字符串，先转换为 BigInt
        const amountBigInt = typeof amount === 'string' && amount.includes('n') 
            ? BigInt(amount.replace('n', ''))
            : typeof amount === 'string' 
                ? BigInt(amount)
                : typeof amount === 'bigint'
                    ? amount
                    : BigInt(Math.floor(amount));

        // 使用 viem 的 formatUnits 格式化，将基础单位转换为小数
        const formatted = formatUnits(amountBigInt, decimals);
        const numValue = parseFloat(formatted);

        // 根据金额大小选择合适的显示格式
        if (numValue >= 1e6) {
            return `${(numValue / 1e6).toFixed(2)}M`;
        }
        if (numValue >= 1e3) {
            return `${(numValue / 1e3).toFixed(2)}K`;
        }

        // 使用指定的 decimalLength，而不是硬编码的 3
        return numValue.toFixed(decimalLength);
    } catch (error) {
        console.error('Failed to format amount:', error);
        return '0.000';
    }
}