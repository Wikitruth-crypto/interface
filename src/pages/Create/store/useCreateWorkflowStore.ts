import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  ExtendedMintProgressType,
  StepNameType,
  WorkflowStatus,
  allSteps,
} from '../types/workflowStateType';

interface CreateWorkflowState {
  workflowStatus: WorkflowStatus;
  completedSteps: StepNameType[];
  currentStep: StepNameType | null;
  createProgress: ExtendedMintProgressType;
  errorMessage: string | null;
  isResultDataUploaded: boolean;
  isCreateFailed: boolean;
  isCancel: boolean;
}

interface CreateWorkflowActions {
  updateCreateProgress: (field: keyof ExtendedMintProgressType, value: any) => void;
  setCompletedSteps: (completedSteps: StepNameType[]) => void;
  addCompletedStep: (step: StepNameType) => void;
  setCurrentStep: (currentStep: StepNameType | null) => void;
  updateWorkflowStatus: (workflowStatus: WorkflowStatus) => void;
  updateErrorMessage: (errorMessage: string | null) => void;
  setIsResultDataUploaded: (isResultDataUploaded: boolean) => void;
  setIsCreateFailed: (isCreateFailed: boolean) => void;
  setIsCancel: (isCancel: boolean) => void;

  startWorkflow: () => void;
  completeWorkflow: () => void;
  failWorkflow: (error: string, failedStepIndex?: number) => void;
  cancelWorkflow: () => void;
  resetCreateProgressList: (steps:StepNameType[]) => void;

  resetCreateProgress: () => void;
  resetAllWorkflowStore: () => void;
}

type CreateWorkflowStore = CreateWorkflowState & CreateWorkflowActions;

const initialMintProgress: ExtendedMintProgressType = {
  compressFiles_Progress: 0,
  uploadFiles_Progress: 0,
  encryptData_Progress: 0,
  uploadBoxImage_Progress: 0,
  createNFTImage_Progress: 0,
  uploadNFTImage_Progress: 0,
  metadataNFT_Progress: 0,
  metadataBox_Progress: 0,
  mint_Progress: 0,
  uploadResultData_Progress: 0,

  compressFiles_status: 'pending',
  compressFiles_Error: '',

  uploadFiles_status: 'pending',
  uploadFiles_Error: '',

  encryptData_status: 'pending',
  encryptData_Error: '',

  uploadBoxImage_status: 'pending',
  uploadBoxImage_Error: '',

  createNFTImage_status: 'pending',
  createNFTImage_Error: '',

  uploadNFTImage_status: 'pending',
  uploadNFTImage_Error: '',

  metadataBox_status: 'pending',
  metadataBox_Error: '',

  metadataNFT_status: 'pending',
  metadataNFT_Error: '',

  mint_status: 'pending',
  mint_Error: '',

  uploadResultData_status: 'pending',
  uploadResultData_Error: '',
};

const initialState: CreateWorkflowState = {
  workflowStatus: 'idle',
  completedSteps: [],
  currentStep: null,
  createProgress: initialMintProgress,
  errorMessage: null,
  isResultDataUploaded: false,
  isCreateFailed: false,
  isCancel: false,
};

