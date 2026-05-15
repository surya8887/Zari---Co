import type { Request, Response } from "express";
import asyncHandler from "../../shared/utils/asyncHandler.js";
import * as userService from "./user.service.js";
import ApiResponse from "../../shared/exceptions/apiResponse.js";

/**
 * @desc Get all users controller
 * @route GET /api/v1/users
 * @access Private/Admin
 */
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const { users, total } = await userService.getAllUsers(page, limit);
  
  return res
    .status(200)
    .json(new ApiResponse(200, {
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      }
    }, "Users fetched successfully"));
});

/**
 * @desc Get single user by ID controller
 * @route GET /api/v1/users/:id
 * @access Private
 */
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.getUserById(id as string);
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});
