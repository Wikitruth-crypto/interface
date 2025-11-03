// import { create } from 'ipfs-http-client';
import { CIDIsExitingType } from '@dapp/types/otherTypes';
import { FleekSdk, ApplicationAccessTokenService } from '@fleek-platform/sdk';

// Method                      Description
// -----------------------------------------------------------------------------------------------------------------
// uploadFile                  Upload a file to IPFS
// uploadDirectory             Upload a directory to IPFS
// uploadVirtualDirectory      Upload a virtual directory to IPFS
// get                         Get a file by CID
// getByFilename               Get a file by Filename
// list                        List files
// delete                      Delete a file by CID
// console.log('env:', {
//     VITE_IPFS_FLEEK_MintData_clientId: import.meta.env.VITE_IPFS_FLEEK_MintData_clientId,
// });

const applicationService_MintData = new ApplicationAccessTokenService({
    clientId: import.meta.env.VITE_IPFS_FLEEK_MintData_clientId,
    // authAppsServiceUrl:'http://localhost:5173/',
});

const applicationService_ExchangeData = new ApplicationAccessTokenService({
    clientId: import.meta.env.VITE_IPFS_FLEEK_ExchangeData_clientId,
    // authAppsServiceUrl:'http://localhost:5173/',
});

export const uploadToFleek = async (type: 'MintData' | 'ExchangeData', file: File, setProgress: (progress: number) => void): Promise<CIDIsExitingType> => {
    
    const fleekSdk = new FleekSdk({
        accessTokenService: type === 'MintData' ? applicationService_MintData : applicationService_ExchangeData
    });

    try {
        const fileLike = {
            name: file.name,
            stream: () => file.stream(),
        };

        let progressUpdated = false;

        const uploadResponse = await fleekSdk.storage().uploadFile({
            file: fileLike,
            onUploadProgress: (progress: { loadedSize?: number; totalSize?: number }) => {
                progressUpdated = true;
                const percentage = Math.round(((progress.loadedSize ?? 0) / (progress.totalSize ?? 1)) * 100);
                setProgress(percentage);
            }
        });

        // type UploadPinResponse = {
        //     pin: {
        //         cid: string;
        //         size: number;
        //         };
        //         duplicate: boolean;
        //     };
        
        const isExisting = uploadResponse.duplicate === true;
        
        if (isExisting && !progressUpdated) {
            setProgress(100);
        }
        
        return {
            cid: uploadResponse.pin.cid,
            isExisting
        };
    } catch (error) {
        console.error('Upload to IPFS error:', error);
        
        throw error;
    }
};

