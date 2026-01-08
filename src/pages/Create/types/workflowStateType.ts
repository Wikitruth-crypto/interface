

export interface MintProgressType {
    
    compressFiles_Progress: number;
    uploadFiles_Progress: number;
    encryptData_Progress: number;
    uploadBoxImage_Progress: number;
    createNFTImage_Progress: number;
    uploadNFTImage_Progress: number;
    metadataNFT_Progress: number;
    metadataBox_Progress: number;
    mint_Progress: number;
    uploadResultData_Progress: number;

}

// Define step name type
export type StepNameType = 
'compressFiles' | 
'uploadFiles' | 
'encryptData' | 
'uploadBoxImage' | 
'createNFTImage' | 
'uploadNFTImage' | 
'metadataNFT' | 
'metadataBox' | 
'mint' | 
'uploadResultData';

// All steps: in index order
export const allSteps: StepNameType[] = [
    'compressFiles', 'uploadFiles', 'encryptData', 'uploadBoxImage', 
    'createNFTImage', 'uploadNFTImage', 'metadataNFT','metadataBox',  
    'mint', 'uploadResultData'
];

export type StepStatus = 'pending' | 'processing' | 'success' | 'error' | 'skipped';
// Define the workflow status type
export type WorkflowStatus = 'idle' | 'processing' | 'success' | 'error' | 'cancelled';


// Extend MintProgress type to match actual used fields
export interface ExtendedMintProgressType extends MintProgressType {

    compressFiles_status: StepStatus;
    compressFiles_Error: string;

    uploadFiles_status: StepStatus;
    uploadFiles_Error: string;

    encryptData_status: StepStatus;
    encryptData_Error: string;

    uploadBoxImage_status: StepStatus;
    uploadBoxImage_Error: string;

    createNFTImage_status: StepStatus;
    createNFTImage_Error: string;

    uploadNFTImage_status: StepStatus;
    uploadNFTImage_Error: string;

    metadataBox_status: StepStatus;
    metadataBox_Error: string;

    metadataNFT_status: StepStatus;
    metadataNFT_Error: string;

    mint_status: StepStatus;
    mint_Error: string;

    uploadResultData_status: StepStatus;
    uploadResultData_Error: string;

}
