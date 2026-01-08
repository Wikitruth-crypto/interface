"use client"
import React, { useEffect, useRef } from 'react';
import { Modal, Steps, Alert, Button, } from 'antd';
import ParagraphList from '@/components/ParagraphList';
// import { useBoxDetailStore } from '@/dapp/pages/BoxDetail/store/boxDetailStore';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import useViewFileStep from '../hooks/useViewFileStep';
import TextP from '@/components/base/text_p';

interface Props {
    onClose: () => void;
}

const ModalViewFile: React.FC<Props> = ({ onClose }) => {
    const { box, metadataBox } = useBoxDetailContext();

    if (!box || !metadataBox) {
        return null;
    }

    const {
        steps,
        isProcessing,
        errorMsg,
        result,
        attemptCount,
        maxRetry,
        start,
        retry,
    } = useViewFileStep();

    const isCreateMode = metadataBox?.mintMethod === 'create';

    // Mark state once on open + start flow to avoid infinite loop from duplicate triggers
    const startedRef = useRef(false);


    useEffect(() => {
        if (startedRef.current) return;
        if (box && metadataBox) {
            startedRef.current = true;
            void start(box, metadataBox);
        }
    }, [box, metadataBox, start]);

    const handleClose = () => {
        onClose();
    };

    const canShowResult = steps.find(s => s.key === 'decrypt')?.status === 'finish';
    const remainingAttempts = Math.max(0, maxRetry - attemptCount);

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
                    message="This Box is in createAndPublish mode, you can view the file directly in the Published area."
                    className="mb-4"
                />
            )}

            <Steps
                direction="vertical"
                items={steps.map(step => ({
                    title: step.title,
                    status: step.status,
                    description: step.description,
                }))}
                className="mb-4"
            />

            {errorMsg && (
                <Alert
                    type="error"
                    showIcon
                    message="Operation failed"
                    description={errorMsg}
                    className="mb-3"
                />
            )}

            <div className="mb-4 flex items-center justify-between">
                <TextP>
                    Attempts: {attemptCount}/{maxRetry}（Remaining {remainingAttempts} times）
                </TextP>
                <Button
                    type="link"
                    size="small"
                    onClick={() => retry(box, metadataBox)}
                    disabled={isProcessing || remainingAttempts === 0}
                    className="px-0"
                >
                    Continue request
                </Button>
            </div>

            {isProcessing && (
                <TextP>
                    Processing, please wait patiently…
                </TextP>
            )}

            {canShowResult && (
                <div className="flex flex-col gap-2">
                    <ParagraphList
                        label="File CID"
                        type="cid"
                        cidList={result?.fileCIDList || []}
                    />
                    <ParagraphList
                        label="Password"
                        type="password"
                        cidList={[result?.password || '']}
                    />
                    <ParagraphList
                        label="Slices Metadata CID"
                        type="cid"
                        cidList={[result?.slicesMetadataCID || '']}
                    />
                </div>
            )}
        </Modal>
    );
};

export default ModalViewFile;
