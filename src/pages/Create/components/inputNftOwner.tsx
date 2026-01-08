import React from 'react';
import { useAddressInput } from '../hooks/Input/useAddressInput';
import { useWalletContext } from '@dapp/contexts/web3Context/useAccount/WalletContext';
import { cn } from '@/lib/utils';
import { Button, Input, } from 'antd';
import TextP from '@/components/base/text_p';
import TextTitle from '@/components/base/text_title';

interface InputNftOwnerProps {
    className?: string;
}


export const InputNftOwner: React.FC<InputNftOwnerProps> = ({ className }) => {
    const { inputValue, handleTypeChange, handleBlur, error } = useAddressInput();
    const { address } = useWalletContext();

    return (
        <div className={cn("flex flex-col w-full space-y-2", className)}>
            <TextTitle>Owner (TruthNFT):</TextTitle>
            <TextP size="sm" type="secondary">
                You can send the NFT to another address. Such as Vitalik、CZ address.
            </TextP>
            <div className="flex items-center w-full lg:max-w-md gap-2">
                <Input
                    value={inputValue}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    onBlur={handleBlur}
                    maxLength={42}
                    placeholder={`Current address: ${address || '0x...'}`}
                    allowClear={true}
                />
                <Button onClick={() => handleTypeChange(address || '')}>Current</Button>
            </div>
            {error && <TextP size="sm" type="error">
                {error}
            </TextP>}
        </div>
    );
}
