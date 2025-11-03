import { Container } from "@/components/Container";
import hacker22 from "@/assets/image/hacker22.png";

export default function MainImageSection() {
  return (
    <section className="w-full py-8 md:py-14">
      <Container className="flex flex-col items-center justify-center">
        <div className="w-full mb-6">
          <img
            src={hacker22}
            alt="main chart"
            className="w-full h-auto object-contain rounded-lg"
            loading="eager"
          />
        </div>
        <div className="w-full max-w-4xl mx-auto space-y-4">
          <p className="text-lg text-center leading-relaxed text-gray-300">
            Crimnal! Do you fear the truth?
          </p>
        </div>
      </Container>
    </section>
  );
}


