import prisma from "../../config/db.js";
import { generateRefreshToken, generateToken } from "./token.js";
import ApiError from "../exceptions/apiError.js";
import type { CookieOptions } from "express";

export const generateAccessTokenRefreshToken = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const [accessToken, refreshToken] = await Promise.all([
    generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    }),

    generateRefreshToken({
      id: user.id,
    }),
  ]);

  await prisma.user.update({
    where: { id: userId },
    data: {
      refreshToken,
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 7,
};
