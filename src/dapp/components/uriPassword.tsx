"use client"

import React, { FC, useEffect, useState } from 'react';
import { Button, Typography } from 'antd';
import { cn } from "@/lib/utils";
import { Copy, Check, Eye, EyeOff } from "lucide-react";
import { ipfsCidToUrl } from '@/dapp/utils/ipfsUrl/ipfsCidToUrl';

export interface UriPasswordProps {
    fileCid: string;
    password: string;
    className?: string;
    variant?: 'default' | 'compact';
    hidePassword?: boolean;
}

interface CopyItem {
    label: string;
    value: string;
    icon?: React.ReactNode;
    masked?: boolean;
}


const UriPassword: FC<UriPasswordProps> = ({
    fileCid,
    password,
    className,
    variant = 'default',
    hidePassword = true
}) => {
    const [fileUri, setFileUri] = useState<string>('');
    const [showPasswordText, setShowPasswordText] = useState(!hidePassword);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchFileUri = async () => {
            if (!fileCid) return;

            setIsLoading(true);
            try {
                const uri = await ipfsCidToUrl(fileCid);
                setFileUri(uri);
            } catch (error) {
                console.error('Failed to convert CID to URL:', error);
                setFileUri('');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFileUri();
    }, [fileCid]);

    const copyItems: CopyItem[] = [
        {
            label: 'CID',
            value: fileCid,
            icon: <Copy className="h-4 w-4" />
        },
        {
            label: 'URL',
            value: fileUri,
            icon: <Copy className="h-4 w-4" />
        },
        {
            label: 'Password',
            value: password,
            icon: <Copy className="h-4 w-4" />,
            masked: hidePassword && !showPasswordText
        }
    ];

    const formatDisplayValue = (item: CopyItem) => {
        if (item.masked && item.label === 'Password') {
            return '•'.repeat(Math.min(item.value.length, 8));
        }
        
        if (variant === 'compact' && item.value.length > 30) {
            return `${item.value.slice(0, 15)}...${item.value.slice(-10)}`;
        }
        
        return item.value;
    };

    if (variant === 'compact') {
        return (
            <div className={cn("space-y-2", className)}>
                {copyItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                        <span className="text-sm font-medium w-20 text-muted-foreground">
                            {item.label}:
                        </span>
                        <Typography.Text
                            copyable={{
                                text: item.value,
                                icon: [<Copy key="copy" className="h-3 w-3" />, <Check key="check" className="h-3 w-3 text-green-500" />],
                                tooltips: ['Copy', 'Copied!'],
                            }}
                            disabled={!item.value || (isLoading && item.label === 'URL')}
                            className="flex-1 px-2 py-1 bg-muted rounded text-sm font-mono truncate"
                        >
                            {isLoading && item.label === 'URL' ? 'Loading...' : formatDisplayValue(item)}
                        </Typography.Text>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={cn("space-y-3", className)}>
            {copyItems.map((item) => (
                <div
                    key={item.label}
                    className={cn(
                        "flex items-center justify-between gap-3",
                        "p-3 rounded-lg border bg-card",
                        "transition-all duration-200",
                        "hover:bg-accent/50"
                    )}
                >
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-muted-foreground">
                                {item.label}
                            </span>
                            {item.label === 'Password' && hidePassword && (
                                <Button
                                    type="text"
                                    size="small"
                                    onClick={() => setShowPasswordText(!showPasswordText)}
                                    className="h-6 w-6 p-0"
                                >
                                    {showPasswordText ?
                                        <EyeOff className="h-3 w-3" /> :
                                        <Eye className="h-3 w-3" />
                                    }
                                </Button>
                            )}
                        </div>
                        <Typography.Text
                            copyable={{
                                text: item.value,
                                icon: [<Copy key="copy" className="h-4 w-4" />, <Check key="check" className="h-4 w-4 text-green-500" />],
                                tooltips: ['Copy', 'Copied!'],
                            }}
                            disabled={!item.value || (isLoading && item.label === 'URL')}
                            className={cn(
                                "block w-full px-2 py-1 text-sm font-mono",
                                "bg-muted rounded truncate",
                                "select-all"
                            )}
                        >
                            {isLoading && item.label === 'URL' ? (
                                <span className="text-muted-foreground">Loading...</span>
                            ) : (
                                formatDisplayValue(item)
                            )}
                        </Typography.Text>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UriPassword; 