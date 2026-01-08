// import { WorkflowStep, WorkflowPayload } from '../core/types';
// import { UploadFilesOutput } from '../../types/stepType';
import { pinataService } from '@dapp/services/pinata/pinataService';
import { PinataGroupType } from '@dapp/services/pinata';
import { saveAs } from 'file-saver';


export async function mintDataUpload(file: File, isTestMode: boolean): Promise<string> {
    const cid = await upload(file, isTestMode, 'MintData');

    return cid
}

export async function evidenceCommonUpload(file: File, isTestMode: boolean): Promise<string> {
    const cid = await upload(file, isTestMode, 'Evidence');

    return cid
}

export async function resultDataUpload(file: File, isTestMode: boolean): Promise<string> {
    const cid = await upload(file, isTestMode, 'ResultData');

    return cid
}

async function upload(file: File, isTestMode: boolean, groupType: PinataGroupType): Promise<string> {
    let cid = '';
    if (isTestMode) {
        cid = 'mock-cid';
        saveAs(file, `${file.name}`);
    } else {
        const result = await pinataService.uploadFile(file, {
            groupType: groupType,
            setProgress: () => { }
        });
        cid = result.cid;
    }

    return cid
}
