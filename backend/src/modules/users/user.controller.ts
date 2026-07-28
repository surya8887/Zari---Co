import type { Request, Response } from "express";
import asyncHandler from "../../shared/utils/asyncHandler.js";
import * as userService from "./user.service.js";
import ApiResponse from "../../shared/exceptions/apiResponse.js";
import { getAllUsersValidation, getUserByIdValidation, updateUserRoleValidation } from "./user.validation.js";

/**
 * @desc Get all users controller
 * @route GET /api/v1/users
 * @access Private/Admin
 */
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { query } = getAllUsersValidation.parse({ query: req.query });
  const { page, limit } = query;

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
  const { params } = getUserByIdValidation.parse({ params: req.params });
  const { id } = params;
  
  const user = await userService.getUserById(id);
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

export const deleteUserById = asyncHandler(async (req: Request, res: Response) => {
  const { params } = getUserByIdValidation.parse({ params: req.params });
  const { id } = params;
  
  const user = await userService.deleteUserById(id);
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User deleted successfully"));
});

/**
 * @desc Update user role
 * @route PATCH /api/v1/users/:id/role
 * @access Private/SuperAdmin
 */
export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { params, body } = updateUserRoleValidation.parse({ 
    params: req.params, 
    body: req.body 
  });
  
  const { id } = params;
  const { role } = body;
  
  const updatedUser = await userService.updateUserRole(id, role);
  
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User role updated successfully"));
});