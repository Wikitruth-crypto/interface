
import { create } from 'zustand';
import { FunctionNameType } from '@/dapp/types/contracts';

// TODO 记录成功的操作，请在accountStore中记录

interface ButtonInteractionState {
    // 当前正在执行的操作
    currentActionFunction: FunctionNameType | null;
    // 当前操作是否在pending状态
    isPending: boolean;
    
    // Actions
    setCurrentActionFunction: (action: FunctionNameType | null) => void;
    setPending: (isPending: boolean) => void;
    reset: () => void;
}

export const useButtonInteractionStore = create<ButtonInteractionState>((set, get) => ({
    currentActionFunction: null,
    isPending: false,

    setCurrentActionFunction: (action) => set({ currentActionFunction: action }),
    setPending: (isPending) => set({ isPending }),

    reset: () => set({
        currentActionFunction: null,
        isPending: false
    })
}));


