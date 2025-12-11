import type { BoxActionConfig } from './types';
import type { ContractConfigs } from '@/dapp/contractsConfig/types';

const exchangeContract = (configs: ContractConfigs) => configs.Exchange;
const truthBoxContract = (configs: ContractConfigs) => configs.TruthBox;

export const boxActionConfigs: Record<string, BoxActionConfig> = {
  buy: {
    id: 'buy',
    label: 'Buy',
    description: 'Buy this box.',
    contract: exchangeContract,
    functionName: 'buy',
    getArgs: ({ boxId }) => [boxId],
    needAllowance: true,
    shouldCheckAllowance: ({ roles }) => !roles.includes('Admin') && !roles.includes('Minter') && !roles.includes('Buyer'),
    getAllowanceParams: ({ box }) => {
      if (!box?.acceptedToken) return null;
      return {
        token: box.acceptedToken as `0x${string}`,
        amount: box.price || 0,
      };
    },
    activeKey: 'buyActive',
  },
  bid: {
    id: 'bid',
    label: 'Bid',
    description: 'Bid for this box.',
    contract: exchangeContract,
    functionName: 'bid',
    getArgs: ({ boxId }) => [boxId],
    needAllowance: true,
    shouldCheckAllowance: ({ roles }) => !roles.includes('Admin') && !roles.includes('Minter') && !roles.includes('Buyer'),
    getAllowanceParams: ({ box }) => {
      if (!box?.acceptedToken) return null;
      return {
        token: box.acceptedToken as `0x${string}`,
        amount: box.price || 0,
      };
    },
    activeKey: 'bidActive',
  },
  payConfiFee: {
    id: 'payConfiFee',
    label: 'PayConfiFee',
    description: 'Pay the confidentiality fee and extend the confidentiality period.',
    contract: truthBoxContract,
    functionName: 'payConfiFee',
    getArgs: ({ boxId }) => [boxId],
    needAllowance: true,
    shouldCheckAllowance: ({ roles }) => !roles.includes('Admin') && !roles.includes('Minter'),
    getAllowanceParams: ({ box }, configs) => {
      return {
        token: configs.OfficialToken.address,
        amount: box?.price || 0,
      };
    },
    activeKey: 'payConfiFeeActive',
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
    // description: 'Complete the order.',
    contract: exchangeContract,
    functionName: 'completeOrder',
    getArgs: ({ boxId }) => [boxId],
    activeKey: 'completeActive',
  },
  publish: {
    id: 'publish',
    label: 'Publish',
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
    contract: exchangeContract,
    functionName: 'sell',
    getArgs: () => [],
    activeKey: 'sellActive',
    requiresCustomArgs: true,
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
    contract: exchangeContract,
    functionName: 'auction',
    getArgs: () => [],
    activeKey: 'auctionActive',
    requiresCustomArgs: true,
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
    contract: truthBoxContract,
    functionName: 'extendDeadline',
    getArgs: () => [],
    activeKey: 'extendActive',
    requiresCustomArgs: true,
    buildWrite: (ctx, configs, customArgs) => {
      if (!customArgs) return null;
      const { seconds } = customArgs as { seconds: number };
      return {
        contract: configs.TruthBox,
        functionName: 'extendDeadline',
        args: [ctx.boxId, seconds],
      };
    },
  },
};

export type BoxActionKey = keyof typeof boxActionConfigs;
