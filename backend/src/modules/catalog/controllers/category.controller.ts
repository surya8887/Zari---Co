import asyncHandler from "../../../shared/utils/asyncHandler.js";
import ApiResponse from "../../../shared/exceptions/apiResponse.js";
import ApiError from "../../../shared/exceptions/apiError.js";
import {createCategorySchema,updateCategorySchema,getAllCategoriesSchema} from "../catalog.validation.js";
import type { Request, Response } from "express";
import {createCategoryService,getAllCategories,getCategoryById,updateCategoryById,deleteCategoryById,} from "../services/category.services.js";

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, slug, description, isPublished, parentId, sortOrder } =
      createCategorySchema.parse(req.body);

    const category = await createCategoryService({
      name,
      slug,
      description,
      isPublished,
      parentId,
      sortOrder,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, category, "Category created successfully"));
  },
);

export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const { query } = getAllCategoriesSchema.parse({ query: req.query });
    const { page, limit } = query;

    const { categories, total } = await getAllCategories(page, limit);

    return res
      .status(200)
      .json(new ApiResponse(200, {
        categories,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        }
      }, "Categories fetched successfully"));
  },
);

export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Category ID is required");
  const category = await getCategoryById(id as string);
  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category fetched successfully"));
});

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "Category ID is required");
    const { name, slug, description, isPublished, parentId, sortOrder } =
      updateCategorySchema.parse(req.body);
    const category = await updateCategoryById(id as string, {
      name,
      slug,
      description,
      isPublished,
      parentId,
      sortOrder,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, category, "Category updated successfully"));
  },
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "Category ID is required");
    const category = await deleteCategoryById(id as string);
    return res
      .status(200)
      .json(new ApiResponse(200, category, "Category deleted successfully"));
  },
);
