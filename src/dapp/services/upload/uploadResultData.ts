// import { create } from 'ipfs-http-client';
// import config_env from "../../config/env"
import { FleekSdk, ApplicationAccessTokenService } from '@fleek-platform/sdk';
import { CIDIsExitingType } from '@dapp/types/otherTypes';

// console.log('env:', {
//     VITE_IPFS_FLEEK_FailedData_clientId: import.meta.env.VITE_IPFS_FLEEK_FailedData_clientId,
// });

// ------
const applicationService = new ApplicationAccessTokenService({
    clientId: import.meta.env.VITE_IPFS_FLEEK_ResultData_clientId,
    // authAppsServiceUrl:'http://localhost:5173/',
});

const fleekSdk = new FleekSdk({
    accessTokenService: applicationService
});

// ---
export const uploadResultData = async (file: File, setProgress: (progress: number) => void): Promise<CIDIsExitingType> => {

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
        
        const isExisting = uploadResponse.duplicate === true;
        
        if (isExisting && !progressUpdated) {
            setProgress(100);
        }
        
        return {
            cid: uploadResponse.pin.cid,
            isExisting
        }

    } catch (error) {
        console.error('Upload to IPFS error:', error);
        
        throw error;
    }
};

