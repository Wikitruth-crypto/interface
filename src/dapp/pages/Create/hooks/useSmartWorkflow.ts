/**
 * 智能工作流 Hook - 推荐使用
 * 
 * ✅ 这是最新的工作流 Hook，集成了所有智能功能
 * 
 * 功能：
 * - 统一的工作流管理，替代所有老旧的工作流系统
 * - 使用简易编排器（simple.ts）计算执行计划
 * - 支持智能跳过步骤
 * - 支持模式感知配置
 * - 支持细粒度字段影响分析
 * 
 * 使用方式：
 * ```typescript
 * const smartWorkflow = useSmartWorkflow();
 * const result = await smartWorkflow.startWorkflow();
 * const retryResult = await smartWorkflow.retryWorkflow();
 * ```
 */

import { useCallback, useMemo, useRef } from 'react';
import { useCreateWorkflowStore } from '../store/useCreateWorkflowStore';
import { useNFTCreateStore } from '../store/useNFTCreateStore';
import { MintMethodType } from '@/dapp/types/metadata/metadataBox';
import { 
  SmartWorkflowOrchestrator,
  createWorkflowContext,
  prepareWorkflowData,
} from '../workflow/core';
import { StepNameType, allSteps } from '../types/workflowStateType';

// 导入步骤创建函数
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

// 导入 Mint 步骤需要的依赖
import { useContractConfig, ContractName, useSupportedTokens } from '@/dapp/contractsConfig';
import { useWriteCustorm } from '@/dapp/hooks/useWriteCustorm';

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

  // 获取 Mint 步骤需要的 Hook 依赖
  const { writeCustorm } = useWriteCustorm();
  const contractConfig = useContractConfig(ContractName.TRUTH_BOX);
  const decimals = useSupportedTokens()[0]?.decimals;

  /**
   * 创建智能编排器
   */
  const createOrchestrator = useCallback(() => {
    const context = createWorkflowContext();
    
    const orchestrator = new SmartWorkflowOrchestrator(context, {
      name: 'Smart NFT Create Workflow',
      enableLogging: true,
      enableProgress: true,
    });

    // 注册所有步骤
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
   * 启动工作流
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
   * 取消工作流
   */
  const cancelWorkflow = useCallback(() => {
    workflowStore.cancelWorkflow();
    orchestratorRef.current?.cancel();
  }, [workflowStore]);

  /**
   * 重置工作流
   */
  const resetWorkflow = useCallback(() => {
    orchestratorRef.current?.cancel();
    orchestratorRef.current = null;

    workflowStore.resetAllWorkflowStore();

    nftStore.setChangedFields([]);
    useNFTCreateStore.getState().markBaseline();
  }, [workflowStore, nftStore]);

  /**
   * 获取已完成步骤
   */
  const getCompletedSteps = useCallback((): StepNameType[] => {
    return [...useCreateWorkflowStore.getState().completedSteps];
  }, []);

  /**
   * 获取步骤索引
   */
  const getStepIndex = useCallback((stepName: string): number => {
    return allSteps.indexOf(stepName as StepNameType);
  }, []);

  /**
   * 检查数据有效性
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
   * 派生状态：是否可以开始创建
   */
  const canStart = useMemo(() => {
    const { workflowStatus } = workflowStore;
    const isValid = checkData();
    return workflowStatus === 'idle' && isValid;
  }, [workflowStore.workflowStatus, checkData]);

  /**
   * 派生状态：是否可以重试
   */
  const canRetry = useMemo(() => {
    const { workflowStatus, currentStep } = workflowStore;
    return (workflowStatus === 'error' || workflowStatus === 'cancelled') && currentStep !== null && currentStep !== 'uploadResultData';
  }, [workflowStore.workflowStatus, workflowStore.currentStep]);

  /**
   * 派生状态：是否可以取消
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
    // 主要操作
    startWorkflow,
    cancelWorkflow,
    resetWorkflow,
    
    // 状态检查
    checkData,
    canStart,
    canRetry,
    canCancel,
    
    // 状态获取
    workflowStatus: workflowStore.workflowStatus,
    currentStep: workflowStore.currentStep,
    changedFields: nftStore.changedFields,
    
    // 工具方法
    getCompletedSteps,
    getStepIndex
  };
};
