import { z } from 'zod';

/**
 * Create Page Form Validation Schema
 * Define all field validation rules using Zod
 */

// Title validation: 40-150 characters, first character cannot be a number
export const titleSchema = z
    .string()
    .min(1, 'Please enter the title')
    .min(40, 'The title must be at least 40 characters long')
    .max(150, 'The title must not exceed 150 characters')
    .refine(
        (val) => val.length === 0 || isNaN(Number(val[0])),
        'The first character cannot be a number'
    );

// Description validation: 300-1000 characters
export const descriptionSchema = z
    .string()
    .min(1, 'Please enter the description')
    .min(300, 'The description must be at least 300 characters long')
    .max(1000, 'The description must not exceed 1000 characters');

// Type of Crime validation: 1-20 characters, first character cannot be a number
export const typeOfCrimeSchema = z
    .string()
    .min(1, 'Please enter the type of crime')
    .max(20, 'Type of crime must not exceed 20 characters')
    .refine(
        (val) => val.length === 0 || isNaN(Number(val[0])),
        'The first character cannot be a number'
    );

// Price validation: must be >= 0.001 (when required)
export const priceSchema = z
    .string()
    .refine(
        (val) => {
            // Allow empty string (handled by conditional validation in createFormSchema)
            if (!val || val === '') return true;

            const num = Number(val);
            return !isNaN(num) && num >= 0.001;
        },
        'Price must be greater than or equal to 0.001'
    );

// NFT Owner Address validation: Ethereum address format
export const nftOwnerSchema = z
    .string()
    .min(1, 'Please enter the NFT owner address')
    .refine(
        (val) => /^0x[a-fA-F0-9]{40}$/.test(val),
        'Invalid Ethereum address format'
    );

// Country validation
export const countrySchema = z
    .string()
    .min(1, 'Please select a country');

// State/Province validation (optional)
export const stateSchema = z.string().optional();

// Event Date validation
export const eventDateSchema = z
    .string()
    .min(1, 'Please select the event date');

// Label validation: array of strings
export const labelSchema = z
    .array(z.string())
    .min(1, 'Please add at least one label')
    .max(10, 'Maximum 10 labels allowed');

// Image file validation
export const boxImageListSchema = z
    .any()
    .refine(
        (files) => {
            if (!files || !Array.isArray(files)) return false;
            return files.length > 0;
        },
        'Please upload an image'
    );

// Attachment file validation (optional)
export const fileListSchema = z.any().optional();

// Mint Method validation
export const mintMethodSchema = z
    .enum(['create', 'createAndPublish'])
    .default('create');

// Complete Form Validation Schema (with conditional validation)
export const createFormSchema = z.object({
    // BoxInfo related fields
    title: titleSchema,
    description: descriptionSchema,
    typeOfCrime: typeOfCrimeSchema,
    label: labelSchema,
    country: countrySchema,
    state: stateSchema,
    eventDate: eventDateSchema,

    // NFT related fields
    nftOwner: nftOwnerSchema,
    price: priceSchema,
    mintMethod: mintMethodSchema,

    // File related
    boxImageList: boxImageListSchema,
    fileList: fileListSchema,
}).refine(
    (data) => {
        // Conditional validation: price is required when mintMethod is 'create'
        if (data.mintMethod === 'create') {
            return data.price && data.price.trim() !== '';
        }
        // price is optional when mintMethod is 'createAndPublish'
        return true;
    },
    {
        message: 'Price is required when mint method is "Storing"',
        path: ['price'], // Error message shown on price field
    }
);

// Export form data type
export type CreateFormData = z.infer<typeof createFormSchema>;

// Partial Validation Schema (for step-by-step validation)
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

