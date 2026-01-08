import { PinataSDK } from 'pinata';
import { getPinataConfig, getGroupConfig, parseFileSize } from './config';
import { 
  UploadOptions, 
  PinataUploadResult,
  NetworkType,
  PinataGroupType
} from './types';

/**
 * Create Pinata SDK instance (lazy load)
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
 * Check file size
 * @param file - File object
 * @param maxSize - Max size string (e.g. '5MB')
 * @throws If file is empty or exceeds size limit
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
 * Generate complete IPFS access URL
 * @param hash - IPFS Hash
 * @returns Complete access URL
 */
const getFileUrl = (hash: string): string => {
  const config = getPinataConfig();
  // Ensure gateway format is correct
  const gateway = config.gateway.endsWith('/') 
    ? config.gateway.slice(0, -1) 
    : config.gateway;
  
  return `${gateway}/ipfs/${hash}`;
};

/**
 * Get pre-configured Group ID
 * @param network - Network type
 * @param groupType - Group type
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
 * Pinata IPFS Upload Service
 */
export const pinataService = {
  /**
   * Upload file to IPFS
   * @param file - File to upload
   * @param options - Upload options
   * @returns Promise<PinataUploadResult> - Upload result
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
      // Default to testnet
      const network: NetworkType = options.network || 'testnet';
      
      // Get Group config
      const groupConfig = getGroupConfig(network, options.groupType);
      
      // Verify file size
      checkFileSize(file, groupConfig.maxSize);

      // Get pre-configured Group ID
      const groupId = getPredefinedGroupId(network, options.groupType);

      // Get Pinata instance
      const pinata = getPinataInstance();

      // Initialize progress
      options.setProgress(0);

      // Simulate progress update (since Pinata SDK may not provide detailed progress callback)
      let progressUpdated = false;
      const progressInterval = setInterval(() => {
        if (!progressUpdated) {
          // Simulate progress growth during upload
          const currentProgress = Math.min(90, Math.random() * 50 + 20);
          options.setProgress(Math.floor(currentProgress));
        }
      }, 300);

      try {
        // Upload file to specified Group
        const uploadResponse = await pinata.upload.public
          .file(file)
          .group(groupId);
        
        progressUpdated = true;
        clearInterval(progressInterval);

        // Set completion progress
        options.setProgress(100);

        // Build result object
        const result: PinataUploadResult = {
          cid: uploadResponse.cid,
          ipfsHash: uploadResponse.cid,
          isExisting: false, // Pinata SDK does not return duplicate field
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
   * Upload JSON data to IPFS
   * @param data - JSON object to upload
   * @param options - Upload options
   * @returns Promise<PinataUploadResult> - Upload result
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
      // Default to testnet
      const network: NetworkType = options.network || 'testnet';
      
      // Get Group config
      const groupConfig = getGroupConfig(network, options.groupType);
      
      // Convert JSON to Blob, then create File object
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const fileName = options.customName || `data-${Date.now()}.json`;
      const file = new File([blob], fileName, { type: 'application/json' });

      // Verify file size
      checkFileSize(file, groupConfig.maxSize);

      // Get pre-configured Group ID
      const groupId = getPredefinedGroupId(network, options.groupType);

      // Get Pinata instance
      const pinata = getPinataInstance();

      // Initialize progress
      options.setProgress(0);

      // JSON upload is usually fast, use simple progress simulation
      options.setProgress(50);

      // Upload JSON to specified Group
      const uploadResponse = await pinata.upload.public
        .file(file)
        .group(groupId);

      options.setProgress(100);

      // Build result object
      const result: PinataUploadResult = {
        cid: uploadResponse.cid,
        ipfsHash: uploadResponse.cid,
        isExisting: false, // Pinata SDK does not return duplicate field
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
   * Generate access URL from IPFS Hash
   * @param hash - IPFS Hash
   * @returns Complete access URL
   * 
   * @example
   * ```typescript
   * const url = pinataService.getFileUrl('QmXxx...');
   * // 返回: https://your-gateway.mypinata.cloud/ipfs/QmXxx...
   * ```
   */
  getFileUrl
};

