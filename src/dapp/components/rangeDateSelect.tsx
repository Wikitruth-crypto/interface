'use client'

import React from 'react';
import { DatePicker,  Space } from 'antd';
import { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

interface TypeProps {
    disabled?: boolean;
    onChange?: (dates: [Dayjs | null, Dayjs | null] | null) => void;
}

const RangeDateSelector: React.FC<TypeProps> = ({disabled = false,onChange}) => {

    const handleDateChange = (
        dates: [
            Dayjs | null, 
            Dayjs | null] | null, 
            // dateStrings: [string, string]
        ) => {
        onChange?.(dates);
    };

    return (
    <>
        <Space direction="vertical" size={12} >
                {/* <DatePicker renderExtraFooter={() => 'extra footer'} /> */}
                {/* <DatePicker renderExtraFooter={() => 'extra footer'} showTime /> */}
                <RangePicker 
                    disabled={disabled} 
                    allowEmpty={[true, true]}
                    renderExtraFooter={() => 'extra footer'} 
                    onChange={handleDateChange}
                />
                {/* <RangePicker renderExtraFooter={() => 'extra footer'} showTime /> */}
                {/* <DatePicker renderExtraFooter={() => 'extra footer'} picker="month" /> */}
            </Space>
    </>
    );
};

export default RangeDateSelector;