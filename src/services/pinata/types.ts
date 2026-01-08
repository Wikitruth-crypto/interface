import { CIDIsExitingType } from '@dapp/types/typesDapp/otherTypes';

/**
 * Pinata Configuration Interface
 */
export interface PinataConfig {
  jwt: string;
  gateway: string;
  // Reserved: Backup JWT
  backupJwt?: string;
  // Reserved: Custom Endpoint
  customEndpoint?: string;
}

/**
 * Network Type
 */
export type NetworkType = 'testnet' | 'mainnet';

/**
 * Group Type Enum - Used to organize different types of files
 */
export type PinataGroupType = 
  | 'MintData'      // Mint Data
  | 'ResultData'    // Result Data
  | 'Evidence'      // Evidence File
  | 'Custom';       // Custom Group

/**
 * Group Configuration
 */
export interface GroupConfig {
  groupId?: string;  // Pinata Group ID (stored after creation)
  name: string;      // Group Name
  maxSize: string;   // Max file size (e.g. '5MB', '24KB')
  keyvalues: Record<string, string>;  // Pinata metadata key-value pairs
}

/**
 * Upload Progress Info
 */
export interface UploadProgress {
  loaded: number;    // Bytes loaded
  total: number;     // Total bytes
  percentage: number; // Upload percentage (0-100)
}

/**
 * Upload Options
 */
export interface UploadOptions {
  groupType: PinataGroupType;  // File group type
  setProgress: (progress: number) => void;  // Progress callback
  network?: NetworkType;       // Network type (default testnet)
  customMetadata?: Record<string, string>;  // Custom metadata (optional)
  customName?: string;  // Custom filename (optional)
}

/**
 * Pinata Upload Result (extends CIDIsExitingType)
 */
export interface PinataUploadResult extends CIDIsExitingType {
  ipfsHash: string;  // IPFS Hash (same as cid)
  timestamp: string; // Upload timestamp
  url: string;       // Complete access URL
  size: number;      // File size (bytes)
}

/**
 * Pinata API Response Interface (according to official docs)
 */
export interface PinataApiResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate?: boolean;
}

