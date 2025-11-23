import { ContractName, SupportedChainId } from '../types';
import { EventName, EventConfig, ContractEventMap, NetworkEventMap } from './types';
import { ALL_EVENT_CONFIGS } from './events';


/**
 * 构建合约事件映射
 * 直接从 ALL_EVENT_CONFIGS 构建，避免循环依赖
 */
function buildContractEventMap(): ContractEventMap {
    const map: ContractEventMap = {};

    // 为每个合约生成事件列表
    Object.values(ContractName).forEach(contractName => {
        const events: EventConfig[] = [];
        
        // 从 ALL_EVENT_CONFIGS 中筛选出属于该合约的事件
        Object.entries(ALL_EVENT_CONFIGS).forEach(([eventName, config]) => {
            if (config.contract === contractName) {
                events.push({
                    name: eventName as EventName,
                    original: config.original,
                    signature: config.signature,
                    onlyOnce: config.onlyOnce,
                    contract: config.contract,
                    chainId: config.chainId,
                    network: config.network,
                    layer: config.layer,
                    description: config.description,
                });
            }
        });
        
        if (events.length > 0) {
            map[contractName] = events;
        }
    });

    return map;
}

/**
 * 所有合约的事件映射（不区分网络）
 */
export const CONTRACT_EVENT_MAP: ContractEventMap = buildContractEventMap();

/**
 * 网络事件配置映射
 * 当前所有网络使用相同的事件配置，未来可以根据不同网络的需求进行差异化配置
 */
export const NETWORK_EVENT_MAP: NetworkEventMap = {
    [SupportedChainId.SAPPHIRE_TESTNET]: CONTRACT_EVENT_MAP,
    [SupportedChainId.SAPPHIRE_MAINNET]: CONTRACT_EVENT_MAP,
};

/**
 * 获取指定合约的事件配置
 * @param contractName - 合约名称
 * @param chainId - 链ID（可选，默认使用当前网络）
 * @returns 事件配置数组
 */
export function getContractEvents(
    contractName: ContractName,
    chainId?: SupportedChainId
): EventConfig[] {
    const targetChainId = chainId ?? SupportedChainId.SAPPHIRE_TESTNET;
    const networkMap = NETWORK_EVENT_MAP[targetChainId];
    return networkMap[contractName] ?? [];
}

/**
 * 获取指定合约的所有事件签名
 * @param contractName - 合约名称
 * @param chainId - 链ID（可选）
 * @returns 事件签名数组
 */
export function getContractEventSignatures(
    contractName: ContractName,
    chainId?: SupportedChainId
): string[] {
    return getContractEvents(contractName, chainId).map(event => event.signature);
}


/**
 * 根据事件名称获取事件配置
 * @param eventName - 事件名称
 * @returns 事件配置
 */
export function getEventConfig(eventName: EventName): EventConfig {
    const config = ALL_EVENT_CONFIGS[eventName];
    return {
        name: eventName,
        original: config.original,
        signature: config.signature,
        onlyOnce: config.onlyOnce,
        contract: config.contract,
        chainId: config.chainId,
        network: config.network,
        layer: config.layer,
        description: config.description,
    };
}

/**
 * 获取事件的签名
 * @param eventName - 事件名称
 * @returns 签名
 */
export function getEventSignature(eventName: EventName): string {
    return ALL_EVENT_CONFIGS[eventName].signature;
}

/**
 * 检查事件是否为 only once
 * @param eventName - 事件名称
 * @returns 是否为 only once
 */
export function isOnlyOnceEvent(eventName: EventName): boolean {
    return ALL_EVENT_CONFIGS[eventName].onlyOnce;
}

