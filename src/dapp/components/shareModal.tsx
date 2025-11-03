import { Modal, Button } from 'antd';

interface ShareModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    text: string;
    url: string;
}

export default function ShareModal({ open, onClose, title, text, url }: ShareModalProps) {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            centered
            closable={true}
            width={600}
            footer={[
                <Button type="primary" onClick={() => {
                    navigator.clipboard.writeText(url);
                    onClose();
                }}>
                    Copy
                </Button>
            ]}
        >
            <div className='flex flex-col items-center justify-center'>
                {/* 标题 */}
                <div className='text-2xl font-bold'>
                    {title}
                </div>
                {/* 文本 */}
                <div className='text-sm text-gray-500'>
                    {text}
                </div>
            </div>
        </Modal>
    );
}
