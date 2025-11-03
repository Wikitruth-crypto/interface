import { CIDIsExitingType } from '@dapp/types/otherTypes';

/**
 * Pinata 配置接口
 */
export interface PinataConfig {
  jwt: string;
  gateway: string;
  // 预留：备用 JWT
  backupJwt?: string;
  // 预留：自定义端点
  customEndpoint?: string;
}

/**
 * 网络类型
 */
export type NetworkType = 'testnet' | 'mainnet';

/**
 * Group 类型枚举 - 用于组织不同类型的文件
 */
export type PinataGroupType = 
  | 'MintData'      // 铸造数据
  | 'ResultData'    // 结果数据
  | 'Evidence'      // 证据文件
  | 'Custom';       // 自定义分组

/**
 * Group 配置
 */
export interface GroupConfig {
  groupId?: string;  // Pinata Group ID（创建后存储）
  name: string;      // Group 名称
  maxSize: string;   // 最大文件大小（如 '5MB', '24KB'）
  keyvalues: Record<string, string>;  // Pinata 元数据键值对
}

/**
 * 上传进度信息
 */
export interface UploadProgress {
  loaded: number;    // 已上传字节数
  total: number;     // 总字节数
  percentage: number; // 上传百分比 (0-100)
}

/**
 * 上传选项
 */
export interface UploadOptions {
  groupType: PinataGroupType;  // 文件分组类型
  setProgress: (progress: number) => void;  // 进度回调函数
  network?: NetworkType;       // 网络类型（默认 testnet）
  customMetadata?: Record<string, string>;  // 自定义元数据（可选）
  customName?: string;  // 自定义文件名（可选）
}

/**
 * Pinata 上传结果（扩展自 CIDIsExitingType）
 */
export interface PinataUploadResult extends CIDIsExitingType {
  ipfsHash: string;  // IPFS 哈希值（同 cid）
  timestamp: string; // 上传时间戳
  url: string;       // 完整的访问 URL
  size: number;      // 文件大小（字节）
}

/**
 * Pinata API 响应接口（根据官方文档）
 */
export interface PinataApiResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate?: boolean;
}

