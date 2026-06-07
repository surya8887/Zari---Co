import asyncHandler from "../../../shared/utils/asyncHandler.js";
import ApiResponse from "../../../shared/exceptions/apiResponse.js";
import ApiError from "../../../shared/exceptions/apiError.js";
import type { Request, Response } from "express";
import {
  createProductImages,
  deleteProductImage,
  setPrimaryImage
} from "../services/image.services.js";

// POST /api/v1/catalog/product/:productId/images
export const uploadImages = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.params;
    if (!productId) {
      throw new ApiError(400, "Product ID parameter is required");
    }

    // Capture uploaded files from Multer array middleware
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw new ApiError(400, "No image files uploaded or received");
    }

    const images = await createProductImages(productId as string, files);

    return res
      .status(201)
      .json(new ApiResponse(201, images, "Product images uploaded and registered successfully"));
  }
);

// DELETE /api/v1/catalog/image/:id
export const deleteImage = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Image ID parameter is required");
    }

    const deleted = await deleteProductImage(id as string);

    return res
      .status(200)
      .json(new ApiResponse(200, deleted, "Product image successfully unlinked and deleted"));
  }
);

// PUT /api/v1/catalog/image/:id/primary
export const togglePrimary = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Image ID parameter is required");
    }

    const updated = await setPrimaryImage(id as string);

    return res
      .status(200)
      .json(new ApiResponse(200, updated, "Selected image set as primary catalog cover"));
  }
);
