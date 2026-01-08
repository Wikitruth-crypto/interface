import Logo from "@/components/base/logo";
import LinkList from "@/components/customer/link";
import { Container } from "@/components/Container";
import LoginDropdown from "@/components/login";
import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";

const baseMenuItems = [
    { name: "Marketplace", href: "/" },
    { name: "Create", href: "/create" },
    { name: "Staking", href: "/staking" },
    { name: "DAO", href: "/dao" },
    { name: "Token", href: "/token" },
];

const getDappMenu = () => {
    return baseMenuItems;
};


export default function DappHeader() {
    const [activeKey, setActiveKey] = useState<string>('')
    const location = useLocation();

    const dappMenu = useMemo(() => getDappMenu(), []);

    useEffect(() => {
        // DApp route activation logic
        // Only highlight menu items when the path exactly matches or is a direct child of a menu item
        const currentMenu = dappMenu.find(item => {
            // Exact match for root path
            if (item.href === '/' && location.pathname === '/') return true;
            // For non-root paths, only match if pathname exactly equals the href
            // or if it's a direct child path (e.g., /create matches /create, but not /create/123)
            if (item.href !== '/') {
                // Exact match
                if (location.pathname === item.href) return true;
                // Don't match sub-paths like /boxDetail, /profile, etc.
                return false;
            }
            return false;
        });
        
        if (currentMenu) {
            setActiveKey(currentMenu.name);
        } else {
            // Clear highlight for paths not in menu (e.g., /boxDetail, /profile)
            setActiveKey('');
        }
    }, [location.pathname, dappMenu]);
    
    return (
        <header className="w-full bg-black/70 backdrop-blur sticky top-0 z-50">
            <Container className="py-3 flex items-center justify-between">
                <Logo />
                <nav className="flex gap-2 lg:gap-6 items-center">
                    <LinkList
                        links={dappMenu}
                        onLinkClick={setActiveKey}
                        activeKey={activeKey}
                    />
                    <LoginDropdown size="sm" />
                </nav>
            </Container>
        </header>
    );
}
