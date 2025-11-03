"use client";
// import { useBrandColorStore } from "@/store/storeBrandColor";
// import { UserGroupIcon } from "@heroicons/react/24/solid";
import { Image } from 'antd';
import arweave from "@/assets/icon/Arweave1.svg";
import dfinity from "@/assets/icon/ICP-Dfinity2.svg";
import pinata from "@/assets/icon/Pinata.svg";
import graph from "@/assets/icon/TheGraph.svg";
import fleek from "@/assets/icon/fleek.svg";
import { Container } from "@/components/Container";


const partners = [
  { name: "Fleek", icon: fleek},
  { name: "Arweave", icon: arweave },
  { name: "Dfinity", icon: dfinity },
  { name: "Pinata", icon: pinata},
  { name: "The Graph", icon: graph},
];

export default function PartnersSection() {
  // const { brandColor } = useBrandColorStore();

  return (
    <section className="w-full py-10 md:py-16">
      <Container className="flex flex-col items-center justify-center">
        <h3 className="text-xl md:text-2xl font-bold mb-8 text-white">
          Infrastructure
          
        </h3>
        <div className="flex flex-wrap gap-x-16 gap-y-8 md:gap-x-30 md:gap-y-12 justify-center items-center w-full">
          {partners.map((p, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-18 h-14 flex items-center justify-center`}>
                <Image src={p.icon} alt={p.name} width={80} height={36} />
              </div>
              {/* <p className="text-gray-400 text-sm font-semibold">{p.name}</p> */}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
} 




