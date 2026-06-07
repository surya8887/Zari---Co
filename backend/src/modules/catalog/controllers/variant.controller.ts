import type { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler.js";
import ApiResponse from "../../../shared/exceptions/apiResponse.js";
import ApiError from "../../../shared/exceptions/apiError.js";
import { createIndividualVariantSchema, updateIndividualVariantSchema } from "../catalog.validation.js";
import {
  createVariant as createVariantService,
  getVariantsByProduct as getVariantsByProductService,
  getVariantById as getVariantByIdService,
  updateVariant as updateVariantService,
  deleteVariant as deleteVariantService
} from "../services/variant.services.js";

// POST /api/v1/catalog/product/:productId/variants
export const createVariant = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.params;
    if (!productId) {
      throw new ApiError(400, "Product ID parameter is required");
    }

    const validatedData = createIndividualVariantSchema.parse(req.body);

    const variant = await createVariantService(productId as string, validatedData);

    return res
      .status(201)
      .json(new ApiResponse(201, variant, "Product variant successfully created with inventory"));
  }
);

// GET /api/v1/catalog/product/:productId/variants
export const getVariantsByProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.params;
    if (!productId) {
      throw new ApiError(400, "Product ID parameter is required");
    }

    const variants = await getVariantsByProductService(productId as string);

    return res
      .status(200)
      .json(new ApiResponse(200, variants, "Product variants successfully retrieved"));
  }
);

// GET /api/v1/catalog/variant/:id
export const getVariant = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Variant ID parameter is required");
    }

    const variant = await getVariantByIdService(id as string);

    return res
      .status(200)
      .json(new ApiResponse(200, variant, "Product variant details successfully retrieved"));
  }
);

// PUT /api/v1/catalog/variant/:id
export const updateVariant = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Variant ID parameter is required");
    }

    const validatedData = updateIndividualVariantSchema.parse(req.body);

    const updated = await updateVariantService(id as string, validatedData);

    return res
      .status(200)
      .json(new ApiResponse(200, updated, "Product variant successfully updated"));
  }
);

// DELETE /api/v1/catalog/variant/:id
export const deleteVariant = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Variant ID parameter is required");
    }

    const deleted = await deleteVariantService(id as string);

    return res
      .status(200)
      .json(new ApiResponse(200, deleted, "Product variant successfully deleted"));
  }
);
