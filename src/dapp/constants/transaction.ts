/**
 * 交易相关常量
 */

/**
 * 默认 Gas Limit
 */
export const DEFAULT_GAS_LIMIT = BigInt(3000000);

/**
 * 默认交易确认数
 */
export const DEFAULT_CONFIRMATIONS = 1;

/**
 * 交易超时时间（毫秒）
 */
export const TRANSACTION_TIMEOUT = 60000; // 60 seconds

/**
 * 轮询间隔（毫秒）
 * 用于查询交易状态或区块链数据
 */
export const POLLING_INTERVAL = 4000; // 4 seconds

/**
 * 重试次数
 */
export const MAX_RETRY_COUNT = 3;

