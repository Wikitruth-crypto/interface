import React, { useCallback } from 'react';
import { useCreateForm } from '../../context/CreateFormContext';
import { FormFieldName } from '../../types/stateType';

/**
 * Common Form Input Hook
 * Replaces all duplicate input hooks, unifies form input logic
 * 
 * Advantages:
 * - Eliminate duplicate code
 * - Unified validation logic
 * - Simplify maintenance
 */
export const useFormInput = (fieldName: FormFieldName) => {
    const form = useCreateForm();
    const { formState, watch } = form;

    // Listen to current value
    const inputValue = watch(fieldName) || '';

    // Get error state (only show after touched)
    const error = formState.touchedFields[fieldName]
        ? (formState.errors[fieldName] as any)?.message
        : undefined;

    // Force re-render when error state changes
    const [forceUpdate, setForceUpdate] = React.useState(0);
    React.useEffect(() => {
        setForceUpdate(prev => prev + 1);
    }, [formState.errors[fieldName], formState.touchedFields[fieldName]]);

    // Handle input change
    const handleChange = useCallback((value: string) => {
        (form.setValue as any)(fieldName, value, {
            shouldValidate: false, // Do not validate on input to avoid disturbing user
            shouldDirty: true,
        });
    }, [form, fieldName]);

    // Handle blur event - mark as touched and trigger validation
    const handleBlur = useCallback(() => {
        // Directly mark as touched and trigger validation
        (form.setValue as any)(fieldName, inputValue, {
            shouldTouch: true,
            shouldValidate: true,
        });
    }, [form, fieldName, inputValue]);

    return {
        inputValue,
        error,
        handleChange,
        handleBlur,
        // Provide character count info
        charCount: inputValue.length,
    };
};

/**
 * Form Input Hook with Length Limit
 * Used for fields needing character count display
 */
export const useFormInputWithLimit = (fieldName: FormFieldName, maxLength?: number) => {
    const baseHook = useFormInput(fieldName);

    // Input handling with length limit
    const handleChangeWithLimit = useCallback((value: string) => {
        // If there is max length limit, restrict input
        if (maxLength && value.length > maxLength) {
            return; // Do not update value
        }
        baseHook.handleChange(value);
    }, [baseHook, maxLength]);

    return {
        ...baseHook,
        handleChange: handleChangeWithLimit,
        maxLength,
    };
};

/**
 * Form Input Hook with Real-time Validation
 * Used for fields needing real-time feedback (e.g. password strength, format check)
 */
export const useFormInputWithRealtimeValidation = (fieldName: FormFieldName) => {
    const form = useCreateForm();
    const { formState, watch } = form;

    // Listen to current value
    const inputValue = watch(fieldName) || '';

    // Get error state (real-time display)
    const error = formState.errors[fieldName]?.message;

    // Handle input change (real-time validation)
    const handleChange = useCallback((value: string) => {
        (form.setValue as any)(fieldName, value, {
            shouldValidate: true, // Real-time validation
            shouldDirty: true,
        });
    }, [form, fieldName]);

    // Handle blur event
    const handleBlur = useCallback(() => {
        (form.setValue as any)(fieldName, inputValue, {
            shouldTouch: true,
            shouldValidate: true,
        });
    }, [form, fieldName, inputValue]);

    return {
        inputValue,
        error,
        handleChange,
        handleBlur,
        charCount: inputValue.length,
    };
};
