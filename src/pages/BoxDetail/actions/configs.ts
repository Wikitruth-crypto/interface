import type { BoxActionConfig } from './types';
import type { ContractConfigs } from '@dapp/config/contractsConfig';

const exchangeContract = (configs: ContractConfigs) => configs.Exchange;
const truthBoxContract = (configs: ContractConfigs) => configs.TruthBox;

export const boxActionConfigs: Record<string, BoxActionConfig> = {
  buy: {
    id: 'buy',
    label: 'Buy',
    description: 'Buy this box.',
    // This operation is executed in ModalBuyBidPay, not executed here write
    activeKey: 'buyActive',
    requiresCustomArgs: true, // Marked as needing custom parameters, to avoid useBoxActionController checking default write
  },
  bid: {
    id: 'bid',
    label: 'Bid',
    description: 'Bid for this box.',
    // This operation is executed in ModalBuyBidPay, not executed here write
    activeKey: 'bidActive',
    requiresCustomArgs: true, // Marked as needing custom parameters, to avoid useBoxActionController checking default write
  },
  payConfiFee: {
    id: 'payConfiFee',
    label: 'PayConfiFee',
    // description: 'Pay the confidentiality fee and extend the confidentiality period.',
    // This operation is executed in ModalBuyBidPay, not executed here write
    activeKey: 'payConfiFeeActive',
    requiresCustomArgs: true, // Marked as needing custom parameters, to avoid useBoxActionController checking default write
  },
  requestRefund: {
    id: 'requestRefund',
    label: 'Refund',
    description: 'Request refund before the deadline.',
    contract: exchangeContract,
    functionName: 'requestRefund',
    getArgs: ({ boxId }) => [boxId],
    activeKey: 'requestRefundActive',
  },
  cancelRefund: {
    id: 'cancelRefund',
    label: 'Cancel',
    description: 'Cancel refund, the transaction will be completed.',
    contract: exchangeContract,
    functionName: 'cancelRefund',
    getArgs: ({ boxId }) => [boxId],
    activeKey: 'cancelRefundActive',
  },
  agreeRefund: {
    id: 'agreeRefund',
    label: 'Agree',
    description: 'Agree refund, funds will be returned to the buyer.',
    contract: exchangeContract,
    functionName: 'agreeRefund',
    getArgs: ({ boxId }) => [boxId],
    activeKey: 'agreeRefundActive',
  },
  refuseRefund: {
    id: 'refuseRefund',
    label: 'Refuse',
    description: 'Refuse refund, the transaction will be completed.',
    contract: exchangeContract,
    functionName: 'refuseRefund',
    getArgs: ({ boxId }) => [boxId],
    activeKey: 'refuseRefundActive',
  },
  completeOrder: {
    id: 'completeOrder',
    label: 'Complete',
    description: 'Complete the order: Paid → InSecrecy.',
    contract: exchangeContract,
    functionName: 'completeOrder',
    getArgs: ({ boxId }) => [boxId],
    activeKey: 'completeActive',
  },
  publish: {
    id: 'publish',
    label: 'Publish',
    description: 'Publish the box.',
    contract: truthBoxContract,
    functionName: 'publishByMinter',
    getArgs: ({ boxId }) => [boxId],
    activeKey: 'publishActive',
    buildWrite: (ctx, configs) => {
      const { box, boxId, roles } = ctx;
      if (!box) return null;

      if (box.status === 'Storing' && roles.includes('Minter')) {
        return {
          contract: configs.TruthBox,
          functionName: 'publishByMinter',
          args: [boxId],
        };
      }

      if (box.status === 'InSecrecy' && roles.includes('Buyer')) {
        return {
          contract: configs.TruthBox,
          functionName: 'publishByBuyer',
          args: [boxId],
        };
      }

      return null;
    },
  },
  sell: {
    id: 'sell',
    label: 'Sell',
    // This operation is executed in ModalSellAuction, the button only负责打开弹窗，弹窗中通过 buildWrite 执行 write
    activeKey: 'sellActive',
    requiresCustomArgs: true, // Marked as needing custom parameters, to avoid useBoxActionController checking default write
    pendingFunctions: ['sell'], // Used to detect whether the sell operation is in progress
    buildWrite: (ctx, configs, customArgs) => {
      if (!customArgs) return null;
      const { acceptedToken, price } = customArgs as { acceptedToken: `0x${string}`; price: bigint };
      return {
        contract: configs.Exchange,
        functionName: 'sell',
        args: [ctx.boxId, acceptedToken, price],
      };
    },
  },
  auction: {
    id: 'auction',
    label: 'Auction',
    // This operation is executed in ModalSellAuction, the button only负责打开弹窗，弹窗中通过 buildWrite 执行 write
    activeKey: 'auctionActive',
    requiresCustomArgs: true, // Marked as needing custom parameters, to avoid useBoxActionController checking default write
    pendingFunctions: ['auction'], // Used to detect whether the auction operation is in progress
    buildWrite: (ctx, configs, customArgs) => {
      if (!customArgs) return null;
      const { acceptedToken, price } = customArgs as { acceptedToken: `0x${string}`; price: bigint };
      return {
        contract: configs.Exchange,
        functionName: 'auction',
        args: [ctx.boxId, acceptedToken, price],
      };
    },
  },
  extendDeadline: {
    id: 'extendDeadline',
    label: 'Extend Deadline',
    description: 'Extend the deadline of the box.',
    // This operation is executed in ModalExtend, not executed here write
    activeKey: 'extendActive',
    requiresCustomArgs: true, // Marked as needing custom parameters, to avoid useBoxActionController checking default write
  },
  viewFile: {
    id: 'viewFile',
    label: 'View File',
    description: 'View the confidential file.',
    // This operation is executed in ModalViewFile, not executed here write
    activeKey: 'viewFileActive',
    requiresCustomArgs: true, // Marked as needing custom parameters, to avoid useBoxActionController checking default write
  },
};

export type BoxActionKey = keyof typeof boxActionConfigs;
