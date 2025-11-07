// src/dapp/pages/BoxDetail/hooks/useCurrentBox.ts
import { useEffect, useRef } from 'react';
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
    const metadataBox = useMetadataStore(state => state.getBoxMetadata(boxId));
    
    // 使用 ref 跟踪是否正在处理，避免重复调用
    const isProcessingRef = useRef<Record<string, boolean>>({});
    
    useEffect(() => {
        // 如果已经有元数据，不需要处理
        if (metadataBox) {
            return;
        }
        
        // 如果没有 boxInfoCID，无法处理
        if (!boxInfoCID) {
            return;
        }
        
        // 如果正在处理这个 boxId，避免重复调用
        if (isProcessingRef.current[boxId]) {
            return;
        }
        
        // 标记为正在处理
        isProcessingRef.current[boxId] = true;
        
        const fetchMetadataBox = async () => {
            try {
                await processBox(boxId, boxInfoCID);
            } catch (error) {
                console.error('Error fetching metadata box:', error);
            } finally {
                // 处理完成后清除标记
                delete isProcessingRef.current[boxId];
            }
        };
        
        fetchMetadataBox();
    }, [boxId, boxInfoCID]); // 移除 metadataBox 依赖，避免循环

    return {
        box,
        metadataBox,
        boxId,
    };
};