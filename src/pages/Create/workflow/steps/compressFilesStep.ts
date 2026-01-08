import { WorkflowStep, WorkflowPayload } from '../core/types';
import { CompressFilesOutput } from '../../types/stepType';
import { compressService } from '@dapp/services/zip/compressService';
import { zipFileService } from '@dapp/services/zip/zipFile';

export function createCompressFilesStep(): WorkflowStep<WorkflowPayload, CompressFilesOutput> {
  return {
    name: 'compressFiles',
    description: 'Compress files',

    validate: (input) => {
      if (!input.files || input.files.length === 0) {
        console.error('Compress Files: files are missing');
        return false;
      }
      if (!input.boxInfo.mintMethod) {
        console.error('Compress Files: mintMethod is missing');
        return false;
      }
      return true;
    },

    execute: async (input, context) => {
      context.throwIfCancelled();
      context.updateStore(stores => {
        stores.workflow.setCurrentStep('compressFiles');
      });

      context.throwIfCancelled();
      const fileEntries = input.files.map((file: File, index: number) => ({
        uid: `file-${index}-${file.name}`,
        name: file.name,
        status: 'done' as const,
        originFileObj: file,
      }));
    
      const files_any:any[] = fileEntries;

      const handler = input.boxInfo.mintMethod === 'create' ? handleCreateMode : handlePublishMode;
      
      const result = await handler(files_any);
      context.throwIfCancelled();

      context.updateStore(stores => {
        stores.nft.updateCompressFilesOutput(result);
      });

      return result;
    },

    onSuccess: (_, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('compressFiles_status', 'success');
        stores.workflow.addCompletedStep('compressFiles');
      });
    },

    onError: (error, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('compressFiles_status', 'error');
        stores.workflow.updateCreateProgress('compressFiles_Error', error.message);
        // stores.workflow.updateCreateProgress('workflowStatus', 'error');
      });
    },
  };
}

async function handleCreateMode(files: any[]): Promise<CompressFilesOutput> {
  
  const { zipBlob, zipName, zipPassword } = await compressService.compressWithPassword(files);

  const splitResult = await zipFileService.splitZipFile(zipBlob, zipName, Math.ceil(zipBlob.size / 2));

  return {
    zipFile: zipBlob,
    fileName: zipName,
    password: zipPassword,
    fileChunks: splitResult.chunks,
    slicesMetadata: splitResult.json,
  };
}

async function handlePublishMode(files: any[]): Promise<CompressFilesOutput> {

  const { zipBlob, zipName } = await compressService.compressWithoutPassword(files);

  return {
    zipFile: zipBlob,
    fileName: zipName,
    password: '',
    fileChunks: [zipBlob],
    slicesMetadata: null,
  };
}
