import { registerUserValidation, loginUserValidation } from "./auth.validation.js";
import type { Request, Response } from "express";
import asyncHandler from "../../shared/utils/asyncHandler.js";
import { 
  registerUser as registerUserService, 
  loginUser as loginUserService,
  logoutUser as logoutUserService,
  loginWithGoogle as loginWithGoogleService
} from "./auth.service.js";
import ApiResponse from "../../shared/exceptions/apiResponse.js";
import { generateAccessTokenRefreshToken, cookieOptions } from "../../shared/utils/cookie.js";
import type { AuthRequest } from "../../shared/middlewares/auth.middleware.js";

/**
 * @desc Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 */
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = registerUserValidation.parse(req.body);
    const { firstName, lastName, email, password, phone } = validatedData;
    
    const user = await registerUserService(firstName, lastName, email, password, phone);
    
    const { accessToken, refreshToken } = await generateAccessTokenRefreshToken(user.id);

    return res
      .status(201)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(new ApiResponse(201, { user, accessToken, refreshToken }, "User registered successfully"));
  },
);

/**
 * @desc Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = loginUserValidation.parse(req.body);
  const { email, password } = validatedData;

  const user = await loginUserService(email, password);

  const { accessToken, refreshToken } = await generateAccessTokenRefreshToken(user.id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user, accessToken, refreshToken }, "User logged in successfully"));
});

/**
 * @desc Logout user
 * @route POST /api/v1/auth/logout
 * @access Private
 */
export const logoutUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (userId) await logoutUserService(userId);
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

/**
 * @desc Google Login
 * @route POST /api/v1/auth/google/login
 * @access Public
 */
export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json(new ApiResponse(400, null, "ID token is required"));
  }

  const user = await loginWithGoogleService(idToken);
  
  const { accessToken: appAccessToken, refreshToken } = await generateAccessTokenRefreshToken(user.id);

  return res
    .status(200)
    .cookie("accessToken", appAccessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user, accessToken: appAccessToken, refreshToken }, "User logged in with Google successfully"));
});