/**
 * 工作流上下文实现
 * 
 * 为工作流步骤提供通用能力：
 * 1. 进度更新
 * 2. 取消检测
 * 3. Store 访问
 * 4. 日志记录
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
     * 更新步骤进度
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

        // 更新进度状态
        (state.updateCreateProgress as any)(`${uiStatusKey}_status`, status);

        // 更新进度百分比（如果提供）
        if (progress !== undefined) {
            (state.updateCreateProgress as any)(`${uiStatusKey}_Progress`, progress);
        }

        // 如果是错误状态，清空错误消息（准备接收新的错误）
        if (status === 'processing') {
            (state.updateCreateProgress as any)(`${uiStatusKey}_Error`, '');
        }
    }

    /**
     * 检查是否已取消
     */
    isCancelled(): boolean {
        const state = this.workflowStore.getState();
        return state.isCancel || state.workflowStatus === 'cancelled';
    }

    /**
     * 如果已取消则抛出错误
     */
    throwIfCancelled(): void {
        if (this.isCancelled()) {
            throw new WorkflowCancelledError();
        }
    }

    /**
     * 获取当前步骤索引
     */
    getCurrentStep(): StepNameType | null {
        const state = this.workflowStore.getState();
        // 最后一个完成的步骤
        return state.currentStep || null;
    }

    /**
     * 设置当前步骤索引（支持字符串 ID）
     */
    setCurrentStep(step: StepNameType): void {
        // 将字符串 ID 转换为数字索引
        this.currentStep = step;
        const state = this.workflowStore.getState();
        // 添加步骤到已完成列表
        state.setCurrentStep(step);
    }

    /**
     * 获取已完成步骤
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
     * 获取步骤索引
     */
    private getStepIndex(step: StepNameType): number {
        const executionOrder = allSteps;
        return executionOrder.indexOf(step);
    }

    /**
     * 处理错误
     */
    handleError(error: Error): void {
        const state = this.workflowStore.getState();
        state.updateWorkflowStatus('error');
        state.updateErrorMessage(error.message);
    }

    /**
     * 记录日志
     */
    log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
        const prefix = `[Workflow]`;

        switch (level) {
            case 'info':
                console.log(`${prefix} ${message}`);
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
     * 获取 Store 数据
     */
    getStore<T = any>(): T {
        return {
            workflow: this.workflowStore.getState(),
            nft: this.nftStore.getState(),
        } as T;
    }

    /**
     * 更新 Store 数据
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
 * 创建工作流上下文的工厂函数
 * 
 * 在 Hook 中使用此函数创建上下文实例
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

