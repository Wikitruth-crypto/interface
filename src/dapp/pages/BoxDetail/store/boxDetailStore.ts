import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
// import { BoxBaseDataType, BoxDetailDataType} from '@/dapp/types/contractDate';
import { BoxRoleType } from '@/dapp/types/account';
import { 
    DeadlineCheckStateType, 
    ModalType,
} from '@BoxDetail/types/stateType';
import { FunctionNameType } from '@/dapp/types/contracts';


export interface UserStateType {
    roles: BoxRoleType[];
}


interface InitialStateType {
    userState: UserStateType;
    deadlineCheckState: DeadlineCheckStateType;
    
    currentModalOpen: ModalType | null;
    currentWorkflow: FunctionNameType | null;

    // 表示当前页面是否有某个弹窗处于打开状态
    modalStatus: {
        [key in ModalType]: 'open' | 'close';
    };
}

// 定义更新状态的类型
interface UpdateType {
    updateDeadlineCheckState: (state: Partial<DeadlineCheckStateType>) => void;
    updateUserState: (state: Partial<UserStateType>) => void;
    // updateCurrentWorkflow: (functionName: FunctionNameType | null) => void;
    updateModalStatus: (modalName: ModalType, status: 'open' | 'close') => void;
}

const initialDeadlineCheckState: DeadlineCheckStateType = {
    inRequestRefundPeriod: true,
    inReviewRefundPeriod: true,
    isOverDeadline: false,
    requestRefundDeadline: 0,
    reviewRefundDeadline: 0,
    completeOrderDeadline: 0,

}

const initialUserState: UserStateType = {
    roles: [],
}

const initialState: InitialStateType = {
    deadlineCheckState: initialDeadlineCheckState,

    userState: initialUserState,
    currentWorkflow: null,
    currentModalOpen: null,

    modalStatus: {
        SellAuction: 'close',
        ExtendDeadline: 'close',
        ViewFile: 'close',
    },
}

type BoxDetailStoreType = InitialStateType & UpdateType;


export const useBoxDetailStore = create<BoxDetailStoreType>()(
    devtools(
        (set) => ({
            ...initialState,

            updateDeadlineCheckState: (partialState) =>
                set((state) => ({
                    deadlineCheckState: { ...state.deadlineCheckState, ...partialState }
                }), false, 'updateDeadlineCheckState'),

            updateUserState: (partialState) =>
                set((state) => ({
                    userState: { ...state.userState, ...partialState }
                }), false, 'updateUserState'),

            updateModalStatus: (modalName: ModalType, status: 'open' | 'close') =>
                set((state) => ({
                    modalStatus: { ...state.modalStatus, [modalName]: status }
                }), false, 'updateModalStatus'),

        })
    )
);

