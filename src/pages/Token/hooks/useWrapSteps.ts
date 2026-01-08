import { useCallback, useState, useEffect } from 'react';
import { writeStatus } from '../types';
import { TokenPair } from '../types';
import { useTokenOperations } from '../hooks/useTokenOperations';
import { useReadAllowance } from '@dapp/hooks/readContracts2/token/useReadAllowance';
import { useAccount } from 'wagmi';
import { formatUnits, parseUnits, maxUint256 } from 'viem';

export type StepStatus = 'wait' | 'process' | 'finish' | 'error';
export type StepKey = 'allowance' | 'approve' | 'wrap';

interface StepConfig {
    title: string;
    descriptions: Record<writeStatus, string>;
}

export interface StepItem {
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
        title: 'Approve',
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

type StepsState = {
    steps: StepItem[];
    currentIndex: number;
};

export const useWrapSteps = (tokenPair: TokenPair, amount: string) => {
    const { address } = useAccount();
    const { readAllowance, allowanceAmount } = useReadAllowance();
    const { wrap, approve, status, isLoading, isPending, isSuccessed, activeButton } = useTokenOperations();

    const [state, setState] = useState<StepsState>({
        steps: createSteps(false),
        currentIndex: 1, // allowance is done; start at first actionable step
    });

    const initializeSteps = useCallback((isEnough: boolean) => {
        const requiresApprove = !isEnough;
        const nextSteps = createSteps(requiresApprove);
        const nextCurrentIndex = 1; // always point to the first actionable step (approve or wrap)
        setState({
            steps: nextSteps,
            currentIndex: nextCurrentIndex,
        });
    }, []);

    const updateStepStatus = useCallback((stepKey: StepKey, status: writeStatus) => {
        if (import.meta.env.DEV) {
            console.log('updateStepStatus:', stepKey, status);
        }

        setState(prev => {
            const targetIndex = prev.steps.findIndex(step => step.stepKey === stepKey);
            if (targetIndex === -1) {
                return prev;
            }

            const mappedStatus = mapWriteStatusToStepStatus(status);
            const description = STEP_CONFIGS[stepKey].descriptions[status];

            const nextSteps = prev.steps.map((step, index) =>
                index === targetIndex
                    ? { ...step, status: mappedStatus, description }
                    : step,
            );

            let nextCurrentIndex = prev.currentIndex;
            const isCurrentStep = targetIndex === prev.currentIndex;
            const hasNextStep = targetIndex < nextSteps.length - 1;

            if (mappedStatus === 'finish' && isCurrentStep && hasNextStep) {
                nextCurrentIndex = targetIndex + 1;
            }

            return {
                steps: nextSteps,
                currentIndex: nextCurrentIndex,
            };
        });
    }, []);

    const { steps, currentIndex } = state;
    const currentStepItem = steps[currentIndex] ?? steps[steps.length - 1];


    // ---

    
    const checkAllowance = useCallback(async (checkType: 'init' | 'approve') => {
        if (!address || !tokenPair.erc20.address || !amount || !tokenPair.secret?.address) {
            return;
        }

        const amountInWei = parseUnits(amount, tokenPair.erc20.decimals);

        try {
            const result = await readAllowance(
                tokenPair.erc20.address,
                address,
                tokenPair.secret?.address,
                amountInWei,
            );
            if (checkType === 'init') {
                initializeSteps(result.isEnough);
            }
        } catch (error) {
            console.error('Check allowance error:', error);
            updateStepStatus('allowance', 'error');
        }
    }, [tokenPair, amount, readAllowance, address, initializeSteps]);

    useEffect(() => {
        
        if (activeButton === 'approve') {
            if (status !== 'idle') {
                updateStepStatus('approve', status);
            }
        } else if (activeButton === 'wrap') {
            if (status !== 'idle') {
                updateStepStatus('wrap', status);
            }
        } 
    }, [activeButton, status]);

    const handleApproveClick = useCallback(async () => {
        if (!tokenPair || !amount || !tokenPair.secret?.address) return;

        const amountInWei = parseUnits(amount, tokenPair.erc20.decimals);
        try {
            await approve(
                tokenPair.erc20.address,
                tokenPair.secret?.address,
                amountInWei,
            );
        } catch (error) {
            console.error('Handle approve click error:', error);
            updateStepStatus('approve', 'error');
        }
    }, [tokenPair, amount, approve, updateStepStatus]);

    const handleApproveMaxClick = useCallback(async () => {
        if (!tokenPair || !tokenPair.secret?.address) return;   
        const amountInWei = maxUint256;
        try {
            await approve(
                tokenPair.erc20.address,
                tokenPair.secret?.address,
                amountInWei,
            );
        } catch (error) {
            console.error('Handle approve max click error:', error);
            updateStepStatus('approve', 'error');
        }
    }, [tokenPair, approve, updateStepStatus]);

    const handleWrapClick = useCallback(async () => {
        if (!tokenPair || !amount || !tokenPair.secret?.address) return;
        await wrap(
            tokenPair.secret?.address,
            amount,
            tokenPair.erc20.decimals,
        );
    }, [tokenPair, amount, wrap]);


    return {
        steps,
        currentIndex,
        currentStepItem,
        initializeSteps,
        updateStepStatus,
        checkAllowance,
        handleApproveClick,
        handleApproveMaxClick,
        handleWrapClick,
        isPending,
        isLoading,
        isSuccessed,
        status,
        activeButton,
        allowanceAmount,
    };
};
