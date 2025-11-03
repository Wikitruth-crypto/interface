import { uploadToFleek } from './uploadToFleek';
import { uploadResultData } from './uploadResultData';
import { CIDIsExitingType } from '@dapp/types/otherTypes';

const checkFileSize = (file: File, maxSize: '5MB' | '24KB') => {
  if (!file) {
    throw new Error('File is empty!');
  }

  if (maxSize === '5MB' && file.size >= 5*1024*1024) {
    throw new Error('The file size cannot exceed 5MB');
  }

  if (maxSize === '24KB' && file.size >= 24*1024) {
    throw new Error('The file size cannot exceed 24KB');
  }
}

// IPFS服务封装
export const ipfsService = {

  uploadFile: async (file: File, setProgress: (progress: number) => void): Promise<CIDIsExitingType> => {
    try {
      checkFileSize(file, '5MB');

      const result = await uploadToFleek('MintData', file, setProgress);
      console.log('uploadFile result:', result);
      return result;
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw error;
    }
  },

  uploadJson: async (file: File, setProgress: (progress: number) => void): Promise<CIDIsExitingType> => {
    try {
      checkFileSize(file, '24KB');

      const result = await uploadToFleek('MintData', file, setProgress);
      console.log('uploadJson result:', result);
      return result;
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw error;
    }
  },

  uploadResultData: async (file: File, setProgress: (progress: number) => void): Promise<CIDIsExitingType> => {
    try {
      checkFileSize(file, '24KB');

      const result = await uploadResultData(file, setProgress);
      console.log('uploadResultData result:', result);
      return result;
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw error;
    }
  },

  uploadExchangeData: async (file: File, setProgress: (progress: number) => void): Promise<CIDIsExitingType> => {
    
    try {
      checkFileSize(file, '24KB');
      
      const result = await uploadToFleek('ExchangeData', file, setProgress);
      console.log('uploadExchangeData result:', result);
      return result;
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw error;
    }
  }
}
