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

export const inventoryIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid inventory ID format"),
  }),
});

export const createInventorySchema = z
  .object({
    variantId: z.string().uuid("Variant ID must be a valid UUID"),
    quantity: z.number().int().min(0).default(0),
    reservedQuantity: z.number().int().min(0).default(0),
    lowStockThreshold: z.number().int().min(0).default(5),
    performedById: z.string().uuid("Performed by ID must be a valid UUID").optional(),
    referenceId: z.string().trim().min(1).optional(),
    note: z.string().trim().min(1).optional(),
  })
  .refine((value) => value.reservedQuantity <= value.quantity, {
    path: ["reservedQuantity"],
    message: "Reserved quantity cannot exceed on-hand quantity",
  });

export const updateInventorySchema = z
  .object({
    quantity: z.number().int().min(0).optional(),
    reservedQuantity: z.number().int().min(0).optional(),
    lowStockThreshold: z.number().int().min(0).optional(),
    performedById: z.string().uuid("Performed by ID must be a valid UUID").optional(),
    referenceId: z.string().trim().min(1).optional(),
    note: z.string().trim().min(1).optional(),
  })
  .refine(
    (value) =>
      value.quantity === undefined ||
      value.reservedQuantity === undefined ||
      value.reservedQuantity <= value.quantity,
    {
      path: ["reservedQuantity"],
      message: "Reserved quantity cannot exceed on-hand quantity",
    },
  );

export const getAllInventorySchema = z.object({
  query: z.object({
    page: queryNumber(1),
    limit: queryNumber(10, 100),
    variantId: z.string().uuid("Invalid variant ID format").optional(),
    productId: z.string().uuid("Invalid product ID format").optional(),
    lowStockOnly: queryBoolean.default(false),
  }),
});
