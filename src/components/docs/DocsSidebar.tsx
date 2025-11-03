"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { docsNavigation, type DocSection } from "./docsData";
// import useTheme from "@/hooks/useThemeColorClass";

interface DocsSidebarProps {
    currentSection: string;
    onSectionChange: (sectionId: string) => void;
    className?: string;
}

export function DocsSidebar({ currentSection, onSectionChange, className }: DocsSidebarProps) {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(
        new Set(["introduction", "whitepaper"]) // 默认展开前两个部分
    );
    // const { brandColor } = useTheme();
    const brandColorClass = `text-primary`;
    const textColorClass = "text-white/80";

    const toggleSection = (sectionId: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(sectionId)) {
            newExpanded.delete(sectionId);
        } else {
            newExpanded.add(sectionId);
        }
        setExpandedSections(newExpanded);
    };

    const renderSection = (section: DocSection, level = 0) => {
        const hasChildren = section.children && section.children.length > 0;
        const isExpanded = expandedSections.has(section.id);
        const isActive = currentSection === section.id;
        const isChildActive = section.children?.some(child => child.id === currentSection);

        return (
            <div key={section.id} className="space-y-1">
                <div
                    className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all",
                        "hover:bg-white/5",
                        level === 0 ? "font-medium" : "font-normal text-sm",
                        isActive && cn(brandColorClass, "bg-white/10"),
                        isChildActive && !isActive && "bg-white/5",
                        !isActive && textColorClass
                    )}
                    style={{ paddingLeft: `${12 + level * 16}px` }}
                    onClick={() => {
                        if (hasChildren) {
                            toggleSection(section.id);
                        } else {
                            onSectionChange(section.id);
                        }
                    }}
                >
                    {hasChildren && (
                        <div className="flex-shrink-0">
                            {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </div>
                    )}
                    <span className="flex-1">{section.title}</span>
                </div>

                {hasChildren && isExpanded && (
                    <div className="space-y-1">
                        {section.children?.map(child => renderSection(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <nav className={cn("space-y-2", className)}>
            <div className="px-3 py-2">
                <h2 className={cn("text-lg font-bold", textColorClass)}>
                    文档导航
                </h2>
            </div>
            <div className="space-y-1">
                {docsNavigation.map(section => renderSection(section))}
            </div>
        </nav>
    );
} 