export const useCreateWorkflowStore = create<CreateWorkflowStore>()(
  devtools(
    (set) => ({
      ...initialState,

      updateCreateProgress: (field, value) =>
        set(
          (state) => ({
            createProgress: { ...state.createProgress, [field]: value },
          }),
          false,
          'updateCreateProgress',
        ),

      setCompletedSteps: (completedSteps: StepNameType[]) =>
        set(
          (state) => ({
            ...state,
            completedSteps,
          }),
          false,
          'setCompletedSteps',
        ),

      addCompletedStep: (step: StepNameType) =>
        set(
          (state) => {
            if (state.completedSteps.includes(step)) {
              return { completedSteps: state.completedSteps };
            }
            return {
              completedSteps: [...state.completedSteps, step],
            };
          },
          false,
          'addCompletedStep',
        ),

      setCurrentStep: (currentStep: StepNameType | null) =>
        set(
          () => ({
            currentStep,
          }),
          false,
          'setCurrentStep',
        ),

      updateWorkflowStatus: (workflowStatus) =>
        set(
          (state) => ({
            ...state,
            workflowStatus,
          }),
          false,
          'updateWorkflowStatus',
        ),

      updateErrorMessage: (errorMessage) =>
        set(
          (state) => ({
            ...state,
            errorMessage,
          }),
          false,
          'updateErrorMessage',
        ),

      setIsResultDataUploaded: (isResultDataUploaded) =>
        set(
          (state) => ({
            ...state,
            isResultDataUploaded,
          }),
          false,
          'setIsResultDataUploaded',
        ),

      setIsCreateFailed: (isCreateFailed) =>
        set(
          (state) => ({
            ...state,
            isCreateFailed,
          }),
          false,
          'setIsCreateFailed',
        ),

      setIsCancel: (isCancel) =>
        set(
          (state) => ({
            ...state,
            isCancel,
          }),
          false,
          'setIsCancel',
        ),

      startWorkflow: () =>
        set(
          (state) => ({
            workflowStatus: 'processing',
            currentStep: null,
            isCreateFailed: false,
            isCancel: false,
            errorMessage: null,
            createProgress: {
              ...state.createProgress,
              compressFiles_Error: '',
              uploadFile_Error: '',
              encryptData_Error: '',
              uploadBoxImage_Error: '',
              createNFTImage_Error: '',
              uploadNFTImage_Error: '',
              metadataBox_Error: '',
              metadataNFT_Error: '',
              mint_Error: '',
              uploadResultData_Error: '',
            },
          }),
          false,
          'startWorkflow',
        ),

      completeWorkflow: () =>
        set(
          (state) => ({
            ...state,
            workflowStatus: 'success',
            isCreateFailed: false,
            isCancel: false,
            errorMessage: null,
            currentStep: null,
          }),
          false,
          'completeWorkflow',
        ),

      failWorkflow: (error, failedStepIndex) =>
        set(
          (state) => {
            const stepByIndex =
              typeof failedStepIndex === 'number' && failedStepIndex >= 0 && failedStepIndex < allSteps.length
                ? allSteps[failedStepIndex]
                : null;
            return {
              ...state,
              workflowStatus: 'error',
              isCreateFailed: true,
              isCancel: false,
              errorMessage: error,
              currentStep: stepByIndex ?? state.currentStep,
            };
          },
          false,
          'failWorkflow',
        ),

      cancelWorkflow: () =>
        set(
          (state) => ({
            ...state,
            workflowStatus: 'cancelled',
            isCancel: true,
            isCreateFailed: true,
            errorMessage: null,
          }),
          false,
          'cancelWorkflow',
        ),
      // Reset workflow, only reset specified steps
      resetCreateProgressList: (steps: StepNameType[]) =>
        set(
          (state) => {
            const newCreateProgress: ExtendedMintProgressType = { ...state.createProgress };
            
            // Iterate steps to reset
            for (const step of steps) {

              // Reset progress to 0
              newCreateProgress[`${step}_Progress`] = 0;
              // Reset status to pending
              newCreateProgress[`${step}_status`] = 'pending';
              // Clear error message
              newCreateProgress[`${step}_Error`] = '';
            }
            return {
              ...state,
              createProgress: newCreateProgress,
            };
          },
          false,
          'resetCreateProgressList',
        ),

      resetCreateProgress: () =>
        set(
          (state) => ({
            ...state,
            createProgress: initialMintProgress,
          }),
          false,
          'resetCreateProgress',
        ),

      resetAllWorkflowStore: () =>
        set(
          () => ({
            ...initialState,
            createProgress: initialMintProgress,
          }),
          false,
          'resetAllWorkflowStore',
        ),
    }),
    { name: 'workflow-store' },
  ),
);
