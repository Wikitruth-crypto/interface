import { z } from 'zod';

/**
 * Create 页面表单验证 Schema
 * 使用 Zod 定义所有字段的验证规则
 */

// 标题验证：40-150 字符，首字符不能是数字
export const titleSchema = z
    .string()
    .min(1, 'Please enter the title')
    .min(40, 'The title must be at least 40 characters long')
    .max(150, 'The title must not exceed 150 characters')
    .refine(
        (val) => val.length === 0 || isNaN(Number(val[0])),
        'The first character cannot be a number'
    );

// 描述验证：300-1000 字符
export const descriptionSchema = z
    .string()
    .min(1, 'Please enter the description')
    .min(300, 'The description must be at least 300 characters long')
    .max(1000, 'The description must not exceed 1000 characters');

// 犯罪类型验证：1-20 字符，首字符不能是数字
export const typeOfCrimeSchema = z
    .string()
    .min(1, 'Please enter the type of crime')
    .max(20, 'Type of crime must not exceed 20 characters')
    .refine(
        (val) => val.length === 0 || isNaN(Number(val[0])),
        'The first character cannot be a number'
    );

// 价格验证：必须大于等于 0.001（当需要时）
export const priceSchema = z
    .string()
    .refine(
        (val) => {
            // 允许空字符串（由 createFormSchema 的条件验证处理）
            if (!val || val === '') return true;

            const num = Number(val);
            return !isNaN(num) && num >= 0.001;
        },
        'Price must be greater than or equal to 0.001'
    );

// NFT Owner 地址验证：以太坊地址格式
export const nftOwnerSchema = z
    .string()
    .min(1, 'Please enter the NFT owner address')
    .refine(
        (val) => /^0x[a-fA-F0-9]{40}$/.test(val),
        'Invalid Ethereum address format'
    );

// 国家验证
export const countrySchema = z
    .string()
    .min(1, 'Please select a country');

// 州/省验证（可选）
export const stateSchema = z.string().optional();

// 事件日期验证
export const eventDateSchema = z
    .string()
    .min(1, 'Please select the event date');

// 标签验证：数组，每个元素是字符串
export const labelSchema = z
    .array(z.string())
    .min(1, 'Please add at least one label')
    .max(10, 'Maximum 10 labels allowed');

// 图片文件验证
export const boxImageListSchema = z
    .any()
    .refine(
        (files) => {
            if (!files || !Array.isArray(files)) return false;
            return files.length > 0;
        },
        'Please upload an image'
    );

// 附件文件验证（可选）
export const fileListSchema = z.any().optional();

// Mint 方法验证
export const mintMethodSchema = z
    .enum(['create', 'createAndPublish'])
    .default('create');

// 完整的表单验证 Schema（带条件验证）
export const createFormSchema = z.object({
    // BoxInfo 相关字段
    title: titleSchema,
    description: descriptionSchema,
    typeOfCrime: typeOfCrimeSchema,
    label: labelSchema,
    country: countrySchema,
    state: stateSchema,
    eventDate: eventDateSchema,

    // NFT 相关字段
    nftOwner: nftOwnerSchema,
    price: priceSchema,
    mintMethod: mintMethodSchema,

    // 文件相关
    boxImageList: boxImageListSchema,
    fileList: fileListSchema,
}).refine(
    (data) => {
        // 条件验证：当 mintMethod 为 'create' 时，price 必填
        if (data.mintMethod === 'create') {
            return data.price && data.price.trim() !== '';
        }
        // 当 mintMethod 为 'createAndPublish' 时，price 可选
        return true;
    },
    {
        message: 'Price is required when mint method is "Storing"',
        path: ['price'], // 错误信息显示在 price 字段上
    }
);

// 导出表单数据类型
export type CreateFormData = z.infer<typeof createFormSchema>;

// 部分验证 Schema（用于分步验证）
export const step1Schema = z.object({
    title: titleSchema,
    description: descriptionSchema,
    typeOfCrime: typeOfCrimeSchema,
});

export const step2Schema = z.object({
    label: labelSchema,
    country: countrySchema,
    state: stateSchema,
    eventDate: eventDateSchema,
});

export const step3Schema = z.object({
    nftOwner: nftOwnerSchema,
    price: priceSchema,
    boxImageList: boxImageListSchema,
});

