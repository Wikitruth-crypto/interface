/**
 * Ant Design Tag 支持的颜色列表
 */
export const TAG_COLORS = [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
    'pink',
] as const;

/**
 * 根据地址生成稳定的颜色索引
 * 使用简单的哈希算法确保相同地址总是返回相同颜色
 * 
 * @param address - 地址字符串（如代币合约地址）
 * @returns Ant Design Tag 颜色名称
 * 
 * @example
 * getColorByAddress('0x1234...') // "cyan"
 */
export const getColorByAddress = (address: string): string => {
    // 将地址转换为数字并取模，确保每次渲染颜色一致
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
        hash = ((hash << 5) - hash) + address.charCodeAt(i);
        hash = hash & hash; // 转换为32位整数
    }
    const index = Math.abs(hash) % TAG_COLORS.length;
    return TAG_COLORS[index];
};

