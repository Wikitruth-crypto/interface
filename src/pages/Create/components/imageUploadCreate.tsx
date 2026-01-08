import React from 'react';
import ImgCrop from 'antd-img-crop';
import { cn } from '@/lib/utils';
import { Upload, Space } from 'antd';
import { useAddImage } from '@Create/hooks/Input/useAddImage';
import TextP from '@/components/base/text_p';
import TextTitle from '@/components/base/text_title';

interface ImageUploadProps {
    className?: string;
}


const ImageUpload: React.FC<ImageUploadProps> = ({ className }) => {
    const { boxImageList, error, onChange, onModalOk } = useAddImage();

    // Safe preview function
    const handlePreview = (file: any) => {
        try {
            if (file?.url) {
                window.open(file.url, '_blank');
            } else if (file?.originFileObj) {
                const url = URL.createObjectURL(file.originFileObj);
                window.open(url, '_blank');
                // Clean up URL object
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            }
        } catch (error) {
            console.error('Preview failed:', error);
        }
    };

    return (
        <div className={cn("flex flex-col space-y-2", className)}>
            <TextTitle>Truth Box Image:</TextTitle>
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
                        beforeUpload={() => false} // Prevent automatic upload
                    >
                        {(!boxImageList || boxImageList.length < 1) && '+ Upload'}
                    </Upload>
                </ImgCrop>
            </Space>
            {error && typeof error === 'string' && (
                <TextP size="sm" type="error">{error}</TextP>
            )}
        </div>
    );
}

export default ImageUpload;