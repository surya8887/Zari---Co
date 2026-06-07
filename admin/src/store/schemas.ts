import { z } from "zod";
import { ProductSchema, CategorySchema } from "@/utils/validation";

// UI & Theme state validation schemas
export const ThemeSchema = z.enum(["light", "dark"]);
export const PageSchema = z.string().min(1, "Page name is required");
export const SearchQuerySchema = z.string();

// Category payload validation
export const CategoryStateSchema = CategorySchema.partial({
  isPublished: true,
  sortOrder: true
});

// Product payload validation
export const ProductStateSchema = ProductSchema;

// Story and policy text validations
export const CollectionStorySchema = z.string();
export const ShippingNotesSchema = z.string();

// Inventory payload validation schema
export const InventoryStateSchema = z.object({
  quantity: z.number().int().nonnegative("Quantity must be a non-negative integer"),
  reservedQuantity: z.number().int().nonnegative("Reserved quantity must be a non-negative integer"),
  lowStockThreshold: z.number().int().nonnegative("Low stock threshold must be a non-negative integer"),
  performedById: z.string().uuid("Invalid user ID format").optional().or(z.literal("")),
  referenceId: z.string().max(100, "Reference ID cannot exceed 100 characters").optional().or(z.literal("")),
  note: z.string().max(500, "Note cannot exceed 500 characters").optional().or(z.literal("")),
}).refine(data => data.reservedQuantity <= data.quantity, {
  message: "Reserved quantity cannot exceed total stock quantity",
  path: ["reservedQuantity"]
});
