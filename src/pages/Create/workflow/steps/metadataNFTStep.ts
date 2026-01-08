import { WorkflowStep, WorkflowPayload } from '../core/types';
import { MetadataNFTOutput } from '../../types/stepType';
import { metadataService } from '@dapp/services/metadata/metadataService';
import { objToJson } from '@dapp/services/createJsonFile/objToJson';
import { nameService } from '@/utils/nameService';
// import { saveFile } from '@/dapp/services/saveFile';
import { mintDataUpload } from '../utils/commonUpload';

export function createMetadataNFTStep(): WorkflowStep<WorkflowPayload, MetadataNFTOutput> {
  return {
    name: 'metadataNFT',
    description: 'Create Metadata NFT',

    validate: (input) => {
      const outputs = input.allStepOutputs;
      if (!outputs.boxImageCid) {
        console.error('Create Metadata: boxImageCid is missing');
        return false;
      }
      if (!outputs.nftImageCid) {
        console.error('Create Metadata: nftImageCid is missing');
        return false;
      }
      return true;
    },

    execute: async (input, context) => {
      context.throwIfCancelled();
      context.updateStore(stores => {
        stores.workflow.setCurrentStep('metadataNFT');
      });

      const outputs = input.allStepOutputs;

      const metadataNFTObj = await metadataService.createMetadataNFT(input.boxInfo, outputs);

      const metadataNFTFile = objToJson(metadataNFTObj, nameService.metadataNFTName());

      const metadataNFTCid = await mintDataUpload(metadataNFTFile, input.isTestMode);

      const result: MetadataNFTOutput = {
        metadataNFTFile,
        metadataNFTCid,
      };

      context.updateStore(stores => {
        stores.nft.updateMetadataNFTOutput(result);
      });


      return result;
    },

    onSuccess: (_, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('metadataNFT_status', 'success');
        stores.workflow.addCompletedStep('metadataNFT');
      });
    },

    onError: (error, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('metadataNFT_status', 'error');
        stores.workflow.updateCreateProgress('metadataNFT_Error', error.message);
        // stores.workflow.updateCreateProgress('workflowStatus', 'error');
      });
    },
  };
}
