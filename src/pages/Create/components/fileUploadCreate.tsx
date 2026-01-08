import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Upload, Space,} from 'antd';
import { useAddFile } from '@Create/hooks/Input/useAddFile';
import { cn } from '@/lib/utils';
import TextP from '@/components/base/text_p';
import TextTitle from '@/components/base/text_title';

const { Dragger } = Upload;

interface FileUploadProps {
    className?: string;
}


const FileUpload: React.FC<FileUploadProps> = ({ className }) => {
    const { fileList, error, handleChange } = useAddFile();


    return (
        <div className={cn("flex flex-col w-full space-y-2", className)}>
            <TextTitle>Crime Evidence File:</TextTitle>
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
                    <TextP size="sm">
                        Click or drag file to this area to upload
                        <br />
                        Support for a single or bulk upload.
                        Strictly prohibited from uploading company data or other banned files.
                        <br />
                        The total size of the files must be less than 5MB.
                    </TextP>
                </Dragger>
            </Space>
            {error && typeof error === 'string' && (
                <TextP size="sm" type="error">{error}</TextP>
            )}
        </div>
    );
}

export default FileUpload;