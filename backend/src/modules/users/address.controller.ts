import type { Response } from "express";
import type { AuthRequest } from "../../shared/middlewares/auth.middleware.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";
import ApiResponse from "../../shared/exceptions/apiResponse.js";
import ApiError from "../../shared/exceptions/apiError.js";
import { createAddressSchema, updateAddressSchema } from "./address.validation.js";
import {
  createUserAddress,
  getUserAddresses,
  getAddressById,
  updateUserAddress,
  deleteUserAddress
} from "./address.service.js";

// POST /api/v1/users/address
export const createAddress = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      throw new ApiError(401, "Unauthorized: Identity context missing");
    }

    const userId = req.user.id;
    const validatedData = createAddressSchema.parse(req.body);

    const address = await createUserAddress(userId, validatedData);

    return res
      .status(201)
      .json(new ApiResponse(201, address, "Address created successfully"));
  }
);

// GET /api/v1/users/address
export const getAddresses = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      throw new ApiError(401, "Unauthorized: Identity context missing");
    }

    const userId = req.user.id;
    const addresses = await getUserAddresses(userId);

    return res
      .status(200)
      .json(new ApiResponse(200, addresses, "Addresses retrieved successfully"));
  }
);

// GET /api/v1/users/address/:id
export const getAddress = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      throw new ApiError(401, "Unauthorized: Identity context missing");
    }

    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Address ID parameter is required");
    }

    const address = await getAddressById(id as string, req.user.id);

    return res
      .status(200)
      .json(new ApiResponse(200, address, "Address details retrieved successfully"));
  }
);

// PUT /api/v1/users/address/:id
export const updateAddress = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      throw new ApiError(401, "Unauthorized: Identity context missing");
    }

    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Address ID parameter is required");
    }

    const validatedData = updateAddressSchema.parse(req.body);
    const updated = await updateUserAddress(id as string, req.user.id, validatedData);

    return res
      .status(200)
      .json(new ApiResponse(200, updated, "Address updated successfully"));
  }
);

// DELETE /api/v1/users/address/:id
export const deleteAddress = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      throw new ApiError(401, "Unauthorized: Identity context missing");
    }

    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Address ID parameter is required");
    }

    const deleted = await deleteUserAddress(id as string, req.user.id);

    return res
      .status(200)
      .json(new ApiResponse(200, deleted, "Address deleted and unlinked successfully"));
  }
);
