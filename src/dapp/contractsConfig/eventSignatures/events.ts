import { EventName } from './types';
import { ContractName, SupportedChainId } from '../types';

/**
 * 所有事件的完整配置
 * 根据 IEvents.sol 中的注释标记 only once 事件
 */
export const ALL_EVENT_CONFIGS: Record<EventName, {
    original: string;
    signature: string;
    onlyOnce: boolean;
    contract: ContractName;
    chainId: number[];
    network: string[];
    layer: string[];
    description: string;
}> = {
    // ========== Exchange ==========
    [EventName.Box_Listed]: {
        original: 'event BoxListed(uint256 indexed boxId, uint256 indexed userId, address acceptedToken)',
        signature: 'event BoxListed(uint256,uint256,address)',
        onlyOnce: true, // only once
        contract: ContractName.EXCHANGE,
        chainId: [SupportedChainId.SAPPHIRE_TESTNET],
        network: ['testnet'],
        layer: ['sapphire'],
        description: 'The box is listed on the exchange',
    },
    [EventName.Box_Purchased]: {
        original: 'event BoxPurchased(uint256 indexed boxId, uint256 indexed userId)',
        signature: 'event BoxPurchased(uint256,uint256)',
        onlyOnce: true, // only once
        contract: ContractName.EXCHANGE,
        chainId: [SupportedChainId.SAPPHIRE_TESTNET],
        network: ['testnet'],
        layer: ['sapphire'],
        description: 'The box is purchased',
    },
    [EventName.Bid_Placed]: {
        original: 'event BidPlaced(uint256 indexed boxId, uint256 indexed userId)',
        signature: 'event BidPlaced(uint256,uint256)',
        onlyOnce: false,
        contract: ContractName.EXCHANGE,
        chainId: [SupportedChainId.SAPPHIRE_TESTNET],
        network: ['testnet'],
        layer: ['sapphire'],
        description: 'The bid is placed',
    },
    [EventName.Completer_Assigned]: {
        original: 'event CompleterAssigned(uint256 indexed boxId, uint256 indexed userId)',
        signature: 'event CompleterAssigned(uint256,uint256)',
        onlyOnce: true, // only once
        contract: ContractName.EXCHANGE,
        chainId: [SupportedChainId.SAPPHIRE_TESTNET],
        network: ['testnet'],
        layer: ['sapphire'],
        description: 'The completer is assigned',
    },
    [EventName.Request_Deadline_Changed]: {
        original: 'event RequestDeadlineChanged(uint256 indexed boxId, uint256 deadline)',
        signature: 'event RequestDeadlineChanged(uint256,uint256)',
        onlyOnce: false,
        contract: ContractName.EXCHANGE,
        chainId: [SupportedChainId.SAPPHIRE_TESTNET],
        network: ['testnet'],
        layer: ['sapphire'],
        description: 'The request deadline is changed',
    },
    [EventName.Review_Deadline_Changed]: {
        original: 'event ReviewDeadlineChanged(uint256 indexed boxId, uint256 deadline)',
        signature: 'event ReviewDeadlineChanged(uint256,uint256)',
        onlyOnce: true, // only once
        contract: ContractName.EXCHANGE,
        chainId: [SupportedChainId.SAPPHIRE_TESTNET],
        network: ['testnet'],
        layer: ['sapphire'],
        description: 'The review deadline is changed',
    },
    [EventName.Refund_Permit_Changed]: {
        original: 'event RefundPermitChanged(uint256 indexed boxId, bool permission)',
        signature: 'event RefundPermitChanged(uint256,bool)',
        onlyOnce: true, // only once
        contract: ContractName.EXCHANGE,
        chainId: [SupportedChainId.SAPPHIRE_TESTNET],
        network: ['testnet'],
        layer: ['sapphire'],
        description: 'The refund permit is changed',
    },

    // ========== FundManager ==========
    [EventName.Order_Amount_Paid]: {
        original: 'event OrderAmountPaid(uint256 indexed boxId, uint256 indexed userId, address indexed token, uint256 amount)',
        signature: 'event OrderAmountPaid(uint256,uint256,address,uint256)',
        onlyOnce: false,
        contract: ContractName.FUND_MANAGER,
        chainId: [SupportedChainId.SAPPHIRE_TESTNET],
        network: ['testnet'],
        layer: ['sapphire'],
        description: 'The order amount is deposited',
    },
    [EventName.Order_Amount_Withdraw]: {
        original: 'event OrderAmountWithdraw(uint256[] list, address indexed token, uint256 indexed userId, uint256 amount, uint8 fundsType)',
        signature: 'event OrderAmountWithdraw(uint256[],address,uint256,uint256,uint8)',
        onlyOnce: false,
        contract: ContractName.FUND_MANAGER,
        chainId: [SupportedChainId.SAPPHIRE_TESTNET],
        network: ['testnet'],
        layer: ['sapphire'],
        description: 'The order amount is withdrawn',
    },
    [EventName.Reward_Amount_Added]: {
        original: 'event RewardAmountAdded(uint256 indexed boxId, address indexed token, uint256 amount, uint8 rewardType)',
        signature: 'event RewardAmountAdded(uint256,address,uint256,uint8)',
        onlyOnce: false,
        contract: ContractName.FUND_MANAGER,
        chainId: [SupportedChainId.SAPPHIRE_TESTNET],
        network: ['testnet'],
        layer: ['sapphire'],
        description: 'The reward amount is added',
    },
    [EventName.Helper_Rewrds_Withdraw]: {
        original: 'event HelperRewrdsWithdraw(uint256 indexed userId, address indexed token, uint256 amount)',
        signature: 'event HelperRewrdsWithdraw(uint256,address,uint256)',
        onlyOnce: false,
        contract: ContractName.FUND_MANAGER,
        chainId: [SupportedChainId.SAPPHIRE_TESTNET],
        network: ['testnet'],
        layer: ['sapphire'],
        description: 'The helper rewards are withdrawn',
    },
    [EventName.Rewards_Withdraw]: {
        original: 'event RewardsWithdraw(uint256 indexed userId, address indexed token, uint256 amount)',
        signature: 'event RewardsWithdraw(uint256,address,uint256)',
        onlyOnce: false,
        contract: ContractName.FUND_MANAGER,
        chainId: [SupportedChainId.SAPPHIRE_TESTNET],
        network: ['testnet'],
        layer: ['sapphire'],
        description: 'The rewards are withdrawn',
    },

    // ========== TruthBox ==========

    [EventName.Box_Created]: {
        original: 'event BoxCreated(uint256 indexed boxId, uint256 indexed userId, string boxInfoCID)',
        signature: 'event BoxCreated(uint256,uint256,string)',
        onlyOnce: true, // only once
        contract: ContractName.TRUTH_BOX,
        chainId: [SupportedChainId.SAPPHIRE_TESTNET],
        network: ['testnet'],
        layer: ['sapphire'],
        description: 'The box is created',
    },
    [EventName.Box_Status_Changed]: {
        original: 'event BoxStatusChanged(uint256 indexed boxId, uint8 status)',
        signature: 'event BoxStatusChanged(uint256,uint8)',
        onlyOnce: false,
        contract: ContractName.TRUTH_BOX,
        chainId: [SupportedChainId.SAPPHIRE_TESTNET],
        network: ['testnet'],
        layer: ['sapphire'],
        description: 'The box status is changed',
    },
    [EventName.Price_Changed]: {
        original: 'event PriceChanged(uint256 indexed boxId, uint256 price)',
        signature: 'event PriceChanged(uint256,uint256)',
        onlyOnce: false,
        contract: ContractName.TRUTH_BOX,
        chainId: [SupportedChainId.SAPPHIRE_TESTNET],
        network: ['testnet'],
        layer: ['sapphire'],
        description: 'The price is changed',
    },
    [EventName.Deadline_Changed]: {
        original: 'event DeadlineChanged(uint256 indexed boxId, uint256 deadline)',
        signature: 'event DeadlineChanged(uint256,uint256)',
        onlyOnce: false,
        contract: ContractName.TRUTH_BOX,
        chainId: [SupportedChainId.SAPPHIRE_TESTNET],
        network: ['testnet'],
        layer: ['sapphire'],
        description: 'The deadline is changed',
    },
    [EventName.Private_Key_Published]: {
        original: 'event PrivateKeyPublished(uint256 indexed boxId, bytes privateKey, uint256 indexed userId)',
        signature: 'event PrivateKeyPublished(uint256,bytes,uint256)',
        onlyOnce: true, // only once
        contract: ContractName.TRUTH_BOX,
        chainId: [SupportedChainId.SAPPHIRE_TESTNET],
        network: ['testnet'],
        layer: ['sapphire'],
        description: 'The private key is published',
    },

    // ========== UserId ==========
    [EventName.Blacklist]: {
        original: 'event Blacklist(address user, bool status)',
        signature: 'event Blacklist(address,bool)',
        onlyOnce: true, // only once
        contract: ContractName.USER_ID,
        chainId: [SupportedChainId.SAPPHIRE_TESTNET],
        network: ['testnet'],
        layer: ['sapphire'],
        description: 'The blacklist status is changed',
    },

    // ========== TruthNFT ==========
    [EventName.Transfer]: {
        original: 'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
        signature: 'event Transfer(address,address,uint256)',
        onlyOnce: false,
        contract: ContractName.TRUTH_NFT,
        chainId: [SupportedChainId.SAPPHIRE_TESTNET],
        network: ['testnet'],
        layer: ['sapphire'],
        description: 'The NFT is transferred',
    },
};

