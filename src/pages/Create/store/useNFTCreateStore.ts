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

// NFT Creation Process State Type
interface NFTCreateState {
  // Input data-------
  fileData: {
    fileList: UploadFile[];
    boxImageList: UploadFile[];
  };
  boxInfoForm: BoxInfoFormType;
  isTestMode:boolean; // Whether in test mode
  // ---------input change tracking-------
  changedFields: AllInputFieldNames[];
  baselineVersion: number;

  // ------ Workflow Generated Data --------
  allStepOutputs: AllStepOutputs;


}

// Define State Modification Methods
interface NFTCreateActions {
  // File Management
  updateFileList: (fileList: UploadFile[]) => void;
  updateBoxImageList: (boxImageList: UploadFile[]) => void;
  updateBoxInfoForm: (field: keyof BoxInfoFormType, value: any) => void;
  setChangedFields: (fields: AllInputFieldNames[]) => void;
  // Workflow Generated Data
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


  // Reset
  resetAllCreateStore: () => void;
  markBaseline: () => void;
}

// Combine State and Actions
type NFTCreateStore = NFTCreateState & NFTCreateActions;

// Initial State
const initialState: NFTCreateState = {
  fileData: {
    fileList: [],
    boxImageList: [], 
  },
  boxInfoForm: initialBoxInfoForm,
  isTestMode: false,
  // Changed fields list (fine-grained tracking)
  changedFields: [],
  baselineVersion: 0,
  allStepOutputs: createInitialAllStepOutputs(),

};

// Create Store
export const useNFTCreateStore = create<NFTCreateStore>()(
  devtools(
    (set) => ({
      ...initialState,
      // File Management Methods
      updateFileList: (fileList) =>
        set((state) => ({
          fileData: { ...state.fileData, fileList }
        }), false, 'updateFileList'),

      updateBoxImageList: (boxImageList) =>
        set((state) => ({
          fileData: { ...state.fileData, boxImageList }
        }), false, 'updateBoxImageList'),

      // BoxInfo Update Methods
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
