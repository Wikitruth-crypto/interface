import { useCallback, useState, useEffect } from 'react';
import { useTokenOperations } from '../hooks/useTokenOperations';
import { ContractConfig } from '@/dapp/contractsConfig/types';
import { useReadAllowance } from '@/dapp/hooks/readContracts2/token/useReadAllowance';
import { useAccount } from 'wagmi';
import { formatUnits, parseUnits, maxUint256 } from 'viem';
import { FunctionNameType } from '@/dapp/types/contracts';

type writeStatus = 'idle' | 'pending' | 'success' | 'error';
type StepStatus = 'wait' | 'process' | 'finish' | 'error';
type StepKey = "eip712Permit"|'allowance' | 'approve' | 'buy' | 'bid';

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
    eip712Permit: {
        title: 'EIP712 Permit',
        descriptions: {
            idle: 'Need to sign EIP712 permit',
            pending: 'Signing EIP712 permit...',
            success: 'EIP712 permit signed',
            error: 'Signing EIP712 permit failed',
        },
    },
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
    }
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

const createSteps = (functionName: FunctionNameType): StepItem[] => {
    const steps: StepItem[] = [
        {
            stepKey: 'eip712Permit',
            title: STEP_CONFIGS.eip712Permit.title,
            description: STEP_CONFIGS.eip712Permit.descriptions.idle,
            status: 'wait',
        },
        {
            stepKey: 'allowance',
            title: STEP_CONFIGS.allowance.title,
            description: STEP_CONFIGS.allowance.descriptions.success,
            status: 'wait',
        },
        {
            stepKey: 'approve',
            title: STEP_CONFIGS.approve.title,
            description: STEP_CONFIGS.approve.descriptions.idle,
            status: 'wait',
        },
    ];
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
    }

    return steps;
};

type StepsState = {
    steps: StepItem[];
    currentIndex: number;
};

export const useBoxDetailSteps = (
    boxId: string,
    tokenAddress: `0x${string}`, 
    amount: string,
    contract: ContractConfig,
    functionName: FunctionNameType,
) => {
    const { address } = useAccount();
    const { readAllowance, allowanceAmount } = useReadAllowance();
    const { wrap, approve, status, isLoading, isPending, isSuccessed, activeButton } = useTokenOperations();

    const [state, setState] = useState<StepsState>({
        steps: createSteps(functionName),
        currentIndex: 1, // allowance is done; start at first actionable step
    });

    const initializeSteps = useCallback((isEnough: boolean) => {
        const nextSteps = createSteps(functionName);
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
                console.log('isEnough:', result.isEnough);
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
        await approve(
            tokenPair.erc20.address,
            tokenPair.secret?.address,
            amount,
            tokenPair.erc20.decimals,
        );
    }, [tokenPair, amount, approve]);

    const handleApproveMaxClick = useCallback(async () => {
        if (!tokenPair || !amount || !tokenPair.secret?.address) return;
        await approve(
            tokenPair.erc20.address,
            tokenPair.secret?.address,
            maxUint256.toString(),
            tokenPair.erc20.decimals,
        );
    }, [tokenPair, amount, approve]);

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
