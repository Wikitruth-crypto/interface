"use client"

import React from 'react';
import { Modal, message } from 'antd';
import { FaTwitter, FaTelegram, FaFacebook, FaShareAlt } from 'react-icons/fa';

interface ShareModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    url?: string;
    title?: string;
}

/**
 * 分享弹窗 - 基于 antd Modal 组件
 * 1. 分享的内容：标题、描述、图片、链接
 * 2. 分享平台：twitter、Facebook、telegram
 */
const ShareModal: React.FC<ShareModalProps> = ({ 
    isOpen, 
    onOpenChange,
    url = typeof window !== 'undefined' ? window.location.href : '', 
    title = 'Wiki Truth - Web3 正义事业平台' 
}) => {
    // 编码 URL 和标题
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    // 各平台分享链接
    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    };

    // 分享平台配置
    const platforms = [
        {
            name: 'twitter',
            icon: <FaTwitter />,
            label: 'Twitter',
            link: shareLinks.twitter,
            bgColor: 'hover:bg-blue-500',
            onClick: () => handleShare(shareLinks.twitter),
        },
        {
            name: 'facebook',
            icon: <FaFacebook />,
            label: 'Facebook',
            link: shareLinks.facebook,
            bgColor: 'hover:bg-blue-600',
            onClick: () => handleShare(shareLinks.facebook),
        },
        {
            name: 'telegram',
            icon: <FaTelegram />,
            label: 'Telegram',
            link: shareLinks.telegram,
            bgColor: 'hover:bg-blue-400',
            onClick: () => handleShare(shareLinks.telegram),
        },
        {
            name: 'copy',
            icon: <FaShareAlt />,
            label: 'Copy Link',
            link: '#',
            bgColor: 'hover:bg-green-500',
            onClick: handleCopyLink,
        },
    ];

    // 分享跳转
    function handleShare(link: string) {
        window.open(link, '_blank', 'width=600,height=400');
        onOpenChange(false);
    }

    // 复制链接
    async function handleCopyLink() {
        try {
            await navigator.clipboard.writeText(url);
            message.success('Link copied!');
            onOpenChange(false);
        } catch (err) {
            message.error('Copy failed');
        }
    }

    return (
        <Modal
            open={isOpen}
            onCancel={() => onOpenChange(false)}
            footer={null}
            centered
            title={<span className="font-semibold text-lg">Share to Social Media</span>}
            className="!p-0"
        >
            {/* 分享内容预览 */}
            <div className="mb-4 p-4 bg-card rounded-lg border border-border">
                <h4 className="font-medium text-sm mb-1">Share Content</h4>
                <p className="text-gray-400 text-sm mb-2">{title}</p>
                <p className="text-gray-400 text-xs break-all">{url}</p>
                <p className="text-gray-500 text-xs mt-2">
                    * The share card content is determined by the page metadata
                </p>
            </div>

            {/* 分享按钮网格 */}
            <div className="grid grid-cols-2 gap-3">
                {platforms.map((platform) => (
                    <button
                        key={platform.name}
                        onClick={platform.onClick}
                        className={`
                            flex items-center gap-3 p-3 rounded-lg bg-background border border-border
                            hover:bg-primary/10 transition-all duration-200 group
                            ${platform.bgColor}
                        `}
                    >
                        <div className="text-xl group-hover:scale-110 transition-transform">
                            {platform.icon}
                        </div>
                        <span className="font-medium text-sm">{platform.label}</span>
                    </button>
                ))}
            </div>
        </Modal>
    );
};

export default ShareModal;




