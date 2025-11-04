// src/dapp/pages/BoxDetail/hooks/useCurrentBox.ts
import { useEffect } from 'react';
import { useQueryStore } from '@/dapp/store_sapphire/useQueryStore';
import { selectBox } from '@/dapp/store_sapphire/selectors';
import { useBoxDetailStore } from '../store/boxDetailStore';
import { useMetadataStore } from '@/dapp/store_sapphire/useMetadataStore';
import { processBox } from '@/dapp/store_sapphire/processMetadata/processBox';
import { MetadataBoxType } from '@/dapp/types/contracts/metadataBox';

export const useCurrentBox = (boxId: string | number | BigInt) => {
    // boxId is string
    if (typeof boxId !== 'string') {
        boxId = boxId.toString();
    }

    const box = useQueryStore(selectBox(boxId));
    const boxInfoCID = box?.boxInfoCID;
    let metadataBox: MetadataBoxType | undefined
    metadataBox = useMetadataStore(state => state.getBoxMetadata(boxId));
    
    useEffect(() => {
        if (!metadataBox && boxInfoCID) {
            const fetchMetadataBox = async () => {
                const metadataBox = await processBox(boxId, boxInfoCID);
            }
            fetchMetadataBox();
        }
    }, [boxId, boxInfoCID, metadataBox]);

    return {
        box,
        metadataBox,
        boxId,
    };
};