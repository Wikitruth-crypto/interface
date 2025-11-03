// Vite 兼容的图片类型定义
export interface StaticImageData {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
  placeholder?: 'blur' | 'empty';
}

export default StaticImageData;
