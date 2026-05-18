import { z } from "zod";

// 1. Admin Authentication Schemas
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Secure Email Address is required.")
    .email("Please provide a valid secure email format."),
  password: z
    .string()
    .min(6, "Access Token Password must be at least 6 characters long.")
});

export const RegisterSchema = z.object({
  firstName: z
    .string()
    .min(1, "First Name is a required parameter."),
  lastName: z
    .string()
    .optional(),
  email: z
    .string()
    .min(1, "Secure Email Address is required.")
    .email("Please provide a valid secure email format."),
  password: z
    .string()
    .min(6, "Access Token Password must be at least 6 characters long."),
  phone: z
    .string()
    .optional()
});

// 2. Product Catalog Schemas
export const ProductSchema = z.object({
  name: z
    .string()
    .min(1, "Jewelry piece name is required.")
    .max(100, "Piece name must be less than 100 characters."),
  sku: z
    .string()
    .min(1, "Catalogue SKU code is required.")
    .regex(/^[a-zA-Z0-9-]+$/, "SKU code must contain only alphanumeric characters or hyphens."),
  price: z
    .string()
    .min(1, "Price is required.")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      "Price must be a valid positive currency amount."
    ),
  description: z
    .string()
    .optional()
    .default(""),
  details: z
    .string()
    .optional()
    .default(""),
  careInstructions: z
    .string()
    .optional()
    .default(""),
  isPublished: z
    .boolean()
    .default(true),
  categoryId: z
    .string()
    .min(1, "A catalog category assignment is required.")
});

// 3. Category Validation Schemas
export const CategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category Name is required.")
    .max(60, "Category Name must be less than 60 characters."),
  slug: z
    .string()
    .min(1, "Slug URL mapping code is required.")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, digits, and hyphens."),
  parentId: z
    .string()
    .nullable()
    .optional(),
  description: z
    .string()
    .optional()
    .default(""),
  isPublished: z
    .boolean()
    .default(true),
  sortOrder: z
    .number()
    .default(0)
});
