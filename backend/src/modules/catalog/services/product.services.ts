import prisma from "../../../config/db.js";
import type {Product} from "../catalog.type.js"
import ApiError from "../../../shared/exceptions/apiError.js";
export const createProduct = async (product: Product) => {
    try {
        const createdProduct = await prisma.product.create({
            data: {
                name: product.name,
                description: product.description,
                categoryId: product.categoryId,
                basePrice: product.basePrice,
                sku: product.sku,
                isPublished: product.isPublished,
                slug: product.slug || ""
            } as any
        });
        return createdProduct;
    } catch (error) {
       throw new ApiError(500, "Product creation failed" as any);
    }
};
