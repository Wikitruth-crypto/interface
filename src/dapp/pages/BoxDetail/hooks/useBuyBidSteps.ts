import { useCallback, useState, useEffect } from 'react';
import { useWriteCustormV2 } from '@/dapp/hooks/useWriteCustormV2';
import { useAllContractConfigs } from '@/dapp/contractsConfig';
import { useReadAllowance } from '@/dapp/hooks/readContracts2/token/useReadAllowance';
import { useAccount } from 'wagmi';
import { formatUnits, parseUnits, maxUint256 } from 'viem';
import { FunctionNameType } from '@/dapp/types/contracts';

type writeStatus = 'idle' | 'pending' | 'success' | 'error';
type StepStatus = 'wait' | 'process' | 'finish' | 'error';
type StepKey = 'allowance' | 'approve' | 'buy' | 'bid' | 'payConfiFee';

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
    buy: {
        title: 'Buy',
        descriptions: {
            idle: 'Ready to buy',
            pending: 'Executing buy operation...',
            success: 'Buy operation success',
            error: 'Buy operation failed',
        },
    },
    bid: {
        title: 'Bid',
        descriptions: {
            idle: 'Ready to bid',
            pending: 'Executing bid operation...',
            success: 'Bid operation success',
            error: 'Bid operation failed',
        },
    },
    payConfiFee: {
        title: 'PayConfiFee',
        descriptions: {
            idle: 'Ready to pay confidentiality fee',
            pending: 'Executing pay confidentiality fee operation...',
            success: 'Pay confidentiality fee operation success',
            error: 'Pay confidentiality fee operation failed',
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

const createSteps = (functionName: 'buy' | 'bid' | 'payConfiFee', isEnough: boolean): StepItem[] => {
    const steps: StepItem[] = [
        {
            stepKey: 'allowance',
            title: STEP_CONFIGS.allowance.title,
            description: STEP_CONFIGS.allowance.descriptions.success,
            status: 'wait',
        },
        
    ];
    if (!isEnough) {
        steps.push({
            stepKey: 'approve',
            title: STEP_CONFIGS.approve.title,
            description: STEP_CONFIGS.approve.descriptions.idle,
            status: 'wait',
        });
    }
    if (functionName === 'buy') {
        steps.push({
            stepKey: 'buy',
            title: STEP_CONFIGS.buy.title,
            description: STEP_CONFIGS.buy.descriptions.idle,
            status: 'wait',
        });
    } else if (functionName === 'bid') {
        steps.push({
            stepKey: 'bid',
            title: STEP_CONFIGS.bid.title,
            description: STEP_CONFIGS.bid.descriptions.idle,
            status: 'wait',
        });
    } else if (functionName === 'payConfiFee') {
        steps.push({
            stepKey: 'payConfiFee',
            title: STEP_CONFIGS.payConfiFee.title,
            description: STEP_CONFIGS.payConfiFee.descriptions.idle,
            status: 'wait',
        });
    }

    return steps;
};

type StepsState = {
    steps: StepItem[];
    currentIndex: number;
};

export const useBuyBidSteps = (
    boxId: string,
    tokenAddress: `0x${string}`,
    amount: string,
    functionName: 'buy' | 'bid' | 'payConfiFee',
) => {
    const allConfigs = useAllContractConfigs();
    const { address } = useAccount();
    const { readAllowance, allowanceAmount, isEnough } = useReadAllowance();
    const { writeCustormV2, status, isLoading, isSuccessed } = useWriteCustormV2(boxId);

    const [state, setState] = useState<StepsState>({
        steps: createSteps(functionName, false),
        currentIndex: 1, // allowance is done; start at first actionable step
    });

    const initializeSteps = useCallback((isEnough: boolean) => {
        const nextSteps = createSteps(functionName, isEnough);
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
        if (!address || !tokenAddress || !amount) {
            return;
        }
        const amountInWei = parseUnits(amount, 18);
        try {
            const result = await readAllowance(
                tokenAddress,
                address,
                allConfigs.FundManager.address,
                amountInWei,
            );
            if (checkType === 'init') {
                initializeSteps(result.isEnough);
                console.log('isEnough:', result.isEnough);
            }
        } catch (error) {
            console.error('Check allowance error:', error);
            updateStepStatus('allowance', 'error');
        }
    }, [tokenAddress, amount, readAllowance, address, initializeSteps]);

    const handleApproveClick = useCallback(async (isMax: boolean = false) => {
        if (!tokenAddress || !amount) return;
        const amountInWei = isMax ? maxUint256 : parseUnits(amount, 18);
        await writeCustormV2({
            contract: allConfigs.wROSE_Secret,
            functionName: 'approve',
            args: [allConfigs.FundManager.address, amountInWei],
        });
    }, [tokenAddress, amount, writeCustormV2]);

    const handleBuyBidClick = useCallback(async () => {
        if (!tokenAddress || !amount) return;
        let contract = allConfigs.Exchange;
        if (functionName === 'payConfiFee') {
            contract = allConfigs.TruthBox;
        }
        await writeCustormV2({
            contract: allConfigs.Exchange,
            functionName: functionName,
            args: [boxId],
        });
    }, [tokenAddress, amount, writeCustormV2]);


    return {
        steps,
        currentIndex,
        currentStepItem,
        initializeSteps,
        updateStepStatus,
        checkAllowance,
        handleApproveClick,
        handleBuyBidClick,
        isLoading,
        isEnough,
        isSuccessed,
        status,
        allowanceAmount,
    };
};
