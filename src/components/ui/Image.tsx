import React, { ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Image 组件 - Vite 兼容的图片组件
 * 
 * 这是一个简单的图片包装组件，用于处理 Vite 环境下的图片加载
 * 支持所有标准 HTML img 属性
 * 
 * @example
 * ```tsx
 * <Image 
 *   src="/images/example.jpg" 
 *   alt="Example" 
 *   width={400}
 *   height={300}
 *   className="rounded-lg"
 * />
 * ```
 */
interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'scale-down';
  objectPosition?: string;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      className,
      priority = false,
      fill = false,
      objectFit = 'cover',
      objectPosition = 'center',
      style,
      ...props
    },
    ref
  ) => {
    // 处理 fill 模式
    if (fill) {
      return (
        <img
          ref={ref}
          src={src}
          alt={alt}
          className={cn(
            'absolute inset-0 w-full h-full',
            className
          )}
          style={{
            objectFit,
            objectPosition,
            ...style,
          }}
          loading={priority ? 'eager' : 'lazy'}
          {...props}
        />
      );
    }

    // 处理固定尺寸模式
    const sizeStyle: React.CSSProperties = {};
    if (width) {
      sizeStyle.width = typeof width === 'number' ? `${width}px` : width;
    }
    if (height) {
      sizeStyle.height = typeof height === 'number' ? `${height}px` : height;
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn(
          'inline-block',
          className
        )}
        style={{
          ...sizeStyle,
          objectFit,
          objectPosition,
          ...style,
        }}
        loading={priority ? 'eager' : 'lazy'}
        {...props}
      />
    );
  }
);

Image.displayName = 'Image';

export default Image;

