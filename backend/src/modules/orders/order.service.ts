import prisma from "../../config/db.js";
import ApiError from "../../shared/exceptions/apiError.js";
import type { CreateOrderInput } from "./order.validation.js";

// Create order
export const createOrder = async (userId: string, data: CreateOrderInput) => {
  // Validate address ownership
  const address = await prisma.address.findFirst({
    where: { id: data.addressId, userId }
  });
  if (!address) {
    throw new ApiError(404, "Shipping address not found or access denied");
  }

  // Use a transaction to ensure all db changes happen atomically
  return prisma.$transaction(async (tx) => {
    // 1. Create the Order
    const newOrder = await tx.order.create({
      data: {
        userId,
        addressId: data.addressId,
        status: "confirmed", // Match OrderStatus enum (lowercase confirmed)
        subtotal: data.subtotal,
        discountTotal: data.discount,
        taxTotal: data.tax,
        shippingTotal: data.shipping,
        grandTotal: data.grandTotal,
        currencyCode: "INR"
      }
    });

    // 2. Create Order Items
    for (const item of data.items) {
      // Find Product to verify price/existence
      const dbProduct = await tx.product.findUnique({
        where: { id: item.productId },
        include: { variants: true }
      });

      if (!dbProduct) {
        throw new ApiError(404, `Product not found: ${item.productId}`);
      }

      // Identify corresponding ProductVariant
      let matchedVariant = null;
      if (item.selectedSize) {
        matchedVariant = dbProduct.variants.find(
          (v) => v.name.toLowerCase() === item.selectedSize!.toLowerCase()
        );
      }

      // Fallback: If no matched variant, use default or the first variant
      if (!matchedVariant) {
        matchedVariant = dbProduct.variants.find(
          (v) => v.name === "Default" || v.name === "default"
        ) || dbProduct.variants[0];
      }

      if (!matchedVariant) {
        throw new ApiError(400, `No active variant found for product: ${dbProduct.name}`);
      }

      const unitPrice = matchedVariant.priceOverride 
        ? matchedVariant.priceOverride 
        : dbProduct.basePrice;

      const lineTotal = Number(unitPrice) * item.quantity;

      await tx.orderItem.create({
        data: {
          orderId: newOrder.id,
          variantId: matchedVariant.id,
          quantity: item.quantity,
          unitPrice,
          lineTotal
        }
      });
    }

    return newOrder;
  });
};

// Retrieve all user orders
export const getUserOrders = async (userId: string) => {
  const dbOrders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      address: true,
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: true
                }
              }
            }
          }
        }
      }
    }
  });

  return dbOrders;
};
