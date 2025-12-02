"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Steps, Alert, Button, Typography } from 'antd';
import DisplayUriPassword from '@/dapp/components/uriPassword';
import useDecryptionViewFile from '@/dapp/pages/BoxDetail/hooks/useDecryptionViewFile';
import { useBoxDetailStore } from '@/dapp/pages/BoxDetail/store/boxDetailStore';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import { useGetPrivateKey } from '@/dapp/hooks/readContracts2/useGetPrivateKey';

interface Props {
    onClose: () => void;
}

type StepStatus = 'wait' | 'process' | 'finish' | 'error';

interface StepMeta {
    title: string;
    description?: string;
    status: StepStatus;
}

const INITIAL_STEPS: StepMeta[] = [
    { title: 'Get Private Key', description: 'Trying to load private key from TruthBox contract', status: 'wait' },
    { title: 'Decrypt File Information', description: 'Decrypting file information with private key', status: 'wait' },
    { title: 'Download File (Developing)', description: 'The download function will be provided in the later version', status: 'wait' },
];

const MAX_RETRY = 5;

const ModalViewFile: React.FC<Props> = ({ onClose }) => {
    const updateModalStatus = useBoxDetailStore(state => state.updateModalStatus);
    const { box, metadataBox } = useBoxDetailContext();
    const { getPrivateKey } = useGetPrivateKey();
    const { decryptionViewFile } = useDecryptionViewFile();

    const [steps, setSteps] = useState<StepMeta[]>(INITIAL_STEPS);
    const [isProcessing, setIsProcessing] = useState(false);
    const [fileCidList, setFileCidList] = useState<string[]>([]);
    const [password, setPassword] = useState<string>('');
    const [slicesMetadataCID, setSlicesMetadataCID] = useState<string>('');
    const attemptRef = useRef(0);
    const [attemptCount, setAttemptCount] = useState(0);

    const stepsRef = useRef<StepMeta[]>(steps);
    useEffect(() => {
        stepsRef.current = steps;
    }, [steps]);

    const isCreateMode = metadataBox?.mintMethod === 'create';

    useEffect(() => {
        updateModalStatus('ViewFile', 'open');
    }, [updateModalStatus]);

    const resetSteps = useCallback(() => {
        setSteps([
            { ...INITIAL_STEPS[0], status: 'wait', description: 'Trying to load private key from TruthBox contract' },
            { ...INITIAL_STEPS[1], status: 'wait', description: 'Decrypting file information with private key' },
            INITIAL_STEPS[2],
        ]);
    }, []);

    const updateStep = useCallback((index: number, partial: Partial<StepMeta>) => {
        setSteps(prev => {
            const next = [...prev];
            next[index] = { ...next[index], ...partial };
            return next;
        });
    }, []);

    const startWorkflow = useCallback(async () => {
        if (!box || !metadataBox) {
            return;
        }
        if (!isCreateMode) {
            updateStep(0, { status: 'error', description: 'Only boxes in create mode need to decrypt files.' });
            return;
        }

        if (attemptRef.current >= MAX_RETRY) {
            updateStep(0, { status: 'error', description: `Maximum number of attempts reached (${MAX_RETRY} times), please try again later.` });
            setIsProcessing(false);
            return;
        }

        attemptRef.current += 1;
        setAttemptCount(attemptRef.current);
        setIsProcessing(true);
        setFileCidList([]);
        setPassword('');
        setSlicesMetadataCID('');
        resetSteps();

        try {
            updateStep(0, { status: 'process', description: 'Reading private key...' });
            const privateKey = await getPrivateKey(box.id);
            if (!privateKey) {
                throw new Error('Failed to read private key, please confirm that you have completed signature authorization.');
            }
            updateStep(0, { status: 'finish', description: 'Private key read completed.' });

            updateStep(1, { status: 'process', description: 'Decrypting file information...' });
            const result = await decryptionViewFile(privateKey, metadataBox);
            if (!result) {
                throw new Error('Decryption returned empty result.');
            }
            setFileCidList(result.fileCIDList || []);
            setPassword(result.password || '');
            setSlicesMetadataCID(result.slicesMetadataCID || '');
            updateStep(1, { status: 'finish', description: 'Decryption successful, below are the file links and passwords.' });

            updateStep(2, { status: 'wait', description: 'Please wait for the download function.' });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error, please try again later.';
            setFileCidList([]);
            setPassword('');
            setSlicesMetadataCID('');

            const hasPrivateKey = stepsRef.current[0]?.status === 'finish';
            if (hasPrivateKey) {
                updateStep(1, { status: 'error', description: message });
            } else {
                updateStep(0, { status: 'error', description: message });
            }
        } finally {
            setIsProcessing(false);
        }
    }, [box, metadataBox, getPrivateKey, decryptionViewFile, resetSteps, updateStep, isCreateMode]);

    useEffect(() => {
        if (box && metadataBox && attemptRef.current === 0) {
            void startWorkflow();
        }
    }, [box, metadataBox, startWorkflow]);

    if (!box || !metadataBox) {
        return null;
    }

    const handleClose = () => {
        updateModalStatus('ViewFile', 'close');
        onClose();
    };

    const handleRetry = () => {
        if (!isProcessing) {
            void startWorkflow();
        }
    };

    const canShowResult = steps[1].status === 'finish';
    const remainingAttempts = Math.max(0, MAX_RETRY - attemptCount);

    return (
        <Modal
            title="View File"
            centered
            open={true}
            closable={false}
            maskClosable={false}
            onOk={() => {}}
            onCancel={handleClose}
            okButtonProps={{ disabled: true }}
            cancelButtonProps={{ disabled: false }}
            okText="Download (Soon)"
            cancelText="Close"
            width={520}
        >
            {!isCreateMode && (
                <Alert
                    type="warning"
                    showIcon
                    message="The current box is in createAndPublish mode, and the files can be viewed directly in the Published area."
                    className="mb-4"
                />
            )}

            <Steps direction="vertical" items={steps} className="mb-4" />

            {steps.some(step => step.status === 'error') && (
                <Alert
                    type="error"
                    showIcon
                    message="Operation failed"
                    description="Please confirm that you have completed wallet signature and SIWE login, then try again."
                    className="mb-3"
                />
            )}

            <div className="mb-4 flex items-center justify-between">
                <Typography.Text type="secondary">
                    Attempts: {attemptCount}/{MAX_RETRY} (Remaining {remainingAttempts} times)
                </Typography.Text>
                <Button
                    type="link"
                    size="small"
                    onClick={handleRetry}
                    disabled={isProcessing || remainingAttempts === 0}
                    className="px-0"
                >
                    Retry
                </Button>
            </div>

            {isProcessing && (
                <Typography.Paragraph className="text-muted-foreground text-xs">
                    Processing, please wait...
                </Typography.Paragraph>
            )}

            {canShowResult && (
                <div className="flex flex-col gap-2">
                    <DisplayUriPassword
                        fileCidList={fileCidList}
                        slicesMetadataCID={slicesMetadataCID}
                        password={password}
                        hidePasswordByDefault={false}
                    />
                </div>
            )}
        </Modal>
    );
};

export default ModalViewFile;
