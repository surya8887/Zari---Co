import asyncHandler from "../../../shared/utils/asyncHandler.js";
import ApiResponse from "../../../shared/exceptions/apiResponse.js";
import ApiError from "../../../shared/exceptions/apiError.js";
import { productSchema } from "../catalog.validation.js";
import type { Request, Response } from "express";
import {
  createProduct as createProductService,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} from "../services/product.services.js";

// POST /api/v1/catalog/product
export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    // Validate request body
    const validatedData = productSchema.parse(req.body);

    const product = await createProductService({
      name: validatedData.name,
      slug: validatedData.slug || validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      categoryId: validatedData.categoryId,
      description: validatedData.description || "",
      basePrice: validatedData.basePrice,
      sku: validatedData.sku,
      isPublished: validatedData.isPublished
    });

    return res
      .status(201)
      .json(new ApiResponse(201, product, "Product created successfully"));
  }
);

// GET /api/v1/catalog/product
export const getProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

    const { products, total } = await getAllProducts(page, limit);

    return res
      .status(200)
      .json(new ApiResponse(200, {
        products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        }
      }, "Products fetched successfully"));
  }
);

// GET /api/v1/catalog/product/:id
export const getProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Product ID parameter is required");
    }

    const product = await getProductById(id as string);

    return res
      .status(200)
      .json(new ApiResponse(200, product, "Product fetched successfully"));
  }
);

// PUT /api/v1/catalog/product/:id
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Product ID parameter is required");
    }

    // Validate partial data
    const validatedData = productSchema.partial().parse(req.body);

    const product = await updateProductById(id as string, {
      name: validatedData.name,
      slug: validatedData.slug,
      categoryId: validatedData.categoryId,
      description: validatedData.description,
      basePrice: validatedData.basePrice,
      sku: validatedData.sku,
      isPublished: validatedData.isPublished
    } as any);

    return res
      .status(200)
      .json(new ApiResponse(200, product, "Product updated successfully"));
  }
);

// DELETE /api/v1/catalog/product/:id
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Product ID parameter is required");
    }

    const product = await deleteProductById(id as string);

    return res
      .status(200)
      .json(new ApiResponse(200, product, "Product soft-deleted successfully"));
  }
);
