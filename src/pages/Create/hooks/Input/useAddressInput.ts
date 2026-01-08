import { useCallback } from 'react';
import { useCreateForm } from '../../context/CreateFormContext';
import { ethers } from 'ethers';

/**
 * NFT Owner Address Input Hook (Refactored)
 * Uses React Hook Form to manage validation and error state
 * 
 * Key Improvements:
 * - Remove validation logic (handled by Zod schema)
 * - Remove debounce (RHF onBlur mode is optimized enough)
 * - Retain address formatting functionality
 */
export const useAddressInput = () => {
    const form = useCreateForm();
    const { register, formState, watch } = form;

    // Listen to current value
    const inputValue = watch('nftOwner') || '';

    // Get error state (only show after touched)
    const error = formState.touchedFields.nftOwner
        ? formState.errors.nftOwner?.message
        : undefined;

  // Handle input change
  const handleTypeChange = useCallback((value: string) => {
    // Automatically convert to lowercase and remove spaces
    const formattedValue = value.trim();
    
    form.setValue('nftOwner', formattedValue, {
      shouldValidate: formState.touchedFields.nftOwner, // If touched, validate in real-time
      shouldDirty: true,
    });
  }, [form, formState.touchedFields.nftOwner]);

  // Handle blur event - mark as touched and trigger validation
  const handleBlur = useCallback(() => {
    form.setValue('nftOwner', inputValue, {
      shouldTouch: true,    // ✅ Mark as touched
      shouldValidate: true, // ✅ Trigger validation
    });
  }, [form, inputValue]);

  const isValidEthereumAddress = (address: string): boolean => {
    // return /^0x[a-fA-F0-9]{40}$/.test(address);
    return ethers.isAddress(address);
  };

  return {
    inputValue,
    handleTypeChange,
    handleBlur,
    error,
    isValidFormat: isValidEthereumAddress(inputValue), // Used for UI hint
  };
};
