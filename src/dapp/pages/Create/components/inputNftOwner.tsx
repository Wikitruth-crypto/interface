import React from 'react';
import { useAddressInput } from '../hooks/Input/useAddressInput';
import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';
import { cn } from '@/lib/utils';
import { Input } from 'antd';

interface InputNftOwnerProps {
    className?: string;
}


export const InputNftOwner: React.FC<InputNftOwnerProps> = ({ className }) => {
    const { inputValue, handleTypeChange, handleBlur, error } = useAddressInput();
    const { address } = useWalletContext();

    return (
        <div className={cn("flex flex-col w-full lg:max-w-md space-y-2", className)}>
            <div className="font-mono text-sm">Owner (TruthNFT):</div>
            <p className="text-sm text-gray-400">
                You can send the NFT to another address. Such as Vitalik、CZ address.
            </p>
            <div className="flex items-center w-full">
                <div className="w-full">
                    <Input
                        value={inputValue}
                        onChange={(e) => handleTypeChange(e.target.value)}
                        onBlur={handleBlur} 
                        maxLength={42}
                        placeholder={`Current address: ${address || '0x...'}`}
                    />
                </div>
            </div>
            {error && <p className={cn(
                "text-sm font-light text-error",
                "px-1 leading-tight"
            )}>
                {error}
            </p>}
        </div>
    );
}
