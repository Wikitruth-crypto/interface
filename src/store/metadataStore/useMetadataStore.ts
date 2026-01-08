import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { MetadataBoxType } from "@dapp/types/typesDapp/metadata/metadataBox";

// Metadata state type - Index by tokenId using Record
interface MetadataStateType {
    // Store Box metadata using tokenId as key
    boxesMetadata: Record<string, MetadataBoxType>;
    // Record error tokenIds
    errorListMetadata: string[];
}

// Define state update types
interface MetadataActions {
    // Get all metadata of a Box
    getBoxMetadata: (tokenId: string) => MetadataBoxType | undefined;
    // Set complete Box metadata
    setMetadataBox: (tokenId: string, data: MetadataBoxType) => void;
    // Update partial Box metadata
    updateBoxMetadata: (tokenId: string, data: Partial<MetadataBoxType>) => void;
    // Add tokenId to error list
    addErrorListMetadata: (tokenId: string) => void;
    // Delete Box metadata
    deleteBoxMetadata: (tokenId: string) => void;
    // Clear all data
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

            // Get all metadata of a Box
            getBoxMetadata: (tokenId: string) => {
                return get().boxesMetadata[tokenId];
            },

            // Set complete Box metadata
            setMetadataBox: (tokenId: string, data: MetadataBoxType) => 
                set((state) => ({
                    boxesMetadata: { 
                        ...state.boxesMetadata, 
                        [tokenId]: data 
                    }
                }), false, 'setMetadataBox'),
            
            // Update partial Box metadata - Used for incremental updates
            updateBoxMetadata: (tokenId: string, data: Partial<MetadataBoxType>) => 
                set((state) => {
                    const existingData = state.boxesMetadata[tokenId];
                    if (!existingData) {
                        console.warn(`Box metadata not found, tokenId: ${tokenId}`);
                        return state;
                    }
                    return {
                        boxesMetadata: { 
                            ...state.boxesMetadata, 
                            [tokenId]: { ...existingData, ...data } 
                        }
                    };
                }, false, 'updateBoxMetadata'),

            // Add error list
            addErrorListMetadata: (tokenId: string) => 
                set((state) => {
                    if (state.errorListMetadata.includes(tokenId)) {
                        return state;
                    }
                    return { 
                        errorListMetadata: [...state.errorListMetadata, tokenId] 
                    };
                }, false, 'addErrorListMetadata'),
                
            // Delete Box metadata
            deleteBoxMetadata: (tokenId: string) => 
                set((state) => {
                    const newBoxes = { ...state.boxesMetadata };
                    delete newBoxes[tokenId];
                    return { boxesMetadata: newBoxes };
                }, false, 'deleteBoxMetadata'),
            
            // Clear all data
            clearAllMetadata: () => 
                set({ 
                    boxesMetadata: {}, 
                    errorListMetadata: [] 
                }, false, 'clearAllMetadata'),
        })
    )
);

