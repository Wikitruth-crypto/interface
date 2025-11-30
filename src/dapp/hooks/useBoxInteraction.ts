import { useAccountStore } from '@/dapp/store/accountStore';
import { FunctionNameType } from '@/dapp/types/contracts';

/**
 * Box 交互记录 Hook
 * 
 * 功能：
 * - 记录用户在某个 Box 中完成的 write 类型交互
 * - 检查用户是否已经执行过某个交互
 * - 获取用户在某个 Box 中的所有交互记录
 * 
 * 特性：
 * - 自动使用当前 chainId（由 useSecureAccount 同步）
 * - 不需要手动传递 chainId 参数
 * - 自动记录交易哈希和时间戳
 * 
 * @example
 * ```tsx
 * function BoxDetailPage() {
 *   const { tokenId } = useParams();
 *   const { recordInteraction, hasInteracted, getInteractions } = useBoxInteraction(tokenId);
 *   
 *   // 在交易成功后记录交互
 *   const handlePublish = async () => {
 *     const txHash = await writeContract(...);
 *     recordInteraction('publish', txHash); // chainId 自动从 Store 获取
 *   };
 *   
 *   // 检查是否已执行过某个操作
 *   const hasPublished = hasInteracted('publish');
 *   
 *   // 获取所有交互记录
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
     * 记录交互
     * @param functionWrote 函数名称
     * @param txHash 可选的交易哈希
     */
    const recordInteraction = (functionWrote: FunctionNameType, txHash?: string) => {
        // 不需要传 chainId，addBoxInteraction 会自动使用当前 chainId
        addBoxInteraction(boxId, functionWrote, txHash);
    };

    /**
     * 检查是否已执行过某个交互
     * @param functionWrote 函数名称
     * @returns 是否已执行
     */
    const hasInteracted = (functionWrote: FunctionNameType): boolean => {
        return hasBoxInteraction(boxId, functionWrote);
    };

    /**
     * 获取所有交互记录
     * @returns 交互记录数组
     */
    const getInteractions = () => {
        return getBoxInteractions(boxId);
    };

    /**
     * 清除当前 Box 的所有交互记录
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

/**
 * 使用示例：在 BoxDetail 页面中
 * 
 * ```tsx
 * import { useBoxInteraction } from '@/dapp/hooks/useBoxInteraction';
 * 
 * function BoxDetailPage() {
 *   const { tokenId } = useParams();
 *   const { recordInteraction, hasInteracted } = useBoxInteraction(tokenId);
 *   const { write, isSuccessed, hash } = useWrite_BoxDetail();
 *   
 *   // 监听交易成功，自动记录
 *   useEffect(() => {
 *     if (isSuccessed && currentFunction && hash) {
 *       recordInteraction(currentFunction, hash);
 *     }
 *   }, [isSuccessed, currentFunction, hash]);
 *   
 *   // 根据是否已交互显示不同的 UI
 *   const hasPublished = hasInteracted('publish');
 *   
 *   return (
 *     <div>
 *       {hasPublished ? (
 *         <div>您已经发布过了</div>
 *       ) : (
 *         <button onClick={handlePublish}>发布</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */

