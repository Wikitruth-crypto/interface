import React, { createContext, useContext, ReactNode } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { createFormSchema, CreateFormData } from '../validation/schemas';
import { useNFTCreateStore } from '../store/useNFTCreateStore';

/**
 * Create 表单 Context
 * 确保所有组件共享同一个表单实例
 */
const CreateFormContext = createContext<UseFormReturn<CreateFormData> | null>(null);

interface CreateFormProviderProps {
    children: ReactNode;
}

/**
 * Create 表单 Provider
 * 在 Create 页面的顶层使用，为所有子组件提供统一的表单实例
 */
export const CreateFormProvider: React.FC<CreateFormProviderProps> = ({ children }) => {
    const boxInfoForm = useNFTCreateStore(state => state.boxInfoForm);
    const fileData = useNFTCreateStore(state => state.fileData);
    const updateBoxInfoForm = useNFTCreateStore(state => state.updateBoxInfoForm);
    const updateFileList = useNFTCreateStore(state => state.updateFileList);
    const updateBoxImageList = useNFTCreateStore(state => state.updateBoxImageList);

    // 初始化表单，使用 Zustand store 的值作为默认值
    const form = useForm<CreateFormData>({
        resolver: zodResolver(createFormSchema) as any, // 类型断言以避免 Zod 和 RHF 的类型冲突
        mode: 'onBlur', // 严格模式：仅在失焦时验证
        reValidateMode: 'onChange', // 失焦后，再次输入时实时验证
        defaultValues: {
            // BoxInfo 默认值
            title: boxInfoForm.title || '',
            description: boxInfoForm.description || '',
            typeOfCrime: boxInfoForm.typeOfCrime || '',
            label: boxInfoForm.label || [],
            country: boxInfoForm.country || '',
            state: boxInfoForm.state || '',
            eventDate: boxInfoForm.eventDate || '',

            // NFT 默认值
            nftOwner: boxInfoForm.nftOwner || '',
            price: boxInfoForm.price || '',
            mintMethod: boxInfoForm.mintMethod || 'create',

            // 文件默认值
            boxImageList: fileData.boxImageList || [],
            fileList: fileData.fileList || [],
        },
    });

    // 监听表单变化，同步到 Zustand store
    useEffect(() => {
        const subscription = form.watch((formData) => {
            // 同步 BoxInfo 字段
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

            // 同步 NFT 字段
            if (formData.nftOwner !== undefined) {
                updateBoxInfoForm('nftOwner', formData.nftOwner || '');
            }
            
            if (formData.price !== undefined) {
                updateBoxInfoForm('price', formData.price || '');
            }
            if (formData.mintMethod !== undefined) {
                updateBoxInfoForm('mintMethod', formData.mintMethod || 'create');
            }

            // 同步文件字段
            if (formData.boxImageList !== undefined) {
                updateBoxImageList(formData.boxImageList || []);
            }
            if (formData.fileList !== undefined) {
                updateFileList(formData.fileList || []);
            }
        });

        return () => subscription.unsubscribe();
    }, [form, updateBoxInfoForm, updateBoxImageList, updateFileList]);

    // ⚠️ 移除自动重置逻辑，避免与 watch 形成死循环
    // 如果需要重置表单，应该由外部组件显式调用 form.reset()
    // 
    // 旧代码（会导致死循环）：
    // useEffect(() => {
    //   if (!boxInfoForm.title && ...) {
    //     form.reset(); // ← 触发 watch → 更新 Zustand → 再次触发此 useEffect
    //   }
    // }, [boxInfoForm, nftForm, form]);

    return (
        <CreateFormContext.Provider value={form}>
            {children}
        </CreateFormContext.Provider>
    );
};

/**
 * 使用 Create 表单的 Hook
 * 从 Context 中获取共享的表单实例
 * 
 * ⚠️ 必须在 CreateFormProvider 内部使用
 */
export const useCreateForm = (): UseFormReturn<CreateFormData> => {
    const form = useContext(CreateFormContext);

    if (!form) {
        throw new Error('useCreateForm must be used within CreateFormProvider');
    }

    return form;
};

/**
 * 获取字段错误信息（仅在 touched 时显示）
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

