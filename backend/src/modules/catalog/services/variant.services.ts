import prisma from "../../../config/db.js";
import ApiError from "../../../shared/exceptions/apiError.js";
import { getProductById } from "./product.services.js";

// Create a new variant for a product and initialize its stock in inventory
export const createVariant = async (
  productId: string,
  data: {
    name: string;
    sku: string;
    priceOverride?: number | null | undefined;
    isActive?: boolean | undefined;
    attributes?: Record<string, any> | undefined;
  }
) => {
  // 1. Verify parent product exists
  await getProductById(productId);

  // 2. Verify SKU is globally unique
  const normalizedSku = data.sku.trim().toUpperCase();
  const existingVariant = await prisma.productVariant.findUnique({
    where: { sku: normalizedSku }
  });

  if (existingVariant) {
    throw new ApiError(400, `SKU '${normalizedSku}' is already registered to another product variant`);
  }

  // 3. Execute transactional write to keep Variant and Inventory in-sync
  const createdVariant = await prisma.$transaction(async (tx) => {
    // A. Create the ProductVariant
    const variant = await tx.productVariant.create({
      data: {
        productId,
        name: data.name,
        sku: normalizedSku,
        priceOverride: data.priceOverride !== undefined ? data.priceOverride : null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        attributes: data.attributes || {}
      }
    });

    // B. Create the matching Inventory entry with zero stock
    await tx.inventory.create({
      data: {
        variantId: variant.id,
        quantity: 0,
        reservedQuantity: 0,
        lowStockThreshold: 5
      }
    });

    return variant;
  });

  return createdVariant;
};

// List all variants for a specific product
export const getVariantsByProduct = async (productId: string) => {
  // Verify product exists
  await getProductById(productId);

  return prisma.productVariant.findMany({
    where: { productId },
    include: {
      inventory: true
    },
    orderBy: { createdAt: "desc" }
  });
};

// Retrieve details for a single variant, including stock levels and parent info
export const getVariantById = async (id: string) => {
  const variant = await prisma.productVariant.findUnique({
    where: { id },
    include: {
      product: true,
      inventory: true
    }
  });

  if (!variant) {
    throw new ApiError(404, "Product variant not found");
  }

  return variant;
};

// Update an existing variant's details
export const updateVariant = async (
  id: string,
  data: {
    name?: string | undefined;
    sku?: string | undefined;
    priceOverride?: number | null | undefined;
    isActive?: boolean | undefined;
    attributes?: Record<string, any> | undefined;
  }
) => {
  // 1. Verify variant exists
  const existing = await getVariantById(id);

  const updateData: Record<string, any> = {};

  // 2. If SKU is changing, verify new SKU is not already registered
  if (data.sku !== undefined) {
    const normalizedSku = data.sku.trim().toUpperCase();
    if (normalizedSku !== existing.sku) {
      const duplicate = await prisma.productVariant.findUnique({
        where: { sku: normalizedSku }
      });
      if (duplicate) {
        throw new ApiError(400, `SKU '${normalizedSku}' is already registered to another product variant`);
      }
      updateData.sku = normalizedSku;
    }
  }

  if (data.name !== undefined) updateData.name = data.name;
  if (data.priceOverride !== undefined) updateData.priceOverride = data.priceOverride;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.attributes !== undefined) updateData.attributes = data.attributes;

  return prisma.productVariant.update({
    where: { id },
    data: updateData,
    include: {
      inventory: true
    }
  });
};

// Delete a product variant (cascades automatically to delete inventory row)
export const deleteVariant = async (id: string) => {
  // Verify variant exists
  await getVariantById(id);

  return prisma.productVariant.delete({
    where: { id }
  });
};
