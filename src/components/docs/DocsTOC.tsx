"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
// import useTheme from "@/hooks/useThemeColorClass";

interface TOCItem {
    id: string;
    title: string;
    level: number;
}

interface DocsTOCProps {
    className?: string;
}

export function DocsTOC({ className }: DocsTOCProps) {
    const [tocItems, setTocItems] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");
    // const { brandColor } = useTheme();

    useEffect(() => {
        // 获取页面中的所有标题
        const headings = Array.from(document.querySelectorAll('h2, h3, h4'));
        const items: TOCItem[] = headings.map((heading, index) => {
            const id = heading.id || `heading-${index}`;
            if (!heading.id) {
                heading.id = id;
            }

            return {
                id,
                title: heading.textContent || '',
                level: parseInt(heading.tagName.substring(1))
            };
        });

        setTocItems(items);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const headings = tocItems.map(item => ({
                id: item.id,
                element: document.getElementById(item.id)
            })).filter(item => item.element);

            let currentActiveId = "";

            for (const heading of headings) {
                if (heading.element) {
                    const rect = heading.element.getBoundingClientRect();
                    if (rect.top <= 100) {
                        currentActiveId = heading.id;
                    }
                }
            }

            setActiveId(currentActiveId);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // 初始化

        return () => window.removeEventListener('scroll', handleScroll);
    }, [tocItems]);

    if (tocItems.length === 0) {
        return null;
    }

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <div className={cn("space-y-2", className)}>
            <h4 className="text-sm font-semibold text-white mb-4">页面导航</h4>
            <nav className="space-y-1">
                {tocItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => scrollToHeading(item.id)}
                        className={cn(
                            "block w-full text-left text-sm transition-colors py-1 px-2 rounded",
                            "hover:bg-white/5",
                            item.level === 2 && "pl-0",
                            item.level === 3 && "pl-4",
                            item.level === 4 && "pl-8",
                            activeId === item.id
                                ? cn(`text-primary `, "bg-white/10")
                                : "text-white/70 hover:text-white"
                        )}
                    >
                        {item.title}
                    </button>
                ))}
            </nav>
        </div>
    );
} 