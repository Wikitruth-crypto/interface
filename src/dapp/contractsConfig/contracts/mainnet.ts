import { ContractAddresses } from '../types';
import { TESTNET_ADDRESSES } from './testnet';

export const MAINNET_ADDRESSES: ContractAddresses = {
  ...TESTNET_ADDRESSES, // 暂时使用 Testnet 配置
};

// 环境变量标记，用于在控制台显示警告
if (typeof window !== 'undefined') {
  if (import.meta.env.PROD) {
    console.warn(
      '⚠️ 主网合约配置提醒: 当前主网使用的是测试网地址配置。' +
      '主网合约部署后请更新 contracts/mainnet.ts'
    );
  }

}

