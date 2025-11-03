// src/dapp/pages/BoxDetail/hooks/useCurrentBox.ts
import { useQueryStore } from '@/dapp/store_sapphire/useQueryStore';
import { selectBox } from '@/dapp/store_sapphire/selectors';
import { useBoxDetailStore } from '../store/boxDetailStore';

/**
 * 获取当前 BoxDetail 页面的 box 数据
 * 自动从 boxDetailStore 获取 boxId
 */
export const useCurrentBox = (id?: string | number | BigInt) => {
    let boxId : string = '';
    if (id) {
        boxId = typeof id === 'number' || typeof id === 'bigint' ? id.toString() : id as string;
    } else {
        boxId = useBoxDetailStore(state => state.tokenId);
    }

    const box = useQueryStore(selectBox(boxId));
    
    return {
        box,
        boxId,
    };
};