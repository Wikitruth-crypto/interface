// import { useCallback, useState, useEffect } from 'react';
// import { writeStatus } from '../types';
// import { TokenPair } from '../types';
// import { TokenMetadata, useSupportedTokens } from '@/dapp/contractsConfig';
// import { useTokenOperations } from './useTokenOperations';
// import { useEIP712Permit } from '@/dapp/hooks/EIP712/useEIP712Permit';
// import { useReadBalance } from '@/dapp/hooks/readContracts2/token/useReadBalance';
// import { useAccount } from 'wagmi';
// import { formatUnits, parseUnits } from 'viem';
// import { PermitType, SignPermitParams } from '@/dapp/hooks/EIP712/types_ERC20secret';

// export type StepStatus = 'wait' | 'process' | 'finish' | 'error';
// export type StepKey = 'EIP712Permit' | 'readBalance' | 'unwrap';

// interface StepConfig {
//     title: string;
//     descriptions: Record<writeStatus, string>;
// }

// export interface StepItem {
//     stepKey: StepKey;
//     title: string;
//     description: string;
//     status: StepStatus;
// }

// const STEP_CONFIGS: Record<StepKey, StepConfig> = {
//     EIP712Permit: {
//         title: 'EIP712Permit...',
//         descriptions: {
//             idle: 'EIP712Permit...',
//             pending: 'EIP712Permit...',
//             success: 'EIP712Permit success',
//             error: 'EIP712Permit failed',
//         },
//     },
//     readBalance: {
//         title: 'Check balance...',
//         descriptions: {
//             idle: 'Check balance...',
//             pending: 'Checking balance...',
//             success: 'Balance is enough',
//             error: 'Checking balance failed',
//         },
//     },
//     unwrap: {
//         title: 'Unwrap',
//         descriptions: {
//             idle: 'Ready to unwrap',
//             pending: 'Executing unwrap operation...',
//             success: 'Unwrap operation success',
//             error: 'Unwrap operation failed',
//         },
//     },
// };

// const mapWriteStatusToStepStatus = (status: writeStatus): StepStatus => {
//     switch (status) {
//         case 'pending':
//             return 'process';
//         case 'success':
//             return 'finish';
//         case 'error':
//             return 'error';
//         case 'idle':
//         default:
//             return 'wait';
//     }
// };

// const createSteps = (isSecretToken: boolean): StepItem[] => {
//     // 如果是 secret token，则需要 EIP712Permit 和 checkBalance
//     let steps: StepItem[] = [];
//     if (isSecretToken) {
//         steps = [
//             {
//                 stepKey: 'EIP712Permit',
//                 title: STEP_CONFIGS.EIP712Permit.title,
//                 description: STEP_CONFIGS.EIP712Permit.descriptions.success,
//                 status: 'wait',
//             },
//             {
//                 stepKey: 'readBalance',
//                 title: STEP_CONFIGS.readBalance.title,
//                 description: STEP_CONFIGS.readBalance.descriptions.idle,
//                 status: 'wait',
//             }
//         ];
//     }

//     steps.push({
//         stepKey: 'unwrap',
//         title: STEP_CONFIGS.unwrap.title,
//         description: STEP_CONFIGS.unwrap.descriptions.idle,
//         status: 'wait',
//     });

//     return steps;
// };

// type StepsState = {
//     steps: StepItem[];
//     currentIndex: number;
// };

// export const useUnWrapSteps = (tokenPair: TokenPair, amount: string) => {
//     const { address } = useAccount();
//     const supportedTokens = useSupportedTokens();
//     const { getValidPermit } = useEIP712Permit();
//     const { readBalance, balance } = useReadBalance();
//     const { unwrap, status, isLoading, isPending, isSuccessed, activeButton } = useTokenOperations();

//     const [state, setState] = useState<StepsState>({
//         steps: createSteps(true),
//         currentIndex: 0, // allowance is done; start at first actionable step
//     });

//     const initializeSteps = useCallback(() => {
//         const tokenTypes = checkTokenTypes(tokenPair.erc20.address);
//         if (!tokenTypes) {
//             return;
//         }
//         let isSecretToken = false;
//         if (tokenTypes === 'Secret') {
//             isSecretToken = true;
//         }
//         const nextSteps = createSteps(isSecretToken);
//         setState({
//             steps: nextSteps,
//             currentIndex: 0,
//         });
//     }, []);

