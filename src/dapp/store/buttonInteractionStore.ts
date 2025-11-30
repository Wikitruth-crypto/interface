
import { create } from 'zustand';
import { FunctionNameType } from '@/dapp/types/contracts';

// TODO 记录成功的操作，请在accountStore中记录

interface ButtonInteractionState {
    // 当前正在执行的操作
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


