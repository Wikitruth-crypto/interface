import { cn } from "@/lib/utils";

interface ImageItem {
    src: string;
    alt: string;
    caption?: string;
    rotate?: number;
}

interface ImageGalleryProps {
    images: ImageItem | ImageItem[];
    layout?: 'single' | 'double' | 'triple' | 'grid';
    className?: string;
    imageClassName?: string;
    captionClassName?: string;
}

export function ImageGallery({ 
    images, 
    layout = 'single',
    className,
    imageClassName,
    captionClassName 
}: ImageGalleryProps) {

    const getImageSrc = (src: string | { default: string; purple: string }) => {
        if (typeof src === "string") return src;
        // 只对 logo 这样结构的对象做处理
        return src.default || src.purple || "";
    };

    const getImageStyle = (rotate: number) => {
        return {
            transform: `rotate(${rotate}deg)`
        }
    }


    // Convert single image to array for consistent handling
    const imageArray = Array.isArray(images) ? images : [images];
    
    // Auto-detect layout based on image count if not specified
    const autoLayout = layout === 'single' && imageArray.length > 1 
        ? imageArray.length === 2 ? 'double' : imageArray.length === 3 ? 'triple' : 'grid'
        : layout;

    const renderImage = (image: ImageItem, index: number) => (
        <div key={index} className="flex flex-col items-center">
            <div 
            className={cn(
                "relative overflow-hidden rounded-lg border border-white/10 bg-white/5",
                "w-full h-auto object-cover",
                imageClassName
            )}
            >
                <img
                    src={getImageSrc(image.src)}
                    alt={image.alt}
                    className="w-full h-auto object-cover"
                    style={getImageStyle(image.rotate || 0)}
                    loading={index === 0 ? "eager" : "lazy"}
                />
            </div>
            {image.caption && (
                <p className={cn(
                    "mt-2 text-sm text-white/70 text-center",
                    captionClassName
                )}>
                    {image.caption}
                </p>
            )}
        </div>
    );

    const renderLayout = () => {
        switch (autoLayout) {
            case 'single':
                return (
                    <div className="w-full flex justify-center">
                        <div className="max-w-2xl w-full">
                            {renderImage(imageArray[0], 0)}
                        </div>
                    </div>
                );

            case 'double':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        {imageArray.slice(0, 2).map((image, index) => renderImage(image, index))}
                    </div>
                );

            case 'triple':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {imageArray.slice(0, 3).map((image, index) => renderImage(image, index))}
                    </div>
                );

            case 'grid':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                        {imageArray.map((image, index) => renderImage(image, index))}
                    </div>
                );

            default:
                return renderImage(imageArray[0], 0);
        }
    };

    return (
        <div className={cn(
            "w-full my-8",
            className
        )}>
            {renderLayout()}
        </div>
    );
}

// 便捷的导出组件，用于不同的布局场景
export function SingleImage(props: Omit<ImageGalleryProps, 'layout'>) {
    return <ImageGallery {...props} layout="single" />;
}

export function DoubleImages(props: Omit<ImageGalleryProps, 'layout'>) {
    return <ImageGallery {...props} layout="double" />;
}

export function TripleImages(props: Omit<ImageGalleryProps, 'layout'>) {
    return <ImageGallery {...props} layout="triple" />;
}

export function ImageGrid(props: Omit<ImageGalleryProps, 'layout'>) {
    return <ImageGallery {...props} layout="grid" />;
} 