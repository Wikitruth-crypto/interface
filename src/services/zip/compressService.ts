import * as zip from "@zip.js/zip.js";
import { saveAs } from 'file-saver';
import type { UploadFile } from 'antd/es/upload/interface';
import { generateRandomPassword, generateRandomFileName } from '@dapp/utils/random/random';

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
 * File compression service
 */
export const compressService = {

  compressWithPassword: async (files: UploadFile[], isSave: boolean = false): Promise<CompressResult> => {
    try {
      // Check files
      if (files.length === 0) {
        throw new Error('No files to compress');
      }
      
      // Create password
      const password = generateRandomPassword();
      
      // Create zip writer
      const writer = new zip.ZipWriter(new zip.BlobWriter("application/zip"));

      // Add file to zip
      for (const file of files) {
        if (file.originFileObj) {
          const arrayBuffer = await file.originFileObj.arrayBuffer();
          await writer.add(file.name, new zip.Uint8ArrayReader(new Uint8Array(arrayBuffer)), {
            password
          });
        }
      }

      // Close zip and get blob
      const zipBlob = await writer.close();

      const zipName = `${generateRandomFileName()}.zip`;
      
      if (isSave) {
        // Save file
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
      // Check files
      if (files.length === 0) {
        throw new Error('No files to compress');
      }
      
      // Create zip writer
      const writer = new zip.ZipWriter(new zip.BlobWriter("application/zip"));

      // Add file to zip (handle duplicate file names)
      const usedNames = new Set<string>();
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.originFileObj) {
          const arrayBuffer = await file.originFileObj.arrayBuffer();
          
          // Handle duplicate file names
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

      // Close zip and get blob
      const zipBlob = await writer.close();

      const zipName = `${generateRandomFileName()}.zip`;
      
      // Save file
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