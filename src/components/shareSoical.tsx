import React from 'react';
import { FaTwitter, FaFacebook, FaTelegram } from 'react-icons/fa';

// const DISCORD_INVITE_URL = 'https://discord.com/invite/your-invite-code';

interface ShareSocialProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    className?: string;
}

const platforms = [
    {
        name: 'Twitter',
        icon: <FaTwitter className="w-5 h-5 md:w-6 md:h-6" />,
        getUrl: (title: string, url: string, ) =>
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        color: 'hover:bg-primary/10 text-primary'
    },
    {
        name: 'Facebook',
        icon: <FaFacebook className="w-5 h-5 md:w-6 md:h-6" />,
        getUrl: (_title: string, url: string,) =>
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        color: 'hover:bg-primary/10 text-primary'
    },
    {
        name: 'Telegram',
        icon: <FaTelegram className="w-5 h-5 md:w-6 md:h-6" />,
        getUrl: (title: string, url: string,) =>
            `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        color: 'hover:bg-primary/10 text-primary'
    },
    // {
    //     name: 'Discord',
    //     icon: <FaDiscord className="w-5 h-5 md:w-6 md:h-6" />,
    //     getUrl: () => DISCORD_INVITE_URL,
    //     color: 'hover:bg-[#5865f2]/10 text-[#5865f2]'
    // },
];

export const ShareSocial: React.FC<ShareSocialProps> = ({
    title = '',
    description = '',
    // image = '',
    url = '',
    className = ''
}) => {
    const shareTitle = title || description || '';
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    // const shareImage = image || '';
    
    return (
        <div className={`flex w-full flex-row gap-3 md:gap-4 justify-center items-center ${className}`}>
            {platforms.map((platform) => (
                <a
                    key={platform.name}
                    href={platform.getUrl(shareTitle, shareUrl,)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Share to ${platform.name}`}
                    className={`rounded-full p-1 md:p-2 shadow-sm transition-colors duration-150 ${platform.color} hover:text-primary hover:scale-105`}
                >
                    <div className='w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-muted-foreground hover:text-primary '>
                        {platform.icon}
                    </div>
                </a>
            ))}
        </div>
    );
};

export default ShareSocial;