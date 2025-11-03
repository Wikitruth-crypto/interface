"use client";

import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { Drawer } from "antd";
import { DocsSidebar } from "./DocsSidebar";
// import { DocsContent } from "./DocsContent";
import { DocsContentV2 } from "./DocsContentV2";
import { DocsTOC } from "./DocsTOC";
import { DocsSearch } from "./DocsSearch";
import { Container } from "@/components/Container";
import { cn } from "@/lib/utils";

export function DocsLayout() {
    const [currentSection, setCurrentSection] = useState("overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="py-5">
            {/* 头部区域 */}
            <Container>
            <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <Container>
                    <div className="flex items-center justify-center h-16 px-4">
                        {/* 移动端菜单按钮 */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="mr-4 lg:hidden p-2 hover:bg-white/10 rounded-md transition-colors"
                        >
                            <Menu className="h-6 w-6 text-white" />
                            <span className="sr-only">Open sidebar</span>
                        </button>

                        <Drawer
                            title="文档导航"
                            placement="left"
                            onClose={() => setSidebarOpen(false)}
                            open={sidebarOpen}
                            width={320}
                            styles={{
                                body: { padding: 0 },
                                header: { borderBottom: '1px solid rgba(255,255,255,0.1)' }
                            }}
                        >
                            <div className="overflow-y-auto h-full px-6 py-6">
                                <DocsSidebar
                                    currentSection={currentSection}
                                    onSectionChange={(section) => {
                                        setCurrentSection(section);
                                        setSidebarOpen(false);
                                    }}
                                />
                            </div>
                        </Drawer>

                        {/* 居中搜索框 */}
                        <div className="flex-1 max-w-md mx-auto">
                            <DocsSearch onSectionChange={setCurrentSection} />
                        </div>
                    </div>
                </Container>
            </header>

            {/* 主内容区域 - 全宽布局 */}
            <div className="flex flex-1 min-h-0 w-full">
                {/* 桌面端侧边栏 - 固定宽度 */}
                <aside className="hidden lg:flex lg:flex-col lg:w-80 lg:flex-shrink-0 lg:border-r lg:border-white/10 lg:bg-background/50 lg:backdrop-blur overflow-y-auto">
                    <div className="p-6">
                        <DocsSidebar
                            currentSection={currentSection}
                            onSectionChange={setCurrentSection}
                        />
                    </div>
                </aside>

                {/* 主内容区域 - 占用剩余空间，宽度固定 */}
                <main className="flex-1 min-w-0 overflow-auto">
                    <Container className="py-8 lg:py-12 h-full">
                        <DocsContentV2 currentSection={currentSection} setCurrentSection={setCurrentSection} />
                    </Container>
                </main>
            </div>
            </Container>
        </div>
    );
} 




