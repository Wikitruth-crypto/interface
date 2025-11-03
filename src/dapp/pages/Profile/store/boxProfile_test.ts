import { getSupportedTokens } from '@/dapp/contractsConfig/tokens';
import { SupportedChainId } from '@/dapp/contractsConfig/types';
// import {BoxData} from '@/dapp/pages/Profile/types/profile.types';
// import { BoxProfileDataQuery } from '@/dapp/theGraphQuery/boxProfile';
import { parseEther } from 'ethers';
import { Address_Minter, Address_Buyer, Address_Buyer2, Address_Completer } from '@/dapp/constants/addressRoles';

// 获取测试网支持的代币列表（纯函数调用，不是 Hook）
const SUPPORTED_TOKENS = getSupportedTokens(SupportedChainId.SAPPHIRE_TESTNET);

// 给boxTest 定义类型
export interface BoxTestType {
    id: string;
    tokenId: string;
    isInBlacklist: boolean;
    buyer: string;
    // seller: string;
    // minter: string;
    // completer: string;
    // publisher: string;
    status: string;
    listedMode: string;
    acceptedToken: string;
    refundPermit: boolean;
    userOrders: {
        id: string;
        user: string;
        amount: string;
    }[];
    userRewards: {
        id: string;
        user: string;
        officeToken: string;
        acceptedToken: string;
    }[];
    publicRewardAmount: string;
};

export const boxTest_1: BoxTestType = {
    id: '1',
    tokenId: '1',
    isInBlacklist: false,
    status: 'Published',
    buyer: Address_Buyer,
    listedMode: 'Selling',
    acceptedToken: SUPPORTED_TOKENS[0].address,
    refundPermit: true,
    userOrders: [{
        id: '1',
        user: Address_Buyer,
        amount: '1800000',
    },
    ],
    userRewards: [{
        id: '1',
        user: Address_Minter,
        officeToken: '1150000',
        acceptedToken: '',
    },
    {
        id: '2',
        user: Address_Completer,
        officeToken: '1200000',
        acceptedToken: '',
    },
    ],
    publicRewardAmount: '1500000',
}

export const boxTest_2: BoxTestType = {
    id: '2',
    tokenId: '2',
    isInBlacklist: false,
    status: 'Completed',
    buyer: Address_Buyer,
    listedMode: 'Auctioning',
    acceptedToken: SUPPORTED_TOKENS[0].address,
    refundPermit: false,
    userOrders: [
        {
        id: '1',
        user: Address_Buyer,
        amount: '',
    },
    {
        id: '2',
        user: Address_Buyer2,
        amount: '2800000',
    },
    ],
    userRewards: [{
        id: '1',
        user: Address_Minter,
        officeToken: '220000',
        acceptedToken: '',
    },
    {
        id: '2',
        user: Address_Completer,
        officeToken: '250000',
        acceptedToken: '',
    },
    ],
    publicRewardAmount: '234000',
}

export const boxTest_3: BoxTestType = {
    id: '3',
    tokenId: '3',
    isInBlacklist: false,
    status: 'Completed',
    buyer: Address_Buyer,
    listedMode: 'Auctioning',
    acceptedToken: SUPPORTED_TOKENS[1].address,
    refundPermit: true,
    userOrders: [
        {
        id: '1',
        user: Address_Buyer,
        amount: `${parseEther('3.3851')}`,
    },
    {
        id: '2',
        user: Address_Buyer2,
        amount: `${parseEther('3.38')}`,
    },
    ],
    userRewards: [{
        id: '1',
        user: Address_Minter,
        officeToken: '3200000',
        acceptedToken: `${parseEther('3.88')}`,
    },
    {
        id: '2',
        user: Address_Completer,
        officeToken: '310000',
        acceptedToken: '',
    },
    ],
    publicRewardAmount: '351000',
}

export const boxTest_4: BoxTestType = {
    id: '4',
    tokenId: '4',
    isInBlacklist: false,
    status: 'Completed',
    buyer: Address_Buyer,
    listedMode: 'Selling',
    acceptedToken: SUPPORTED_TOKENS[1].address,
    refundPermit: false,
    userOrders: [{
        id: '1',
        user: Address_Buyer,
        amount: '',
    },
    ],
    userRewards: [{
        id: '1',
        user: Address_Minter,
        officeToken: '420000',
        acceptedToken: `${parseEther('4.4858')}`,
    },
    {
        id: '2',
        user: Address_Completer,
        officeToken: '410000',
        acceptedToken: '',
    },
    ],
    publicRewardAmount: '450000',
}


export const boxTest_5: BoxTestType = {
    id: '5',
    tokenId: '5',
    isInBlacklist: false,
    status: 'Completed',
    buyer: Address_Buyer,
    listedMode: 'Selling',
    acceptedToken: SUPPORTED_TOKENS[1].address,
    refundPermit: false,
    userOrders: [{
        id: '1',
        user: Address_Buyer,
        amount: '',
    },
    ],
    userRewards: [{
        id: '1',
        user: Address_Minter,
        officeToken: '',
        acceptedToken: '',
    },
    {
        id: '2',
        user: Address_Completer,
        officeToken: '570000',
        acceptedToken: '',
    },
    ],
    publicRewardAmount: '',
}

