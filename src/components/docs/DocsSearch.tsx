"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { docsNavigation, getDocById } from "./docsData";
import { getSearchData } from "./content/contentData";
// import useTheme from "@/hooks/useThemeColorClass";

interface SearchResult {
    id: string;
    title: string;
    content: string;
    category: string;
}

interface DocsSearchProps {
    onSectionChange: (sectionId: string) => void;
    className?: string;
}

export function DocsSearch({ onSectionChange, className }: DocsSearchProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    // const { brandColor } = useTheme();

    // 从内容数据中获取搜索数据
    const searchData: SearchResult[] = getSearchData().map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        category: item.category
    }));

    useEffect(() => {
        if (query.trim() === "") {
            setResults([]);
            return;
        }

        const filtered = searchData.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.content.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );

        setResults(filtered.slice(0, 8)); // 限制显示结果数量
    }, [query]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleSelect = (sectionId: string) => {
        onSectionChange(sectionId);
        setIsOpen(false);
        setQuery("");
    };

    return (
        <>
            {/* 搜索触发器 */}
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "flex items-center w-full max-w-md px-3 py-2 text-sm",
                    "bg-white/5 border border-white/10 rounded-lg",
                    "text-white/60 hover:text-white transition-colors",
                    className
                )}
            >
                <Search className="h-4 w-4 mr-2" />
                <span className="flex-1 text-left">搜索文档...</span>
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs bg-white/10 rounded">
                    ⌘K
                </kbd>
            </button>

            {/* 搜索弹框 */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20">
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="relative w-full max-w-2xl bg-background border border-white/10 rounded-lg shadow-xl">
                        {/* 搜索输入 */}
                        <div className="flex items-center border-b border-white/10 px-4">
                            <Search className="h-4 w-4 text-white/60 mr-3" />
                            <input
                                type="text"
                                placeholder="搜索文档内容..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-1 py-4 bg-transparent text-white placeholder:text-white/60 focus:outline-none"
                                autoFocus
                            />
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 text-white/60 hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* 搜索结果 */}
                        <div className="max-h-96 overflow-y-auto p-2">
                            {results.length > 0 ? (
                                <div className="space-y-1">
                                    {results.map((result) => (
                                        <button
                                            key={result.id}
                                            onClick={() => handleSelect(result.id)}
                                            className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors group"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className={cn(
                                                    "font-medium group-hover:text-white transition-colors",
                                                    `text-primary`
                                                )}>
                                                    {result.title}
                                                </h4>
                                                <span className="text-xs text-white/40">
                                                    {result.category}
                                                </span>
                                            </div>
                                            <p className="text-sm text-white/60 line-clamp-2">
                                                {result.content}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            ) : query.trim() !== "" ? (
                                <div className="text-center py-8 text-white/60">
                                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p>未找到相关内容</p>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-white/60">
                                    <p>输入关键词开始搜索</p>
                                </div>
                            )}
                        </div>

                        {/* 搜索提示 */}
                        <div className="border-t border-white/10 px-4 py-2">
                            <div className="flex items-center justify-between text-xs text-white/40">
                                <span>使用 ↑↓ 导航，回车选择</span>
                                <span>ESC 关闭</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 

