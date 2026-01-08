import { useCallback, useState, useEffect } from 'react';
import { useCreateForm } from '../../context/CreateFormContext';
import { FormFieldName } from '../../types/stateType';

/**
 * Direct Validation Form Input Hook
 * Use local state for validation to avoid React Hook Form delays
 */
export const useFormInputDirect = (fieldName: FormFieldName) => {
  const form = useCreateForm();
  const { watch } = form;
  
  // Listen to current value
  const inputValue = watch(fieldName) || '';
  
  // Local state management
  const [isTouched, setIsTouched] = useState(false);
  const [localError, setLocalError] = useState<string | undefined>(undefined);
  
  // Handle input change
  const handleChange = useCallback((value: string) => {
    form.setValue(fieldName, value as any, {
      shouldValidate: false,
      shouldDirty: true,
    });
    
    // If already touched, validate immediately
    if (isTouched) {
      validateField(value);
    }
  }, [form, fieldName, isTouched]);
  
  // Handle blur event
  const handleBlur = useCallback(() => {
    setIsTouched(true);
    const stringValue = Array.isArray(inputValue) ? inputValue.join(',') : inputValue;
    validateField(stringValue);
  }, [inputValue]);
  
  // Validate field
  const validateField = useCallback((value: string) => {
    // Get field validation rules
    const fieldSchema = form.getFieldState(fieldName);
    
    // Simple validation logic
    let error: string | undefined = undefined;
    
    if (fieldName === 'title') {
      if (!value || value.trim().length === 0) {
        error = 'Title is required';
      } else if (value.length < 40) {
        error = 'Title must be at least 40 characters';
      } else if (value.length > 150) {
        error = 'Title must be no more than 150 characters';
      }
    } else if (fieldName === 'description') {
      if (!value || value.trim().length === 0) {
        error = 'Description is required';
      } else if (value.length < 100) {
        error = 'Description must be at least 100 characters';
      } else if (value.length > 1000) {
        error = 'Description must be no more than 1000 characters';
      }
    } else if (fieldName === 'typeOfCrime') {
      if (!value || value.trim().length === 0) {
        error = 'Type of crime is required';
      } else if (value.length > 20) {
        error = 'Type of crime must be no more than 20 characters';
      }
    }
    
    setLocalError(error);
    
    // Update form state simultaneously
    if (error) {
      form.setError(fieldName, { type: 'manual', message: error });
    } else {
      form.clearErrors(fieldName);
    }
  }, [form, fieldName]);
  
  // Re-validate when value changes (if touched)
  useEffect(() => {
    if (isTouched) {
      const stringValue = Array.isArray(inputValue) ? inputValue.join(',') : inputValue;
      validateField(stringValue);
    }
  }, [inputValue, isTouched, validateField]);
  
  return {
    inputValue,
    error: localError,
    handleChange,
    handleBlur,
    charCount: inputValue.length,
  };
};

/**
 * Direct Validation Hook with Length Limit
 */
export const useFormInputDirectWithLimit = (fieldName: FormFieldName, maxLength?: number) => {
  const baseHook = useFormInputDirect(fieldName);
  
  // Input handling with length limit
  const handleChangeWithLimit = useCallback((value: string) => {
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
