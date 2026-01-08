'use client'

import React, { useCallback } from 'react';
import { useCreateForm } from '../context/CreateFormContext';
import CountrySelector, { CountryStateSelection } from '@dapp/components/countrySelector/countrySelector2';
import { cn } from '@/lib/utils';
import TextP from '@/components/base/text_p';
import TextTitle from '@/components/base/text_title';

interface CountrySelectorCreateProps {
    className?: string;
}


const CountrySelectorCreate: React.FC<CountrySelectorCreateProps> = ({
    className
}) => {
    const form = useCreateForm();
    const { formState } = form;

    const countryValue = form.watch('country');
    const stateValue = form.watch('state');
    
    // Get error status (only show after touched)
    const error = formState.touchedFields.country 
        ? formState.errors.country?.message 
        : undefined;
    
    // Prevent initial error display
    const shouldShowError = formState.touchedFields.country && formState.errors.country;
    
    // Handle selection change
    const handleSelectionChange = useCallback((selection: CountryStateSelection | null) => {
        if (selection) {
            // First set the value, without triggering validation
            form.setValue('country', selection.country.name, {
                shouldValidate: false,
                shouldDirty: true,
                shouldTouch: false, // Do not immediately mark as touched
            });
            form.setValue('state', selection.state.name, {
                shouldValidate: false,
                shouldDirty: true,
                shouldTouch: false, // Do not immediately mark as touched
            });
            
            // Delay mark as touched and trigger validation
            setTimeout(() => {
                form.setValue('country', selection.country.name, {
                    shouldTouch: true,
                    shouldValidate: true,
                });
                form.setValue('state', selection.state.name, {
                    shouldTouch: true,
                    shouldValidate: true,
                });
            }, 100);
        }
    }, [form]);

    return (
        <div className={cn("flex flex-col w-full lg:w-md space-y-2", className)}>
            <TextTitle>Country/Region:</TextTitle>
            <div className="w-full">
                <CountrySelector
                    onSelectionChange={handleSelectionChange}
                    placeholder={{
                        country: "Select a country",
                        state: "Select a state"
                    }}
                    initialCountry={countryValue || undefined}
                    initialState={stateValue || undefined}
                />
            </div>
            
            {shouldShowError && (
                <TextP size="sm" type="error">
                    {error}
                </TextP>
            )}
        </div>
    );
};

export default CountrySelectorCreate;
