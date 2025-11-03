import React from 'react';
import ImgCrop from 'antd-img-crop';
import { cn } from '@/lib/utils';
import { Upload, Space } from 'antd';
import { useAddImage } from '@dapp/pages/Create/hooks/Input/useAddImage';

interface ImageUploadProps {
    className?: string;
}

/**
 * 图片上传组件 (重构版)
 * 使用 React Hook Form 进行验证
 * 
 * 关键改进：
 * - 集成 RHF 验证
 * - 改进错误显示逻辑
 */
const ImageUpload: React.FC<ImageUploadProps> = ({ className }) => {
    const { boxImageList, error, onChange, onModalOk } = useAddImage();

    // 安全的预览函数
    const handlePreview = (file: any) => {
        try {
            if (file?.url) {
                window.open(file.url, '_blank');
            } else if (file?.originFileObj) {
                const url = URL.createObjectURL(file.originFileObj);
                window.open(url, '_blank');
                // 清理 URL 对象
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            }
        } catch (error) {
            console.error('Preview failed:', error);
        }
    };

    return (
        <div className={cn("flex flex-col space-y-2", className)}>
            <div className="font-mono text-sm">Truth Box Image:</div>
            <Space>
                <ImgCrop 
                    rotationSlider 
                    aspect={1 / 1} 
                    onModalOk={onModalOk}
                    modalProps={{
                        centered: true,
                        // destroyOnClose: true,
                        destroyOnHidden: true, 
                    } as any}
                >
                    <Upload
                        listType="picture-card"
                        fileList={boxImageList || []}
                        onChange={onChange}
                        onPreview={handlePreview}
                        maxCount={1}
                        showUploadList={{
                            showPreviewIcon: true,
                            showRemoveIcon: true,
                            showDownloadIcon: false
                        }}
                        accept="image/*"
                        beforeUpload={() => false} // 阻止自动上传
                    >
                        {(!boxImageList || boxImageList.length < 1) && '+ Upload'}
                    </Upload>
                </ImgCrop>
            </Space>
            {error && typeof error === 'string' && (
                <p className={cn("text-sm text-error", "px-1 leading-tight")}>{error}</p>
            )}
        </div>
    );
}

export default ImageUpload;