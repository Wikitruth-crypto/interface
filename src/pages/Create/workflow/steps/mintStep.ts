import { WorkflowStep, WorkflowPayload } from '../core/types';
import { MintOutput } from '../../types/stepType';
import { parseUnits } from 'viem';

export interface MintStepDependencies {
  writeCustorm: (params: any) => Promise<string>;
  contractConfig: any;
  decimals?: number ;
}

export function createMintStep(deps: MintStepDependencies): WorkflowStep<WorkflowPayload, MintOutput> {
  const { writeCustorm, contractConfig, decimals } = deps;

  return {
    name: 'mint',
    description: 'Mint Truth Box and NFT',

    validate: (input) => {
      const outputs = input.allStepOutputs;
      if (!outputs.metadataBoxCid) {
        console.error('Mint: metadataBoxCid is missing');
        return false;
      }
      if (!outputs.metadataNFTCid) {
        console.error('Mint: metadataNFTCid is missing');
        return false;
      }
      if (!input.boxInfo.nftOwner) {
        console.error('Mint: nftOwner is missing');
        return false;
      }
      if (input.boxInfo.mintMethod === 'create') {
        if (!input.boxInfo.price) {
          console.error('Mint: price is missing');
          return false;
        }
        if (!outputs.keyPair?.privateKey_minter) {
          console.error('Mint: key pair is missing');
          return false;
        }
      }
      return true;
    },

    execute: async (input, context) => {
      context.throwIfCancelled();
      context.updateStore(stores => {
        stores.workflow.setCurrentStep('mint');
      });

      const outputs = input.allStepOutputs;
      const { nftOwner, price, mintMethod } = input.boxInfo;

      try {
        let functionName: string;
        let args: any[];

        if (mintMethod === 'create') {
          if (!price || typeof price !== 'string') {
            throw new Error(`Invalid price: ${price} (type: ${typeof price})`);
          }
          if (!outputs.keyPair?.privateKey_minter) {
            throw new Error('keyPair.privateKey_minter is missing');
          }
          
          const priceInWei = parseUnits(price, decimals || 18);
          functionName = 'create';
          args = [
            nftOwner,
            outputs.metadataNFTCid,
            outputs.metadataBoxCid,
            outputs.keyPair.privateKey_minter,
            priceInWei,
          ];
        } else {
          functionName = 'createAndPublish';
          args = [nftOwner, outputs.metadataNFTCid, outputs.metadataBoxCid];
        }

        const invalidArgs = args.map((arg, index) => ({ 
          index, 
          arg, 
          isUndefined: arg === undefined,
          isNull: arg === null,
          type: typeof arg,
        }));
        const hasInvalid = invalidArgs.some(item => item.isUndefined || item.isNull);
        if (hasInvalid) {
          console.error('Mint: Some arguments are invalid:', invalidArgs);
          console.error('Mint: Full args array:', args);
          throw new Error(`Cannot mint: some arguments are invalid. Args: ${JSON.stringify(invalidArgs)}`);
        }

        if (!contractConfig || !contractConfig.address || !contractConfig.abi) {
          console.error('Mint: Invalid contractConfig:', contractConfig);
          throw new Error(`Invalid contractConfig: ${JSON.stringify(contractConfig)}`);
        }

        context.throwIfCancelled();
        const transactionHash = await writeCustorm({
          contract: contractConfig,
          functionName: functionName as any,
          args: args as any,
        });

        const result: MintOutput = {
          transactionHash,
          tokenId: '',
        };

        context.updateStore(stores => {
          stores.nft.updateMintOutput(result);
        });

        return result;
      } catch (error: any) {
        throw new Error(`Mint failed: ${error.message}`);
      }
    },

    onSuccess: (_, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('mint_status', 'success');
        stores.workflow.addCompletedStep('mint');
        stores.workflow.updateCreateProgress('workflowStatus', 'success');
      });
    },

    onError: (error, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('mint_status', 'error');
        stores.workflow.updateCreateProgress('mint_Error', error.message);
        // stores.workflow.updateCreateProgress('workflowStatus', 'error');
      });
    },
  };
}
