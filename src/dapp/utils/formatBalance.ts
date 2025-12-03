/**
 * 格式化余额显示为指定小数位数
 * 数据已经是格式化后的字符串，只需要处理小数点位数
 * 
 * @param balance - 余额字符串（已格式化的）
 * @param decimalPlaces - 小数位数，默认 3
 * @returns 格式化后的余额字符串
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

