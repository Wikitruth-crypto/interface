import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  BoxInfoFormType,
  initialBoxInfoForm,
  AllInputFieldNames,
} from '../types/stateType';
import {
  CompressFilesOutput,
  UploadFilesOutput,
  EncryptDataOutput,
  UploadBoxImageOutput,
  CreateNFTImageOutput,
  UploadNFTImageOutput,
  MetadataBoxOutput,
  MetadataNFTOutput,
  MintOutput,
  UploadResultDataOutput,
  AllStepOutputs,
  createInitialAllStepOutputs,
} from '../types/stepType';
import type { UploadFile } from 'antd/es/upload/interface';

// NFT创建过程的状态类型
interface NFTCreateState {
  // Input data-------
  fileData: {
    fileList: UploadFile[];
    boxImageList: UploadFile[];
  };
  boxInfoForm: BoxInfoFormType;
  isTestMode:boolean; // 是否是测试模式
  // ---------input change tracking-------
  changedFields: AllInputFieldNames[];
  baselineVersion: number;

  // ------工作流生成的数据--------
  allStepOutputs: AllStepOutputs;


}

// 定义状态修改方法
interface NFTCreateActions {
  // 文件管理
  updateFileList: (fileList: UploadFile[]) => void;
  updateBoxImageList: (boxImageList: UploadFile[]) => void;
  updateBoxInfoForm: (field: keyof BoxInfoFormType, value: any) => void;
  setChangedFields: (fields: AllInputFieldNames[]) => void;
  // 工作流生成的数据
  updateCompressFilesOutput: (compressFilesOutput: CompressFilesOutput) => void;
  updateUploadFilesOutput: (uploadFilesOutput: UploadFilesOutput) => void;
  updateEncryptDataOutput: (encryptDataOutput: EncryptDataOutput) => void;
  updateUploadBoxImageOutput: (uploadBoxImageOutput: UploadBoxImageOutput) => void;
  updateCreateNFTImageOutput: (createNFTImageOutput: CreateNFTImageOutput) => void;
  updateUploadNFTImageOutput: (uploadNFTImageOutput: UploadNFTImageOutput) => void;
  updateMetadataBoxOutput: (metadataBoxOutput: MetadataBoxOutput) => void;
  updateMetadataNFTOutput: (metadataNFTOutput: MetadataNFTOutput) => void;
  updateMintOutput: (mintOutput: MintOutput) => void;
  updateUploadResultDataOutput: (uploadResultDataOutput: UploadResultDataOutput) => void;


  // 重置
  resetAllCreateStore: () => void;
  markBaseline: () => void;
}

// 组合状态和动作
type NFTCreateStore = NFTCreateState & NFTCreateActions;

// 初始状态
const initialState: NFTCreateState = {
  fileData: {
    fileList: [],
    boxImageList: [], 
  },
  boxInfoForm: initialBoxInfoForm,
  isTestMode: false,
  // 变更字段列表（细粒度追踪）
  changedFields: [],
  baselineVersion: 0,
  allStepOutputs: createInitialAllStepOutputs(),

};

// 创建store
export const useNFTCreateStore = create<NFTCreateStore>()(
  devtools(
    (set) => ({
      ...initialState,
      // 文件管理方法
      updateFileList: (fileList) =>
        set((state) => ({
          fileData: { ...state.fileData, fileList }
        }), false, 'updateFileList'),

      updateBoxImageList: (boxImageList) =>
        set((state) => ({
          fileData: { ...state.fileData, boxImageList }
        }), false, 'updateBoxImageList'),

      // BoxInfo更新方法
      updateBoxInfoForm: (field, value) =>
        set((state) => ({
          boxInfoForm: { ...state.boxInfoForm, [field]: value }
        }), false, 'updateBoxInfoForm'),

      setChangedFields: (fields: AllInputFieldNames[]) =>
        set((state) => ({
          ...state,
          changedFields: fields,
        }), false, 'setChangedFields'),

      updateCompressFilesOutput: (compressFilesOutput: CompressFilesOutput) =>
        set((state) => ({
          allStepOutputs: { ...state.allStepOutputs, ...compressFilesOutput }
        }), false, 'updateCompressFilesOutput'),

      updateUploadFilesOutput: (uploadFilesOutput: UploadFilesOutput) =>
        set((state) => ({
          allStepOutputs: { ...state.allStepOutputs, ...uploadFilesOutput }
        }), false, 'updateUploadFilesOutput'),

      updateEncryptDataOutput: (encryptDataOutput: EncryptDataOutput) =>
        set((state) => ({
          allStepOutputs: { ...state.allStepOutputs, ...encryptDataOutput }
        }), false, 'updateEncryptDataOutput'),

      updateUploadBoxImageOutput: (uploadBoxImageOutput: UploadBoxImageOutput) =>
        set((state) => ({
          allStepOutputs: { ...state.allStepOutputs, ...uploadBoxImageOutput }
        }), false, 'updateUploadBoxImageOutput'),

      updateCreateNFTImageOutput: (createNFTImageOutput: CreateNFTImageOutput) =>
        set((state) => ({
          allStepOutputs: { ...state.allStepOutputs, ...createNFTImageOutput }
        }), false, 'updateCreateNFTImageOutput'),

      updateUploadNFTImageOutput: (uploadNFTImageOutput: UploadNFTImageOutput) =>
        set((state) => ({
          allStepOutputs: { ...state.allStepOutputs, ...uploadNFTImageOutput }
        }), false, 'updateUploadNFTImageOutput'),

      updateMetadataBoxOutput: (metadataBoxOutput: MetadataBoxOutput) =>
        set((state) => ({
          allStepOutputs: { ...state.allStepOutputs, ...metadataBoxOutput }
        }), false, 'updateMetadataBoxOutput'),

      updateMetadataNFTOutput: (metadataNFTOutput: MetadataNFTOutput) =>
        set((state) => ({
          allStepOutputs: { ...state.allStepOutputs, ...metadataNFTOutput }
        }), false, 'updateMetadataNFTOutput'),

      updateMintOutput: (mintOutput: MintOutput) =>
        set((state) => ({
          allStepOutputs: { ...state.allStepOutputs, ...mintOutput }
        }), false, 'updateMintOutput'),

      updateUploadResultDataOutput: (uploadResultDataOutput: UploadResultDataOutput) =>
        set((state) => ({
          allStepOutputs: { ...state.allStepOutputs, ...uploadResultDataOutput }
        }), false, 'updateUploadResultDataOutput'),

      resetAllCreateStore: () =>
        set((state) => ({
          fileData: {
            fileList: [],
            boxImageList: [],
          },
          boxInfoForm: initialBoxInfoForm,
          changedFields: [],
          baselineVersion: state.baselineVersion + 1,
          allStepOutputs: createInitialAllStepOutputs(),
        }), false, 'resetAllCreateStore'),

      markBaseline: () =>
        set((state) => ({
          baselineVersion: state.baselineVersion + 1,
        }), false, 'markBaseline'),

    }),
    { name: 'nft-create-store' }
  )
); 
