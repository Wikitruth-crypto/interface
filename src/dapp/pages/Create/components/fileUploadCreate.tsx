import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Upload, Space } from 'antd';
import { useAddFile } from '@dapp/pages/Create/hooks/Input/useAddFile';
import { cn } from '@/lib/utils';

const { Dragger } = Upload;

interface FileUploadProps {
    className?: string;
}


const FileUpload: React.FC<FileUploadProps> = ({ className }) => {
    const { fileList, error, handleChange } = useAddFile();


    return (
        <div className={cn("flex flex-col w-full space-y-2", className)}>
            <div className="font-mono text-sm">Crime Evidence File:</div>
            <Space  >
                <Dragger
                    multiple
                    beforeUpload={() => false}
                    onChange={handleChange}
                    fileList={fileList}
                    showUploadList={{
                        showPreviewIcon: true,
                        showRemoveIcon: true,
                        showDownloadIcon: false
                    }}
                    accept="application/pdf"
                    // error={error}
                // {...props}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload.
                        Strictly prohibited from uploading company data or other banned files.
                        <br />
                        The total size of the files must be less than 5MB.
                    </p>
                </Dragger>
            </Space>
            {error && typeof error === 'string' && (
                <p className={cn("text-sm text-error", "px-1 leading-tight")}>{error}</p>
            )}
        </div>
    );
}

export default FileUpload;