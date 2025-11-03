import { PinataSDK } from 'pinata';
import { getPinataConfig, getGroupConfig, parseFileSize } from './config';
import { 
  UploadOptions, 
  PinataUploadResult,
  NetworkType,
  PinataGroupType
} from './types';

/**
 * 创建 Pinata SDK 实例（懒加载）
 */
let pinataInstance: PinataSDK | null = null;

const getPinataInstance = (): PinataSDK => {
  if (!pinataInstance) {
    const config = getPinataConfig();
    pinataInstance = new PinataSDK({
      pinataJwt: config.jwt,
      pinataGateway: config.gateway
    });
  }
  return pinataInstance;
};

/**
 * 检查文件大小
 * @param file - 文件对象
 * @param maxSize - 最大大小字符串（如 '5MB'）
 * @throws 如果文件为空或超过大小限制
 */
const checkFileSize = (file: File, maxSize: string): void => {
  if (!file) {
    throw new Error('File is empty!');
  }

  const maxBytes = parseFileSize(maxSize);
  
  if (file.size > maxBytes) {
    throw new Error(`The file size cannot exceed ${maxSize}. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
  }
};

/**
 * 生成完整的 IPFS 访问 URL
 * @param hash - IPFS 哈希值
 * @returns 完整的访问 URL
 */
const getFileUrl = (hash: string): string => {
  const config = getPinataConfig();
  // 确保 gateway 格式正确
  const gateway = config.gateway.endsWith('/') 
    ? config.gateway.slice(0, -1) 
    : config.gateway;
  
  return `${gateway}/ipfs/${hash}`;
};

/**
 * 获取预配置的 Group ID
 * @param network - 网络类型
 * @param groupType - Group 类型
 * @returns Group ID
 */
const getPredefinedGroupId = (network: NetworkType, groupType: PinataGroupType): string => {
  const groupConfig = getGroupConfig(network, groupType);
  
  if (!groupConfig.groupId) {
    throw new Error(`Group ID not configured for ${network}/${groupType}. Please check your environment variables.`);
  }
  
  // console.log(`Using predefined Group: ${groupConfig.name} (${groupConfig.groupId})`);
  return groupConfig.groupId;
};

/**
 * Pinata IPFS 上传服务
 */
export const pinataService = {
  /**
   * 上传文件到 IPFS
   * @param file - 要上传的文件
   * @param options - 上传选项
   * @returns Promise<PinataUploadResult> - 上传结果
   * 
   * @example
   * ```typescript
   * const result = await pinataService.uploadFile(file, {
   *   groupType: 'MintData',
   *   setProgress: (p) => console.log(`Progress: ${p}%`)
   * });
   * console.log('IPFS URL:', result.url);
   * ```
   */
  uploadFile: async (
    file: File, 
    options: UploadOptions
  ): Promise<PinataUploadResult> => {
    try {
      // 默认使用测试网
      const network: NetworkType = options.network || 'testnet';
      
      // 获取 Group 配置
      const groupConfig = getGroupConfig(network, options.groupType);
      
      // 验证文件大小
      checkFileSize(file, groupConfig.maxSize);

      // 获取预配置的 Group ID
      const groupId = getPredefinedGroupId(network, options.groupType);

      // 获取 Pinata 实例
      const pinata = getPinataInstance();

      // 初始化进度
      options.setProgress(0);

      // 模拟进度更新（因为 Pinata SDK 可能不提供详细的进度回调）
      let progressUpdated = false;
      const progressInterval = setInterval(() => {
        if (!progressUpdated) {
          // 在上传过程中模拟进度增长
          const currentProgress = Math.min(90, Math.random() * 50 + 20);
          options.setProgress(Math.floor(currentProgress));
        }
      }, 300);

      try {
        // 上传文件到指定 Group
        const uploadResponse = await pinata.upload.public
          .file(file)
          .group(groupId);
        
        progressUpdated = true;
        clearInterval(progressInterval);

        // 设置完成进度
        options.setProgress(100);

        // 构建结果对象
        const result: PinataUploadResult = {
          cid: uploadResponse.cid,
          ipfsHash: uploadResponse.cid,
          isExisting: false, // Pinata SDK 不返回 duplicate 字段
          timestamp: uploadResponse.created_at,
          url: getFileUrl(uploadResponse.cid),
          size: uploadResponse.size
        };

        // console.log('Pinata upload file success:', result);
        return result;

      } catch (uploadError) {
        clearInterval(progressInterval);
        throw uploadError;
      }

    } catch (error) {
      console.error('Pinata upload file error:', error);
      throw error;
    }
  },

  /**
   * 上传 JSON 数据到 IPFS
   * @param data - 要上传的 JSON 对象
   * @param options - 上传选项
   * @returns Promise<PinataUploadResult> - 上传结果
   * 
   * @example
   * ```typescript
   * const metadata = { title: 'My NFT', description: 'A cool NFT' };
   * const result = await pinataService.uploadJSON(metadata, {
   *   groupType: 'MintData',
   *   setProgress: (p) => console.log(`Progress: ${p}%`),
   *   customName: 'nft-metadata.json'
   * });
   * ```
   */
  uploadJSON: async (
    data: Record<string, any>, 
    options: UploadOptions
  ): Promise<PinataUploadResult> => {
    try {
      // 默认使用测试网
      const network: NetworkType = options.network || 'testnet';
      
      // 获取 Group 配置
      const groupConfig = getGroupConfig(network, options.groupType);
      
      // 将 JSON 转换为 Blob，然后创建 File 对象
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const fileName = options.customName || `data-${Date.now()}.json`;
      const file = new File([blob], fileName, { type: 'application/json' });

      // 验证文件大小
      checkFileSize(file, groupConfig.maxSize);

      // 获取预配置的 Group ID
      const groupId = getPredefinedGroupId(network, options.groupType);

      // 获取 Pinata 实例
      const pinata = getPinataInstance();

      // 初始化进度
      options.setProgress(0);

      // JSON 上传通常很快，使用简单的进度模拟
      options.setProgress(50);

      // 上传 JSON 到指定 Group
      const uploadResponse = await pinata.upload.public
        .file(file)
        .group(groupId);

      options.setProgress(100);

      // 构建结果对象
      const result: PinataUploadResult = {
        cid: uploadResponse.cid,
        ipfsHash: uploadResponse.cid,
        isExisting: false, // Pinata SDK 不返回 duplicate 字段
        timestamp: uploadResponse.created_at,
        url: getFileUrl(uploadResponse.cid),
        size: uploadResponse.size
      };

      // console.log('Pinata upload JSON success:', result);
      return result;

    } catch (error) {
      console.error('Pinata upload JSON error:', error);
      throw error;
    }
  },

  /**
   * 根据 IPFS Hash 生成访问 URL
   * @param hash - IPFS 哈希值
   * @returns 完整的访问 URL
   * 
   * @example
   * ```typescript
   * const url = pinataService.getFileUrl('QmXxx...');
   * // 返回: https://your-gateway.mypinata.cloud/ipfs/QmXxx...
   * ```
   */
  getFileUrl
};

