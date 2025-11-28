

/**
 * 格式化地址显示，省略中间部分
 * @param address 地址字符串
 * @param startLength 开头显示的长度（默认6）
 * @param endLength 结尾显示的长度（默认4）
 * @returns 格式化后的地址，如 "0x1234...5678"
 */
export const formatAddress = (address: string, startLength: number = 4, endLength: number = 4): string => {
    if (!address || address.length <= startLength + endLength) {
        return address;
    }
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};