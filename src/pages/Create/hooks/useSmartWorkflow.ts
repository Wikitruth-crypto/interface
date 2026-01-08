/**
 * Smart Workflow Hook - Recommended
 * 
 * ✅ This is the latest workflow hook, integrating all smart features
 * 
 * Features:
 * - Unified workflow management, replacing all legacy workflow systems
 * - Use simple orchestrator (simple.ts) to calculate execution plan
 * - Support smart step skipping
 * - Support mode-aware configuration
 * - Support fine-grained field impact analysis
 * 
 * Usage:
 * ```typescript
 * const smartWorkflow = useSmartWorkflow();
 * const result = await smartWorkflow.startWorkflow();
 * const retryResult = await smartWorkflow.retryWorkflow();
 * ```
 */

import { useCallback, useMemo, useRef } from 'react';
import { useCreateWorkflowStore } from '../store/useCreateWorkflowStore';
import { useNFTCreateStore } from '../store/useNFTCreateStore';
import { MintMethodType } from '@dapp/types/typesDapp/metadata/metadataBox';
import { 
  SmartWorkflowOrchestrator,
  createWorkflowContext,
  prepareWorkflowData,
} from '../workflow/core';
import { StepNameType, allSteps } from '../types/workflowStateType';

// Import step creation functions
import {
  createCompressFilesStep,
  createUploadFilesStep,
  createEncryptDataStep,
  createUploadBoxImageStep,
  createCreateNFTImageStep,
  createUploadNFTImageStep,
  createMetadataBoxStep,
  createMetadataNFTStep,
  createMintStep,
  createUploadResultDataStep,
} from '../workflow/steps';

// Import dependencies needed for Mint step
import { useContractConfig, ContractName, useSupportedTokens } from '@dapp/config/contractsConfig';
import { useWriteCustorm } from '@/hooks/useWriteCustorm';

export interface SmartWorkflowResult {
  success: boolean;
  data?: any;
  error?: string;
  cancelled?: boolean;
  completedSteps?: StepNameType[];
  duration?: number;
}

