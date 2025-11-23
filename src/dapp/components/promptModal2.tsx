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
    /** 是否显示弹窗 */
    isOpen: boolean;
    /** 关闭回调 */
    onClose: () => void;
    /** 弹窗标题 */
    title?: string;
    /** 弹窗内容 */
    content?: string | React.ReactNode;
    /** 确认按钮文字 */
    confirmText?: string;
    /** 提示类型 */
    type?: 'info' | 'warning' | 'success' | 'error';
    /** 是否显示关闭按钮 */
    closable?: boolean;
    /** 点击遮罩是否关闭 */
    maskClosable?: boolean;
    /** 弹窗宽度 */
    width?: number;
    /** 内容区域最大高度（像素），超出此高度将显示滚动条，默认 400px */
    maxHeight?: number;
}

/**
 * 提示弹窗组件
 * 
 * 功能：
 * - 用于系统提示信息
 * - 用于签署/阅读说明
 * - 支持不同类型的提示样式
 */
const PromptModal: React.FC<PromptModalProps> = ({
    isOpen,
    onClose,
    title = 'System Prompt',
    content = 'The current beta version is old, and the new beta version will be launched soon. Testing can officially begin at that time!',
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

    // 根据类型选择图标
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