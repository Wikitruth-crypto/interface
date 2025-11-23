// 定义网关接口
interface Gateway {
    url: string;
    isHealthy: boolean;
    lastCheck: number;
    responseTime: number;
    failureCount: number;
}

const GATEWAY_CONFIG = {
    HEALTH_CHECK_INTERVAL: 15 * 60 * 1000, // 15分钟检查一次
    MAX_FAILURES: 3, // 最大失败次数
    TIMEOUT: 5000, // 5秒超时
    CACHE_DURATION: 15 * 60 * 1000, // 10分钟缓存
};

export const network = 'https://';
export const end = '.ipfs.w3s.link/'; // 暂不使用，这是fleek的网关，
// 初始化网关列表
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

// 网关状态缓存
const gatewayCache = new Map<string, { url: string; timestamp: number }>();

/**
 * 检查网关健康状态
 * @param gateway 网关对象
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
 * 获取最佳网关
 * @param cid IPFS CID
 * @returns Promise<string>
 */
export const getIpfsGateway = async (cid: string): Promise<string> => {
    // 检查缓存
    const cached = gatewayCache.get(cid);
    if (cached && Date.now() - cached.timestamp < GATEWAY_CONFIG.CACHE_DURATION) {
        return cached.url;
    }

    // 首先尝试使用第一个网关
    const primaryGateway = gateways[0];
    
    // 如果第一个网关不健康，检查其状态
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
        // 如果第一个网关健康，直接使用
        const gatewayUrl = primaryGateway.url.replace('{cid}', cid);
        gatewayCache.set(cid, {
            url: gatewayUrl,
            timestamp: Date.now(),
        });
        return gatewayUrl;
    }

    // 如果第一个网关不可用，尝试其他网关
    const backupGateways = gateways.slice(1);
    const healthyBackupGateways = backupGateways.filter(g => g.isHealthy);

    // 如果没有健康的备用网关，尝试重新检查所有备用网关
    if (healthyBackupGateways.length === 0) {
        await Promise.all(backupGateways.map(checkGatewayHealth));
    }

    // 按响应时间排序
    const sortedGateways = [...backupGateways]
        .filter(g => g.isHealthy)
        .sort((a, b) => a.responseTime - b.responseTime);

    if (sortedGateways.length === 0) {
        throw new Error('No healthy gateways available');
    }

    const selectedGateway = sortedGateways[0];
    const gatewayUrl = selectedGateway.url.replace('{cid}', cid);

    // 更新缓存
    gatewayCache.set(cid, {
        url: gatewayUrl,
        timestamp: Date.now(),
    });

    return gatewayUrl;
};

/**
 * 强制刷新网关状态
 */
export const refreshGatewayStatus = async () => {
    await Promise.all(gateways.map(checkGatewayHealth));
};

/**
 * 获取当前网关状态
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