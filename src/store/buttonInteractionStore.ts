
import { create } from 'zustand';
import { FunctionNameType } from '@dapp/types/typesDapp/contracts';

// Record successful operations, please record in accountStore

interface ButtonInteractionState {
    // Currently executing operation
    functionWriting: FunctionNameType | null;
    // Actions
    setFunctionWriting: (action: FunctionNameType | null) => void;
    reset: () => void;
}

export const useButtonInteractionStore = create<ButtonInteractionState>((set, get) => ({
    functionWriting: null,

    setFunctionWriting: (functionName) => set({ functionWriting: functionName }),

    reset: () => set({
        functionWriting: null,
    })
}));


