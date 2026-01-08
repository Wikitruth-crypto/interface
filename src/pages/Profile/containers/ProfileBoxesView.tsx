import React, { useMemo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import UserDataBar from '@/components/userDataBar';
import CardProfileContainer from './CardProfileContainer';
import ProfileWithdrawPanel from '../components/ProfileWithdrawPanel';
import SkeletonProfile from '@/components/base/skeletonProfile';
import { LoaderModal } from '@/components/loaderModal';
import { useProfileTable, useLisener, useUserProfile, useUserBoxes } from '../hooks';

interface ProfileBoxesViewProps {
    address?: string;
    userId: string | null;
    className?: string;
}

const ProfileBoxesView: React.FC<ProfileBoxesViewProps> = ({ address, userId, className }) => {
    const { filters, updateTab } = useProfileTable();
    useLisener();

    const safeAddress = address ?? '';
    const safeUserId = userId ?? '';

    const {
        data: userProfile,
        isLoading: userLoading,
        error: userError,
    } = useUserProfile(safeAddress, safeUserId);

    const {
        data: boxPages,
        isLoading: boxesLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        error: boxesError,
    } = useUserBoxes(safeAddress, filters, safeUserId);

    const flatData = useMemo(() => boxPages?.pages.flatMap((page) => page.items) ?? [], [boxPages]);

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleCardClick = useCallback((cardId: string) => {
        setOpen(true);
        navigate(`/boxDetail/${cardId}`);
    }, [navigate]);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        window.location.reload();
    }, []);

    const handleLoadMore = useCallback(() => {
        fetchNextPage();
    }, [fetchNextPage]);

    const isLoading = userLoading || boxesLoading;
    const hasError = Boolean(userError || boxesError);

    return (
        <div className={cn('space-y-6', className)}>
            {hasError ? (
                <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
                    <div className="text-center space-y-4">
                        <h3 className="text-lg font-semibold text-red-400">The data loading failed</h3>
                        <p className="text-foreground/70">Something went wrong while loading boxes</p>
                        <button
                            onClick={handleRefresh}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                            disabled={isRefreshing}
                        >
                            {isRefreshing ? 'Refreshing...' : 'Reload'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <UserDataBar
                        data={userProfile?.stats}
                        loading={userLoading}
                        selectedTab={filters.selectedTab}
                        onTabClick={updateTab}
                    />

                    <ProfileWithdrawPanel className="w-full" />

                    <div className="w-full">
                        {isLoading && flatData.length === 0 ? (
                            <div className="space-y-4">
                                {Array.from({ length: 3 }, (_, i) => (
                                    <SkeletonProfile key={i} />
                                ))}
                            </div>
                        ) : flatData.length > 0 ? (
                            <>
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
                            <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
                                <div className="text-center space-y-2">
                                    <h3 className="text-lg font-semibold">No data</h3>
                                    <p className="text-foreground/70">You don't have any boxes</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <LoaderModal open={open} closable={true} />
        </div>
    );
};

export default ProfileBoxesView;
