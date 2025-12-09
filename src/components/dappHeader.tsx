import Logo from "@/components/base/logo";
import LinkList from "@/components/customer/link";
import { Container } from "@/components/Container";
import LoginDropdown from "@/dapp/components/login";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const dappMenu = [
    { name: "Marketplace", href: "/app" },
    { name: "Create", href: "/app/create" },
    { name: "Staking", href: "/app/staking" },
    { name: "DAO", href: "/app/dao" },
    { name: "Token", href: "/app/token" },
    { name: "Tests", href: "/app/tests" },
    // { name: "Account Query Test", href: "/app/accountQueryTest" },
];



export default function DappHeader() {
    const [activeKey, setActiveKey] = useState<string>('Marketplace')
    const location = useLocation();

    useEffect(() => {
        // DApp route activation logic
        const currentMenu = dappMenu.find(item => {
            // Exact match /app
            if (item.href === '/app' && location.pathname === '/app') return true;
            // Match other paths (e.g., /app/create, /app/boxDetail/1)
            if (item.href !== '/app' && location.pathname.startsWith(item.href)) return true;
            // Special handling: boxDetail path should highlight Marketplace or other appropriate menu items
            if (location.pathname.startsWith('/app/boxDetail')) {
                // Can be set to not activate any item, or activate Marketplace
                return false;
            }
            return false;
        });
        if (currentMenu) {
            setActiveKey(currentMenu.name);
        } else if (location.pathname.startsWith('/app/boxDetail')) {
            // BoxDetail page can keep the current activated item, or set to Marketplace
            setActiveKey('Marketplace');
        }
    }, [location.pathname]);
    
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
