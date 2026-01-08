import { WorkflowStep, WorkflowPayload } from '../core/types';
import { CreateNFTImageOutput } from '../../types/stepType';
import { filterNftData } from '../utils/filterNftData'
import CreateNftImage from '@dapp/services/createNftImage';
import backgroundImg from '@assets/nft/nft-light-1.jpg';
import { nameService } from '@/utils/nameService';
import { openNFTPreview } from '@dapp/components/html/nftPreviewTemplate';
import { timeToDate } from '@dapp/utils/time';

export function createCreateNFTImageStep(): WorkflowStep<WorkflowPayload, CreateNFTImageOutput> {
  return {
    name: 'createNFTImage',
    description: 'Create NFT Image',

    validate: (input) => {
      const { boxInfo, boxImages } = input;
      if (!boxInfo.typeOfCrime || !boxInfo.title || !boxInfo.country || !boxInfo.eventDate) {
        console.error('Create NFT Image: missing required box info fields');
        return false;
      }
      if (!boxImages || boxImages.length === 0) {
        console.error('Create NFT Image: images are missing');
        return false;
      }
      return true;
    },

    execute: async (input, context) => {
      context.throwIfCancelled();
      context.updateStore(stores => {
        stores.workflow.setCurrentStep('createNFTImage');
      });

      const timestamp = Date.now();
      const createDate = timeToDate(timestamp);
      const currentTime = { createDate, timestamp };

      const nftData = filterNftData({
        typeOfCrime: input.boxInfo.typeOfCrime,
        title: input.boxInfo.title,
        country: input.boxInfo.country,
        state: input.boxInfo.state,
        eventDate: input.boxInfo.eventDate,
        createDate,
      });

      const imageName = nameService.nftImageName();
      const { image, dataUrl } = await CreateNftImage(nftData, imageName, backgroundImg, input.boxImages[0]);


      const output: CreateNFTImageOutput = {
        nftImage: image,
        currentTime,
      };

      context.updateStore(stores => {
        stores.nft.updateCreateNFTImageOutput(output);
      });
      if (!input.isTestMode) {
        openNFTPreview(dataUrl, imageName);

      } 

      return output;
    },

    onSuccess: (_, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('createNFTImage_status', 'success');
        stores.workflow.addCompletedStep('createNFTImage');
      });
    },

    onError: (error, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('createNFTImage_status', 'error');
        stores.workflow.updateCreateProgress('createNFTImage_Error', error.message);
        // stores.workflow.updateCreateProgress('workflowStatus', 'error');
      });
    },
  };
}
