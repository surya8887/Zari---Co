import { z } from "zod";

export const createOrderSchema = z.object({
  addressId: z.string().uuid("Invalid address ID"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  subtotal: z.number().min(0),
  discount: z.number().min(0).default(0),
  tax: z.number().min(0),
  shipping: z.number().min(0),
  grandTotal: z.number().min(0),
  items: z.array(
    z.object({
      productId: z.string().uuid("Invalid product ID"),
      quantity: z.number().int().min(1, "Quantity must be at least 1"),
      selectedSize: z.string().optional()
    })
  ).min(1, "Order must contain at least one item")
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
