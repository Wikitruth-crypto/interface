/* 
 * @deprecated 此文件已废弃，请使用新的配置系统
 * 
 * 迁移指南：
 * - 旧方式: import { IPFS_GATEWAYS, CURRENT_IPFS_GATEWAY, ipfsToHttp, fetchFromIPFS } from './ipfs'
 * - 新方式: import { ipfsCidToUrl } from '@/dapp/utils/ipfsUrl/ipfsCidToUrl'
 */

// /**
//  * IPFS 网关配置
//  * 用于访问 IPFS 上存储的文件
//  */
// export const IPFS_GATEWAYS = {
//   /** 默认网关 */
//   default: 'https://ipfs.io/ipfs/',
//   /** Pinata 网关 */
//   pinata: 'https://gateway.pinata.cloud/ipfs/',
//   /** Cloudflare 网关 */
//   cloudflare: 'https://cloudflare-ipfs.com/ipfs/',
// } as const;

// /**
//  * 当前使用的 IPFS 网关
//  */
// export const CURRENT_IPFS_GATEWAY = IPFS_GATEWAYS.default;

// /**
//  * 将 IPFS URI 转换为 HTTP URL
//  * @param ipfsUri - IPFS URI (例如: ipfs://Qm...)
//  * @param gateway - 使用的网关，默认为当前网关
//  * @returns HTTP URL
//  */
// export function ipfsToHttp(
//   ipfsUri: string,
//   gateway: string = CURRENT_IPFS_GATEWAY
// ): string {
//   if (!ipfsUri) return '';
  
//   // 移除 ipfs:// 前缀
//   const hash = ipfsUri.replace('ipfs://', '');
  
//   return `${gateway}${hash}`;
// }

// /**
//  * 尝试多个网关获取 IPFS 资源
//  * @param ipfsUri - IPFS URI
//  * @returns Promise<string> - 第一个成功的 URL
//  */
// export async function fetchFromIPFS(ipfsUri: string): Promise<string> {
//   const gateways = Object.values(IPFS_GATEWAYS);
  
//   for (const gateway of gateways) {
//     try {
//       const url = ipfsToHttp(ipfsUri, gateway);
//       const response = await fetch(url, { method: 'HEAD' });
      
//       if (response.ok) {
//         return url;
//       }
//     } catch (error) {
//       console.warn(`Failed to fetch from ${gateway}:`, error);
//     }
//   }
  
//   throw new Error(`Failed to fetch IPFS resource: ${ipfsUri}`);
// }

