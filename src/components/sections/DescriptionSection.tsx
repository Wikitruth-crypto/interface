"use client";
import { Typography } from 'antd';
import { Container } from "@/components/Container";

export default function DescriptionSection() {

  return (
    <section className="w-full py-10 md:py-16">
      <Container className="flex flex-col items-center justify-center text-center">
        <Typography.Title level={2} className="text-white font-semibold">Since people can lie and commit crimes for money, why can't they tell the truth and fight crime for money?</Typography.Title>
        {/*         
        <p className="max-w-240 text-base md:text-lg mx-auto text-gray-300">
          One crime requires countless crimes to cover up. Criminals will not stop committing crimes because no one knows, only the truth can make them stop.
        </p> */}
      </Container>
    </section>
  );
}




