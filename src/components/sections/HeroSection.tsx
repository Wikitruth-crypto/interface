"use client";
// import { useBrandColorStore } from "@/store/storeBrandColor";
import TitleBrand from "@/components/base/titleBrand";
import { Container } from "@/components/Container";
import { Button } from "antd";

export default function HeroSection() {
  // const { brandColor } = useBrandColorStore();
  const handleGetStart = () => {
    window.open("https://www.localhost:3000/app", "_blank");
  }
  const handleLearnMore = () => {
    window.open("https://www.localhost:3000/whitepaper", "_blank");
  }

  return (
    <section className="w-full py-16 md:py-20">
      <Container className="flex flex-col items-center justify-center text-center">
        <TitleBrand size="h1" mt="large" mb="large">Wiki Truth</TitleBrand>
        <p className="max-w-240 text-lg md:text-xl mx-auto text-gray-300">
          Storing, trading, and publicly disclosing the truth of crimes on web3,<br />
          Unlock the value of truth with blockchain.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 md:mt-10">

          <Button variant="solid" size="large" onClick={handleGetStart}>Get Start</Button>

          <Button variant="outlined" size="large" onClick={handleLearnMore}>Learn More</Button>

        </div>
      </Container>
    </section>
  );
}


