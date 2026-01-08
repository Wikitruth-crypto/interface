let currentGatewayUrlTemplate: string = 'https://ipfs.io/ipfs/{cid}'; // Default gateway

/**
 * Set the current best gateway URL template
 * @param urlTemplate - Gateway URL template, must contain {cid} placeholder
 */
export const setCurrentGateway = (urlTemplate: string): void => {
    if (!urlTemplate.includes('{cid}')) {
        console.warn('Gateway URL template must include {cid} placeholder');
        return;
    }
    currentGatewayUrlTemplate = urlTemplate;
};

/**
 * Get the current best gateway URL template
 * @returns The current best gateway URL template
 */
export const getCurrentGateway = (): string => {
    return currentGatewayUrlTemplate;
};

/**
 * Convert CID to complete URL using the current best gateway
 * @param cid - IPFS CID
 * @returns The complete IPFS gateway URL
 */
export const getCurrentGatewayUrl = (cid: string): string => {
    return currentGatewayUrlTemplate.replace('{cid}', cid);
};

