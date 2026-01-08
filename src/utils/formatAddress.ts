

/**
 * Format address display, omitting the middle part
 * @param address Address string
 * @param startLength Length shown at start (default 6)
 * @param endLength Length shown at end (default 4)
 * @returns Formatted address, e.g. "0x1234...5678"
 */
export const formatAddress = (address: string, startLength: number = 4, endLength: number = 4): string => {
    if (!address || address.length <= startLength + endLength) {
        return address;
    }
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};