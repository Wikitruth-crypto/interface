"use client"

import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd';
import { Button, message, Upload, Space } from 'antd';

export interface FileUploadProps {
    maxCount?: number;
    acceptType?: string;
    maxSize?: number;
    buttonText?: string;
    disabled?: boolean;
    onSuccess?: (file: UploadFile) => void;
    onError?: (error: Error) => void;
    onChange?: (fileList: UploadFile[]) => void;
    uploadUrl?: string;
    headers?: Record<string, string>;
    localOnly?: boolean;
}

const FileUploadButton: React.FC<FileUploadProps> = ({
    maxCount = 1,
    acceptType,
    maxSize = 10,
    buttonText = 'Click to Upload',
    disabled = false,
    onSuccess,
    onError,
    onChange,
    uploadUrl = 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    headers = {
        authorization: 'authorization-text',
    },
    localOnly = false,
}) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [error, setError] = useState<string>('');

    const handleChange: UploadProps['onChange'] = (info) => {
        setFileList(info.fileList);

        if (onChange) {
            onChange(info.fileList);
        }

        if (info.file.status === 'done') {
            message.success(`${info.file.name} uploaded successfully`);
            if (onSuccess) {
                onSuccess(info.file);
            }
        } else if (info.file.status === 'error') {
            const errorMsg = `${info.file.name} upload failed`;
            message.error(errorMsg);
            setError(errorMsg);
            if (onError) {
                onError(new Error(errorMsg));
            }
        }
    };

    const beforeUpload: UploadProps['beforeUpload'] = (file) => {
        // Check file size
        const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
        if (!isLtMaxSize) {
            const errorMsg = `The file size cannot exceed ${maxSize}MB!`;
            message.error(errorMsg);
            setError(errorMsg);
            return Upload.LIST_IGNORE;
        }

        // Check file type
        if (acceptType && !acceptType.split(',').some(type => file.type.includes(type.trim()))) {
            const errorMsg = `Only ${acceptType} format files are allowed!`;
            message.error(errorMsg);
            setError(errorMsg);
            return Upload.LIST_IGNORE;
        }

        setError('');

        // If it is local mode, do not upload the file, directly process
        if (localOnly) {
            // Create a virtual UploadFile object
            const uploadFile: UploadFile = {
                uid: file.uid || Date.now().toString(),
                name: file.name,
                size: file.size,
                type: file.type,
                status: 'done',
                originFileObj: file,
            };

            // Update file list
            const newFileList = maxCount === 1 ? [uploadFile] : [...fileList, uploadFile];
            setFileList(newFileList);

            // Trigger callback
            if (onChange) {
                onChange(newFileList);
            }

            if (onSuccess) {
                onSuccess(uploadFile);
            }

            // Return false to prevent upload
            return false;
        }

        return true;
    };

    const uploadProps: UploadProps = {
        name: 'file',
        action: localOnly ? undefined : uploadUrl, // Local mode does not set action
        headers: localOnly ? undefined : headers,   // Local mode does not set headers
        fileList,
        maxCount,
        accept: acceptType,
        disabled,
        beforeUpload,
        onChange: handleChange,
        customRequest: localOnly ? ({ onSuccess }) => {
            // Empty implementation of local mode
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess('ok');
                }
            }, 0);
        } : undefined,
    };

    return (
        <div className="flex flex-col gap-2">
            <Space>
                <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />} disabled={disabled}>
                        {buttonText}
                    </Button>
                </Upload>
            </Space>
            {error && <p className="text-red-400 text-sm font-mono">{error}</p>}
        </div>
    );
};

export default FileUploadButton;