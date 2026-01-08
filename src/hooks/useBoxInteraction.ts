import { useAccountStore } from '@dapp/store/accountStore';
import { FunctionNameType } from '@dapp/types/typesDapp/contracts';

/**

 * @example
 * ```tsx
 * function BoxDetailPage() {
 *   const { tokenId } = useParams();
 *   const { recordInteraction, hasInteracted, getInteractions } = useBoxInteraction(tokenId);
 *   
 *   // Record interaction after transaction success
 *   const handlePublish = async () => {
 *     const txHash = await writeContract(...);
 *     recordInteraction('publish', txHash); // chainId automatically gets from Store
 *   };
 *   
 *   // Check if an operation has been executed
 *   const hasPublished = hasInteracted('publish');
 *   
 *   // Get all interaction records
 *   const interactions = getInteractions();
 * }
 * ```
 */
export const useBoxInteraction = (boxId: string) => {
    const {
        addBoxInteraction,
        getBoxInteractions,
        hasBoxInteraction,
        clearBoxInteractions,
    } = useAccountStore();

    /**
     * Record interaction
     * @param functionWrote Function name
     * @param txHash Optional transaction hash
     */
    const recordInteraction = (functionWrote: FunctionNameType, txHash?: string) => {
        // No need to pass chainId, addBoxInteraction will automatically use the current chainId
        addBoxInteraction(boxId, functionWrote, txHash);
    };

    /**
     * Check if an interaction has been executed
     * @param functionWrote Function name
     * @returns Whether it has been executed
     */
    const hasInteracted = (functionWrote: FunctionNameType): boolean => {
        return hasBoxInteraction(boxId, functionWrote);
    };

    /**
     * Get all interaction records
     * @returns Interaction record array
     */
    const getInteractions = () => {
        return getBoxInteractions(boxId);
    };

    /**
     * Clear all interactions for the current Box
     */
    const clearInteractions = () => {
        clearBoxInteractions(boxId);
    };

    return {
        recordInteraction,
        hasInteracted,
        getInteractions,
        clearInteractions,
    };
};

