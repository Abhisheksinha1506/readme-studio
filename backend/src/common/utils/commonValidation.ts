import { z } from 'zod'

export const commonValidations = {
    id: z
        .string()
        .refine((data) => !isNaN(Number(data)), 'ID must be a numeric value')
        .transform(Number)
        .refine((num) => num > 0, 'ID must be a positive number'),
    // Template folder name, e.g. "othneildrew-best-readme-template". Excludes dots and path separators so it is safe to use in file paths.
    templateFolder: z.string().regex(/^[a-z0-9-]+$/, 'ID must contain only lowercase letters, digits and hyphens'),
    // ... other common validations
}
