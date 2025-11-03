import { useState, useEffect } from "react";
import type { UploadFile } from 'antd/es/upload/interface';
import { useCreateForm } from '../../context/CreateFormContext';

/**
 * 文件上传 Hook (重构版)
 * 使用 React Hook Form 管理验证和错误状态
 * 
 * 关键改进：
 * - 保留文件处理逻辑和大小验证
 * - 移除 someInputIsEmpty 的验证逻辑
 * - 验证交由 RHF 处理
 */
export const useAddFile = () => {
    const form = useCreateForm();
    const { formState, watch } = form;

    const [uploadError, setUploadError] = useState<string>('');

    // 监听当前值
    const fileList = watch('fileList') || [];

    // 获取错误状态（可选字段，可能没有 touched）
    const error = formState.touchedFields.fileList
        ? formState.errors.fileList?.message
        : uploadError; // 优先显示上传错误

    // 处理文件变更
    const handleChange = (info: { fileList: UploadFile[] }) => {
        form.setValue('fileList', info.fileList, {
            shouldValidate: formState.touchedFields.fileList,
            shouldDirty: true,
            shouldTouch: true,
        });
    };

    // 判断文件的大小
    const handleGetTotalSize = (fileList: UploadFile[]) => {
        // 遍历文件列表,获得总的文件大小
        let totalSize = 0;
        fileList.forEach(file => {
            // 让file 符合File类型，获取文件大小
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
        // 每次添加一个文件，就进行判断文件大小
        if (fileList.length > 0) {
            setTimeout(() => {
                setUploadError('');
            }, 300);

            // 判断文件大小
            handleGetTotalSize(fileList);
        }
    }, [fileList.length]);

    return {
        fileList,
        error,
        handleChange
    };
};


