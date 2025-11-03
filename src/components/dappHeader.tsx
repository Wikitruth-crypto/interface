import Logo from "@/components/base/logo";
import LinkList from "@/components/customer/link";
import { Container } from "@/components/Container";
import { ConnectWallet } from "@/dapp/components/base/connectWallet";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const dappMenu = [
    { name: "Marketplace", href: "/app" },
    { name: "Create", href: "/app/create" },
    { name: "Staking", href: "/app/staking" },
    { name: "DAO", href: "/app/dao" },
    { name: "Token", href: "/app/token" },
    { name: "Profile", href: "/app/profile" },
];



export default function DappHeader() {
    const [activeKey, setActiveKey] = useState<string>('Home')
    const location = useLocation();

    useEffect(() => {
        // DApp路由的激活逻辑
        const currentMenu = dappMenu.find(item => {
            if (item.href === '/app' && location.pathname === '/app') return true;
            if (item.href !== '/app' && location.pathname.startsWith(item.href)) return true;
            return false;
        });
        if (currentMenu) {
            setActiveKey(currentMenu.name);
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
                    <ConnectWallet />
                </nav>
            </Container>
        </header>
    );
}
