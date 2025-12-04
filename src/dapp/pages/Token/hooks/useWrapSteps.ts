import { useState, useCallback } from 'react';
import { writeStatus } from '../types';

export type StepStatus = 'wait' | 'process' | 'finish' | 'error';
export type StepKey = 'allowance' | 'approve' | 'wrap';

interface StepConfig {
    title: string;
    descriptions: Record<writeStatus, string>;
}

interface StepItem {
    stepKey: StepKey;
    title: string;
    description: string;
    status: StepStatus;
}

const STEP_CONFIGS: Record<StepKey, StepConfig> = {
    allowance: {
        title: 'Checking allowance...',
        descriptions: {
            idle: 'Checking allowance...',
            pending: 'Checking allowance...',
            success: 'Allowance is enough',
            error: 'Checking allowance failed',
        },
    },
    approve: {
        title: 'Approve (if needed)',
        descriptions: {
            idle: 'Need to approve',
            pending: 'Approving...',
            success: 'Approve success',
            error: 'Approve failed',
        },
    },
    wrap: {
        title: 'Wrap',
        descriptions: {
            idle: 'Ready to wrap',
            pending: 'Executing wrap operation...',
            success: 'Wrap operation success',
            error: 'Wrap operation failed',
        },
    },
};

const mapWriteStatusToStepStatus = (status: writeStatus): StepStatus => {
    switch (status) {
        case 'pending':
            return 'process';
        case 'success':
            return 'finish';
        case 'error':
            return 'error';
        case 'idle':
        default:
            return 'wait';
    }
};

const createSteps = (requiresApprove: boolean): StepItem[] => {
    const steps: StepItem[] = [
        {
            stepKey: 'allowance',
            title: STEP_CONFIGS.allowance.title,
            description: STEP_CONFIGS.allowance.descriptions.success,
            status: 'finish',
        },
    ];

    if (requiresApprove) {
        steps.push({
            stepKey: 'approve',
            title: STEP_CONFIGS.approve.title,
            description: STEP_CONFIGS.approve.descriptions.idle,
            status: 'wait',
        });
    }

    steps.push({
        stepKey: 'wrap',
        title: STEP_CONFIGS.wrap.title,
        description: STEP_CONFIGS.wrap.descriptions.idle,
        status: 'wait',
    });

    return steps;
};

export const useWrapSteps = () => {
    const [steps, setSteps] = useState<StepItem[]>(createSteps(true));
    const [currentStep, setCurrentStep] = useState<number>(1);

    const initializeSteps = useCallback((isEnough: boolean) => {
        const nextSteps = createSteps(!isEnough);
        setSteps(nextSteps);
        setCurrentStep(Math.min(1, nextSteps.length - 1));
    }, []);

    const updateStepStatus = useCallback((stepKey: StepKey, status: writeStatus) => {
        let targetIndex = -1;
        let nextLength = 0;
        setSteps(prev => {
            nextLength = prev.length;
            targetIndex = prev.findIndex(step => step.stepKey === stepKey);
            if (targetIndex === -1) {
                return prev;
            }
            const mappedStatus = mapWriteStatusToStepStatus(status);
            const description = STEP_CONFIGS[stepKey].descriptions[status];
            const targetStep = prev[targetIndex];
            if (targetStep.status === mappedStatus && targetStep.description === description) {
                return prev;
            }
            return prev.map((step, index) => {
                if (index !== targetIndex) return step;
                return {
                    ...step,
                    description,
                    status: mappedStatus,
                };
            });
        });

        if (status === 'success' && targetIndex !== -1) {
            setCurrentStep(prev => {
                if (targetIndex !== prev) {
                    return prev;
                }
                const maxIndex = Math.max(0, nextLength - 1);
                return Math.min(prev + 1, maxIndex);
            });
        }
    }, []);

    return {
        steps,
        currentStep,
        initializeSteps,
        updateStepStatus,
    };
};
