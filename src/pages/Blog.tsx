import BlogNews from "@/components/sections/BlogNews";
import AIResearchBlogSection from "@/components/sections/AIResearch";

export default function BlogPage() {
    return (
        <div className="w-full max-w-full overflow-hidden py-10">
            <AIResearchBlogSection />
            <BlogNews />
        </div>
    )
}

