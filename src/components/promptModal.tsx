import { Modal, Button } from "antd";
import TextP from "@/components/base/text_p";

interface PromptModalProps {
    title?: string;
    description?: string;
    open: boolean;
    closable?: boolean;
    onCancel?: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmLoading?: boolean;
    showCancel?: boolean;
}

export function PromptModal({
    open,
    closable = false,
    onCancel,
    onConfirm,
    title = 'System prompt',
    description = 'The ',
    confirmText = 'I road',
    cancelText = 'Cancel',
    confirmLoading = false,
    showCancel = true
}: PromptModalProps) {
    return (
        <Modal 
            open={open} 
            footer={null} 
            closable={closable} 
            onCancel={onCancel}
            maskClosable={false}
            centered
            width={480}
        >
            <div className="w-full flex flex-col justify-center items-center gap-4 h-full">
                {/* Title */}
                <TextP type="primary" size="md"className="mb-2 text-center">
                    {title}
                </TextP>
                {/* Content: scrollable text */}
                <TextP size="md" className="mb-4 min-h-[200px] overflow-y-auto">
                    {description}
                </TextP>
                <div className="w-full h-px border-t border-t-border my-2" />
                {/* Button area */}
                <div className="flex w-full justify-center gap-4 mt-2">
                    {showCancel && (
                        <Button onClick={onCancel} variant="outlined">
                            {cancelText}
                        </Button>
                    )}
                    <Button 
                        loading={confirmLoading}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}


