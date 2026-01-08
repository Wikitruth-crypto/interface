import { refreshGatewayStatus, getGatewayStatus } from './gateway';
import { setCurrentGateway } from './current';

/**
 * IPFS gateway polling configuration
 */
const POLLING_CONFIG = {
    INTERVAL: 15 * 60 * 1000, // 10 minutes
    INITIAL_DELAY: 0, // Immediately execute the first check
};

/**
 * Select the best gateway
 * Prioritize the gateway that is healthy and has the shortest response time
 */
const selectBestGateway = (): string | null => {
    const statuses = getGatewayStatus();

    // Filter out healthy gateways
    const healthyGateways = statuses.filter(g => g.isHealthy);

    if (healthyGateways.length === 0) {
        console.warn('No healthy IPFS gateways available');
        return null;
    }

    // Sort by response time, select the fastest
    const sortedGateways = [...healthyGateways].sort(
        (a, b) => a.responseTime - b.responseTime
    );

    return sortedGateways[0].url;
};

/**
 * Execute one gateway health check and update the current best gateway
 */
const checkAndUpdateGateway = async (): Promise<void> => {
    try {
        // Refresh the health status of all gateways
        await refreshGatewayStatus();

        // Select the best gateway
        const bestGateway = selectBestGateway();

        if (bestGateway) {
            setCurrentGateway(bestGateway);
            if (import.meta.env.DEV) {
                console.log(`[IPFS Gateway] Updated to: ${bestGateway}`);
            }
        } else {
            console.warn('[IPFS Gateway] No healthy gateway found, keeping current gateway');
        }
    } catch (error) {
        console.error('[IPFS Gateway] Error during gateway check:', error);
    }
};

let pollingIntervalId: NodeJS.Timeout | null = null;

/**
 * Start IPFS gateway polling
 * Check the gateway status every 10 minutes and update the best gateway
 */
export const startIpfsGatewayPolling = (): void => {
    // If it has already started, stop it first
    if (pollingIntervalId) {
        stopIpfsGatewayPolling();
    }

    // Immediately execute the first check
    checkAndUpdateGateway();

    // Set up periodic polling
    pollingIntervalId = setInterval(() => {
        checkAndUpdateGateway();
    }, POLLING_CONFIG.INTERVAL);

    if (import.meta.env.DEV) {
        console.log(`[IPFS Gateway] Polling started, interval: ${POLLING_CONFIG.INTERVAL / 1000 / 60} minutes`);
    }
};

/**
 * Stop IPFS gateway polling
 */
export const stopIpfsGatewayPolling = (): void => {
    if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
        pollingIntervalId = null;

        if (import.meta.env.DEV) {
            console.log('[IPFS Gateway] Polling stopped');
        }
    }
};

/**
 * Manually trigger one gateway check (for testing or emergency situations)
 */
export const manualGatewayCheck = async (): Promise<void> => {
    await checkAndUpdateGateway();
};

