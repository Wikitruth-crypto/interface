// Define gateway interface
interface Gateway {
    url: string;
    isHealthy: boolean;
    lastCheck: number;
    responseTime: number;
    failureCount: number;
}

const GATEWAY_CONFIG = {
    HEALTH_CHECK_INTERVAL: 15 * 60 * 1000, // Check every 15 minutes
    MAX_FAILURES: 3, // Maximum number of failures
    TIMEOUT: 5000, // 5 seconds timeout
    CACHE_DURATION: 15 * 60 * 1000, // 10 minutes cache
};

export const network = 'https://';
export const end = '.ipfs.w3s.link/'; // Not used, this is the fleek gateway,
// Initialize gateway list
const gateways: Gateway[] = [
    // {
    //     url: `${network}{cid}${end}`,
    //     isHealthy: true,
    //     lastCheck: 0,
    //     responseTime: 0,
    //     failureCount: 0,
    // },
    {
        url: 'https://ipfs.io/ipfs/{cid}',
        isHealthy: true,
        lastCheck: 0,
        responseTime: 0,
        failureCount: 0,
    },
    {
        url: 'https://gateway.pinata.cloud/ipfs/{cid}',
        isHealthy: true,
        lastCheck: 0,
        responseTime: 0,
        failureCount: 0,
    },
    // {
    //     url: 'https://cloudflare-ipfs.com/ipfs/{cid}',
    //     isHealthy: true,
    //     lastCheck: 0,
    //     responseTime: 0,
    //     failureCount: 0,
    // },
    {
        url: 'https://dweb.link/ipfs/{cid}',
        isHealthy: true,
        lastCheck: 0,
        responseTime: 0,
        failureCount: 0,
    },
];

// Gateway status cache
const gatewayCache = new Map<string, { url: string; timestamp: number }>();

/**
 * Check gateway health status
 * @param gateway Gateway object
 * @returns Promise<boolean>
 */
const checkGatewayHealth = async (gateway: Gateway): Promise<boolean> => {
    try {
        const testCid = 'bafkreiaurkeqxw6mfkqua3msyllwtutrlgdt3ye3xf7senwcjpado7dvby';
        const startTime = Date.now();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), GATEWAY_CONFIG.TIMEOUT);

        const response = await fetch(gateway.url.replace('{cid}', testCid), {
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            gateway.responseTime = Date.now() - startTime;
            gateway.failureCount = 0;
            gateway.isHealthy = true;
            gateway.lastCheck = Date.now();
            return true;
        }

        gateway.failureCount++;
        if (gateway.failureCount >= GATEWAY_CONFIG.MAX_FAILURES) {
            gateway.isHealthy = false;
        }
        gateway.lastCheck = Date.now();
        return false;
    } catch (error) {
        gateway.failureCount++;
        if (gateway.failureCount >= GATEWAY_CONFIG.MAX_FAILURES) {
            gateway.isHealthy = false;
        }
        gateway.lastCheck = Date.now();
        return false;
    }
};

/**
 * Get the best gateway
 * @param cid IPFS CID
 * @returns Promise<string>
 */
export const getIpfsGateway = async (cid: string): Promise<string> => {
    // Check cache
    const cached = gatewayCache.get(cid);
    if (cached && Date.now() - cached.timestamp < GATEWAY_CONFIG.CACHE_DURATION) {
        return cached.url;
    }

    // First try using the first gateway
    const primaryGateway = gateways[0];
    
    // If the first gateway is not healthy, check its status
    if (!primaryGateway.isHealthy) {
        const isHealthy = await checkGatewayHealth(primaryGateway);
        if (isHealthy) {
            const gatewayUrl = primaryGateway.url.replace('{cid}', cid);
            gatewayCache.set(cid, {
                url: gatewayUrl,
                timestamp: Date.now(),
            });
            return gatewayUrl;
        }
    } else {
        // If the first gateway is healthy, use it directly
        const gatewayUrl = primaryGateway.url.replace('{cid}', cid);
        gatewayCache.set(cid, {
            url: gatewayUrl,
            timestamp: Date.now(),
        });
        return gatewayUrl;
    }

    // If the first gateway is not available, try other gateways
    const backupGateways = gateways.slice(1);
    const healthyBackupGateways = backupGateways.filter(g => g.isHealthy);

    // If there are no healthy backup gateways, try to re-check all backup gateways
    if (healthyBackupGateways.length === 0) {
        await Promise.all(backupGateways.map(checkGatewayHealth));
    }

    // Sort by response time
    const sortedGateways = [...backupGateways]
        .filter(g => g.isHealthy)
        .sort((a, b) => a.responseTime - b.responseTime);

    if (sortedGateways.length === 0) {
        throw new Error('No healthy gateways available');
    }

    const selectedGateway = sortedGateways[0];
    const gatewayUrl = selectedGateway.url.replace('{cid}', cid);

    // Update cache
    gatewayCache.set(cid, {
        url: gatewayUrl,
        timestamp: Date.now(),
    });

    return gatewayUrl;
};

/**
 * Force refresh gateway status
 */
export const refreshGatewayStatus = async () => {
    await Promise.all(gateways.map(checkGatewayHealth));
};

/**
 * Get the current gateway status
 */
export const getGatewayStatus = () => {
    return gateways.map(g => ({
        url: g.url,
        isHealthy: g.isHealthy,
        responseTime: g.responseTime,
        failureCount: g.failureCount,
        lastCheck: g.lastCheck,
    }));
};