import {
  WorkflowStep,
  WorkflowContext,
  WorkflowResult,
  WorkflowConfig,
  WorkflowStepError,
  WorkflowPayload,
  WorkflowCancelledError,
} from './types';
import { StepNameType } from '../../types/workflowStateType';
import { AllInputFieldNames } from '../../types/stateType';
import { WorkflowOrchestrator, PlanResult } from '../config/simple';
import { AllStepOutputs, createInitialAllStepOutputs } from '../../types/stepType';

type SmartExecutionOptions = {
  mode: string;
  changedFields?: AllInputFieldNames[];
};

export class SmartWorkflowOrchestrator<TOutput = any> {
  private steps = new Map<StepNameType, WorkflowStep>();
  private startTime = 0;
  private cancelled = false;

  constructor(
    private context: WorkflowContext,
    private config: Pick<WorkflowConfig, 'name' | 'enableLogging' | 'enableProgress'>
  ) {}

  registerStep(step: WorkflowStep): this {
    this.steps.set(step.name as StepNameType, step);
    return this;
  }

  registerSteps(steps: WorkflowStep[]): this {
    steps.forEach(step => this.registerStep(step));
    return this;
  }

  cancel(): void {
    this.cancelled = true;
  }

  async execute(initialData: Partial<WorkflowPayload>, options: SmartExecutionOptions): Promise<WorkflowResult<TOutput>> {
    this.startTime = Date.now();
    this.cancelled = false;
    const changedFields = options.changedFields ?? [];

    const plan = this.generatePlan(changedFields);

    this.context.updateStore(stores => {
      stores.nft?.setChangedFields?.([]);
      stores.nft?.markBaseline?.();
      stores.workflow?.resetCreateProgressList?.(plan.executionSteps);
    });

    this.log(`Plan generated. execution=[${plan.executionSteps.join(', ')}], skip=[${plan.skippableSteps.join(', ')}]`);

    let currentPayload = this.hydratePayload(initialData);

    if (plan.executionSteps.length === 0) {
      this.log('No steps need to run. Returning current state.');
      const completed = this.context.getCompletedSteps();
      return this.handleSuccess(currentPayload as unknown as TOutput, completed);
    }

    try {
      const finished: StepNameType[] = [];

      for (const stepName of plan.executionSteps) {
        const step = this.steps.get(stepName);
        if (!step) {
          this.log(`Step ${stepName} is not registered. Skipping.`, 'warn');
          continue;
        }

        if (this.cancelled || this.context.isCancelled()) {
          return this.handleCancelled(finished);
        }

        const stepInput = this.hydratePayload(currentPayload);

        if (step.validate && !(await step.validate(stepInput))) {
          throw new WorkflowStepError(stepName, new Error('Validation failed'));
        }

        this.context.setCurrentStep(stepName);
        this.context.updateProgress(stepName, 'processing', 0);

        try {
          const stepResult = await step.execute(stepInput, this.context);
          this.context.updateProgress(stepName, 'success', 100);
          this.context.addCompletedStep(stepName);
          finished.push(stepName);

          if (step.onSuccess) {
            await step.onSuccess(stepResult, this.context);
          }

          currentPayload = this.hydratePayload({
            ...stepInput,
            ...stepResult,
          });
        } catch (error: any) {
          if (error instanceof WorkflowCancelledError) {
            this.context.updateProgress(stepName, 'pending', 0);
            throw error;
          }
          this.context.updateProgress(stepName, 'error', 0);
          if (step.onError) {
            await step.onError(error, this.context);
          }
          throw new WorkflowStepError(stepName, error);
        }

        // In test mode, simulate execution time
        if (currentPayload.isTestMode) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }

      return this.handleSuccess(currentPayload as unknown as TOutput, this.context.getCompletedSteps());
    } catch (error: any) {
      if (error instanceof WorkflowCancelledError) {
        return this.handleCancelled(this.context.getCompletedSteps());
      }
      if (error instanceof WorkflowStepError && error.originalError instanceof WorkflowCancelledError) {
        return this.handleCancelled(this.context.getCompletedSteps());
      }
      return this.handleError(error);
    }
  }

  private generatePlan(changedFields: AllInputFieldNames[]): PlanResult {
    const completedSteps = this.context.getCompletedSteps();
    return WorkflowOrchestrator.generateExecutionPlan(completedSteps, changedFields);
  }

  private getPersistedOutputs(): AllStepOutputs {
    const stores = this.context.getStore<{ nft?: { allStepOutputs?: AllStepOutputs } }>();
    if (stores?.nft?.allStepOutputs) {
      return { ...stores.nft.allStepOutputs };
    }
    return createInitialAllStepOutputs();
  }

  private hydratePayload(base: Partial<WorkflowPayload>): WorkflowPayload {
    const persisted = this.getPersistedOutputs();
    return {
      ...persisted,
      ...base,
      allStepOutputs: persisted,
    } as WorkflowPayload;
  }

  private handleSuccess(data: TOutput, completedSteps: StepNameType[]): WorkflowResult<TOutput> {
    const duration = Date.now() - this.startTime;
    this.log(`Workflow finished successfully in ${duration}ms`);

    return {
      success: true,
      data,
      completedSteps,
      duration,
    };
  }

  private handleCancelled(completedSteps: StepNameType[]): WorkflowResult<TOutput> {
    const duration = Date.now() - this.startTime;
    this.log(`Workflow cancelled after ${duration}ms`, 'warn');

    return {
      success: false,
      cancelled: true,
      message: 'Workflow cancelled',
      completedSteps,
    };
  }

  private handleError(error: Error): WorkflowResult<TOutput> {
    const duration = Date.now() - this.startTime;
    this.context.handleError(error);
    this.log(`Workflow failed: ${error.message}`, 'error');

    return {
      success: false,
      error,
      currentStep: this.context.getCurrentStep(),
      duration,
    };
  }

  private log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    if (!this.config.enableLogging) return;
    const prefix = `[SmartWorkflow:${this.config.name}]`;
    switch (level) {
      case 'warn':
        console.warn(`${prefix} ${message}`);
        break;
      case 'error':
        console.error(`${prefix} ${message}`);
        break;
      default:
        if (import.meta.env.DEV) {
          console.log(`${prefix} ${message}`);
        }
        break;
    }
  }
}
