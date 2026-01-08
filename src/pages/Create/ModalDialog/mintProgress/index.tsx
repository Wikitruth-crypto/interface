import React, { useEffect, useState, useRef } from 'react';
import { Modal, Button, Progress } from 'antd';
import { useCreateWorkflowStore } from '../../store/useCreateWorkflowStore';
import ResultItem from '@/components/base/ResultItem';
import { useSmartWorkflow } from '../../hooks/useSmartWorkflow';


interface ModalProps {
    onClose: () => void;
    onNext?: () => void;
}

const ModalDialogMintProgress: React.FC<ModalProps> = ({ onClose, onNext }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [retryLoading, setRetryLoading] = useState(false);
    // const isResultDataUploaded = useCreateWorkflowStore(state => state.isResultDataUploaded);
    const workflowStatus = useCreateWorkflowStore(state => state.workflowStatus);
    // const errorMessage = useNFTCreateStore(state => state.errorMessage);

    const {
        startWorkflow,     // Start creation
        cancelWorkflow,    // Cancel creation
        canCancel,         // Derived state: Can cancel
        canRetry,          // Derived state: Can retry
    } = useSmartWorkflow();

    // ✅ Use useRef to ensure execution only once
    const hasInitialized = useRef(false);

    // initialize the workflow - Execute only once
    useEffect(() => {
        // Prevent duplicate execution
        if (hasInitialized.current) {
            return;
        }
        hasInitialized.current = true;

        const initWorkflow = async () => {
            try {
                await startWorkflow();
                
            } catch (error) {
                console.error('[MintProgress] Workflow error:', error);
            }
        };
        
        initWorkflow();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 
    
    const handleCancel = async () => {
            setIsOpen(false);
            setCancelLoading(true);
            cancelWorkflow();
            setCancelLoading(false);
            onClose();
    };

    const handleNext = () => {
        onNext?.();
        setIsOpen(false);
            
    };

    // Retry
    const handleRetry = async () => {
        if (workflowStatus === 'error') {
            setRetryLoading(true);
            startWorkflow()
            setRetryLoading(false);
        }
    };

    const mintProgress = useCreateWorkflowStore(state => state.createProgress);

    /**
     * render the progress items
     */
    const renderProgressItems = () => {
        return (
            <div style={{ marginTop: 20 }}>
                

                <ResultItem
                    title="Compress File"
                    isLoading={mintProgress.compressFiles_status === 'processing'}
                    isComplete={mintProgress.compressFiles_status === 'success'}
                    error={mintProgress.compressFiles_Error || null}
                />
                <ResultItem
                    title="Upload Main File"
                    isLoading={mintProgress.uploadFiles_status === 'processing'}
                    isComplete={mintProgress.uploadFiles_status === 'success'}
                    error={mintProgress.uploadFiles_Error || null}
                />

                <ResultItem
                    title="Upload Box Image"
                    isLoading={mintProgress.uploadBoxImage_status === 'processing'}
                    isComplete={mintProgress.uploadBoxImage_status === 'success'}
                    error={mintProgress.uploadBoxImage_Error || null}
                />

                <ResultItem
                    title="Upload NFT Image" // image
                    isLoading={mintProgress.uploadNFTImage_status === 'processing'}
                    isComplete={mintProgress.uploadNFTImage_status === 'success'}
                    error={mintProgress.uploadNFTImage_Error || null}
                />
                <ResultItem
                    title="Upload Metadata"
                    isLoading={mintProgress.metadataBox_status === 'processing'}
                    isComplete={mintProgress.metadataBox_status === 'success'}
                    error={mintProgress.metadataBox_Error || null}
                />
                <ResultItem
                    title="Mint Box NFT"
                    isLoading={mintProgress.mint_status === 'processing'}
                    isComplete={mintProgress.mint_status === 'success'}
                    error={mintProgress.mint_Error || null}
                />
            </div>
        );
    };

    /**
     * calculate the total progress
     */
    function calculateTotalProgress(): number {
        const steps = [
            mintProgress.uploadBoxImage_status === 'success',
            mintProgress.compressFiles_status === 'success',
            mintProgress.uploadFiles_status === 'success',
            mintProgress.uploadNFTImage_status === 'success',
            mintProgress.metadataBox_status === 'success',
            mintProgress.mint_status === 'success'
        ];

        const completedSteps = steps.filter(Boolean).length;
        return Math.round((completedSteps / steps.length) * 100);
    }

    return (
        <div>
            < Modal
                title="Creating"
                open={isOpen}
                closable={false}
                maskClosable={false}
                destroyOnHidden={true}
                footer={
                    [

                        <Button
                            key="close"
                            onClick={handleCancel}
                            loading={cancelLoading}
                            disabled={!canCancel}
                        >
                            Cancel
                        </Button>,
                        <Button
                            key="retry"
                            type="primary"
                            danger
                            onClick={handleRetry}
                            loading={retryLoading}
                            disabled={!canRetry}
                        >
                            Retry
                        </Button>,
                        <Button
                            key="next"
                            type="primary"
                            onClick={handleNext}
                            disabled={workflowStatus !== 'success'}
                        >
                            Next
                        </Button>
                    ]}
                width={520}
            >
                < div style={{ marginBottom: 20 }
                }>
                    <Progress
                        percent={
                            workflowStatus === 'success' ? 100 :
                                workflowStatus === 'error' ? 0 :
                                    calculateTotalProgress()
                        }
                        status={
                            workflowStatus === 'success' ? 'success' :
                                workflowStatus === 'error' ? 'exception' :
                                    'active'
                        }
                    />
                </div>

                {/* detailed progress items */}
                {renderProgressItems()}
            </Modal >
        </div >

    );
}

export default ModalDialogMintProgress;