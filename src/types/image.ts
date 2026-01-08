// Vite compatible image type definition
export interface StaticImageData {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
  placeholder?: 'blur' | 'empty';
}

export default StaticImageData;
