import React, { ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Image component - Vite compatible image component
 * 
 * This is a simple image wrapper component for handling image loading in the Vite environment
 * Supports all standard HTML img attributes
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
    // Handle fill mode
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

    // Handle fixed size mode
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

