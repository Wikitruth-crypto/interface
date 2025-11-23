import { refreshGatewayStatus, getGatewayStatus } from './gateway';
import { setCurrentGateway } from './current';

/**
 * IPFS网关轮询配置
 */
const POLLING_CONFIG = {
    INTERVAL: 15 * 60 * 1000, // 10分钟
    INITIAL_DELAY: 0, // 立即执行第一次检查
};

/**
 * 选择最佳网关
 * 优先选择健康且响应时间最短的网关
 */
const selectBestGateway = (): string | null => {
    const statuses = getGatewayStatus();

    // 过滤出健康的网关
    const healthyGateways = statuses.filter(g => g.isHealthy);

    if (healthyGateways.length === 0) {
        console.warn('No healthy IPFS gateways available');
        return null;
    }

    // 按响应时间排序，选择最快的
    const sortedGateways = [...healthyGateways].sort(
        (a, b) => a.responseTime - b.responseTime
    );

    return sortedGateways[0].url;
};

/**
 * 执行一次网关健康检查并更新当前最佳网关
 */
const checkAndUpdateGateway = async (): Promise<void> => {
    try {
        // 刷新所有网关的健康状态
        await refreshGatewayStatus();

        // 选择最佳网关
        const bestGateway = selectBestGateway();

        if (bestGateway) {
            setCurrentGateway(bestGateway);
            console.log(`[IPFS Gateway] Updated to: ${bestGateway}`);
        } else {
            console.warn('[IPFS Gateway] No healthy gateway found, keeping current gateway');
        }
    } catch (error) {
        console.error('[IPFS Gateway] Error during gateway check:', error);
    }
};

let pollingIntervalId: NodeJS.Timeout | null = null;

/**
 * 启动IPFS网关轮询
 * 每10分钟检查一次网关状态并更新最佳网关
 */
export const startIpfsGatewayPolling = (): void => {
    // 如果已经启动，先停止
    if (pollingIntervalId) {
        stopIpfsGatewayPolling();
    }

    // 立即执行第一次检查
    checkAndUpdateGateway();

    // 设置定时轮询
    pollingIntervalId = setInterval(() => {
        checkAndUpdateGateway();
    }, POLLING_CONFIG.INTERVAL);

    console.log(`[IPFS Gateway] Polling started, interval: ${POLLING_CONFIG.INTERVAL / 1000 / 60} minutes`);
};

/**
 * 停止IPFS网关轮询
 */
export const stopIpfsGatewayPolling = (): void => {
    if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
        pollingIntervalId = null;
        console.log('[IPFS Gateway] Polling stopped');
    }
};

/**
 * 手动触发一次网关检查（用于测试或紧急情况）
 */
export const manualGatewayCheck = async (): Promise<void> => {
    await checkAndUpdateGateway();
};

