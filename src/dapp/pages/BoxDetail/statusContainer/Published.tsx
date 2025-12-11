'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Typography, Alert } from 'antd';
import ParagraphList from '@/dapp/components/ParagraphList';
import { timeToDate } from '@dapp/utils/time';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import useDecryptionViewFile from '../hooks/useDecryptionViewFile';

interface Props {
    tokenId?: string,
}

const Published: React.FC<Props> = ({ }) => {
    const { box, metadataBox } = useBoxDetailContext();
    const { decryptionViewFile } = useDecryptionViewFile();
    const decryptionViewFileRef = useRef(decryptionViewFile);
    decryptionViewFileRef.current = decryptionViewFile;

    const [fileCidList, setFileCidList] = useState<string[]>([]);
    const [password, setPassword] = useState<string>('');
    const [slicesMetadataCID, setSlicesMetadataCID] = useState<string>('');
    const [uriError, setUriError] = useState<string | null>(null);
    const [isResolving, setIsResolving] = useState<boolean>(false);

    const [date, setDate] = useState<string | null>(null);

    useEffect(() => {
        if (box?.deadline) {
            const result = timeToDate(Number(box.deadline));
            setDate(result);
        }
    }, [box?.deadline]);

    const mintMethod = metadataBox?.mintMethod || 'create';
    const isCreateMode = mintMethod === 'create';

    useEffect(() => {
        if (!metadataBox) {
            setFileCidList([]);
            setPassword('');
            setSlicesMetadataCID('');
            setUriError('Metadata not found, cannot show download information.');
            setIsResolving(false);
            return;
        }

        if (metadataBox.mintMethod === 'createAndPublish') {
            setFileCidList(metadataBox.fileList || []);
            setPassword('');
            setSlicesMetadataCID('');
            setUriError(null);
            setIsResolving(false);
            return;
        }

        if (!box?.privateKey) {
            setFileCidList([]);
            setPassword('');
            setSlicesMetadataCID('');
            setUriError('Cannot find public privateKey in Box data, cannot decrypt files.');
            setIsResolving(false);
            return;
        }

        let cancelled = false;

        const loadEncryptedData = async () => {
            setIsResolving(true);
            setUriError(null);
            try {
                const result = await decryptionViewFileRef.current?.(box.privateKey as string, metadataBox);
                if (cancelled || !result) return;
                setFileCidList(result.fileCIDList || []);
                setPassword(result.password || '');
                setSlicesMetadataCID(result.slicesMetadataCID || '');
            } catch (error) {
                if (cancelled) return;
                const message = error instanceof Error ? error.message : 'Failed to decrypt file information, please try again later.';
                setUriError(message);
                setFileCidList([]);
                setPassword('');
                setSlicesMetadataCID('');
            } finally {
                if (!cancelled) {
                    setIsResolving(false);
                }
            }
        };

        void loadEncryptedData();

        return () => {
            cancelled = true;
        };
    }, [metadataBox, box?.privateKey]);

    if (!box) {
        return <div>loading...</div>;
    }

    const hasUriData = fileCidList.length > 0 || (isCreateMode && (password || slicesMetadataCID));

    return (
        <div className="flex w-full flex-col items-start justify-center gap-4">
            <div className="flex flex-row items-center justify-start gap-2">
                <Typography.Paragraph className="text-muted-foreground text-sm">Public Date:</Typography.Paragraph>
                <Typography.Paragraph className="text-primary text-sm">{date}</Typography.Paragraph>
            </div>
            <Typography.Paragraph className="text-muted-foreground text-sm">
                You can use the link to download the file. If the password is empty,
                <br />
                it means that a password is not required.
            </Typography.Paragraph>

            {metadataBox && (
                <Typography.Paragraph className="text-muted-foreground text-xs">
                    The current Box uses the <strong className="text-primary">{mintMethod}</strong> mode to publish,
                    {isCreateMode ? ' need to decrypt to get file CID / password.' : ' metadata directly contains file CID.'}
                </Typography.Paragraph>
            )}

            {isResolving && (
                <Typography.Paragraph className="text-muted-foreground text-xs">
                    Parsing file links, please wait...
                </Typography.Paragraph>
            )}

            {uriError && (
                <Alert
                    type="error"
                    showIcon
                    message="Cannot show file information"
                    description={uriError}
                />
            )}

            {fileCidList.length > 0 && (
                <ParagraphList
                    label="File CID"
                    type="cid"
                    cidList={fileCidList}
                />


            )}
            {
                password && (
                    <ParagraphList
                        label="Password"
                        type="password"
                        cidList={[password]}
                    />
                )}
            {
                slicesMetadataCID && (
                    <ParagraphList
                        label="Slices Metadata CID"
                        type="cid"
                        cidList={[slicesMetadataCID]}
                    />
                )}

            {!isResolving && !uriError && metadataBox && !hasUriData && (
                <Typography.Paragraph className="text-muted-foreground text-xs">
                    Metadata does not contain files to display.
                </Typography.Paragraph>
            )}
        </div>
    );
}

export default Published;
