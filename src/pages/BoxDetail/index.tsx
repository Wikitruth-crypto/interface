import React from 'react';
import { useParams } from 'react-router-dom';
import ContentLeft from './containers/left';
import ContentRight from './containers/right';
import { Container } from '@/components/Container';
import { BoxDetailProvider } from './contexts/BoxDetailContext';
// import UserIdAlert from '@/dapp/components/userIdAlert';

const BoxDetail: React.FC = () => {
    const { tokenId } = useParams<{ tokenId: string }>();

    return (
        <>
            <Container className="py-8 md:py-12 lg:py-16">
                {/* Hero Section */}
                <div className="text-center mb-8 md:mb-12">
                    <p className="text-xl text-muted-foreground md:text-2xl lg:text-3xl font-bold">
                        Only criminals fear the truth being revealed!
                    </p>
                </div>

                {/* <UserIdAlert /> */}

                {/* Main Content */}
                <div className="bg-muted/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 lg:p-12">

                    <BoxDetailProvider boxId={tokenId || ''}>
                        <div className="flex w-full flex-col lg:flex-row gap-8 lg:gap-12">
                            {/* Left Content */}
                            <div className="flex-1 lg:max-w-2xl">
                                <ContentLeft tokenId={tokenId || ''} />
                            </div>

                            {/* Divider - Only visible on desktop */}
                            <div className="hidden lg:block w-px bg-border/50 self-stretch"></div>

                            {/* Right Content */}
                            <div className="flex-1 lg:max-w-xl">
                                <ContentRight tokenId={tokenId || ''} />
                            </div>
                        </div>
                    </BoxDetailProvider>
                </div>
            </Container>
        </>
    );
}

export default BoxDetail;
