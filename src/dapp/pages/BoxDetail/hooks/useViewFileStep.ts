import { useCallback, useRef, useState } from 'react';
import { useGetPrivateKey } from '@/dapp/hooks/readContracts2/useGetPrivateKey';
import useDecryptionViewFile, { ViewFileResult } from './useDecryptionViewFile';
import { MetadataBoxType } from '@/dapp/types/metadata/metadataBox';
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
    privateKey: { key: 'privateKey', title: '读取私钥' },
    decrypt: { key: 'decrypt', title: '解密文件信息'},
    done: { key: 'done', title: '完成' },
};

const MAX_RETRY = 5;

export const useViewFileStep = (
) => {
    const { getPrivateKey } = useGetPrivateKey();
    const { decryptionViewFile } = useDecryptionViewFile();

    const [steps, setSteps] = useState<ViewFileStep[]>([
        { ...STEP_TEMPLATES.privateKey, status: 'wait', description: '等待读取私钥' },
        { ...STEP_TEMPLATES.decrypt, status: 'wait', description: '等待解密' },
        { ...STEP_TEMPLATES.done, status: 'wait', description: '等待完成' },
    ]);

    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<ViewFileResult | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const attemptRef = useRef(0);

    const reset = useCallback(() => {
        setSteps([
            { ...STEP_TEMPLATES.privateKey, status: 'wait', description: '等待读取私钥' },
            { ...STEP_TEMPLATES.decrypt, status: 'wait', description: '等待解密' },
            { ...STEP_TEMPLATES.done, status: 'wait', description: '等待完成' },
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
            setErrorMsg('未找到 Box 或 metadata，无法解密。');
            updateStep('privateKey', 'error', '缺少必要数据');
            return;
        }

        if (attemptRef.current >= MAX_RETRY) {
            setErrorMsg(`已达到最大尝试次数（${MAX_RETRY} 次），请稍后再试。`);
            return;
        }

        attemptRef.current += 1;
        setIsProcessing(true);
        setErrorMsg(null);
        updateStep('privateKey', 'process', '正在读取私钥…');

        try {
            const pk = await getPrivateKey(box.id);
            if (!pk) {
                throw new Error('无法读取私钥，请确认已完成签名授权。');
            }
            updateStep('privateKey', 'finish', '私钥读取完成');

            updateStep('decrypt', 'process', '解密文件信息中…');
            const res = await decryptionViewFile(pk, metadataBox);
            setResult(res);
            updateStep('decrypt', 'finish', '解密成功');
            updateStep('done', 'finish', '完成');
        } catch (err: any) {
            const msg = err?.message || '未知错误，请稍后重试。';
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
