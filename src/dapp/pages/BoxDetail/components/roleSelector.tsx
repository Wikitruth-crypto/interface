import { Select } from 'antd';
// import { useState } from 'react';

// import { useBoxDetailStore } from '@BoxDetail/store/nftDetailStore';

interface RoleSelectorProps {
    options: string[];
    onChange: (role: string | null) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onChange, options }) => {

    const handleChange = (value: string) => {
        onChange(value);
    };

    const handleFilter = (input: string, option: any) => {
        return option.label.toLowerCase().includes(input.toLowerCase());
    };

    return (
        <Select
            showSearch
            placeholder="Select a person"
            onChange={handleChange}
            filterOption={handleFilter}
            options={options.map(option => ({ value: option, label: option }))}
        />
    )
}

export default RoleSelector;