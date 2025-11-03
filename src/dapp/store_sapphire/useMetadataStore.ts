import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { MetadataBoxType } from "@/dapp/types/contracts/metadataBox";

// 元数据状态类型 - 使用Record按tokenId进行索引
interface MetadataStateType {
    // 使用tokenId作为键存储Box元数据
    boxesMetadata: Record<string, MetadataBoxType>;
    // 记录错误的tokenId
    errorListMetadata: string[];
}

// 定义更新状态的类型
interface MetadataActions {
    // 获取Box的所有元数据
    getBoxMetadata: (tokenId: string) => MetadataBoxType | undefined;
    // 设置Box完整元数据
    setMetadataBox: (tokenId: string, data: MetadataBoxType) => void;
    // 更新Box部分元数据
    updateBoxMetadata: (tokenId: string, data: Partial<MetadataBoxType>) => void;
    // 将tokenId添加至错误列表
    addErrorListMetadata: (tokenId: string) => void;
    // 删除Box元数据
    deleteBoxMetadata: (tokenId: string) => void;
    // 清除所有数据
    clearAllMetadata: () => void;
}

const initialState: MetadataStateType = {
    boxesMetadata: {},
    errorListMetadata: [],
};

type MetadataStoreType = MetadataStateType & MetadataActions;

export const useMetadataStore = create<MetadataStoreType>()(
    devtools(
        (set, get) => ({
            ...initialState,

            // 获取Box的所有元数据
            getBoxMetadata: (tokenId: string) => {
                return get().boxesMetadata[tokenId];
            },

            // 设置Box完整元数据
            setMetadataBox: (tokenId: string, data: MetadataBoxType) => 
                set((state) => ({
                    boxesMetadata: { 
                        ...state.boxesMetadata, 
                        [tokenId]: data 
                    }
                }), false, 'setMetadataBox'),
            
            // 更新Box部分元数据 - 用于增量更新
            updateBoxMetadata: (tokenId: string, data: Partial<MetadataBoxType>) => 
                set((state) => {
                    const existingData = state.boxesMetadata[tokenId];
                    if (!existingData) {
                        console.warn(`尝试更新不存在的Box元数据，tokenId: ${tokenId}`);
                        return state;
                    }
                    return {
                        boxesMetadata: { 
                            ...state.boxesMetadata, 
                            [tokenId]: { ...existingData, ...data } 
                        }
                    };
                }, false, 'updateBoxMetadata'),

            // 添加错误列表
            addErrorListMetadata: (tokenId: string) => 
                set((state) => {
                    if (state.errorListMetadata.includes(tokenId)) {
                        return state;
                    }
                    return { 
                        errorListMetadata: [...state.errorListMetadata, tokenId] 
                    };
                }, false, 'addErrorListMetadata'),
                
            // 删除Box元数据
            deleteBoxMetadata: (tokenId: string) => 
                set((state) => {
                    const newBoxes = { ...state.boxesMetadata };
                    delete newBoxes[tokenId];
                    return { boxesMetadata: newBoxes };
                }, false, 'deleteBoxMetadata'),
            
            // 清除所有数据
            clearAllMetadata: () => 
                set({ 
                    boxesMetadata: {}, 
                    errorListMetadata: [] 
                }, false, 'clearAllMetadata'),
        })
    )
);

