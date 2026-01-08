import { useCallback } from 'react';
import { useCreateForm } from '../../context/CreateFormContext';
import { useNumberInput } from '@/hooks/useNumberInput';

/**
 * Price Input Hook (Simplified)
 * Retain number formatting, remove duplicate validation logic
 */
export const usePriceInput = (decimals: number = 3) => {
    const form = useCreateForm();
    const { formState, watch } = form;

    // Use common number input hooks for formatting
    const { value: formattedValue, handleNumberChange } = useNumberInput(decimals);

    // Listen to price value in form
    const inputValue = watch('price') || '';

    // Get error state (only show after touched)
    const error = formState.touchedFields.price
        ? formState.errors.price?.message
        : undefined;

    // Handle input change
    const handlePriceChange = useCallback((value: string) => {
        // Use useNumberInput for formatting
        handleNumberChange(value);

        // Update form value
        form.setValue('price', value, {
            shouldValidate: formState.touchedFields.price,
            shouldDirty: true,
        });
    }, [handleNumberChange, form, formState.touchedFields.price]);

    // Handle blur event - mark as touched and trigger validation
    const handleBlur = useCallback(() => {
        form.setValue('price', inputValue, {
            shouldTouch: true,
            shouldValidate: true,
        });
    }, [form, inputValue]);

    return {
        error,
        inputValue,
        handlePriceChange,
        handleBlur,
        formattedValue, // Formatted value
        decimals,
    };
};
