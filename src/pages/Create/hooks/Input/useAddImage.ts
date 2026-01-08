import { useState } from 'react';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { useCreateForm } from '../../context/CreateFormContext';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

/**
 * Image Upload Hook (Refactored)
 * Uses React Hook Form to manage validation and error state
 * 
 * Key Improvements:
 * - Retain file processing logic
 * - Remove someInputIsEmpty validation logic
 * - Validation handled by RHF
 */
export const useAddImage = () => {
    const form = useCreateForm();
    const { formState, watch } = form;

    const [uploadError, setUploadError] = useState<string>('');

    // Listen to current value
    const boxImageList = watch('boxImageList') || [];

    // Get error state (only show after touched)
    const error = formState.touchedFields.boxImageList
        ? formState.errors.boxImageList?.message
        : uploadError; // Prioritize upload error

    const onChange: UploadProps['onChange'] = (info: { fileList: UploadFile[] }) => {
        try {
            setUploadError('');
            // Clean file list, ensure each file object has correct structure
            const cleanFileList = info.fileList.map((file, index) => ({
                ...file,
                uid: file.uid || `file-${Date.now()}-${index}`,
                name: file.name || 'uploaded-file',
                status: file.status || 'done',
            }));

            // Update form value
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
                    // Create a clean UploadFile object
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
