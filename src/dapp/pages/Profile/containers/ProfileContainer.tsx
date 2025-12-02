import React, { useMemo, useCallback, useState } from 'react';
// 使用原有的真实数据hooks，而不是mock hooks
import { useUserProfile, useUserBoxes, useProfileTable, useLisener } from '../hooks';
import { useWalletContext } from '@/dapp/context/useAccount/WalletContext';
import { Container } from '@/components/Container';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { LoaderModal } from '@/dapp/components/loaderModal';
import UserDataBar from '@/dapp/components/userDataBar';
import CardProfileContainer from './CardProfileContainer';
import ProfileWithdrawPanel from '../components/ProfileWithdrawPanel';
// import ProgressiveRevealCard from '@/dapp/components/base/progressiveRevealCard';
import SkeletonProfile from '@/dapp/components/base/skeletonProfile';
import ProfileRewardsPanel from '../components/ProfileRewardsPanel';
import { useGetMyUserId } from '@/dapp/hooks/readContracts2/useGetMyUserId';

// 导入hooks
// import { useProgressiveReveal } from '@/dapp/hooks/useProgressiveReveal';

export interface ProfileContainerProps {
    /** 自定义样式 */
    className?: string;
    /** 页面配置 */
    config?: {
        /** 是否启用渐进式加载 */
        enableProgressiveReveal?: boolean;
        /** 渐进式加载延迟 */
        revealDelay?: number;
        /** 是否显示调试信息 */
        debug?: boolean;
    };
}

/**
 * ProfileContainer - Profile页面主容器组件
 * 
 * 职责：
 * - 统一管理整个Profile页面的状态
 * - 协调各个子组件的交互
 * - 处理数据获取和错误状态
 * - 管理加载状态和用户反馈
 * - 提供统一的事件处理
 * 
 * 架构特点：
 * - 基于原有hooks：使用useUserProfile、useUserBoxes等真实数据hooks
 * - 数据流控制：控制数据在各组件间的流动
 * - 错误边界：处理和展示错误状态
 * - 性能优化：使用memo和callback优化
 */
