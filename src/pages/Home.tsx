import HeroSection from "@/components/sections/HeroSection";
import MainImageSection from "@/components/sections/MainImageSection";
import GlobleEarth from "@/components/sections/GlobleEarth";
import CarouselSection from "@/components/sections/CarouselSection";
import TechnologySection from "@/components/sections/Technology";
import EncryptionData from "@/components/sections/EncryptionData";
import TruthBoxSection from "@/components/sections/TruthBoxSection";
import NFTSection from "@/components/sections/NFTSection";
import MiniCardsSection from "@/components/sections/MiniCardsSection";
import PartnersSection from "@/components/sections/PartnersSection";

export default function HomePage() {
    return (
        <div className="w-full overflow-hidden">
            <HeroSection />
            <MainImageSection />
            <GlobleEarth />
            <CarouselSection />
            <TechnologySection />
            <EncryptionData />
            <TruthBoxSection />
            <NFTSection />
            <MiniCardsSection />
            <PartnersSection />
        </div>
    );
}

