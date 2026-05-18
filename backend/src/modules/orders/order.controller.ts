import type { Response } from "express";
import type { AuthRequest } from "../../shared/middlewares/auth.middleware.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";
import ApiResponse from "../../shared/exceptions/apiResponse.js";
import ApiError from "../../shared/exceptions/apiError.js";
import { createOrderSchema } from "./order.validation.js";
import { createOrder as createOrderService, getUserOrders as getUserOrdersService } from "./order.service.js";

// POST /api/v1/orders
export const createOrder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      throw new ApiError(401, "Unauthorized: Identity context missing");
    }

    const userId = req.user.id;
    const validatedData = createOrderSchema.parse(req.body);

    const order = await createOrderService(userId, validatedData);

    return res
      .status(201)
      .json(new ApiResponse(201, order, "Order placed successfully"));
  }
);

// GET /api/v1/orders
export const getUserOrders = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      throw new ApiError(401, "Unauthorized: Identity context missing");
    }

    const userId = req.user.id;
    const orders = await getUserOrdersService(userId);

    return res
      .status(200)
      .json(new ApiResponse(200, orders, "Order history retrieved successfully"));
  }
);