export const useSmartWorkflow = () => {
  const workflowStore = useCreateWorkflowStore();
  const nftStore = useNFTCreateStore();
  const orchestratorRef = useRef<SmartWorkflowOrchestrator | null>(null);

  // Get Hook dependencies needed for Mint step
  const { writeCustorm } = useWriteCustorm();
  const contractConfig = useContractConfig(ContractName.TRUTH_BOX);
  const decimals = useSupportedTokens()[0]?.decimals;

  /**
   * Create smart orchestrator
   */
  const createOrchestrator = useCallback(() => {
    const context = createWorkflowContext();
    
    const orchestrator = new SmartWorkflowOrchestrator(context, {
      name: 'Smart NFT Create Workflow',
      enableLogging: true,
      enableProgress: true,
    });

    // Register all steps
    orchestrator
      .registerStep(createCompressFilesStep())
      .registerStep(createUploadFilesStep())
      .registerStep(createEncryptDataStep())
      .registerStep(createUploadBoxImageStep())
      .registerStep(createCreateNFTImageStep())
      .registerStep(createUploadNFTImageStep())
      .registerStep(createMetadataNFTStep())
      .registerStep(createMetadataBoxStep())
      .registerStep(createMintStep({
        writeCustorm,
        contractConfig,
        decimals,
      }))
      .registerStep(createUploadResultDataStep());

    return orchestrator;
  }, [writeCustorm, contractConfig, decimals]);

  /**
   * Start workflow
   */
  const startWorkflow = useCallback(async (): Promise<SmartWorkflowResult> => {
    let orchestrator: SmartWorkflowOrchestrator | null = null;
    try {
      const initialData = prepareWorkflowData();
      const mode = initialData.boxInfo.mintMethod as MintMethodType;
      const changedFields = [...(nftStore.changedFields || [])];

      workflowStore.startWorkflow();

      orchestrator = createOrchestrator();
      orchestratorRef.current = orchestrator;

      const result = await orchestrator.execute(initialData, {
        mode,
        changedFields,
      });

      if (result.success) {
        workflowStore.completeWorkflow();
        console.log('[useSmartWorkflow] Workflow completed successfully');
        return {
          success: true,
          data: result.data,
          completedSteps: result.completedSteps,
          duration: result.duration,
        };
      }

      if ('cancelled' in result && result.cancelled) {
        return {
          success: false,
          cancelled: true,
          error: result.message,
          completedSteps: result.completedSteps ?? [],
          duration: 0,
        };
      }

      const errorMessage = 'error' in result ? result.error.message : result.message;
      const completedSteps = 'completedSteps' in result ? result.completedSteps : [];
      const duration = 'duration' in result ? result.duration : 0;

      workflowStore.failWorkflow(errorMessage);
      return {
        success: false,
        error: errorMessage,
        completedSteps,
        duration,
      };
    } catch (error: any) {
      if (error?.name === 'WorkflowCancelledError') {
        return {
          success: false,
          cancelled: true,
          error: error.message,
        };
      }
      console.error('[useSmartWorkflow] Workflow failed:', error);
      workflowStore.failWorkflow(error?.message ?? String(error));
      return {
        success: false,
        error: error?.message ?? String(error),
      };
    } finally {
      if (orchestratorRef.current === orchestrator) {
        orchestratorRef.current = null;
      }
    }
  }, [workflowStore, createOrchestrator, nftStore.changedFields]);

  /**
   * Cancel workflow
   */
  const cancelWorkflow = useCallback(() => {
    workflowStore.cancelWorkflow();
    orchestratorRef.current?.cancel();
  }, [workflowStore]);

  /**
   * Reset workflow
   */
  const resetWorkflow = useCallback(() => {
    orchestratorRef.current?.cancel();
    orchestratorRef.current = null;

    workflowStore.resetAllWorkflowStore();

    nftStore.setChangedFields([]);
    useNFTCreateStore.getState().markBaseline();
  }, [workflowStore, nftStore]);

  /**
   * Get completed steps
   */
  const getCompletedSteps = useCallback((): StepNameType[] => {
    return [...useCreateWorkflowStore.getState().completedSteps];
  }, []);

  /**
   * Get step index
   */
  const getStepIndex = useCallback((stepName: string): number => {
    return allSteps.indexOf(stepName as StepNameType);
  }, []);

  /**
   * Check data validity
   */
  const checkData = useCallback((): boolean => {
    try {
      const data = prepareWorkflowData();
      return !!data;
    } catch (error) {
      console.error('[useSmartWorkflow] Data validation failed:', error);
      return false;
    }
  }, []);

  /**
   * Derived state: Can start creation
   */
  const canStart = useMemo(() => {
    const { workflowStatus } = workflowStore;
    const isValid = checkData();
    return workflowStatus === 'idle' && isValid;
  }, [workflowStore.workflowStatus, checkData]);

  /**
   * Derived state: Can retry
   */
  const canRetry = useMemo(() => {
    const { workflowStatus, currentStep } = workflowStore;
    return (workflowStatus === 'error' || workflowStatus === 'cancelled') && currentStep !== null && currentStep !== 'uploadResultData';
  }, [workflowStore.workflowStatus, workflowStore.currentStep]);

  /**
   * Derived state: Can cancel
   */
  const canCancel = useMemo(() => {
    const { workflowStatus, currentStep, createProgress } = workflowStore;
    if (workflowStatus === 'success' || workflowStatus === 'cancelled') {
      return false;
    }
    if (currentStep === 'mint' && createProgress.mint_status === 'processing') {
      return false;
    }
    if (currentStep === 'uploadResultData') {
      return false;
    }
    return true;
  }, [
    workflowStore.workflowStatus, 
    workflowStore.currentStep, 
    workflowStore.createProgress.mint_status
  ]);

  return {
    // Main operations
    startWorkflow,
    cancelWorkflow,
    resetWorkflow,
    
    // State check
    checkData,
    canStart,
    canRetry,
    canCancel,
    
    // State retrieval
    workflowStatus: workflowStore.workflowStatus,
    currentStep: workflowStore.currentStep,
    changedFields: nftStore.changedFields,
    
    // Utility methods
    getCompletedSteps,
    getStepIndex
  };
};
