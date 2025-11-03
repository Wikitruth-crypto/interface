import { useState } from 'react';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { useCreateForm } from '../../context/CreateFormContext';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

/**
 * 图片上传 Hook (重构版)
 * 使用 React Hook Form 管理验证和错误状态
 * 
 * 关键改进：
 * - 保留文件处理逻辑
 * - 移除 someInputIsEmpty 的验证逻辑
 * - 验证交由 RHF 处理
 */
export const useAddImage = () => {
    const form = useCreateForm();
    const { formState, watch } = form;

    const [uploadError, setUploadError] = useState<string>('');

    // 监听当前值
    const boxImageList = watch('boxImageList') || [];

    // 获取错误状态（仅在 touched 后显示）
    const error = formState.touchedFields.boxImageList
        ? formState.errors.boxImageList?.message
        : uploadError; // 优先显示上传错误

    const onChange: UploadProps['onChange'] = (info: { fileList: UploadFile[] }) => {
        try {
            setUploadError('');
            // 清理文件列表，确保每个文件对象都有正确的结构
            const cleanFileList = info.fileList.map((file, index) => ({
                ...file,
                uid: file.uid || `file-${Date.now()}-${index}`,
                name: file.name || 'uploaded-file',
                status: file.status || 'done',
            }));

            // 更新表单值
            form.setValue('boxImageList', cleanFileList, {
                shouldValidate: formState.touchedFields.boxImageList,
                shouldDirty: true,
                shouldTouch: true,
            });
        } catch (error) {
            console.error('onChange error:', error);
            setUploadError('Failed to process uploaded file');
        }
    };

    const onPreview = async (file: UploadFile) => {
        try {
            let src = file.url as string;
            if (!src && file.originFileObj) {
                src = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file.originFileObj as FileType);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = () => reject(new Error('Failed to read file'));
                });
            }

            if (src) {
                const imgWindow = window.open(src);
                if (imgWindow) {
                    imgWindow.document.write(`<img src="${src}" style="max-width: 100%; height: auto;" />`);
                }
            }
        } catch (error) {
            console.error('Preview error:', error);
        }
    };

    const onModalOk = async (value: any) => {
        try {
            const file = await Promise.resolve(value);
            if (file instanceof File) {
                const blob = file.slice(0, file.size, file.type);
                const size = blob.size;

                const isLt500K = size < 0.3 * 1024 * 1024;
                if (!isLt500K) {
                    setUploadError('The cropped image size must be less than 0.3MB');
                    form.setValue('boxImageList', [], {
                        shouldValidate: true,
                        shouldTouch: true,
                    });
                } else {
                    // 创建一个干净的 UploadFile 对象
                    const rcFile = file as any;
                    rcFile.uid = Date.now().toString();

                    const newFileList: UploadFile[] = [{
                        uid: Date.now().toString(),
                        name: file.name || 'cropped-image.jpg',
                        status: 'done',
                        url: URL.createObjectURL(file),
                        originFileObj: rcFile,
                        size: file.size,
                        type: file.type,
                    }];

                    form.setValue('boxImageList', newFileList, {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                    });
                    setUploadError('');
                }
            }
        } catch (error) {
            console.error('onModalOk error:', error);
            setUploadError('Failed to process the cropped image');
        }
    };

    return {
        boxImageList,
        error,
        onChange,
        onPreview,
        onModalOk
    };
};
