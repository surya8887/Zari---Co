import { z } from "zod";

const queryBoolean = z
    .enum(["true", "false"])
    .optional()
    .transform((val) => (val === undefined ? undefined : val === "true"));

const queryNumber = (defaultValue: number, max?: number) =>
    z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : defaultValue))
        .pipe(max ? z.number().int().min(1).max(max) : z.number().int().min(1));

export const idParamSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid ID format"),
    }),
});

// ==========================================
// Category Validations
// ==========================================
export const createCategorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
    slug: z.string().optional(),
    description: z.string().optional(),
    isPublished: z.boolean().default(false),
    parentId: z.string().uuid("Invalid parent ID format").optional(),
    sortOrder: z.number().int().default(0),
});

export const updateCategorySchema = createCategorySchema.partial();

export const getAllCategoriesSchema = z.object({
    query: z.object({
        page: queryNumber(1),
        limit: queryNumber(10, 100),
    }),
});


// ==========================================
// Product Components Validations
// ==========================================
export const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    categoryId: z.string().uuid("Category ID must be a valid UUID"),
    slug: z.string().optional(),
    description: z.string().optional(),
    basePrice: z.number().min(0, "Base price cannot be negative"),
    sku: z.string().min(1, "Product base SKU is required"),
    isPublished: z.boolean().default(false),
});

export const productVariantSchema = z.object({
    name: z.string().min(1, "Product variant name is required"),
    sku: z.string().min(1, "Variant SKU is required"),
    priceOverride: z.number().min(0).optional().nullable(),
    isActive: z.boolean().default(true),
    // The DB stores 'attributes' as JSON. A record maps cleanly to Prisma's Json wrapper.
    attributes: z.record(z.string(), z.unknown()).default({}),
});

export const createImageSchema = z.object({
    imageUrl: z.string().url("Must be a valid URL"),
    altText: z.string().optional(),
    isPrimary: z.boolean().default(false),
    sortOrder: z.number().int().default(0),
});


// ==========================================
// Product Aggregate Validations
// ==========================================
export const createProductSchema = z.object({
    product: productSchema,
    // Enforcing schema design rule: Every product needs at least one variant.
    variants: z.array(productVariantSchema).min(1, "At least one variant (default) is required"),
    images: z.array(createImageSchema).optional(),
}).refine(
    (value) => (value.images ?? []).filter((image) => image.isPrimary).length <= 1,
    { path: ["images"], message: "Only one primary image is allowed" },
);

const updateProductVariantSchema = productVariantSchema.partial().extend({
    id: z.string().uuid("Variant ID must be a valid UUID"),
});

const updateProductImageSchema = createImageSchema.partial().extend({
    id: z.string().uuid("Image ID must be a valid UUID"),
});

export const updateProductSchema = z.object({
    product: productSchema.partial().optional(),
    variants: z.object({
        create: z.array(productVariantSchema).optional(),
        update: z.array(updateProductVariantSchema).optional(),
        delete: z.array(z.string().uuid("Variant ID must be a valid UUID")).optional(),
    }).optional(),
    images: z.object({
        create: z.array(createImageSchema).optional(),
        update: z.array(updateProductImageSchema).optional(),
        delete: z.array(z.string().uuid("Image ID must be a valid UUID")).optional(),
    }).optional(),
}).refine(
    (value) => {
        const imageCreates = value.images?.create ?? [];
        const imageUpdates = value.images?.update ?? [];
        return [...imageCreates, ...imageUpdates].filter((image) => image.isPrimary).length <= 1;
    },
    { path: ["images"], message: "Only one primary image can be set in a single request" },
);

export const getAllProductsSchema = z.object({
    query: z.object({
        page: queryNumber(1),
        limit: queryNumber(10, 100),
        categoryId: z.string().uuid("Invalid category ID format").optional(),
        search: z.string().trim().min(1).optional(),
        isPublished: queryBoolean,
        includeDeleted: queryBoolean.default(false),
    }),
});
