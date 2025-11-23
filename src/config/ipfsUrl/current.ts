/**
 * 当前最佳IPFS网关URL模板
 * 格式: 'https://ipfs.io/ipfs/{cid}'
 * 由 ipfsGateway.ts 中的轮询机制定期更新
 */
let currentGatewayUrlTemplate: string = 'https://ipfs.io/ipfs/{cid}'; // 默认网关

/**
 * 设置当前最佳网关URL模板
 * @param urlTemplate - 网关URL模板，必须包含 {cid} 占位符
 */
export const setCurrentGateway = (urlTemplate: string): void => {
    if (!urlTemplate.includes('{cid}')) {
        console.warn('Gateway URL template must include {cid} placeholder');
        return;
    }
    currentGatewayUrlTemplate = urlTemplate;
};

/**
 * 获取当前最佳网关URL模板
 * @returns 当前最佳网关URL模板
 */
export const getCurrentGateway = (): string => {
    return currentGatewayUrlTemplate;
};

/**
 * 使用当前最佳网关将CID转换为完整URL
 * @param cid - IPFS CID
 * @returns 完整的IPFS网关URL
 */
export const getCurrentGatewayUrl = (cid: string): string => {
    return currentGatewayUrlTemplate.replace('{cid}', cid);
};

