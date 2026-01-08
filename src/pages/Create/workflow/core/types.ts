/**
 * Workflow Core Type Definitions
 * 
 * This file defines all core types for the workflow system
 */

// import { AllInputFieldNames } from "@Create/types/stateType";
import { StepNameType } from "@Create/types/workflowStateType";
import { StepStatus, } from "@Create/types/workflowStateType";
import { AllStepOutputs, } from "@Create/types/stepType";

/**
 * Workflow Step Interface
 * 
 * All workflow steps must implement this interface
 * 
 * @template TInput - Step input type
 * @template TOutput - Step output type
 */
export interface WorkflowStep<TInput = any, TOutput = any> {
  /** Step unique identifier */
  name: StepNameType;
  
  /** Step description */
  description: string;
  
  
  /**
   * Execute step logic
   * @param input - Previous step output (or initial input)
   * @param context - Workflow context
   * @returns Step output (passed to next step)
   */
  execute: (input: TInput, context: WorkflowContext) => Promise<TOutput>;
  
  /**
   * Validate input data (optional)
   * @param input - Input data
   * @returns Whether validation passed
   */
  validate?: (input: TInput) => boolean | Promise<boolean>;
  
  /**
   * Can skip this step (optional)
   * @param input - Input data
   * @param context - Workflow context
   * @returns Whether to skip
   */
  canSkip?: (input: TInput, context: WorkflowContext) => boolean | Promise<boolean>;
  
  /**
   * Success callback (optional)
   * @param output - Step output
   * @param context - Workflow context
   */
  onSuccess?: (output: TOutput, context: WorkflowContext) => void | Promise<void>;
  
  /**
   * Error callback (optional)
   * @param error - Error object
   * @param context - Workflow context
   */
  onError?: (error: Error, context: WorkflowContext) => void | Promise<void>;
}

// ============ Workflow Context Interface ============

/**
 * Workflow Context
 * 
 * Provides common capabilities and state access for step execution
 */
export interface WorkflowContext {
  /**
   * Update step progress
   * @param stepName - Step name
   * @param status - Step status
   * @param progress - Progress percentage (0-100)
   */
  updateProgress: (stepName: StepNameType, status: StepStatus, progress?: number) => void;
  
  /**
   * Check if workflow has been cancelled
   * @returns Whether cancelled
   */
  isCancelled: () => boolean;

  /**
   * Throw WorkflowCancelledError if cancelled
   */
  throwIfCancelled: () => void;
  
  /**
   * Get current step index
   * @returns Current step index
   */
  getCurrentStep: () => StepNameType | null;
  
  /**
   * Set current step index
   * @param step - Step index
   */
  setCurrentStep: (step: StepNameType) => void;

  getCompletedSteps: () => StepNameType[];

  addCompletedStep: (step: StepNameType) => void;
  
  /**
   * Handle error
   * @param error - Error object
   */
  handleError: (error: Error) => void;
  
  /**
   * Log message
   * @param message - Log message
   * @param level - Log level
   */
  log: (message: string, level?: 'info' | 'warn' | 'error') => void;
  
  /**
   * Get Store data
   * @template T - Store type
   * @returns Store data
   */
  getStore: <T = any>() => T;
  
  /**
   * Update Store data
   * @param updater - Updater function
   */
  updateStore: (updater: (store: any) => void) => void;
  
  // 🆕 Completed steps set (for judgment, supports string ID)
  completedSteps: StepNameType[];

  currentStep: StepNameType | null;
}

// ============ Workflow Result Types ============

/**
 * Workflow Execution Success Result
 */
export interface WorkflowSuccessResult<T = any> {
  success: true;
  data: T;
  duration: number; // Execution duration (ms)
  completedSteps: StepNameType[]; // Completed steps
}

/**
 * Workflow Execution Failure Result
 */
export interface WorkflowErrorResult {
  success: false;
  error: Error;
  currentStep: StepNameType | null; // Failed step name
  duration: number;
}

/**
 * Workflow Execution Cancelled Result
 */
export interface WorkflowCancelledResult {
  success: false;
  cancelled: true;
  message: string;
  completedSteps: StepNameType[];
}

/**
 * Workflow Execution Result (Union Type)
 */
export type WorkflowResult<T = any> = 
  | WorkflowSuccessResult<T>
  | WorkflowErrorResult
  | WorkflowCancelledResult;

// ============ Workflow Config Types ============

/**
 * Workflow Configuration
 */
export interface WorkflowConfig {
  /** Workflow name */
  name: string;
  
  /** Enable logging */
  enableLogging?: boolean;
  
  /** Enable progress reporting */
  enableProgress?: boolean;
  
  /** Auto retry on failure */
  autoRetry?: boolean;
  
  /** Auto retry count */
  retryCount?: number;
  
  /** Retry delay (ms) */
  retryDelay?: number;
}

// ============ Workflow Error Types ============

/**
 * Workflow Cancelled Error
 */
export class WorkflowCancelledError extends Error {
  constructor(message = 'Workflow was cancelled by user') {
    super(message);
    this.name = 'WorkflowCancelledError';
  }
}

/**
 * Workflow Step Error
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
 * Workflow Data Validation Error
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

// ============ Workflow Data Types (NFT Create Specific) ============

/**
 * Workflow Initial Input Data
 */
export interface WorkflowInitialData {
  // Basic Info
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
  
  // File Data
  files: File[];
  boxImages: File[];
  isTestMode: boolean;
}

export type WorkflowPayload = WorkflowInitialData & {
  allStepOutputs: AllStepOutputs;
};


