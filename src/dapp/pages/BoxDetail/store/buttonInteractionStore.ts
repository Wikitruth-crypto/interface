
import { create } from 'zustand';
import { FunctionNameType } from '@/dapp/types/contracts';

// TODO 记录成功的操作，请在accountStore中记录

interface ButtonInteractionState {
    // 当前正在执行的操作
    currentAction: FunctionNameType | null;
    // 当前操作是否在pending状态
    isPending: boolean;
    
    // Actions
    setCurrentAction: (action: FunctionNameType | null) => void;
    setPending: (isPending: boolean) => void;
    reset: () => void;
}

export const useButtonInteractionStore = create<ButtonInteractionState>((set, get) => ({
    currentAction: null,
    isPending: false,

    setCurrentAction: (action) => set({ currentAction: action }),
    setPending: (isPending) => set({ isPending }),

    reset: () => set({
        currentAction: null,
        isPending: false
    })
}));