'use client'
import React, { useCallback } from 'react';
import { useCreateForm } from '../context/CreateFormContext';
import { DateSelector, DateDataType } from '@/components/dateSelector';
import { cn } from '@/lib/utils';
import TextP from '@/components/base/text_p';
import TextTitle from '@/components/base/text_title';

interface DateSelectorCreateProps {
    className?: string;
}

const DateSelectorCreate: React.FC<DateSelectorCreateProps> = ({
    className
}) => {
    const form = useCreateForm();
    const { formState } = form;
    const eventDateValue = form.watch('eventDate');
    
    // Get error status (only show after touched)
    const error = formState.touchedFields.eventDate 
        ? formState.errors.eventDate?.message 
        : undefined;

    const handleDateChange = useCallback((date: DateDataType) => {
        form.setValue('eventDate', date.value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        });
    }, [form]);

    return (
        <div className={cn("flex flex-col w-full lg:max-w-[300px] space-y-2", className)}>
            <TextTitle>Event Date:</TextTitle>
            <div className="w-full">
                <DateSelector
                    onSuccess={handleDateChange}
                    value={eventDateValue || undefined}
                />
            </div>
            
            {error && (
                <TextP size="sm" type="error">
                    {error}
                </TextP>
            )}
        </div>
    );
};

export default DateSelectorCreate;
