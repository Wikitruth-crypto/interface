import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
// import { BoxBaseDataType, BoxDetailDataType} from '@/dapp/types/contractDate';
import { AccountRoleType } from '@/dapp/types/account';

interface RecordTimestampType {
    [id: string]: number;
}

export interface BoxDetailStateType {
    loadedItem: string[];
    loadedTimestamp: RecordTimestampType;
}

export interface DappStateType {
    account: string;
    role: AccountRoleType;
    boxDetailState: BoxDetailStateType;

}

// 定义更新状态的类型
interface UpdateType {
    updateAccount: (account: string) => void;
    updateRole: (role: 'admin' | 'user' | null) => void;

    updateBoxDetailState_loadedItem: (id: string) => void; 

    
    
}

const initialState: DappStateType = {
    account: '',
    role: null,
    boxDetailState: {
        loadedItem: [],
        loadedTimestamp: {},
    },
}

type DappStoreType = DappStateType & UpdateType ;


export const useDappStore = create<DappStoreType>()(
    devtools(
        (set) => ({
            ...initialState,

            // 方法
            updateAccount: (account: string) => set({ account }),
            updateRole: (role: AccountRoleType) => set({ role }),

            updateBoxDetailState_loadedItem: (id: string) => set((state) => ({
                boxDetailState: { 
                    ...state.boxDetailState, 
                    loadedItem: [...state.boxDetailState.loadedItem, id].sort(),
                    loadedTimestamp: {
                        ...state.boxDetailState.loadedTimestamp,
                        [id]: Date.now()
                    }
                }
            })),



            // scrollState
            // updateScrollState: (key, value) =>
            //     set((state) => ({
            //         scrollState: { ...state.scrollState, [key]: value }
            //     }), false, 'updateScrollState'),
        })
    )
);

