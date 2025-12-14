/**
 * 工作流核心类型定义
 * 
 * 此文件定义了工作流系统的所有核心类型
 */

// import { AllInputFieldNames } from "@/dapp/pages/Create/types/stateType";
import { StepNameType } from "@/dapp/pages/Create/types/workflowStateType";
import { StepStatus, } from "@/dapp/pages/Create/types/workflowStateType";
import { AllStepOutputs, } from "@/dapp/pages/Create/types/stepType";

/**
 * 工作流步骤接口
 * 
 * 所有工作流步骤必须实现此接口
 * 
 * @template TInput - 步骤输入类型
 * @template TOutput - 步骤输出类型
 */
export interface WorkflowStep<TInput = any, TOutput = any> {
  /** 步骤唯一标识 */
  name: StepNameType;
  
  /** 步骤描述 */
  description: string;
  
  
  /**
   * 执行步骤逻辑
   * @param input - 上一步的输出（或初始输入）
   * @param context - 工作流上下文
   * @returns 步骤输出（传递给下一步）
   */
  execute: (input: TInput, context: WorkflowContext) => Promise<TOutput>;
  
  /**
   * 验证输入数据（可选）
   * @param input - 输入数据
   * @returns 验证是否通过
   */
  validate?: (input: TInput) => boolean | Promise<boolean>;
  
  /**
   * 是否可以跳过此步骤（可选）
   * @param input - 输入数据
   * @param context - 工作流上下文
   * @returns 是否跳过
   */
  canSkip?: (input: TInput, context: WorkflowContext) => boolean | Promise<boolean>;
  
  /**
   * 成功回调（可选）
   * @param output - 步骤输出
   * @param context - 工作流上下文
   */
  onSuccess?: (output: TOutput, context: WorkflowContext) => void | Promise<void>;
  
  /**
   * 错误回调（可选）
   * @param error - 错误对象
   * @param context - 工作流上下文
   */
  onError?: (error: Error, context: WorkflowContext) => void | Promise<void>;
}

// ============ 工作流上下文接口 ============

/**
 * 工作流上下文
 * 
 * 为步骤执行提供通用能力和状态访问
 */
export interface WorkflowContext {
  /**
   * 更新步骤进度
   * @param stepName - 步骤名称
   * @param status - 步骤状态
   * @param progress - 进度百分比 (0-100)
   */
  updateProgress: (stepName: StepNameType, status: StepStatus, progress?: number) => void;
  
  /**
   * 检查工作流是否已被取消
   * @returns 是否已取消
   */
  isCancelled: () => boolean;

  /**
   * 如果已取消则抛出 WorkflowCancelledError
   */
  throwIfCancelled: () => void;
  
  /**
   * 获取当前步骤索引
   * @returns 当前步骤索引
   */
  getCurrentStep: () => StepNameType | null;
  
  /**
   * 设置当前步骤索引
   * @param step - 步骤索引
   */
  setCurrentStep: (step: StepNameType) => void;

  getCompletedSteps: () => StepNameType[];

  addCompletedStep: (step: StepNameType) => void;
  
  /**
   * 处理错误
   * @param error - 错误对象
   */
  handleError: (error: Error) => void;
  
  /**
   * 记录日志
   * @param message - 日志消息
   * @param level - 日志级别
   */
  log: (message: string, level?: 'info' | 'warn' | 'error') => void;
  
  /**
   * 获取 Store 数据
   * @template T - Store 类型
   * @returns Store 数据
   */
  getStore: <T = any>() => T;
  
  /**
   * 更新 Store 数据
   * @param updater - 更新函数
   */
  updateStore: (updater: (store: any) => void) => void;
  
  // 🆕 已完成步骤集合（用于判断，支持字符串 ID）
  completedSteps: StepNameType[];

  currentStep: StepNameType | null;
}

// ============ 工作流结果类型 ============

/**
 * 工作流执行成功结果
 */
export interface WorkflowSuccessResult<T = any> {
  success: true;
  data: T;
  duration: number; // 执行时长（毫秒）
  completedSteps: StepNameType[]; // 完成的步骤数
}

/**
 * 工作流执行失败结果
 */
export interface WorkflowErrorResult {
  success: false;
  error: Error;
  currentStep: StepNameType | null; // 失败的步骤名称
  duration: number;
}

/**
 * 工作流执行取消结果
 */
export interface WorkflowCancelledResult {
  success: false;
  cancelled: true;
  message: string;
  completedSteps: StepNameType[];
}

/**
 * 工作流执行结果（联合类型）
 */
export type WorkflowResult<T = any> = 
  | WorkflowSuccessResult<T>
  | WorkflowErrorResult
  | WorkflowCancelledResult;

// ============ 工作流配置类型 ============

/**
 * 工作流配置
 */
export interface WorkflowConfig {
  /** 工作流名称 */
  name: string;
  
  /** 是否启用日志 */
  enableLogging?: boolean;
  
  /** 是否启用进度报告 */
  enableProgress?: boolean;
  
  /** 失败后是否自动重试 */
  autoRetry?: boolean;
  
  /** 自动重试次数 */
  retryCount?: number;
  
  /** 重试延迟（毫秒） */
  retryDelay?: number;
}

// ============ 工作流错误类型 ============

/**
 * 工作流取消错误
 */
export class WorkflowCancelledError extends Error {
  constructor(message = 'Workflow was cancelled by user') {
    super(message);
    this.name = 'WorkflowCancelledError';
  }
}

/**
 * 工作流步骤错误
 */
export class WorkflowStepError extends Error {
  constructor(
    public stepName: StepNameType,
    // public stepIndex: number,
    public originalError: Error
  ) {
    super(`Step "${stepName}"  failed: ${originalError.message}`);
    this.name = 'WorkflowStepError';
  }
}

/**
 * 工作流数据验证错误
 */
export class WorkflowValidationError extends Error {
  constructor(
    public field: string,
    public message: string
  ) {
    super(`Validation failed for "${field}": ${message}`);
    this.name = 'WorkflowValidationError';
  }
}

// ============ 工作流数据类型（NFT Create 特定）============

/**
 * 工作流初始输入数据
 */
export interface WorkflowInitialData {
  // 基本信息
  boxInfo: {
    title: string;
    description: string;
    label: string[];
    country: string;
    state: string;
    typeOfCrime: string;
    eventDate: string;
    nftOwner: string;
    price: string;
    mintMethod: 'create' | 'createAndPublish';
  };
  
  // 文件数据
  files: File[];
  boxImages: File[];
  isTestMode: boolean;
}

export type WorkflowPayload = WorkflowInitialData & {
  allStepOutputs: AllStepOutputs;
};


