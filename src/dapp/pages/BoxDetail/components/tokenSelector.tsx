"use client"
import CommonSelect, { CommonSelectOption } from '@/dapp/components/base/CommonSelect';
import { useSupportedTokens } from '@/dapp/contractsConfig';
import { useEffect, useState } from 'react';

interface TokenSelectorProps {
    onChange: (token: CommonSelectOption | null) => void;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ onChange }) => {
    const supportedTokens = useSupportedTokens();
    const [value, setValue] = useState<CommonSelectOption|null>(null)
    const options: CommonSelectOption[] = supportedTokens.map(token => ({
        // icon: '/token/usdt.png',
        index: token.index,
        name: token.name,
        symbol: token.symbol,
        value: token.address,
        decimals: token.decimals
    }));

    const handleChange = (option: CommonSelectOption | null) => {
        onChange(option);
        setValue(option)
    }

    useEffect(() => {
        setValue(options[0])
    }, [])

    return (
        <CommonSelect
            options={options}
            value={value}
            onChange={handleChange}
            placeholder="Please select a token"
        />
    )
}

export default TokenSelector;