import { WorkflowStep, WorkflowPayload } from '../core/types';
import { UploadBoxImageOutput } from '../../types/stepType';
// import { pinataService } from '@/dapp/services/pinata/pinataService';
import { mintDataUpload } from '../utils/commonUpload';

export function createUploadBoxImageStep(): WorkflowStep<WorkflowPayload, UploadBoxImageOutput> {
  return {
    name: 'uploadBoxImage',
    description: 'Upload Box Image to IPFS',

    validate: (input) => {
      if (!input.boxImages || input.boxImages.length === 0) {
        console.error('Upload Box Image: images are missing');
        return false;
      }
      return true;
    },

    execute: async (input, context) => {
      context.throwIfCancelled();
      context.updateStore(stores => {
        stores.workflow.setCurrentStep('uploadBoxImage');
      });

      const image = input.boxImages[0];
      const renamed = new File([image], image.name, { type: image.type });
      const cid = await mintDataUpload(renamed, input.isTestMode);

      context.updateStore(stores => {
        stores.nft.updateUploadBoxImageOutput({
          boxImageCid: cid,
        });
      });


      return { boxImageCid: cid };
    },

    onSuccess: (_, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('uploadBoxImage_status', 'success');
        stores.workflow.addCompletedStep('uploadBoxImage');
      });
    },

    onError: (error, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('uploadBoxImage_status', 'error');
        stores.workflow.updateCreateProgress('uploadBoxImage_Error', error.message);
        // stores.workflow.updateCreateProgress('workflowStatus', 'error');
      });
    },
  };
}
