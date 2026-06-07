import type { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler.js";
import ApiResponse from "../../../shared/exceptions/apiResponse.js";
import {
  createInventorySchema,
  getAllInventorySchema,
  inventoryIdParamSchema,
  updateInventorySchema,
} from "../inventory.validation.js";
import {
  createInventory as createInventoryService,
  deleteInventoryById,
  getAllInventory,
  getInventoryById,
  updateInventoryById,
} from "../services/inventory.service.js";

export const createInventory = asyncHandler(async (req: Request, res: Response) => {
  const payload = createInventorySchema.parse(req.body);
  const inventory = await createInventoryService(payload);

  return res
    .status(201)
    .json(new ApiResponse(201, inventory, "Inventory created successfully"));
});

export const getInventoryList = asyncHandler(async (req: Request, res: Response) => {
  const { query } = getAllInventorySchema.parse({ query: req.query });
  const { page, limit, variantId, productId, lowStockOnly } = query;
  const filters: {
    variantId?: string;
    productId?: string;
    lowStockOnly?: boolean;
  } = {};

  if (variantId !== undefined) filters.variantId = variantId;
  if (productId !== undefined) filters.productId = productId;
  filters.lowStockOnly = lowStockOnly;

  const { inventory, total } = await getAllInventory(page, limit, filters);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        inventory,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      "Inventory fetched successfully",
    ),
  );
});

export const getInventory = asyncHandler(async (req: Request, res: Response) => {
  const { params } = inventoryIdParamSchema.parse({ params: req.params });
  const inventory = await getInventoryById(params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, inventory, "Inventory fetched successfully"));
});

export const updateInventory = asyncHandler(async (req: Request, res: Response) => {
  const { params } = inventoryIdParamSchema.parse({ params: req.params });
  const payload = updateInventorySchema.parse(req.body);
  const inventory = await updateInventoryById(params.id, payload);

  return res
    .status(200)
    .json(new ApiResponse(200, inventory, "Inventory updated successfully"));
});

export const deleteInventory = asyncHandler(async (req: Request, res: Response) => {
  const { params } = inventoryIdParamSchema.parse({ params: req.params });
  const inventory = await deleteInventoryById(params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, inventory, "Inventory deleted successfully"));
});
