import type { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler.js";
import ApiResponse from "../../../shared/exceptions/apiResponse.js";
import {
  createProductSchema,
  getAllProductsSchema,
  idParamSchema,
  updateProductSchema,
} from "../catalog.validation.js";
import {
  createProduct as createProductService,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
} from "../services/product.services.js";

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const payload = createProductSchema.parse(req.body);
  const product = await createProductService(payload);

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { query } = getAllProductsSchema.parse({ query: req.query });
  const { page, limit, categoryId, search, isPublished, includeDeleted } = query;
  const filters: {
    categoryId?: string;
    search?: string;
    isPublished?: boolean;
    includeDeleted?: boolean;
  } = {};

  if (categoryId !== undefined) filters.categoryId = categoryId;
  if (search !== undefined) filters.search = search;
  if (isPublished !== undefined) filters.isPublished = isPublished;
  filters.includeDeleted = includeDeleted;

  const { products, total } = await getAllProducts(page, limit, filters);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      "Products fetched successfully",
    ),
  );
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const { params } = idParamSchema.parse({ params: req.params });
  const product = await getProductById(params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { params } = idParamSchema.parse({ params: req.params });
  const payload = updateProductSchema.parse(req.body);
  const product = await updateProductById(params.id, payload);

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { params } = idParamSchema.parse({ params: req.params });
  const product = await deleteProductById(params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product deleted successfully"));
});
