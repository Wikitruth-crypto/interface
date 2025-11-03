"use client";

// import Image from "@/components/ui/Image";
import { StaticImageData } from "@/types/image";
import { Button, Image } from "antd";
import TitleText from "@/components/base/titleText";

export interface ButtonProps {
    text?: string;
    link?: string;
    onClick?: () => void;
}

export interface DataProps {
    title: string;
    description: string;
    image: StaticImageData;
    button1?: ButtonProps;
    button2?: ButtonProps;
}

interface Props {
    data: DataProps;
}

export default function RowCardRight({ data }: Props) {

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            {/* 图片内容 - 小屏幕时显示在文本上方，大屏幕时显示在左侧 */}
            <div className="flex-1 flex items-center justify-center max-w-2xl md:mr-10 order-1">
                <Image
                    src={data.image.src}
                    alt="chart"
                    width={600}
                    height={400}
                    className="rounded-xl shadow-glow object-contain w-full h-auto max-w-full"
                />
            </div>
            {/* 文本内容 - 小屏幕时显示在图片下方，大屏幕时显示在右侧 */}
            <div className="flex-1 flex flex-col items-start justify-center max-w-md px-4 md:px-0 order-2">
                <TitleText size="h2" mt="medium" mb="medium" align="left">{data.title}</TitleText>
                <p className="mb-4 text-white/70">{data.description}</p>
                <div className="flex gap-3">
                    {data.button1?.text && <Button type="primary" size="large">{data.button1.text}</Button>}
                    {data.button2?.text && <Button type="default" size="large">{data.button2.text}</Button>}
                </div>
            </div>
        </div>
    );
}





