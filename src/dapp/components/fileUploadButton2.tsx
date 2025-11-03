"use client"

import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd';
import { Button, message, Upload, Space } from 'antd';

export interface FileUploadProps {
    // 上传文件的最大数量
    maxCount?: number;
    // 允许上传的文件类型
    acceptType?: string;
    // 单个文件的最大大小（单位：MB）
    maxSize?: number;
    // 上传按钮的文本
    buttonText?: string;
    // 是否禁用
    disabled?: boolean;
    // 上传成功后的回调
    onSuccess?: (file: UploadFile) => void;
    // 上传失败后的回调
    onError?: (error: Error) => void;
    // 文件列表变化的回调
    onChange?: (fileList: UploadFile[]) => void;
    // 自定义上传地址
    uploadUrl?: string;
    // 自定义请求头
    headers?: Record<string, string>;
    // 是否只选择文件不上传（新增）
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
        // 检查文件大小
        const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
        if (!isLtMaxSize) {
            const errorMsg = `The file size cannot exceed ${maxSize}MB!`;
            message.error(errorMsg);
            setError(errorMsg);
            return Upload.LIST_IGNORE;
        }

        // 检查文件类型
        if (acceptType && !acceptType.split(',').some(type => file.type.includes(type.trim()))) {
            const errorMsg = `Only ${acceptType} format files are allowed!`;
            message.error(errorMsg);
            setError(errorMsg);
            return Upload.LIST_IGNORE;
        }

        setError('');

        // 如果是本地模式，不上传文件，直接处理
        if (localOnly) {
            // 创建一个虚拟的UploadFile对象
            const uploadFile: UploadFile = {
                uid: file.uid || Date.now().toString(),
                name: file.name,
                size: file.size,
                type: file.type,
                status: 'done',
                originFileObj: file,
            };

            // 更新文件列表
            const newFileList = maxCount === 1 ? [uploadFile] : [...fileList, uploadFile];
            setFileList(newFileList);

            // 触发回调
            if (onChange) {
                onChange(newFileList);
            }

            if (onSuccess) {
                onSuccess(uploadFile);
            }

            // 返回false阻止上传
            return false;
        }

        return true;
    };

    const uploadProps: UploadProps = {
        name: 'file',
        action: localOnly ? undefined : uploadUrl, // 本地模式时不设置action
        headers: localOnly ? undefined : headers,   // 本地模式时不设置headers
        fileList,
        maxCount,
        accept: acceptType,
        disabled,
        beforeUpload,
        onChange: handleChange,
        customRequest: localOnly ? ({ onSuccess }) => {
            // 本地模式的空实现
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