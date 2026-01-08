import { useCreateForm } from '../context/CreateFormContext';

/**
 * Data Validation Hook (Refactored)
 * Uses React Hook Form for validation
 * 
 * Key Improvements:
 * - Remove manual field checks
 * - Use RHF's trigger() method to trigger all field validations
 * - Remove someInputIsEmpty state
 */
export const useCheckData = () => {
  const form = useCreateForm();
  const { trigger, formState } = form;
  
  const checkData = async (): Promise<boolean> => {
    // Trigger all field validations
    const isValid = await trigger();
    
    if (!isValid) {
      console.error('Form validation failed:', formState.errors);
      // Can show a notification here to tell user which fields are required
      return false;
    }
    
    return true;
  };

  return { checkData };
}; 