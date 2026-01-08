import { WorkflowStep, WorkflowPayload } from '../core/types';
import { MetadataBoxOutput } from '../../types/stepType';
import { metadataService } from '@dapp/services/metadata/metadataService';
import { objToJson } from '@dapp/services/createJsonFile/objToJson';
import { nameService } from '@/utils/nameService';
// import { saveFile } from '@/dapp/services/saveFile';
import { mintDataUpload } from '../utils/commonUpload';


export function createMetadataBoxStep(): WorkflowStep<WorkflowPayload, MetadataBoxOutput> {
  return {
    name: 'metadataBox',
    description: 'Create Metadata Box',

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
      if (!outputs.fileCidList || outputs.fileCidList.length === 0) {
        console.error('Create Metadata: fileCidList is missing');
        return false;
      }
      if (input.boxInfo.mintMethod === 'create') {
        if (!outputs.encryptionSlicesMetadataCID.slicesMetadataCID_encryption) {
          console.error('Create Metadata: encryptionSlicesMetadataCID is missing');
          return false;
        }
      }
      return true;
    },

    execute: async (input, context) => {
      context.throwIfCancelled();
      context.updateStore(stores => {
        stores.workflow.setCurrentStep('metadataBox');
      });

      const outputs = input.allStepOutputs;

      const metadataBoxObj = await metadataService.createMetadataBox(input.boxInfo, outputs);

      const metadataBoxFile = objToJson(metadataBoxObj, nameService.metadataBoxName());
      const metadataBoxCid = await mintDataUpload(metadataBoxFile, input.isTestMode);

      const result: MetadataBoxOutput = {
        metadataBoxFile,
        metadataBoxCid,
      };

      context.updateStore(stores => {
        stores.nft.updateMetadataBoxOutput(result);
      });


      return result;
    },

    onSuccess: (_, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('metadataBox_status', 'success');
        stores.workflow.addCompletedStep('metadataBox');
      });
    },

    onError: (error, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('metadataBox_status', 'error');
        stores.workflow.updateCreateProgress('metadataBox_Error', error.message);
        // stores.workflow.updateCreateProgress('workflowStatus', 'error');
      });
    },
  };
}
