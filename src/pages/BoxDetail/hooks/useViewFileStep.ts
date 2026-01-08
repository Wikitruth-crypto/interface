import { useCallback, useRef, useState } from 'react';
import { useGetPrivateKey } from '@dapp/hooks/readContracts2/useGetPrivateKey';
import useDecryptionViewFile, { ViewFileResult } from './useDecryptionViewFile';
import { MetadataBoxType } from '@dapp/types/typesDapp/metadata/metadataBox';
import { BoxDetailData } from '../types/boxDetailData';

export type ViewFileStepKey = 'privateKey' | 'decrypt' | 'done';
type StepStatus = 'wait' | 'process' | 'finish' | 'error';

export interface ViewFileStep {
    key: ViewFileStepKey;
    title: string;
    description: string;
    status: StepStatus;
}

const STEP_TEMPLATES: Record<ViewFileStepKey, Omit<ViewFileStep, 'status' | 'description'>> = {
    privateKey: { key: 'privateKey', title: 'Reading private key' },
    decrypt: { key: 'decrypt', title: 'Decrypting file information'},
    done: { key: 'done', title: 'Done' },
};

const MAX_RETRY = 5;

export const useViewFileStep = (
) => {
    const { getPrivateKey } = useGetPrivateKey();
    const { decryptionViewFile } = useDecryptionViewFile();

    const [steps, setSteps] = useState<ViewFileStep[]>([
        { ...STEP_TEMPLATES.privateKey, status: 'wait', description: 'Reading private key' },
        { ...STEP_TEMPLATES.decrypt, status: 'wait', description: 'Decrypting file information' },
        { ...STEP_TEMPLATES.done, status: 'wait', description: 'Done' },
    ]);

    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<ViewFileResult | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const attemptRef = useRef(0);

    const reset = useCallback(() => {
        setSteps([
            { ...STEP_TEMPLATES.privateKey, status: 'wait', description: 'Reading private key' },
            { ...STEP_TEMPLATES.decrypt, status: 'wait', description: 'Decrypting file information' },
            { ...STEP_TEMPLATES.done, status: 'wait', description: 'Done' },
        ]);
        setErrorMsg(null);
        setResult(null);
    }, []);

    const updateStep = useCallback((key: ViewFileStepKey, status: StepStatus, description?: string) => {
        setSteps(prev =>
            prev.map(step =>
                step.key === key
                    ? { ...step, status, description: description ?? step.description }
                    : step,
            ),
        );
    }, []);

    const start = useCallback(async (
        box: BoxDetailData,
        metadataBox: MetadataBoxType
    ) => {
        if (!box || !metadataBox) {
            setErrorMsg('Box or metadata not found, cannot decrypt.');
            updateStep('privateKey', 'error', 'Missing necessary data');
            return;
        }

        if (attemptRef.current >= MAX_RETRY) {
            setErrorMsg(`Maximum attempts reached (${MAX_RETRY} times), please try again later.`);
            return;
        }

        attemptRef.current += 1;
        setIsProcessing(true);
        setErrorMsg(null);
        updateStep('privateKey', 'process', 'Reading private key…');

        try {

            const pk = box.privateKey ? box.privateKey :  await getPrivateKey(box.id);

            if (!pk) {
                throw new Error('Cannot read private key, please confirm that the signature authorization has been completed.');
            }
            updateStep('privateKey', 'finish', 'Private key read completed');

            updateStep('decrypt', 'process', 'Decrypting file information…');
            const res = await decryptionViewFile(pk, metadataBox);
            setResult(res);
            updateStep('decrypt', 'finish', 'Decryption successful');
            updateStep('done', 'finish', 'Done');
        } catch (err: any) {
            const msg = err?.message || 'Unknown error, please try again later.';
            setErrorMsg(msg);
            if (steps.find(s => s.key === 'privateKey')?.status !== 'finish') {
                updateStep('privateKey', 'error', msg);
            } else {
                updateStep('decrypt', 'error', msg);
            }
        } finally {
            setIsProcessing(false);
        }
    }, [decryptionViewFile, getPrivateKey, updateStep, steps]);

    const retry = useCallback((box: BoxDetailData, metadataBox: MetadataBoxType) => {
        if (attemptRef.current < MAX_RETRY) {
            void start(box, metadataBox);
        }
    }, [start]);

    return {
        steps,
        isProcessing,
        errorMsg,
        result,
        attemptCount: attemptRef.current,
        maxRetry: MAX_RETRY,
        start,
        retry,
        reset,
    };
};

export default useViewFileStep;
