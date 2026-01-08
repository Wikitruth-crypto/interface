import { useCallback } from 'react';
import { useCreateForm } from '../../context/CreateFormContext';

/**
 * Label Input Hook (Refactored)
 * Uses React Hook Form to manage validation and error state
 * 
 * Key Improvements:
 * - Integrate RHF for array validation
 * - Support min/max label count validation
 */
export const useLabelInput = () => {
  const form = useCreateForm();
  const { formState, watch } = form;
  
  // Listen to current value
  const labels = watch('label') || [];
  
  // Get error state (only show after touched)
  const isTouched = formState.touchedFields.label as boolean | undefined;
  const error = isTouched
    ? formState.errors.label?.message 
    : undefined;

  // Update label array
  const handleLabelsChange = useCallback((newLabels: string[]) => {
    form.setValue('label', newLabels, {
      shouldValidate: Boolean(isTouched), // If touched, validate in real-time
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [form, isTouched]);

  return {
    labels,
    handleLabelsChange,
    error,
  };
}; 