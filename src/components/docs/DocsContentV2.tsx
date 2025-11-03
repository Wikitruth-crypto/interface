"use client";

import { getContentById } from "./content/contentData";
import { ContentRenderer } from "./ContentRenderer";
import { cn } from "@/lib/utils";
// import useTheme from "@/hooks/useThemeColorClass";

interface DocsContentV2Props {
    currentSection: string;
    setCurrentSection: (section: string) => void;
}

export function DocsContentV2({ currentSection ,setCurrentSection }: DocsContentV2Props) {
    // const { gradientColor, brandColor } = useTheme();
    
    // 从数据中获取内容
    const contentData = getContentById(currentSection);
    
    if (!contentData) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-white mb-4">内容未找到</h2>
                    <p className="text-white/60">请检查页面 ID 是否正确</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* 文档标题 */}
            <div className="mb-8">
                <h1 className={cn(
                    "text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-4",
                    "text-primary"
                )}>
                    {contentData.title}
                </h1>
                <div className="h-1 w-20 bg-gradient-to-r rounded-full"
                    style={{ background: `linear-gradient(to right, var(--primary))` }} />
                
                {/* 分类标签 */}
                <div className="mt-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white/10 text-white/70">
                        {contentData.category}
                    </span>
                </div>
            </div>

            {/* 内容渲染 */}
            <div className="prose prose-invert prose-lg max-w-none">
                <ContentRenderer sections={contentData.content.sections} onJumpToSection={setCurrentSection}/>
            </div>
            
            {/* 标签展示 */}
            {contentData.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-white/10">
                    <h4 className="text-sm font-medium text-white/70 mb-3">相关标签</h4>
                    <div className="flex flex-wrap gap-2">
                        {contentData.tags.map((tag, index) => (
                            <span 
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded text-xs bg-white/5 text-white/60 hover:bg-white/10 transition-colors"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 


