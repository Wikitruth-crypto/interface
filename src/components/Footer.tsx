"use client";
import { Image } from "antd";
import { useState } from "react";
// import { useBrandColorStore } from "@/store/storeBrandColor";
import { Container } from "@/components/Container";
import TitleBrand from "./base/titleBrand";
// import TitleText from "./base/titleText";
import TextSpan from "./base/textSpan";
import { FaDiscord, FaTwitter, FaTelegram, FaGithub, FaMailBulk, FaShareAlt } from 'react-icons/fa';
import Line from "./base/line";
import ShareModal from "./customer/shareModal";
import Famous from "./customer/famous";



const links = [
    { name: "@2025 All rights reserved", href: "#" },
    { name: "Terms of Service", href: "#" },
];

export default function Footer() {
    // const { brandColor } = useBrandColorStore();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const logoSrc = "/logo/logo-8-2-37.svg";

    // 处理分享按钮点击
    const handleShareClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsShareModalOpen(true);
    };

    // 更新 socialLinks，为分享按钮添加点击处理
    const socialLinks = [
        {
            name: 'twitter',
            icon: <FaTwitter />,
            href: 'https://x.com/WikiTruthLabs',
            label: 'Twitter'
        },
        {
            name: 'telegram',
            icon: <FaTelegram />,
            href: 'https://t.me/+kKfEGJ6Ua2FhYjI1',
            label: 'Telegram'
        },
        {
            name: 'github',
            icon: <FaGithub />,
            href: 'https://github.com/WikiTruth-crypto',
            label: 'GitHub'
        },
        {
            name: 'discord',
            icon: <FaDiscord />,
            href: 'https://discord.gg/KVDs7CFSr2',
            label: 'Discord'
        },
        {
            name: 'email',
            icon: <FaMailBulk />,
            href: 'mailto:wikitruth@proton.me',
            label: 'Email'
        },
        {
            name: 'share',
            icon: <FaShareAlt />,
            href: '#',
            label: 'Share',
            onClick: handleShareClick
        },
    ];

    return (
        <>
            <footer className="w-full bg-black/90 pt-10 pb-8 mt-16 border-t border-white/20">
                <Container>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 border-b border-white/10 pb-6">
                        <Famous className="max-w-2xl"/>
                        {/* 官方社交平台 */}
                        <div className="flex flex-col items-end gap-2">
                            <TextSpan>Social media</TextSpan>
                            <div className="flex items-center gap-1">
                                {socialLinks.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        target={item.name !== 'share' ? "_blank" : undefined}
                                        rel="noopener noreferrer"
                                        onClick={item.onClick}
                                    >
                                        <div className="w-10 h-10 rounded-md flex items-center justify-center opacity-80 hover:text-primary hover:scale-105 transition-all text-lg">
                                            {item.icon}
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Line weight={1} />
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 gap-4">
                        <div className="flex items-center gap-2">
                            <Image src={logoSrc} alt="logo" width={28} height={28} />
                            <TitleBrand size="h4" align="left" lineHeight="normal" tracking="normal">Wiki Truth</TitleBrand>
                        </div>
                        <div className="flex gap-6">
                            {links.map((item, i) => (
                                <a key={i} href={item.href} className="text-white/70 hover:text-primary transition">
                                    <TextSpan>{item.name}</TextSpan>
                                </a>
                            ))}
                        </div>
                    </div>
                </Container>
            </footer>

            {/* 分享弹窗 */}
            <ShareModal
                isOpen={isShareModalOpen}
                onOpenChange={setIsShareModalOpen}
            />
        </>
    );
}

