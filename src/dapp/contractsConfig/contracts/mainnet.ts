import { ContractAddresses } from '../types';
import { TESTNET_ADDRESSES } from './testnet';

/**
 * Sapphire Mainnet (23293) 合约地址配置
 * 
 * ⚠️ 重要说明：
 * 当前合约尚未部署到主网，为了避免配置返回 undefined 增加代码复杂度，
 * 暂时使用 Testnet 的配置作为 fallback。
 * 
 * 🔄 待办事项：
 * 主网合约部署后，请更新此配置为实际的主网地址。
 * 
 * 📝 优势：
 * - 避免每次使用都需要检查 undefined
 * - 代码更简洁，不需要到处写 if (!config) 判断
 * - 在开发阶段仍可正常工作（使用测试网配置）
 */
export const MAINNET_ADDRESSES: ContractAddresses = {
  ...TESTNET_ADDRESSES, // 暂时使用 Testnet 配置
};

// 环境变量标记，用于在控制台显示警告
if (typeof window !== 'undefined') {
  console.warn(
    '⚠️ 主网合约配置提醒: 当前主网使用的是测试网地址配置。' +
    '主网合约部署后请更新 contracts/mainnet.ts'
  );
}

