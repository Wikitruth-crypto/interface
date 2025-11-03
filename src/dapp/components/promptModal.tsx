import { Modal, Button } from "antd";
import Paragraph from "@/components/base/paragraph";

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
    description = 'The current beta version is old, and the new beta version will be launched soon. Testing can officially begin at that time!',
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
                {/* 标题 */}
                <Paragraph color="primary" size="lg" weight="semibold" className="mb-2 text-center">
                    {title}
                </Paragraph>
                {/* 内容: 可滚动文本 */}
                <Paragraph color="muted-foreground" size="md" className="mb-4 min-h-[200px] overflow-y-auto">
                    {description}
                </Paragraph>
                <div className="w-full h-px border-t border-t-border my-2" />
                {/* 按钮区 */}
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


