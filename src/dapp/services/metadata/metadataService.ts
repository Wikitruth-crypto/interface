import { EncryptionDataType, KeyPairType_Mint } from '@/dapp/types/metadata/encryption';
import { 
  BoxInfoFormType,
} from '@/dapp/pages/Create/types/stateType';
import { AllStepOutputs } from '@/dapp/pages/Create/types/stepType';
import {
  initialMetadataBox,
  MetadataBoxType,
  MintMethodType,
} from '@/dapp/types/metadata/metadataBox'; 
import {
  initialMetadataNFT,
  MetadataNFTType,
} from '@/dapp/types/metadata/metadataNFT'; 

import {
  initialResultData,
  ResultDataType,
} from '@/dapp/types/metadata/resultData';
import { CIDIsExitingType } from '@/dapp/types/otherTypes';


export const metadataService = {

  createMetadataBox: async (
    boxInfoForm: BoxInfoFormType,
    allStepOutputs: AllStepOutputs,
    // encryptionData: EncryptionDataType,
    // keyPair: KeyPairType_Mint,
  ) : Promise<MetadataBoxType> => {
    try {
      // 验证必需数据
      if(allStepOutputs.nftImageCid === '' ) {
        throw new Error('image is empty!');
      }
      if (allStepOutputs.boxImageCid === '') {
        throw new Error('image2 is empty!');
      }
      if(allStepOutputs.fileCidList.length === 0) {
        throw new Error('file is empty!');
      }
      // 
      let publicKey_let = '';
      let fileList_let: string[] = [];
      let encryptionSlicesMetadataCID_let = {
        slicesMetadataCID_encryption: '',
        slicesMetadataCID_iv: '',
      };
      // 验证加密数据
      if(boxInfoForm.mintMethod === 'createAndPublish') {
        
        fileList_let = allStepOutputs.fileCidList;
      } else if(boxInfoForm.mintMethod === 'create') {
        if(allStepOutputs.keyPair.publicKey_minter === '') {
          throw new Error('publicKey_minter is empty!');
        }
        publicKey_let = allStepOutputs.keyPair.publicKey_minter;
        // 验证文件分片数
        if (
          allStepOutputs.encryptionSlicesMetadataCID.slicesMetadataCID_encryption === '' ||
          allStepOutputs.encryptionSlicesMetadataCID.slicesMetadataCID_iv === ''
        ) {
          throw new Error('slicesMetadataCID_encryption is empty!');
        }
        encryptionSlicesMetadataCID_let = allStepOutputs.encryptionSlicesMetadataCID;

        // 验证每个分片的加密数据
        for (let i = 0; i < allStepOutputs.encryptionFileCID.length; i++) {
          if (
            allStepOutputs.encryptionFileCID[i].fileCID_iv === '' || 
            allStepOutputs.encryptionFileCID[i].fileCID_encryption === ''
          ) {
            throw new Error('encryptionFileCID is empty!');
          }
        }

        // 验证密码加密数据
        if(
          allStepOutputs.encryptionPasswords.password_iv === '' ||
          allStepOutputs.encryptionPasswords.password_encryption === ''
        ) {
          throw new Error('encryptionData is empty!');
        } 
      } else {
        throw new Error('mintMethod is invalid!');
      }

      // 创建 MetadataBox 对象
      const metadataBox: MetadataBoxType = {
        ...initialMetadataBox,
        // BoxInfo 数据
        typeOfCrime: boxInfoForm.typeOfCrime,
        label: boxInfoForm.label || [], // 新增的 label 属性
        title: boxInfoForm.title,
        country: boxInfoForm.country,
        state: boxInfoForm.state,
        description: boxInfoForm.description,
        eventDate: boxInfoForm.eventDate,
        createDate: allStepOutputs.currentTime.createDate,
        timestamp: Number(allStepOutputs.currentTime.timestamp), // 转换为 number
        // 图片数据
        nftImage: `ipfs://${allStepOutputs.nftImageCid}`,
        boxImage: `ipfs://${allStepOutputs.boxImageCid}`,
        // Mint 方法
        mintMethod: boxInfoForm.mintMethod,
        // 加密数据
        encryptionSlicesMetadataCID: encryptionSlicesMetadataCID_let,
        encryptionFileCID: allStepOutputs.encryptionFileCID,
        encryptionPasswords: allStepOutputs.encryptionPasswords,
        publicKey: publicKey_let,
        // 文件数据
        fileList: fileList_let,
        // password: '',
      };

      return metadataBox;
    } catch (error) {
      console.error('Create MetadataBox failed:', error);
      throw error;
    }
  },

  createMetadataNFT: async (
    boxInfoForm: BoxInfoFormType,
    allStepOutputs: AllStepOutputs,
  ) : Promise<MetadataNFTType> => {
    try {
      // 验证必需数据
      if(allStepOutputs.nftImageCid === '' ) {
        throw new Error('image is empty!');
      }

      // 创建 MetadataNFT 对象
      const metadataNFT: MetadataNFTType = {
        ...initialMetadataNFT,
        // 基础信息
        tokenId: '', // tokenId 在 mint 后由合约生成
        typeOfCrime: boxInfoForm.typeOfCrime,
        title: boxInfoForm.title,
        country: boxInfoForm.country,
        state: boxInfoForm.state,
        // 图片
        image: `ipfs://${allStepOutputs.nftImageCid}`,
        eventDate: boxInfoForm.eventDate,
        // 属性
        // attributes: [
        //   ...initialMetadataNFT.attributes,
        // ]
      };

      return metadataNFT;
    } catch (error) {
      console.error('Create MetadataNFT failed:', error);
      throw error;
    }
  },

  createResultData: (
    mintMethod: MintMethodType,
    fileCidList: string[],
    cidList: CIDIsExitingType[],
    isSuccess: boolean,
    timestamp: string,
  ) => {
    try {
      if (!timestamp) {
        throw (' timestamp is empty!');
      }
      if (fileCidList.length === 0) {
        throw (' fileCidList is empty!');
      }
      if (cidList.length === 0) {
        throw (' cidList is empty!');
      }

      const resultData: ResultDataType = {
        ...initialResultData,
        mintMethod: mintMethod,
        fileCidList: fileCidList,
        timestamp: timestamp,
        isSuccess: isSuccess,
        cidList: cidList.map(cid => cid.cid),
      };
      return resultData;
    } catch (error) {
      console.error('Create Result data JSON failed:', error);
      throw error;
    }
  }


}; 