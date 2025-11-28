import Logo from "@/components/base/logo";
import LinkList from "@/components/customer/link";
import { Container } from "@/components/Container";
import { ConnectButtonComponent } from "@/dapp/context/connectWallet/connectButton";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const dappMenu = [
    { name: "Marketplace", href: "/app" },
    { name: "Create", href: "/app/create" },
    { name: "Staking", href: "/app/staking" },
    { name: "DAO", href: "/app/dao" },
    { name: "Token", href: "/app/token" },
    { name: "Profile", href: "/app/profile" },
    { name: "Tests", href: "/app/tests" },
    // { name: "Account Query Test", href: "/app/accountQueryTest" },
];



export default function DappHeader() {
    const [activeKey, setActiveKey] = useState<string>('Marketplace')
    const location = useLocation();

    useEffect(() => {
        // DApp路由的激活逻辑
        const currentMenu = dappMenu.find(item => {
            // 精确匹配 /app
            if (item.href === '/app' && location.pathname === '/app') return true;
            // 匹配其他路径（如 /app/create, /app/boxDetail/1 等）
            if (item.href !== '/app' && location.pathname.startsWith(item.href)) return true;
            // 特殊处理：boxDetail 路径应该高亮 Marketplace 或其他合适的菜单项
            if (location.pathname.startsWith('/app/boxDetail')) {
                // 可以设置为不激活任何项，或者激活 Marketplace
                return false;
            }
            return false;
        });
        if (currentMenu) {
            setActiveKey(currentMenu.name);
        } else if (location.pathname.startsWith('/app/boxDetail')) {
            // BoxDetail 页面可以保持当前激活项，或者设置为 Marketplace
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
                    <ConnectButtonComponent 
                    size="sm"
                    />
                </nav>
            </Container>
        </header>
    );
}
