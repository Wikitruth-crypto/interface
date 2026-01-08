import { WorkflowStep, WorkflowPayload } from '../core/types';
import { UploadResultDataOutput } from '../../types/stepType';
import { metadataService } from '@dapp/services/metadata/metadataService';
import { objToJson } from '@dapp/services/createJsonFile/objToJson';
import { nameService } from '@/utils/nameService';
// import { saveFile } from '@dapp/services/saveFile';
// import { pinataService } from '@dapp/services/pinata/pinataService';
import { resultDataUpload } from '../utils/commonUpload';

export function createUploadResultDataStep(): WorkflowStep<WorkflowPayload, UploadResultDataOutput> {
  return {
    name: 'uploadResultData',
    description: 'Upload Result Data',

    execute: async (input, context) => {
      context.throwIfCancelled();
      context.updateStore(stores => {
        stores.workflow.setCurrentStep('uploadResultData');
      });

      const outputs = input.allStepOutputs;

      try {
        const resultData = metadataService.createResultData(
          input.boxInfo.mintMethod,
          outputs.fileCidList,
          [
            outputs.boxImageCid && { cid: outputs.boxImageCid, isExisting: false },
            outputs.nftImageCid && { cid: outputs.nftImageCid, isExisting: false },
            outputs.metadataBoxCid && { cid: outputs.metadataBoxCid, isExisting: false },
            outputs.metadataNFTCid && { cid: outputs.metadataNFTCid, isExisting: false },
          ].filter(Boolean) as any,
          true,
          String(outputs.currentTime.timestamp ?? Date.now())
        );

        const resultDataFile = objToJson(resultData, nameService.resultDataName());
        
        const resultDataCid = await resultDataUpload(resultDataFile, input.isTestMode);

        context.updateStore(stores => {
          stores.nft.updateUploadResultDataOutput({ resultDataCid });
        });

        return { resultDataCid };
      } catch (error: any) {
        context.log(`Result data upload failed (non-critical): ${error.message}`, 'warn');
        return { resultDataCid: '' };
      }
    },

    onSuccess: (_, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('uploadResultData_status', 'success');
        stores.workflow.addCompletedStep('uploadResultData');
      });
    },

    onError: (error, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('uploadResultData_status', 'error');
        stores.workflow.updateCreateProgress('uploadResultData_Error', error.message);
      });
    },
  };
}
