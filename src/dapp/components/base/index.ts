// 基础组件导出
export { default as FundsSection } from '../fundsSection';
export { default as BoxImage } from './boxImage';
export { default as BoxInfo } from './boxInfo';
export { default as BaseButton } from './baseButton';
export { default as InputArea } from './inputArea';
export { default as InputBox, InputText } from './inputBox';
export { default as InputNumber } from './inputNumber';
export { default as PaginationBase } from './pagination';
export { default as ProgressBar } from './progressBar';
export { default as SkeletonCard } from './skeletonCard';
export { default as SkeletonProfile } from './skeletonProfile';
export { default as ResultItem } from './alertResult';
export { default as PriceText } from './priceLabel';
export { default as InfiniteScroll } from './infiniteScroll';
// export { default as FileUploadButton } from '../fileUploadButton';

// 新增的重构组件
export { default as CommonSelect } from './CommonSelect';
// export { default as AlertBox } from './alertBox';
export { default as SearchBox } from './searchBox';

// 骨架屏基础组件导出
export {
    Skeleton,
    SkeletonLine,
    SkeletonCircle,
    SkeletonBlock,
    SkeletonParagraph,
    SkeletonButton,
    SkeletonAvatar
} from './skeletonBase';

// 导出类型
export type { FundsSectionProps, TokenInfo } from '../fundsSection';
export type { BoxImageProps } from './boxImage';
export type { BoxInfoProps, BoxMetadata } from './boxInfo';
export type { InputAreaProps } from './inputArea';
export type { InputBoxProps } from './inputBox';
export type { InputNumberProps } from './inputNumber';
export type { Props as PaginationProps } from './pagination';
export type { ProgressBarProps } from './progressBar';
export type { SkeletonCardProps } from './skeletonCard';
export type { SkeletonProfileProps } from './skeletonProfile';
export type {
    SkeletonProps,
    SkeletonLineProps,
    SkeletonCircleProps,
    SkeletonBlockProps
} from './skeletonBase';
export type { ResultItemProps } from './alertResult';
export type { PriceTextProps, TokenInfo as PriceTokenInfo } from './priceLabel';
export type { InfiniteScrollProps } from './infiniteScroll';
// export type { FileUploadButtonProps, UploadFile } from '../fileUploadButton';

// 新增重构组件的类型
export type { CommonSelectOption, CommonSelectProps } from './CommonSelect';
// export type { AlertBoxProps } from './alertBox';
export type { SearchResult, SearchBoxProps } from './searchBox';