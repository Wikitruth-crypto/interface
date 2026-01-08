import { WorkflowStep, WorkflowPayload } from '../core/types';
import { EncryptDataOutput } from '../../types/stepType';
import { CryptionService } from '@dapp/services/cryption';

export function createEncryptDataStep(): WorkflowStep<WorkflowPayload, EncryptDataOutput> {
  return {
    name: 'encryptData',
    description: 'Encrypt Data',

    canSkip: (input) => input.boxInfo.mintMethod === 'createAndPublish',

    validate: (input) => {
      const fileCidList = input.allStepOutputs.fileCidList;
      if (!fileCidList || fileCidList.length === 0) {
        console.error('Encrypt Data: fileCidList is missing');
        return false;
      }
      if (input.boxInfo.mintMethod === 'create') {
        const password = input.allStepOutputs.password;
        const slicesMetadataCID = input.allStepOutputs.slicesMetadataCID;
        if (!password) {
          console.error('Encrypt Data: password is missing');
          return false;
        }
        if (!slicesMetadataCID) {
          console.error('Encrypt Data: slicesMetadataCID is missing');
          return false;
        }
      }
      return true;
    },

    execute: async (input, context) => {
      context.throwIfCancelled();
      context.updateStore(stores => {
        stores.workflow.setCurrentStep('encryptData');
      });

      if (input.boxInfo.mintMethod === 'createAndPublish') {
        const empty: EncryptDataOutput = {
          encryptionSlicesMetadataCID: {
            slicesMetadataCID_encryption: '',
            slicesMetadataCID_iv: '',
          },
          encryptionFileCID: [],
          encryptionPasswords: {
            password_encryption: '',
            password_iv: '',
          },
          keyPair: {
            privateKey_minter: '',
            publicKey_minter: '',
          },
        };
        context.updateStore(stores => {
          stores.nft.updateEncryptDataOutput(empty);
        });
        return empty;
      }

      const fileCidList = input.allStepOutputs.fileCidList;
      const password = input.allStepOutputs.password;
      const slicesMetadataCID = input.allStepOutputs.slicesMetadataCID;

      const keyPair = await CryptionService.generateKeyPair();

      const metadataResult = await CryptionService.encryptList(
        keyPair.publicKey_bytes,
        keyPair.privateKey_bytes,
        slicesMetadataCID ? [slicesMetadataCID] : []
      );

      const cidResult = await CryptionService.encryptList(
        keyPair.publicKey_bytes,
        keyPair.privateKey_bytes,
        fileCidList ?? []
      );

      const passwordResult = await CryptionService.encryptList(
        keyPair.publicKey_bytes,
        keyPair.privateKey_bytes,
        [password ?? '']
      );

      if (!cidResult.success || !cidResult.data || !passwordResult.success || !passwordResult.data) {
        throw new Error('Encrypt data failed');
      }

      const output: EncryptDataOutput = {
        encryptionSlicesMetadataCID: {
          slicesMetadataCID_encryption: metadataResult.data?.[0]?.encrypted_bytes ?? '',
          slicesMetadataCID_iv: metadataResult.data?.[0]?.iv_bytes ?? '',
        },
        encryptionFileCID: cidResult.data.map(item => ({
          fileCID_encryption: item.encrypted_bytes,
          fileCID_iv: item.iv_bytes,
        })),
        encryptionPasswords: {
          password_encryption: passwordResult.data[0].encrypted_bytes,
          password_iv: passwordResult.data[0].iv_bytes,
        },
        keyPair: {
          privateKey_minter: keyPair.privateKey_bytes,
          publicKey_minter: keyPair.publicKey_bytes,
        },
      };

      context.updateStore(stores => {
        stores.nft.updateEncryptDataOutput(output);
      });



      return output;
    },

    onSuccess: (_, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('encryptData_status', 'success');
        stores.workflow.addCompletedStep('encryptData');
      });
    },

    onError: (error, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('encryptData_status', 'error');
        stores.workflow.updateCreateProgress('encryptData_Error', error.message);
        // stores.workflow.updateCreateProgress('workflowStatus', 'error');
      });
    },
  };
}
