import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ContentLeft from './containers/left';
import ContentRight from './containers/right';
import { useLoadBoxDetail } from './hooks/useLoadBoxDetail';
import { Container } from '@/components/Container';
import { useBoxDetailStore } from './store/boxDetailStore';

const BoxDetail: React.FC = () => {
    const { tokenId } = useParams<{ tokenId: string }>();
    const { updateTokenId } = useBoxDetailStore();

    const numericTokenId = Number(tokenId);

    const { loadBoxDetail, loading, error } = useLoadBoxDetail();

    useEffect(() => {
        if (tokenId) {
            // loadBoxDetail(tokenId);
            updateTokenId(tokenId);
        }
    }, [tokenId]);

    return (
        <Container className="py-8 md:py-12 lg:py-16">
            {/* Hero Section */}
            <div className="text-center mb-8 md:mb-12">
                <h2 className="text-lg font-mono md:text-xl lg:text-2xl font-semibold text-foreground mb-4">
                    Only criminals fear the truth being revealed!
                </h2>
            </div>

            {/* Main Content */}
            <div className="bg-muted/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 lg:p-12">
                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="flex w-full flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Left Content */}
                    <div className="flex-1 lg:max-w-2xl">
                        <ContentLeft loading={loading} tokenId={numericTokenId} />
                    </div>

                    {/* Divider - Only visible on desktop */}
                    <div className="hidden lg:block w-px bg-border/50 self-stretch"></div>

                    {/* Right Content */}
                    <div className="flex-1 lg:max-w-xl">
                        <ContentRight loading={loading} />
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default BoxDetail;
