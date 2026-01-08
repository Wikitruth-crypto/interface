/**
 * Generate random file name
 * @param length - Random string length, default 16
 * @returns Random string
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