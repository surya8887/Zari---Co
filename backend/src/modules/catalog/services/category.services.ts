import prisma from "../../../config/db.js";
import ApiError from "../../../shared/exceptions/apiError.js";

import type { CreateCategory, UpdateCategory } from "../catalog.type.js";

export const createCategoryService = async ({ name, slug, description, isPublished, parentId, sortOrder }: CreateCategory) => {
    // We don't need manual validation here because Zod already validated the inputs in the controller.
    
    const category = await prisma.category.create({
        data: {
            name,
            slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''), // Auto-generate slug if not provided
            description: description ?? null,
            isPublished: isPublished ?? false,
            parentId: parentId ?? null,
            sortOrder: sortOrder ?? 0
        }
    });
    
    return category;
};

export const getAllCategories = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
        prisma.category.findMany({
            where: { deletedAt: null },
            skip,
            take: limit,
            orderBy: { sortOrder: 'asc' }
        }),
        prisma.category.count({
            where: { deletedAt: null }
        })
    ]);

    return { categories, total };
};

export const getCategoryById = async (id: string) => {
    const category = await prisma.category.findFirst({
        where: { id, deletedAt: null }
    });
    if (!category) throw new ApiError(404, "Category not found");
    return category;
};

export const updateCategoryById = async (id: string, params: UpdateCategory) => {
    const data: any = {};
    
    if (params.name !== undefined) {
        data.name = params.name;
        if (!params.slug) {
            data.slug = params.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }
    }
    if (params.slug !== undefined) data.slug = params.slug;
    if (params.description !== undefined) data.description = params.description ?? null;
    if (params.isPublished !== undefined) data.isPublished = params.isPublished;
    if (params.parentId !== undefined) data.parentId = params.parentId ?? null;
    if (params.sortOrder !== undefined) data.sortOrder = params.sortOrder;

    const category = await prisma.category.update({
        where: { id },
        data
    });
    return category;
};

export const deleteCategoryById = async (id: string) => {
    // Soft delete
    const category = await prisma.category.update({
        where: { id },
        data: { deletedAt: new Date() }
    });
    return category;
};  
