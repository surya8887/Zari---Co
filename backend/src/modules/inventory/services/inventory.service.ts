import prisma from "../../../config/db.js";
import ApiError from "../../../shared/exceptions/apiError.js";
import type {
  createInventorySchema,
  updateInventorySchema,
} from "../inventory.validation.js";
import type { z } from "zod";

type CreateInventoryInput = z.infer<typeof createInventorySchema>;
type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;

const inventoryInclude = {
  variant: {
    select: {
      id: true,
      name: true,
      sku: true,
      isActive: true,
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          sku: true,
          isPublished: true,
        },
      },
    },
  },
} as const;

const ensureVariantExists = async (variantId: string) => {
  const variant = await prisma.productVariant.findFirst({
    where: {
      id: variantId,
      product: { deletedAt: null },
    },
    select: { id: true },
  });

  if (!variant) throw new ApiError(404, "Product variant not found");
};

const ensureUserExists = async (userId?: string) => {
  if (!userId) return;

  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: { id: true },
  });

  if (!user) throw new ApiError(404, "Performed by user not found");
};

const toInventoryResponse = (inventory: any) => ({
  ...inventory,
  availableQuantity: inventory.quantity - inventory.reservedQuantity,
  isLowStock: inventory.quantity - inventory.reservedQuantity <= inventory.lowStockThreshold,
});

export const createInventory = async (payload: CreateInventoryInput) => {
  await ensureVariantExists(payload.variantId);
  await ensureUserExists(payload.performedById);

  return prisma.$transaction(async (tx: any) => {
    const existing = await tx.inventory.findUnique({
      where: { variantId: payload.variantId },
      select: { id: true },
    });

    if (existing) throw new ApiError(409, "Inventory already exists for this variant");

    const inventory = await tx.inventory.create({
      data: {
        variantId: payload.variantId,
        quantity: payload.quantity,
        reservedQuantity: payload.reservedQuantity,
        lowStockThreshold: payload.lowStockThreshold,
      },
      include: inventoryInclude,
    });

    if (payload.quantity > 0) {
      await tx.inventoryTransaction.create({
        data: {
          variantId: payload.variantId,
          performedById: payload.performedById ?? null,
          type: "restock",
          quantityDelta: payload.quantity,
          referenceId: payload.referenceId ?? null,
          note: payload.note ?? "Initial inventory quantity",
        },
      });
    }

    if (payload.reservedQuantity > 0) {
      await tx.inventoryTransaction.create({
        data: {
          variantId: payload.variantId,
          performedById: payload.performedById ?? null,
          type: "reserved",
          quantityDelta: -payload.reservedQuantity,
          referenceId: payload.referenceId ?? null,
          note: payload.note ?? "Initial reserved quantity",
        },
      });
    }

    return toInventoryResponse(inventory);
  });
};

export const getAllInventory = async (
  page: number,
  limit: number,
  filters: {
    variantId?: string;
    productId?: string;
    lowStockOnly?: boolean;
  },
) => {
  const skip = (page - 1) * limit;
  const where: Record<string, unknown> = {};

  if (filters.variantId) where.variantId = filters.variantId;
  if (filters.productId) {
    where.variant = {
      productId: filters.productId,
      product: { deletedAt: null },
    };
  }
  if (filters.lowStockOnly) {
    where.quantity = { lte: (prisma.inventory as any).fields.lowStockThreshold };
  }

  const [inventory, total] = await Promise.all([
    prisma.inventory.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: inventoryInclude,
    }),
    prisma.inventory.count({ where }),
  ]);

  return { inventory: inventory.map(toInventoryResponse), total };
};

export const getInventoryById = async (id: string) => {
  const inventory = await prisma.inventory.findUnique({
    where: { id },
    include: inventoryInclude,
  });

  if (!inventory) throw new ApiError(404, "Inventory not found");
  return toInventoryResponse(inventory);
};

export const updateInventoryById = async (id: string, payload: UpdateInventoryInput) => {
  await ensureUserExists(payload.performedById);

  return prisma.$transaction(async (tx: any) => {
    const current = await tx.inventory.findUnique({
      where: { id },
      include: inventoryInclude,
    });

    if (!current) throw new ApiError(404, "Inventory not found");

    const nextQuantity = payload.quantity ?? current.quantity;
    const nextReservedQuantity = payload.reservedQuantity ?? current.reservedQuantity;

    if (nextReservedQuantity > nextQuantity) {
      throw new ApiError(400, "Reserved quantity cannot exceed on-hand quantity");
    }

    const data: Record<string, unknown> = {};
    if (payload.quantity !== undefined) data.quantity = payload.quantity;
    if (payload.reservedQuantity !== undefined) data.reservedQuantity = payload.reservedQuantity;
    if (payload.lowStockThreshold !== undefined) data.lowStockThreshold = payload.lowStockThreshold;

    const updated = await tx.inventory.update({
      where: { id },
      data,
      include: inventoryInclude,
    });

    const quantityDelta = nextQuantity - current.quantity;
    if (quantityDelta !== 0) {
      await tx.inventoryTransaction.create({
        data: {
          variantId: current.variantId,
          performedById: payload.performedById ?? null,
          type: "manual_adjust",
          quantityDelta,
          referenceId: payload.referenceId ?? null,
          note: payload.note ?? "Manual inventory quantity adjustment",
        },
      });
    }

    const reservedDelta = nextReservedQuantity - current.reservedQuantity;
    if (reservedDelta !== 0) {
      await tx.inventoryTransaction.create({
        data: {
          variantId: current.variantId,
          performedById: payload.performedById ?? null,
          type: reservedDelta > 0 ? "reserved" : "released",
          quantityDelta: -reservedDelta,
          referenceId: payload.referenceId ?? null,
          note: payload.note ?? "Manual reserved quantity adjustment",
        },
      });
    }

    return toInventoryResponse(updated);
  });
};

export const deleteInventoryById = async (id: string) => {
  return prisma.$transaction(async (tx: any) => {
    const inventory = await tx.inventory.findUnique({
      where: { id },
      include: inventoryInclude,
    });

    if (!inventory) throw new ApiError(404, "Inventory not found");
    if (inventory.reservedQuantity > 0) {
      throw new ApiError(409, "Cannot delete inventory while stock is reserved");
    }

    await tx.inventory.delete({ where: { id } });
    return toInventoryResponse(inventory);
  });
};
