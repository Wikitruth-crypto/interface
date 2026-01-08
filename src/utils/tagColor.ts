/**
 * List of supported colors for Ant Design Tag
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
 * Generate a stable color index based on the address
 * Use a simple hash algorithm to ensure the same address always returns the same color
 * 
 * @param address - Address string (e.g. token contract address)
 * @returns Ant Design Tag color name
 * 
 * @example
 * getColorByAddress('0x1234...') // "cyan"
 */
export const getColorByAddress = (address: string): string => {
    // Convert address to number and take modulo to ensure consistent color on each render
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
        hash = ((hash << 5) - hash) + address.charCodeAt(i);
        hash = hash & hash; // Convert to 32-bit integer
    }
    const index = Math.abs(hash) % TAG_COLORS.length;
    return TAG_COLORS[index];
};

