"use client";

import { cn } from "@/lib/utils";
import { Steps } from "./Steps";
import { ImageGallery } from "./ImageGallery";
import { DocSection } from "./content/contentData";
import { ListItem } from "./content/contentData"

interface ContentRendererProps {
    sections: DocSection[];
    onJumpToSection: (section: string) => void;
    className?: string;
}

export function ContentRenderer({ sections, onJumpToSection, className }: ContentRendererProps) {
    const renderSection = (section: DocSection, index: number) => {
        switch (section.type) {
            case 'heading':
                const { level, text } = section.content;
                const headingClasses = {
                    2: "text-2xl font-bold text-white",
                    3: "text-xl font-semibold text-white mt-8",
                    4: "text-lg font-medium text-white mt-6",
                    5: "text-base font-medium text-white mt-4",
                    6: "text-sm font-medium text-white mt-4"
                };
                
                const className = cn(
                    headingClasses[level as keyof typeof headingClasses] || headingClasses[2],
                    section.className
                );

                if (level === 2) return <h2 key={index} className={className}>{text}</h2>;
                if (level === 3) return <h3 key={index} className={className}>{text}</h3>;
                if (level === 4) return <h4 key={index} className={className}>{text}</h4>;
                if (level === 5) return <h5 key={index} className={className}>{text}</h5>;
                if (level === 6) return <h6 key={index} className={className}>{text}</h6>;
                return <h2 key={index} className={className}>{text}</h2>;

            case 'text':
                // 兼容字符串和数组
                if (typeof section.content === "string") {
                    return (
                        <p 
                            key={index}
                            className={cn(
                                "text-white/90 leading-relaxed",
                                section.className
                            )}
                        >
                            {section.content}
                        </p>
                    );
                }
                if (Array.isArray(section.content)) {
                    return (
                        <p 
                            key={index}
                            className={cn(
                                "text-white/90 leading-relaxed",
                                section.className
                            )}
                        >
                            {section.content.map((item, i) => {
                                if (typeof item === "string") return item;
                                if (item.link) {
                                    return (
                                        <button
                                            key={i}
                                            className="text-primary underline cursor-pointer hover:opacity-80"
                                            onClick={() => onJumpToSection?.(item.link.target)}
                                            type="button"
                                        >
                                            {item.link.label}
                                        </button>
                                    );
                                }
                                return null;
                            })}
                        </p>
                    );
                }

            case 'list':
                return (
                    <ul>
                        {section.content.items.map((item: ListItem, i: number) => {
                            if (typeof item === "string") {
                                return <li key={item}>{item}</li>; // 用内容做 key
                            }
                            if (typeof item === "object" && item.text) {
                                // 组合 text 和 link.target 保证唯一性
                                const key = item.text + (item.link?.target || "") + i;
                                return (
                                    <li key={key}>
                                        {item.text}
                                        {item.link && (
                                            <button
                                                className="text-primary underline cursor-pointer ml-1"
                                                onClick={() => onJumpToSection?.(item.link?.target || "")}
                                                type="button"
                                            >
                                                {item.link.label}
                                            </button>
                                        )}
                                    </li>
                                );
                            }
                            return null;
                        })}
                    </ul>
                );

            case 'steps':
                const { current, items: stepItems } = section.content;
                return (
                    <div key={index} className={cn("mt-8", section.className)}>
                        <Steps 
                            items={stepItems}
                            current={current}
                            direction="vertical"
                            className="max-w-4xl"
                        />
                    </div>
                );

            case 'images':
                const { layout, images } = section.content;
                return (
                    <div key={index} className={section.className}>
                        <ImageGallery 
                            images={images}
                            layout={layout}
                        />
                    </div>
                );

            case 'code':
                return (
                    <pre 
                        key={index}
                        className={cn(
                            "bg-white/5 p-4 rounded-lg border border-white/10 overflow-x-auto",
                            section.className
                        )}
                    >
                        <code className="text-sm text-white/90">
                            {section.content}
                        </code>
                    </pre>
                );

            default:
                console.warn(`未知的内容类型: ${section.type}`);
                return null;
        }
    };

    return (
        <div className={cn("space-y-6 text-white/90", className)}>
            {sections.map((section, index) => renderSection(section, index))}
        </div>
    );
} 




