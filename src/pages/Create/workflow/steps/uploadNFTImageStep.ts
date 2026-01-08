import { WorkflowStep, WorkflowPayload } from '../core/types';
import { UploadNFTImageOutput } from '../../types/stepType';
// import { saveFile } from '@/dapp/services/saveFile';
// import { pinataService } from '@/dapp/services/pinata/pinataService';
import { mintDataUpload } from '../utils/commonUpload';

export function createUploadNFTImageStep(): WorkflowStep<WorkflowPayload, UploadNFTImageOutput> {
  return {
    name: 'uploadNFTImage',
    description: 'Upload NFT Image to IPFS',

    validate: (input) => {
      const image = input.allStepOutputs.nftImage;
      if (!image || image.size === 0) {
        console.error('Upload NFT Image: nftImage is missing');
        return false;
      }
      return true;
    },

    execute: async (input, context) => {
      context.throwIfCancelled();
      context.updateStore(stores => {
        stores.workflow.setCurrentStep('uploadNFTImage');
      });

      const image = input.allStepOutputs.nftImage;
      const cid = await mintDataUpload(image!, input.isTestMode);

      context.updateStore(stores => {
        stores.nft.updateUploadNFTImageOutput({ nftImageCid: cid });
      });

      return { nftImageCid: cid };
    },

    onSuccess: (_, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('uploadNFTImage_status', 'success');
        stores.workflow.addCompletedStep('uploadNFTImage');
      });
    },

    onError: (error, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('uploadNFTImage_status', 'error');
        stores.workflow.updateCreateProgress('uploadNFTImage_Error', error.message);
        // stores.workflow.updateCreateProgress('workflowStatus', 'error');
      });
    },
  };
}
