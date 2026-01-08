import React, { createContext, useContext, ReactNode } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { createFormSchema, CreateFormData } from '../validation/schemas';
import { useNFTCreateStore } from '../store/useNFTCreateStore';

/**
 * Create Form Context
 * Ensures all components share the same form instance
 */
const CreateFormContext = createContext<UseFormReturn<CreateFormData> | null>(null);

interface CreateFormProviderProps {
    children: ReactNode;
}

/**
 * Create Form Provider
 * Used at the top level of the Create page to provide a unified form instance for all child components
 */
export const CreateFormProvider: React.FC<CreateFormProviderProps> = ({ children }) => {
    const boxInfoForm = useNFTCreateStore(state => state.boxInfoForm);
    const fileData = useNFTCreateStore(state => state.fileData);
    const updateBoxInfoForm = useNFTCreateStore(state => state.updateBoxInfoForm);
    const updateFileList = useNFTCreateStore(state => state.updateFileList);
    const updateBoxImageList = useNFTCreateStore(state => state.updateBoxImageList);

    // Initialize form, use values from Zustand store as default
    const form = useForm<CreateFormData>({
        resolver: zodResolver(createFormSchema) as any, // Type assertion to avoid type conflict between Zod and RHF
        mode: 'onBlur', // Strict mode: validate only on blur
        reValidateMode: 'onChange', // Re-validate on change after blur
        defaultValues: {
            // BoxInfo Default Values
            title: boxInfoForm.title || '',
            description: boxInfoForm.description || '',
            typeOfCrime: boxInfoForm.typeOfCrime || '',
            label: boxInfoForm.label || [],
            country: boxInfoForm.country || '',
            state: boxInfoForm.state || '',
            eventDate: boxInfoForm.eventDate || '',

            // NFT Default Values
            nftOwner: boxInfoForm.nftOwner || '',
            price: boxInfoForm.price || '',
            mintMethod: boxInfoForm.mintMethod || 'create',

            // File Default Values
            boxImageList: fileData.boxImageList || [],
            fileList: fileData.fileList || [],
        },
    });

    // Listen for form changes, sync to Zustand store
    useEffect(() => {
        const subscription = form.watch((formData) => {
            // Sync BoxInfo Fields
            if (formData.title !== undefined) {
                updateBoxInfoForm('title', formData.title || '');
            }
            if (formData.description !== undefined) {
                updateBoxInfoForm('description', formData.description || '');
            }
            if (formData.typeOfCrime !== undefined) {
                updateBoxInfoForm('typeOfCrime', formData.typeOfCrime || '');
            }
            if (formData.label !== undefined) {
                updateBoxInfoForm('label', formData.label || []);
            }
            if (formData.country !== undefined) {
                updateBoxInfoForm('country', formData.country || '');
            }
            if (formData.state !== undefined) {
                updateBoxInfoForm('state', formData.state || '');
            }
            if (formData.eventDate !== undefined) {
                updateBoxInfoForm('eventDate', formData.eventDate || '');
            }

            // Sync NFT Fields
            if (formData.nftOwner !== undefined) {
                updateBoxInfoForm('nftOwner', formData.nftOwner || '');
            }
            
            if (formData.price !== undefined) {
                updateBoxInfoForm('price', formData.price || '');
            }
            if (formData.mintMethod !== undefined) {
                updateBoxInfoForm('mintMethod', formData.mintMethod || 'create');
            }

            // Sync File Fields
            if (formData.boxImageList !== undefined) {
                updateBoxImageList(formData.boxImageList || []);
            }
            if (formData.fileList !== undefined) {
                updateFileList(formData.fileList || []);
            }
        });

        return () => subscription.unsubscribe();
    }, [form, updateBoxInfoForm, updateBoxImageList, updateFileList]);

    // ⚠️ Remove auto-reset logic to avoid infinite loop with watch
    // If form reset is needed, it should be explicitly called by external component using form.reset()
    // 
    // Old code (causes infinite loop):
    // useEffect(() => {
    //   if (!boxInfoForm.title && ...) {
    //     form.reset(); // ← Triggers watch → Updates Zustand → Triggers this useEffect again
    //   }
    // }, [boxInfoForm, nftForm, form]);

    return (
        <CreateFormContext.Provider value={form}>
            {children}
        </CreateFormContext.Provider>
    );
};

/**
 * Hook to use Create Form
 * Get shared form instance from Context
 * 
 * ⚠️ Must be used within CreateFormProvider
 */
export const useCreateForm = (): UseFormReturn<CreateFormData> => {
    const form = useContext(CreateFormContext);

    if (!form) {
        throw new Error('useCreateForm must be used within CreateFormProvider');
    }

    return form;
};

/**
 * Get field error message (only show when touched)
 */
export const getFieldError = (
    fieldName: keyof CreateFormData,
    formState: UseFormReturn<CreateFormData>['formState']
): string | undefined => {
    const { errors, touchedFields } = formState;
    const touched = touchedFields[fieldName];
    const error = errors[fieldName];

    return touched && error ? String(error.message) : undefined;
};

