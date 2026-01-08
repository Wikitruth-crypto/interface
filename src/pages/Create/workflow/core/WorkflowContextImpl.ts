/**
 * Workflow context implementation
 * 
 * Provides common capabilities for workflow steps:
 * 1. Progress update
 * 2. Cancel detection
 * 3. Store access
 * 4. Log recording
 */

import { WorkflowContext, WorkflowCancelledError } from './types';
import { useCreateWorkflowStore } from '../../store/useCreateWorkflowStore';
import { useNFTCreateStore } from '../../store/useNFTCreateStore';
import { allSteps, StepNameType, StepStatus } from '../../types/workflowStateType';

export class WorkflowContextImpl implements WorkflowContext {
    public currentStep: StepNameType | null = null;
    public completedSteps: StepNameType[] = [];

    constructor(
        private workflowStore: typeof useCreateWorkflowStore,
        private nftStore: typeof useNFTCreateStore
    ) { }

    /**
     * Update step progress
     */
    updateProgress(stepName: StepNameType, status: StepStatus, progress?: number): void {
        const state = this.workflowStore.getState();
        // ????????UI????
        const stepToUIStatus: Record<StepNameType, string> = {
            compressFiles: 'compressFiles',
            uploadFiles: 'uploadFile',
            encryptData: 'encryptData',
            uploadBoxImage: 'uploadBoxImage',
            createNFTImage: 'createNFTImage',
            uploadNFTImage: 'uploadNFTImage',
            metadataBox: 'metadataBox',
            metadataNFT: 'metadataNFT',
            mint: 'mint',
            uploadResultData: 'uploadResultData'
        };
        const uiStatusKey = stepToUIStatus[stepName] || stepName;

        // Update progress status
        (state.updateCreateProgress as any)(`${uiStatusKey}_status`, status);

        // Update progress percentage (if provided)
        if (progress !== undefined) {
            (state.updateCreateProgress as any)(`${uiStatusKey}_Progress`, progress);
        }

        // If it is an error status, clear the error message (ready to receive new errors)
        if (status === 'processing') {
            (state.updateCreateProgress as any)(`${uiStatusKey}_Error`, '');
        }
    }

    /**
     * Check if it has been cancelled
     */
    isCancelled(): boolean {
        const state = this.workflowStore.getState();
        return state.isCancel || state.workflowStatus === 'cancelled';
    }

    /**
     * If it has been cancelled, throw an error
     */
    throwIfCancelled(): void {
        if (this.isCancelled()) {
            throw new WorkflowCancelledError();
        }
    }

    /**
     * Get current step index
     */
    getCurrentStep(): StepNameType | null {
        const state = this.workflowStore.getState();
        // The last completed step
        return state.currentStep || null;
    }

    /**
     * Set current step index (supports string ID)
     */
    setCurrentStep(step: StepNameType): void {
        // Convert string ID to number index
        this.currentStep = step;
        const state = this.workflowStore.getState();
        // Add step to completed list
        state.setCurrentStep(step);
    }

    /**
     * Get completed steps
     */
    getCompletedSteps(): StepNameType[] {
        const state = this.workflowStore.getState();
        return state.completedSteps;
    }

    addCompletedStep(step: StepNameType): void {
        const state = this.workflowStore.getState();
        state.addCompletedStep(step);
    }

    /**
     * Get step index
     */
    private getStepIndex(step: StepNameType): number {
        const executionOrder = allSteps;
        return executionOrder.indexOf(step);
    }

    /**
     * Handle error
     */
    handleError(error: Error): void {
        const state = this.workflowStore.getState();
        state.updateWorkflowStatus('error');
        state.updateErrorMessage(error.message);
    }

    /**
     * Record log
     */
    log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
        const prefix = `[Workflow]`;

        switch (level) {
            case 'info':
                if (import.meta.env.DEV) {
                    console.log(`${prefix} ${message}`);
                }
                break;
            case 'warn':
                console.warn(`${prefix} ${message}`);
                break;
            case 'error':
                console.error(`${prefix} ${message}`);
                break;
        }
    }

    /**
     * Get Store data
     */
    getStore<T = any>(): T {
        return {
            workflow: this.workflowStore.getState(),
            nft: this.nftStore.getState(),
        } as T;
    }

    /**
     * Update Store data
     */
    updateStore(updater: (store: any) => void): void {
        const stores = {
            workflow: this.workflowStore.getState(),
            nft: this.nftStore.getState(),
        };

        updater(stores);
    }
}

/**
 * Create workflow context factory function
 * 
 * Use this function to create a context instance in a Hook
 */
export function createWorkflowContext(
    completedSteps?: StepNameType[]
    // skippableSteps?: Set<StepNameType>, 
    
): WorkflowContext {
    const context = new WorkflowContextImpl(
        useCreateWorkflowStore,
        useNFTCreateStore
    );

    if (completedSteps) {
        context.completedSteps = completedSteps;
    }

    return context;
}

