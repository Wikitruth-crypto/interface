/**
 * 事件签名配置模块统一导出
 * 
 * 提供智能的事件配置系统：
 * - 根据合约分类事件
 * - 标记 only once 事件
 * - 支持按网络配置
 * - 提供便捷的查询函数和 Hooks
 */

// 导出类型
export * from './types';

// 导出事件配置
export * from './events';

// 导出配置函数
import {
  getContractEvents as _getContractEvents,
  getContractEventSignatures as _getContractEventSignatures,
  getEventConfig as _getEventConfig,
  isOnlyOnceEvent as _isOnlyOnceEvent,
  CONTRACT_EVENT_MAP,
  NETWORK_EVENT_MAP,
} from './config';

export {
  _getContractEvents as getContractEvents,
  _getContractEventSignatures as getContractEventSignaturesNew,
  _getEventConfig as getEventConfig,
  _isOnlyOnceEvent as isOnlyOnceEvent,
  CONTRACT_EVENT_MAP,
  NETWORK_EVENT_MAP,
};

// 导出 Hooks
export {
  useContractEvents,
  useContractEventSignatures,
  useEventConfig,
  useIsOnlyOnceEvent,
} from './hooks';

// 向后兼容：保留旧的导出
import { ContractName } from '../types';

/**
 * @deprecated 使用 getContractEventSignaturesNew(contractName, chainId?) 代替
 * 为了向后兼容保留此函数
 */
export function getContractEventSignatures(
  contract: ContractName
): readonly string[] {
  return _getContractEventSignatures(contract);
}
