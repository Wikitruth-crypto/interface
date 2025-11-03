import * as zip from "@zip.js/zip.js";
import { saveAs } from 'file-saver';
import type { UploadFile } from 'antd/es/upload/interface';
import { generateRandomPassword, generateRandomFileName } from '@/dapp/utils/random/random';

export interface CompressResult {
  zipBlob: Blob;
  zipName: string;
  zipPassword: string;
}

export interface CompressResultNoPassword {
  zipBlob: Blob;
  zipName: string;
}

/**
 * 文件压缩服务
 */
export const compressService = {

  compressWithPassword: async (files: UploadFile[], isSave: boolean = false): Promise<CompressResult> => {
    try {
      // 检查文件
      if (files.length === 0) {
        throw new Error('No files to compress');
      }
      
      // 创建密码
      const password = generateRandomPassword();
      
      // 创建zip写入器
      const writer = new zip.ZipWriter(new zip.BlobWriter("application/zip"));

      // 添加文件到zip
      for (const file of files) {
        if (file.originFileObj) {
          const arrayBuffer = await file.originFileObj.arrayBuffer();
          await writer.add(file.name, new zip.Uint8ArrayReader(new Uint8Array(arrayBuffer)), {
            password
          });
        }
      }

      // 关闭zip并获取blob
      const zipBlob = await writer.close();

      const zipName = `${generateRandomFileName()}.zip`;
      
      if (isSave) {
        // 保存文件，
        saveAs(zipBlob, zipName);
      }
      
      return { zipBlob, zipName, zipPassword: password };
    } catch (error) {
      console.error('Compression failed:', error);
      throw error;
    }
  },

  compressWithoutPassword: async (files: UploadFile[], isSave: boolean = false): Promise<CompressResultNoPassword> => {
    try {
      // 检查文件
      if (files.length === 0) {
        throw new Error('No files to compress');
      }
      
      // 创建zip写入器
      const writer = new zip.ZipWriter(new zip.BlobWriter("application/zip"));

      // 添加文件到zip（处理重复文件名）
      const usedNames = new Set<string>();
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.originFileObj) {
          const arrayBuffer = await file.originFileObj.arrayBuffer();
          
          // 处理重复文件名
          let fileName = file.name;
          let counter = 1;
          while (usedNames.has(fileName)) {
            const nameParts = file.name.split('.');
            const extension = nameParts.length > 1 ? `.${nameParts.pop()}` : '';
            const baseName = nameParts.join('.');
            fileName = `${baseName}_${counter}${extension}`;
            counter++;
          }
          
          usedNames.add(fileName);
          await writer.add(fileName, new zip.Uint8ArrayReader(new Uint8Array(arrayBuffer)));
        }
      }

      // 关闭zip并获取blob
      const zipBlob = await writer.close();

      const zipName = `${generateRandomFileName()}.zip`;
      
      // 保存文件
      if (isSave) {
        saveAs(zipBlob, zipName);
      }
      
      return { zipBlob, zipName };
    } catch (error) {
      console.error('Compression failed:', error);
      throw error;
    }
  }
}; 