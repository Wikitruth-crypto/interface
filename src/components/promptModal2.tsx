import React from 'react';
import { Modal, Typography, Space } from 'antd';
import { 
    ExclamationCircleOutlined, 
    InfoCircleOutlined, 
    CheckCircleOutlined, 
    CloseCircleOutlined 
} from '@ant-design/icons';

const { Paragraph } = Typography;

export interface PromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    content?: string | React.ReactNode;
    confirmText?: string;
    type?: 'info' | 'warning' | 'success' | 'error';
    closable?: boolean;
    /** Click mask to close */
    maskClosable?: boolean;
    width?: number;
    maxHeight?: number;
}

/**
 * Prompt modal component
 * 
 * Function:
 * - Used for system prompt information
 * - Used for signing/reading instructions
 * - Support different types of prompt styles
 */
const PromptModal: React.FC<PromptModalProps> = ({
    isOpen,
    onClose,
    title = 'System Prompt',
    content = 'The current beta version',
    confirmText = 'I Understand',
    type = 'info',
    closable = true,
    maskClosable = true,
    width = 520,
    maxHeight = 400,
}) => {
    const handleOk = () => {
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    // Select icon based on type
    const getIcon = () => {
        switch (type) {
            case 'warning':
                return <ExclamationCircleOutlined />;
            case 'success':
                return <CheckCircleOutlined />;
            case 'error':
                return <CloseCircleOutlined />;
            case 'info':
            default:
                return <InfoCircleOutlined />;
        }
    };

    return (
        <Modal
            title={
                <Space>
                    {getIcon()}
                    <span>{title}</span>
                </Space>
            }
            open={isOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            closable={closable}
            maskClosable={maskClosable}
            width={width}
            okText={confirmText}
            cancelButtonProps={{ style: { display: 'none' } }}
            centered
        >
            <div
                style={{
                    maxHeight: `${maxHeight}px`,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    paddingRight: 8,
                }}
            >
                {typeof content === 'string' ? (
                    <Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {content}
                    </Paragraph>
                ) : (
                    content
                )}
            </div>
        </Modal>
    );
};

export default PromptModal;