const ProfileContainer: React.FC<ProfileContainerProps> = ({
    className,
    config = {}
}) => {
    const {
        enableProgressiveReveal = false,
        revealDelay = 200,
        debug = false
    } = config;

    // 获取钱包地址
    const { address } = useWalletContext();

    // 页面级状态
    const [isRefreshing, setIsRefreshing] = useState(false);

    // 表格状态管理 - 使用原有的hooks
    const { filters, updateTab, updateStatus, table } = useProfileTable();
    
    // 监听器：处理tab切换时的数据重置
    useLisener();
    
    // 通过合约/user store 解析 userId（为空时部分 tab 不可用）
    const resolvedUserId = useGetMyUserId();
    const userId: string | null = resolvedUserId && resolvedUserId.trim() !== ''
        ? resolvedUserId.trim()
        : null;
    
    // 数据获取 - 使用 Supabase 查询
    const { 
        data: userProfile, 
        isLoading: userLoading,
        error: userError 
    } = useUserProfile(address as string, userId as string);
    
    const {
        data: boxPages,
        isLoading: boxesLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        error: boxesError
    } = useUserBoxes(address as string, filters, userId as string);

    // 扁平化数据 - 与原有逻辑保持一致
    const flatData = useMemo(() => 
        boxPages?.pages.flatMap(page => page.items) ?? [], 
        [boxPages]
    );

    // 渐进式显示hook - 暂时禁用以避免闪烁
    // const {
    //     items,
    //     startReveal,
    //     reset: resetReveal,
    //     isRevealing,
    //     revealedCount,
    //     progress
    // } = useProgressiveReveal({
    //     revealDelay,
    //     transitionDuration: 300,
    //     initialCount: 12,
    //     cleanupOnUnmount: true
    // });

    // 统一的加载状态
    const isLoading = userLoading || boxesLoading;
    const hasError = userError || boxesError;

    // 统一的错误处理
    const errorMessage = useMemo(() => {
        if (userError) {
            const message = userError instanceof Error ? userError.message : String(userError);
            return `User data error: ${message}`;
        }
        if (boxesError) {
            const message = boxesError instanceof Error ? boxesError.message : String(boxesError);
            return `Boxes data error: ${message}`;
        }
        return null;
    }, [userError, boxesError]);

    const navigate = useNavigate();

    // 事件处理器
    const handleCardClick = (cardId: string) => {
        setOpen(true);
        navigate(`/app/boxDetail/${cardId}`);
    };

    const [open, setOpen] = useState(false);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            // 刷新页面数据
            window.location.reload();
        } catch (error) {
            console.error('Refresh failed:', error);
        } finally {
            setIsRefreshing(false);
        }
    }, []);

    // 处理加载更多的点击事件
    const handleLoadMore = useCallback(() => {
        fetchNextPage();
    }, [fetchNextPage]);

    // 当数据变化时，启动渐进式显示 - 暂时禁用以避免闪烁
    // useEffect(() => {
    //     if (enableProgressiveReveal && flatData.length > 0 && !isRevealing) {
    //         startReveal(flatData);
    //     }
    // }, [flatData, enableProgressiveReveal, isRevealing, startReveal]);

    // 统一错误处理
    if (hasError) {
        return (
            <Container className={cn('flex flex-col items-center justify-center min-h-96 space-y-4', className)}>
                <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold text-red-400">The data loading failed</h3>
                    <p className="text-foreground/70">{errorMessage}</p>
                    <button 
                        onClick={handleRefresh}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        disabled={isRefreshing}
                    >
                        {isRefreshing ? 'Refreshing...' : 'Reload'}
                    </button>
                </div>
            </Container>
        );
    }

    // 渲染卡片列表 - 统一使用传统渲染模式
    const renderCardList = () => {
        // 直接使用传统渲染模式，避免渐进式显示的闪烁问题
        return (
            <div className="w-full space-y-3 sm:space-y-4 md:space-y-6">
                {flatData.map((boxData) => (
                    <CardProfileContainer
                        key={boxData.id}
                        data={boxData}
                        userId={userId}
                        onCardClick={() => handleCardClick(boxData.id)}
                    />
                ))}
            </div>
        );
    };

    return (
        <Container className={cn('space-y-6 py-6', className)}>
            {/* 账户信息 */}
            <div className="space-y-2">
                <h3 className="text-xl font-semibold">Your Account:</h3>
                <p className="text-foreground/70 font-mono text-sm break-all">
                    {address}
                </p>
            </div>
            <ProfileRewardsPanel userId={userId} className="w-full" />

            {/* 用户数据栏 */}
            <div className="w-full">
                <UserDataBar 
                    data={userProfile?.stats} 
                    loading={userLoading}
                    selectedTab={filters.selectedTab}
                    onTabClick={updateTab}
                />
            </div>

            <ProfileWithdrawPanel className="w-full" />



            {/* 筛选栏 */}
            {/* <FilterBarProfile 
                filters={filters}
                onStatusChange={updateStatus}
            /> */}

            {/* 卡片列表 */}
            <div className="w-full">
                {isLoading && flatData.length === 0 ? (
                    // 加载骨架屏
                    <div className="space-y-4">
                        {Array.from({ length: 3 }, (_, i) => (
                            <SkeletonProfile key={i} />
                        ))}
                    </div>
                ) : flatData.length > 0 ? (
                    // 卡片列表
                    <>
                        {renderCardList()}
                        
                        {/* 加载更多按钮 */}
                        {hasNextPage && (
                            <div className="flex justify-center pt-6">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={isFetchingNextPage}
                                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    {isFetchingNextPage ? 'Loading...' : 'Load more'}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    // 空状态
                    <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-semibold">No data</h3>
                            <p className="text-foreground/70">You don't have any boxes</p>
                        </div>
                    </div>
                )}
            </div>

            <LoaderModal open={open} closable={true}/>
        </Container>
    );
};

export default ProfileContainer; 