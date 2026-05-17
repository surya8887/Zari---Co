import prisma from "../../../config/db.js";
import ApiError from "../../../shared/exceptions/apiError.js";
import type {
  createProductSchema,
  updateProductSchema,
} from "../catalog.validation.js";
import type { z } from "zod";

type CreateProductInput = z.infer<typeof createProductSchema>;
type UpdateProductInput = z.infer<typeof updateProductSchema>;

const productInclude: any = {
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
      isPublished: true,
    },
  },
  variants: {
    orderBy: { createdAt: "asc" },
    include: {
      inventory: true,
    },
  },
  images: {
    orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
  },
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const normalizeProductData = (product: Record<string, any>) => {
  const data: Record<string, unknown> = {};

  if (product.name !== undefined) data.name = product.name;
  if (product.categoryId !== undefined) data.categoryId = product.categoryId;
  if (product.description !== undefined) data.description = product.description ?? null;
  if (product.basePrice !== undefined) data.basePrice = product.basePrice;
  if (product.sku !== undefined) data.sku = product.sku;
  if (product.isPublished !== undefined) data.isPublished = product.isPublished;
  if (product.slug !== undefined && product.slug) data.slug = product.slug;
  if (product.slug === undefined && product.name !== undefined) data.slug = slugify(product.name);

  return data;
};

const normalizeVariantData = (variant: Record<string, any>) => {
  const data: Record<string, unknown> = {};

  if (variant.name !== undefined) data.name = variant.name;
  if (variant.sku !== undefined) data.sku = variant.sku;
  if (variant.priceOverride !== undefined) data.priceOverride = variant.priceOverride ?? null;
  if (variant.attributes !== undefined) data.attributes = variant.attributes;
  if (variant.isActive !== undefined) data.isActive = variant.isActive;

  return data;
};

const normalizeImageData = (image: Record<string, any>) => {
  const data: Record<string, unknown> = {};

  if (image.imageUrl !== undefined) data.imageUrl = image.imageUrl;
  if (image.altText !== undefined) data.altText = image.altText ?? null;
  if (image.isPrimary !== undefined) data.isPrimary = image.isPrimary;
  if (image.sortOrder !== undefined) data.sortOrder = image.sortOrder;

  return data;
};

const ensureCategoryExists = async (categoryId: string) => {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, deletedAt: null },
    select: { id: true },
  });

  if (!category) throw new ApiError(404, "Category not found");
};

const ensureProductExists = async (id: string) => {
  const product = await prisma.product.findFirst({
    where: { id, deletedAt: null },
    select: { id: true },
  });

  if (!product) throw new ApiError(404, "Product not found");
};

export const createProduct = async ({ product, variants, images = [] }: CreateProductInput) => {
  await ensureCategoryExists(product.categoryId);

  return prisma.$transaction(async (tx: any) => {
    const createdProduct = await tx.product.create({
      data: {
        ...normalizeProductData({
          ...product,
          slug: product.slug || slugify(product.name),
        }),
        variants: {
          create: variants.map((variant) => normalizeVariantData(variant)),
        },
        images: images.length
          ? {
              create: images.map((image) => normalizeImageData(image)),
            }
          : undefined,
      },
      include: productInclude,
    });

    return createdProduct;
  });
};

export const getAllProducts = async (
  page: number,
  limit: number,
  filters: {
    categoryId?: string;
    search?: string;
    isPublished?: boolean;
    includeDeleted?: boolean;
  },
) => {
  const skip = (page - 1) * limit;
  const where: Record<string, unknown> = {};

  if (!filters.includeDeleted) where.deletedAt = null;
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.isPublished !== undefined) where.isPublished = filters.isPublished;
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { sku: { contains: filters.search, mode: "insensitive" } },
      { slug: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: productInclude,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total };
};

export const getProductById = async (id: string) => {
  const product = await prisma.product.findFirst({
    where: { id, deletedAt: null },
    include: productInclude,
  });

  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

export const updateProductById = async (id: string, payload: UpdateProductInput) => {
  await ensureProductExists(id);
  if (payload.product?.categoryId) await ensureCategoryExists(payload.product.categoryId);

  return prisma.$transaction(async (tx: any) => {
    if (payload.variants?.delete?.length) {
      const inventoryCount = await tx.inventory.count({
        where: { variantId: { in: payload.variants.delete } },
      });

      if (inventoryCount > 0) {
        throw new ApiError(409, "Cannot delete variants that already have inventory records");
      }

      await tx.productVariant.deleteMany({
        where: {
          id: { in: payload.variants.delete },
          productId: id,
        },
      });
    }

    if (payload.variants?.update?.length) {
      await Promise.all(
        payload.variants.update.map((variant) =>
          tx.productVariant.updateMany({
            where: { id: variant.id, productId: id },
            data: normalizeVariantData(variant),
          }),
        ),
      );
    }

    if (payload.variants?.create?.length) {
      await tx.productVariant.createMany({
        data: payload.variants.create.map((variant) => ({
          productId: id,
          ...normalizeVariantData(variant),
        })),
      });
    }

    if (payload.images?.delete?.length) {
      await tx.productImage.deleteMany({
        where: {
          id: { in: payload.images.delete },
          productId: id,
        },
      });
    }

    const shouldResetPrimaryImage =
      payload.images?.create?.some((image) => image.isPrimary) ||
      payload.images?.update?.some((image) => image.isPrimary);

    if (shouldResetPrimaryImage) {
      await tx.productImage.updateMany({
        where: { productId: id },
        data: { isPrimary: false },
      });
    }

    if (payload.images?.update?.length) {
      await Promise.all(
        payload.images.update.map((image) =>
          tx.productImage.updateMany({
            where: { id: image.id, productId: id },
            data: normalizeImageData(image),
          }),
        ),
      );
    }

    if (payload.images?.create?.length) {
      await tx.productImage.createMany({
        data: payload.images.create.map((image) => ({
          productId: id,
          ...normalizeImageData(image),
        })),
      });
    }

    const productData = payload.product ? normalizeProductData(payload.product) : {};
    const product = await tx.product.update({
      where: { id },
      data: productData,
      include: productInclude,
    });

    return product;
  });
};

export const deleteProductById = async (id: string) => {
  await ensureProductExists(id);

  return prisma.product.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      isPublished: false,
      variants: {
        updateMany: {
          where: { productId: id },
          data: { isActive: false },
        },
      },
    },
    include: productInclude,
  });
};
