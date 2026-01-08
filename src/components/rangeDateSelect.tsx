'use client'

import React from 'react';
import { DatePicker,  Space } from 'antd';
import { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

interface TypeProps {
    disabled?: boolean;
    value?: [Dayjs | null, Dayjs | null];
    onChange?: (dates: [Dayjs | null, Dayjs | null] | null) => void;
}

const RangeDateSelector: React.FC<TypeProps> = ({
    disabled = false,
    value,
    onChange
}) => {

    const handleDateChange = (
        dates: [
            Dayjs | null, 
            Dayjs | null] | null, 
            // dateStrings: [string, string]
        ) => {
        onChange?.(dates);
    };

    return (
        <Space direction="vertical" size={12}>
            <RangePicker 
                value={value}
                disabled={disabled} 
                allowEmpty={[true, true]}
                allowClear
                onChange={handleDateChange}
            />
        </Space>
    );
};

export default RangeDateSelector;
