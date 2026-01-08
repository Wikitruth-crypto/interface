
import React, { useState } from "react";
import { Link } from "react-router-dom";

export interface LinkItem {
    name: string;
    href: string;
    icon?: React.ReactNode;
}

export interface LinkListProps {
    links: LinkItem[];
    activeKey?: string;
    onLinkClick?: (key: string, href: string) => void;
}

const LinkList: React.FC<LinkListProps> = ({ links, activeKey, onLinkClick }) => {
    // const { brandColor } = useBrandColorStore();
    const [menuOpen, setMenuOpen] = useState(false);
    // const brandClass = brandColor === "green"
    //     ? "text-green-400"
    //     : "text-purple-400";

    // Mobile menu button
    return (
        <>
            {/* Desktop */}
            <nav className="hidden md:flex gap-2 items-center">
                {links.map((item) => (
                    <Link
                        key={item.name}
                        to={item.href}
                        className={`px-3 py-1 rounded-lg transition ${activeKey === item.name ? "text-primary font-bold" : "text-white/90 hover:bg-white/12"}`}
                        onClick={() => onLinkClick?.(item.name, item.href)}
                    >
                        {item.icon && <span className="mr-1">{item.icon}</span>}
                        {item.name}
                    </Link>
                ))}
                {/* <SwitchTheme /> */}
            </nav>
            {/* Mobile */}
            <div className="md:hidden relative">
                <button
                    className="p-2 rounded text-white"
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label="Open menus"
                >
                    {/* Simple hamburger icon */}
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                {menuOpen && (
                    <div className="absolute left-0 top-full mt-2 w-48 bg-black rounded-xl shadow-lg z-50 flex flex-col gap-2 border border-white/10"
                        onClick={e => e.stopPropagation()}>
                        {links.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`block px-4 py-2 rounded-lg text-base text-center transition ${activeKey === item.name ? "text-primary font-bold" : "text-white/90 hover:bg-white/10"}`}
                                onClick={() => {
                                    setMenuOpen(false);
                                    onLinkClick?.(item.name, item.href);
                                }}
                            >
                                {item.icon && <span className="mr-1">{item.icon}</span>}
                                {item.name}
                            </Link>
                        ))}
                        {/* <div className="flex justify-center">
                            <SwitchTheme/>
                        </div> */}
                    </div>
                )}
            </div>
        </>
    );
};

export default LinkList;
