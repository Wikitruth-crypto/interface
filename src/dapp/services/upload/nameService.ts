/**
 * 生成随机文件名
 * @param length - 随机字符串长度，默认16
 * @returns 随机字符串
 */
function generateRandomName(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const nameService = {

  nftImageName: (): string => {
    return `WikiTruth_nftImage_${generateRandomName(12)}`;
  },

  metadataBoxName: (): string => {
    return `WikiTruth_metadataBox_${generateRandomName(12)}`;
  },

  metadataNFTName: (): string => {
    return `WikiTruth_metadataNFT_${generateRandomName(12)}`;
  },

  resultDataName: (): string => {
    return `WikiTruth_resultData_${generateRandomName(12)}`;
  },

}; 