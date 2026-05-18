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