//     const updateStepStatus = useCallback((stepKey: StepKey, status: writeStatus) => {
//         if (import.meta.env.DEV) {
//             console.log('updateStepStatus:', stepKey, status);
//         }

//         setState(prev => {
//             const targetIndex = prev.steps.findIndex(step => step.stepKey === stepKey);
//             if (targetIndex === -1) {
//                 return prev;
//             }

//             const mappedStatus = mapWriteStatusToStepStatus(status);
//             const description = STEP_CONFIGS[stepKey].descriptions[status];

//             const nextSteps = prev.steps.map((step, index) =>
//                 index === targetIndex
//                     ? { ...step, status: mappedStatus, description }
//                     : step,
//             );

//             let nextCurrentIndex = prev.currentIndex;
//             const isCurrentStep = targetIndex === prev.currentIndex;
//             const hasNextStep = targetIndex < nextSteps.length - 1;

//             if (mappedStatus === 'finish' && isCurrentStep && hasNextStep) {
//                 nextCurrentIndex = targetIndex + 1;
//             }

//             return {
//                 steps: nextSteps,
//                 currentIndex: nextCurrentIndex,
//             };
//         });
//     }, []);

//     const { steps, currentIndex } = state;
//     const currentStepItem = steps[currentIndex] ?? steps[steps.length - 1];


//     // ---
//     const checkTokenTypes = useCallback((tokenAddress: string) => {
//         try {
//             // 1. 获取代币配置
//             const tokenMetadata = supportedTokens.find(
//                 (token: TokenMetadata) => token.address.toLowerCase() === tokenAddress.toLowerCase()
//             );
//             if (!tokenMetadata) {
//                 throw new Error('Token metadata not found');
//             }
//             return tokenMetadata.types
//         } catch (error) {
//             console.error('Check token types error:', error);
//             return null;
//         }
//     }, [tokenPair]);


//     const handleEIP712Permit = useCallback(async () => {
//         if (!address || !tokenPair.erc20.address || !amount || !tokenPair.secretContractAddress) {
//             return;
//         }

//         const amountInWei = parseUnits(amount, tokenPair.erc20.decimals);

//         try {
//             const signPermitParams: SignPermitParams = {
//                 contractAddress: tokenPair.erc20.address,
//                 amount: amountInWei,
//                 label: PermitType.VIEW,
//                 spender: address,
//             };
//             const result = await getValidPermit(
//                 signPermitParams,
//             );
//             if (result) {
//                 updateStepStatus('EIP712Permit', 'success');
//             } else {
//                 updateStepStatus('EIP712Permit', 'error');
//             }
//         } catch (error) {
//             console.error('Check EIP712Permit error:', error);
//             updateStepStatus('EIP712Permit', 'error');
//         }
//     }, [tokenPair, amount, getValidPermit, address, initializeSteps]);

//     useEffect(() => {
//         const handleReadBalance = async () => {
//             if (currentStepItem.stepKey === 'readBalance') {
//                 if (!tokenPair.erc20.address || !address || !amount) {
//                     return;
//                 }
//                 const result = await readBalance(tokenPair.erc20.address, address, amount);
//                 if (result.isEnough) {
//                     updateStepStatus('readBalance', 'success');
//                 } else {
//                     updateStepStatus('readBalance', 'error');
//                 }
//             }
//         }
//         handleReadBalance();
//     }, [currentStepItem, address, amount, readBalance]);

//     useEffect(() => {
//         if (activeButton === 'unwrap') {
//             if (status !== 'idle') {
//                 updateStepStatus('unwrap', status);
//             }
//         }
//     }, [activeButton, status]);

//     const handleUnwrapClick = useCallback(async () => {
//         if (!tokenPair || !amount || !tokenPair.secretContractAddress) return;
//         await unwrap(
//             tokenPair.secretContractAddress,
//             amount,
//             tokenPair.erc20.decimals,
//         );
//     }, [tokenPair, amount, unwrap]);


//     return {
//         steps,
//         currentIndex,
//         currentStepItem,
//         initializeSteps,
//         updateStepStatus,
//         handleEIP712Permit,
//         handleUnwrapClick,
//         isPending,
//         isLoading,
//         isSuccessed,
//         status,
//         activeButton,
//         balance,
//     };
// };


