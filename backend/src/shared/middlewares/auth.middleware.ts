import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../exceptions/apiError.js";
import { verfiyAccessToken } from "../utils/token.js";

interface DecodedToken {
  id: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: DecodedToken;
}

const authenticateUser = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token =
      req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    const decodedToken = (await verfiyAccessToken(token)) as DecodedToken;
    console.log(decodedToken);
    req.user = decodedToken;

    next();
  },
);

const authenticateAdmin = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (req.user.role !== "admin") {
      throw new ApiError(403, "Forbidden");
    }

    next();
  },
);

const authenticateSuperAdmin = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (req.user.role !== "superadmin") {
      throw new ApiError(403, "Forbidden");
    }

    next();
  },
);

export { authenticateUser, authenticateAdmin, authenticateSuperAdmin };
