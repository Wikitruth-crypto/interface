'use client'

import React, { useState, useEffect, useRef } from 'react';
import {Alert } from 'antd';
import ParagraphList from '@/components/ParagraphList';
// import { timeToDate } from '@dapp/utils/time';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import useDecryptionViewFile from '../hooks/useDecryptionViewFile';
import ViewFileButton from '../ButtonContainer/viewFile';
import TextP from '@/components/base/text_p';

interface Props {
    tokenId?: string,
}

const Published: React.FC<Props> = ({ }) => {
    const { box, metadataBox } = useBoxDetailContext();
    const { decryptionViewFile } = useDecryptionViewFile();
    const decryptionViewFileRef = useRef(decryptionViewFile);
    decryptionViewFileRef.current = decryptionViewFile;

    const [fileCidList, setFileCidList] = useState<string[]>([]);
    const [uriError, setUriError] = useState<string | null>(null);

    const mintMethod = metadataBox?.mintMethod || 'create';
    const isCreateMode = mintMethod === 'create';

    useEffect(() => {
        if (!metadataBox) {
            setFileCidList([]);
            setUriError('Metadata not found, cannot show download information.');
            return;
        }

        if (metadataBox.mintMethod === 'createAndPublish') {
            setFileCidList(metadataBox.fileList || []);
            setUriError(null);
            return;
        }

    }, [metadataBox]);

    if (!box) {
        return <div>loading...</div>;
    }

    const hasUriData = fileCidList.length > 0;

    return (
        <div className="flex w-full flex-col items-start justify-center gap-4">
            <TextP>
                You can use the link to download the file. If the password is empty,
                <br />
                it means that a password is not required.
            </TextP>

            {metadataBox && (
                <TextP>
                    The current Box uses the <strong className="text-primary">{mintMethod}</strong> mode to publish,
                    {isCreateMode ? ' need to decrypt to get file CID / password.' : ' metadata directly contains file CID.'}
                </TextP>
            )}

            {uriError && (
                <Alert
                    type="error"
                    showIcon
                    message="Cannot show file information"
                    description={uriError}
                />
            )}

            {fileCidList.length > 0 ? (
                <ParagraphList
                    label="File CID"
                    type="cid"
                    cidList={fileCidList}
                />
            ) : (
                <ViewFileButton />
            )
            }

            {!uriError && metadataBox && !hasUriData && (
                <TextP>
                    Metadata does not contain files to display.
                </TextP>
            )}
        </div>
    );
}

export default Published;
