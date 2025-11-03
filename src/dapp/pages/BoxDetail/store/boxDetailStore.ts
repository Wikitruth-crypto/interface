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

export interface KeyStateType {
    publicKey: string;
    privateKey: string;
}

// 记录当前address的隐私数据，
// 比如当用于切换address后，则需要验证切换后的地址是否有权限访问该数据。
// 否则，用户切换地址后，则无法访问该Box的隐私数据。
// 比如：当Box处于InSecrecy状态时，表示只有Buyer才能通过getPrivateData函数获取隐私数据, 并会被存储在SecretStateType中。
// 因此，当用户切换address后，则表示不再是Buyer,即无法访问该address的隐私数据。
export interface SecretStateType {
    privateKey: string;
}


interface InitialStateType {
    tokenId: string;
    deadlineCheckState: DeadlineCheckStateType;
    // 记录当前Box的密钥对
    keyState: KeyStateType;
    // 记录用户在当前的Box中的角色信息
    userState: UserStateType;
    currentModalOpen: ModalType | null;
    currentWorkflow: FunctionNameType | null;

    // 表示当前页面是否有某个弹窗处于打开状态
    modalStatus: {
        [key in ModalType]: 'open' | 'close';
    };
    // 记录用户在当前的Box中的隐私数据
    userSecretState: {
        [key in string]: SecretStateType;
    }
}

// 定义更新状态的类型
interface UpdateType {
    updateTokenId: (state: string) => void;
    updateDeadlineCheckState: (state: Partial<DeadlineCheckStateType>) => void;
    updateKeyState: (state: Partial<KeyStateType>) => void;
    updateUserState: (state: Partial<UserStateType>) => void;
    updateCurrentWorkflow: (functionName: FunctionNameType | null) => void;
    updateModalStatus: (modalName: ModalType, status: 'open' | 'close') => void;
    updateUserSecretState: (userAddress: string, state: Partial<SecretStateType>) => void;
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

const initialKeyState: KeyStateType = {
    publicKey: '',
    privateKey: '',
}


const initialState: InitialStateType = {
    tokenId: '',
    deadlineCheckState: initialDeadlineCheckState,
    keyState: initialKeyState,

    userState: initialUserState,
    currentWorkflow: null,
    currentModalOpen: null,

    modalStatus: {
        SellAuction: 'close',
        ExtendDeadline: 'close',
        ViewFile: 'close',
    },
    userSecretState: {},
}

type BoxDetailStoreType = InitialStateType & UpdateType;


export const useBoxDetailStore = create<BoxDetailStoreType>()(
    devtools(
        (set) => ({
            ...initialState,

            updateTokenId: (state: string) => set({ tokenId: state }),


            updateDeadlineCheckState: (partialState) =>
                set((state) => ({
                    deadlineCheckState: { ...state.deadlineCheckState, ...partialState }
                }), false, 'updateDeadlineCheckState'),



            updateKeyState: (partialState) =>
                set((state) => ({
                    keyState: { ...state.keyState, ...partialState }
                }), false, 'updateKeyState'),


            updateUserState: (partialState) =>
                set((state) => ({
                    userState: { ...state.userState, ...partialState }
                }), false, 'updateUserState'),

            updateCurrentWorkflow: (functionName: FunctionNameType | null) =>
                set(() => ({
                    currentWorkflow: functionName
                }), false, 'updateCurrentWorkflow'),


            updateModalStatus: (modalName: ModalType, status: 'open' | 'close') =>
                set((state) => ({
                    modalStatus: { ...state.modalStatus, [modalName]: status }
                }), false, 'updateModalStatus'),

            updateUserSecretState: (userAddress: string, state: Partial<SecretStateType>) =>
                set((state) => ({
                    userSecretState: { ...state.userSecretState, [userAddress]: { ...state.userSecretState[userAddress], ...state } }
                }), false, 'updateUserSecretState'),
        })
    )
);

