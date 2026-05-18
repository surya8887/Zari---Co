import prisma from "../../../config/db.js";
import type { Product } from "../catalog.type.js";
import ApiError from "../../../shared/exceptions/apiError.js";

// Create a new product in the database
export const createProduct = async (product: Product) => {
  try {
    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        description: product.description || "",
        categoryId: product.categoryId,
        basePrice: product.basePrice,
        sku: product.sku,
        isPublished: product.isPublished,
        slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      }
    });
    return createdProduct;
  } catch (error) {
    throw new ApiError(500, "Product creation failed in database service");
  }
};

// Retrieve all non-deleted products with optional pagination
export const getAllProducts = async (page: number = 1, limit: number = 50) => {
  try {
    const skip = (page - 1) * limit;
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          deletedAt: null
        },
        orderBy: {
          createdAt: "desc"
        },
        skip,
        take: limit,
        include: {
          category: true,
          variants: true,
          images: true
        }
      }),
      prisma.product.count({
        where: {
          deletedAt: null
        }
      })
    ]);

    return { products, total };
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve products from database");
  }
};

// Get a single product by its UUID
export const getProductById = async (id: string) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id,
        deletedAt: null
      },
      include: {
        category: true,
        variants: true,
        images: true
      }
    });

    if (!product) {
      throw new ApiError(404, "Product not found in database");
    }

    return product;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Error fetching product from database");
  }
};

// Update an existing product
export const updateProductById = async (id: string, data: Partial<Product>) => {
  try {
    // Check if product exists
    await getProductById(id);

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.basePrice !== undefined) updateData.basePrice = data.basePrice;
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;
    if (data.slug !== undefined) updateData.slug = data.slug;

    const updated = await prisma.product.update({
      where: { id },
      data: updateData
    });

    return updated;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to update product details");
  }
};

// Soft delete a product by setting deletedAt
export const deleteProductById = async (id: string) => {
  try {
    await getProductById(id);

    const deleted = await prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    return deleted;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to delete product from database");
  }
};
