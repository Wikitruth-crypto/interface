import { useState, useEffect } from "react";
import type { UploadFile } from 'antd/es/upload/interface';
import { useCreateForm } from '../../context/CreateFormContext';

/**
 * File Upload Hook (Refactored)
 * Uses React Hook Form to manage validation and error state
 * 
 * Key Improvements:
 * - Retain file processing logic and size validation
 * - Remove someInputIsEmpty validation logic
 * - Validation handled by RHF
 */
export const useAddFile = () => {
    const form = useCreateForm();
    const { formState, watch } = form;

    const [uploadError, setUploadError] = useState<string>('');

    // Listen to current value
    const fileList = watch('fileList') || [];

    // Get error state (optional field, might not be touched)
    const error = formState.touchedFields.fileList
        ? formState.errors.fileList?.message
        : uploadError; // Prioritize upload error

    // Handle file change
    const handleChange = (info: { fileList: UploadFile[] }) => {
        form.setValue('fileList', info.fileList, {
            shouldValidate: formState.touchedFields.fileList,
            shouldDirty: true,
            shouldTouch: true,
        });
    };

    // Check file size
    const handleGetTotalSize = (fileList: UploadFile[]) => {
        // Iterate file list to get total file size
        let totalSize = 0;
        fileList.forEach(file => {
            // Make file conform to File type, get file size
            const fileObj = file.originFileObj as File;
            if (fileObj) {
                totalSize += fileObj.size;
            }
        });

        const isLt5M = totalSize < 5 * 1024 * 1024;
        if (!isLt5M) {
            setUploadError('The total size of the files must be less than 5MB');
            // Delete the last file
            form.setValue('fileList', fileList.slice(0, -1), {
                shouldValidate: true,
                shouldDirty: true,
            });
        } else {
            setUploadError('');
        }
    };

    useEffect(() => {
        // Check file size every time a file is added
        if (fileList.length > 0) {
            setTimeout(() => {
                setUploadError('');
            }, 300);

            // Check file size
            handleGetTotalSize(fileList);
        }
    }, [fileList.length]);

    return {
        fileList,
        error,
        handleChange
    };
};


