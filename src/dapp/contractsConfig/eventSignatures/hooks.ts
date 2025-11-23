/**
 * React Hooks - 用于在组件中获取事件配置
 */

import { useMemo } from 'react';
import { ContractName } from '../types';
import { useChainId } from 'wagmi';
import {
    getContractEvents,
    getContractEventSignatures,
    getEventConfig,
    isOnlyOnceEvent,
} from './config';
import { EventName, EventConfig } from './types';

/**
 * Hook: 获取指定合约的事件配置
 * @param contractName - 合约名称
 * @returns 事件配置数组
 */
export function useContractEvents(contractName: ContractName): EventConfig[] {
    const chainId = useChainId();

    return useMemo(() => {
        return getContractEvents(contractName, chainId);
    }, [contractName, chainId]);
}

/**
 * Hook: 获取指定合约的事件签名
 * @param contractName - 合约名称
 * @returns 事件签名数组
 */
export function useContractEventSignatures(contractName: ContractName): string[] {
    const chainId = useChainId();

    return useMemo(() => {
        return getContractEventSignatures(contractName, chainId);
    }, [contractName, chainId]);
}

/**
 * Hook: 根据事件名称获取事件配置
 * @param eventName - 事件名称
 * @returns 事件配置
 */
export function useEventConfig(eventName: EventName): EventConfig {
    return useMemo(() => {
        return getEventConfig(eventName);
    }, [eventName]);
}

/**
 * Hook: 检查事件是否为 only once
 * @param eventName - 事件名称
 * @returns 是否为 only once
 */
export function useIsOnlyOnceEvent(eventName: EventName): boolean {
    return useMemo(() => {
        return isOnlyOnceEvent(eventName);
    }, [eventName]);
}

